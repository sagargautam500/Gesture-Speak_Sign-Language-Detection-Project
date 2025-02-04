from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
from ultralytics import YOLO
import cv2
import pyttsx3
import threading




# ---------------------------------------------
# Flask Application Setup
# ---------------------------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------------------------
# Model Loading
# ---------------------------------------------
try:
    # Load EfficientNet Model
    efficientnet_model = tf.keras.models.load_model("../models/model_keras.h5")
    efficientnet_model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Load CNN Model (adjusted to lower resolution input to reduce memory usage)
    cnn_model = tf.keras.models.load_model("../models/sign_language_cnn_model.h5")
    cnn_model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Load YOLO Model
    yolo_model = YOLO("../models/best.pt").to("cuda")

except Exception as e:
    print(f"Error loading models: {str(e)}")
    exit(1)

# ---------------------------------------------
# Constants and Configuration
# ---------------------------------------------
CLASS_LABELS = [
    "fight", "give", "hats_off", "heart", "hello",
    "help", "i_love_you", "namaste", "no", "perfect",
    "please", "silent", "sorry", "stop", "thank_you",
    "water", "yes"
]

# ---------------------------------------------
# Image Preprocessing Functions
# ---------------------------------------------
def preprocess_image(file, model_type="cnn"):
    """Preprocess image based on model requirements"""
    img = Image.open(file).convert('RGB')

    if model_type == "cnn":
        # For custom CNN, resize to a lower resolution (e.g., 224x224)
        img = img.resize((224, 224), Image.LANCZOS)
        img_array = np.array(img)[None, ...] / 255.0
    elif model_type == "efficientnet":
        # For EfficientNetB0
        img = img.resize((300, 300), Image.LANCZOS)
        img_array = np.array(img)[None, ...]
    else:
        # Default to CNN preprocessing if unknown model_type
        img = img.resize((224, 224), Image.LANCZOS)
        img_array = np.array(img)[None, ...] / 255.0

    return img_array

# ---------------------------------------------
# K-Means Clustering & Background Removal Functions
# ---------------------------------------------
def initialize_centroids(pixels, k):
    """
    Randomly initialize k centroids from the pixels.
    pixels: (n_pixels, 3) numpy array.
    Returns: (k, 3) numpy array of centroids.
    """
    indices = np.random.choice(pixels.shape[0], k, replace=False)
    return pixels[indices]

def assign_clusters(pixels, centroids):
    """
    Assign each pixel to the nearest centroid.
    pixels: (n_pixels, 3)
    centroids: (k, 3)
    Returns: cluster indices for each pixel (n_pixels,)
    """
    diff = pixels[:, np.newaxis, :] - centroids[np.newaxis, :, :]
    dist_sq = np.sum(diff ** 2, axis=2)  # shape: (n_pixels, k)
    return np.argmin(dist_sq, axis=1)

def update_centroids(pixels, labels, k):
    """
    Compute new centroids as the mean of all pixels assigned to each cluster.
    pixels: (n_pixels, 3)
    labels: (n_pixels,) cluster indices
    k: number of clusters
    Returns: (k, 3) numpy array of updated centroids.
    """
    centroids = np.zeros((k, pixels.shape[1]))
    for i in range(k):
        cluster_pixels = pixels[labels == i]
        if len(cluster_pixels) == 0:
            centroids[i] = pixels[np.random.choice(pixels.shape[0])]
        else:
            centroids[i] = np.mean(cluster_pixels, axis=0)
    return centroids

def k_means(pixels, k=2, max_iterations=100, tol=1e-4):
    """
    Run the k-means algorithm on the pixel data.
    pixels: (n_pixels, 3) numpy array.
    Returns:
      - labels: (n_pixels,) cluster assignments.
      - centroids: (k, 3) array of cluster centers.
    """
    centroids = initialize_centroids(pixels, k)
    for iteration in range(max_iterations):
        labels = assign_clusters(pixels, centroids)
        new_centroids = update_centroids(pixels, labels, k)
        if np.linalg.norm(new_centroids - centroids) < tol:
            print(f"Converged at iteration {iteration}")
            break
        centroids = new_centroids
    return labels, centroids

def remove_background_from_image(image, labels, background_cluster, background_color=(255, 255, 255)):
    """
    Replace the pixels belonging to the background cluster with the background_color.
    image: original image array of shape (height, width, 3).
    labels: (n_pixels,) cluster assignments.
    background_cluster: integer, the index of the background cluster.
    background_color: tuple, the color to use for the background.
    Returns: new_image with background replaced.
    """
    new_image = image.copy()
    h, w, _ = image.shape
    labels_image = labels.reshape((h, w))
    background_mask = (labels_image == background_cluster)
    new_image[background_mask] = background_color
    return new_image

# ---------------------------------------------
# API Endpoints
# ---------------------------------------------
@app.route('/classify-image', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    model_type = request.form.get('model_type', 'cnn').lower()
    try:
        processed_img = preprocess_image(file, model_type)
        if model_type == "cnn":
            predictions = cnn_model.predict(processed_img)[0]
        elif model_type == "efficientnet":
            predictions = efficientnet_model.predict(processed_img)[0]
        else:
            return jsonify({'error': 'Invalid model type'}), 400

        class_idx = np.argmax(predictions)
        confidence = np.max(predictions)
        return jsonify({
            'model': model_type,
            'class': CLASS_LABELS[class_idx],
            'confidence': float(confidence)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/detect-gesture', methods=['GET'])
def detect_gesture():
    def generate_frames():
        # Initialize camera and TTS variables per client
        cap = cv2.VideoCapture(1)  # Adjust camera index if needed
        last_spoken = None  # Track last spoken gesture per client

        try:
            while True:
                success, frame = cap.read()
                if not success:
                    break

                # Perform YOLO detection
                results = yolo_model(frame, conf=0.3, iou=0.5)
                annotated_frame = results[0].plot()

                # Process detected gestures for TTS
                for box in results[0].boxes:
                    class_id = int(box.cls[0])
                    class_name = yolo_model.names[class_id]

                    # Speak if a new gesture is detected
                    if class_name != last_spoken:
                        def speak(text):
                            try:
                                engine = pyttsx3.init()
                                engine.say(text)
                                engine.runAndWait()
                                engine.stop()
                            except Exception as e:
                                print(f"TTS Error: {e}")

                        # Start TTS in a new thread to avoid blocking
                        threading.Thread(target=speak, args=(class_name,)).start()
                        last_spoken = class_name
                        break  # Only process the first new gesture per frame

                # Encode and stream the frame
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

        finally:
            cap.release()

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/gesture-info/<gesture_id>', methods=['GET'])
def gesture_info(gesture_id):
    gesture_details = {
        "hello": "A common greeting gesture using an open palm wave.",
        "thank_you": "Hand movement from chin outward to express gratitude.",
        # Add more gesture descriptions as needed.
    }
    return jsonify(gesture_details.get(gesture_id.lower(), "Gesture information not available."))

@app.route('/test', methods=['GET'])
def health_check():
    return jsonify({
        "status": "active",
        "models_loaded": {
            "cnn": cnn_model is not None,
            "efficientnet": efficientnet_model is not None,
            "yolo": yolo_model is not None
        }
    })

@app.route('/remove-background', methods=['POST'])
def remove_background_api():
    """
    This endpoint accepts an image file, removes its background using k-means clustering,
    and returns the processed image.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    try:
        # Load image using PIL and convert to RGB
        file = request.files['image']
        pil_image = Image.open(file).convert('RGB')
        image = np.array(pil_image)
        if image.dtype != np.uint8:
            image = (image * 255).astype(np.uint8)
        h, w, _ = image.shape
        pixels = image.reshape((-1, 3)).astype(np.float32)
        # Run k-means clustering with k=2 (foreground and background)
        k = 2
        labels, centroids = k_means(pixels, k=k)
        # Identify background cluster using the heuristic: cluster with more pixels
        counts = np.bincount(labels)
        background_cluster = np.argmax(counts)
        print("Identified background cluster:", background_cluster)
        # Replace background pixels with white
        new_image = remove_background_from_image(image, labels, background_cluster, background_color=(255, 255, 255))
        # Encode the image as JPEG
        success, encoded_image = cv2.imencode('.jpg', cv2.cvtColor(new_image, cv2.COLOR_RGB2BGR))
        if not success:
            return jsonify({'error': 'Failed to encode image'}), 500
        return Response(encoded_image.tobytes(), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


import base64

@app.route('/object-detection', methods=['POST'])
def object_detection():
    """
    This endpoint accepts an image file, performs object detection using YOLO,
    and returns a JSON response containing:
      - A Base64-encoded annotated image (with bounding boxes).
      - A list of detected class names.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        # Read the image file from the request.
        file = request.files['image']
        file_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Run YOLO detection on the image.
        results = yolo_model(image, conf=0.5, iou=0.5)

        # Annotate the image with bounding boxes and labels.
        annotated_image = results[0].plot()

        # Extract detected class names.
        # Ensure that the model has detected at least one object.
        detected_class_names = []
        if hasattr(results[0].boxes, "cls") and results[0].boxes.cls is not None:
            # Convert tensor to a numpy array if needed.
            class_ids = results[0].boxes.cls.cpu().numpy() if hasattr(results[0].boxes.cls, "cpu") else results[0].boxes.cls
            # results[0].names is a dictionary mapping class IDs to class names.
            detected_class_names = [results[0].names[int(cls)] for cls in class_ids]

        # Encode the annotated image as JPEG.
        success, encoded_image = cv2.imencode('.jpg', annotated_image)
        if not success:
            return jsonify({'error': 'Failed to encode image'}), 500

        # Convert the image to a Base64-encoded string.
        encoded_image_str = base64.b64encode(encoded_image.tobytes()).decode('utf-8')

        # Return the result as JSON.
        return jsonify({
            'annotated_image': encoded_image_str,
            'classes': detected_class_names
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------------------------
# Security Headers
# ---------------------------------------------
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Cache-Control'] = 'no-store, max-age=0'
    return response

# ---------------------------------------------
# Application Entry Point
# ---------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
