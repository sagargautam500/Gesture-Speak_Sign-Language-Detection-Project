from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# Load the model
model = load_model('../models/sign_language_cnn_model.h5')

# Define the image preprocessing function
def preprocess_image(image_path, target_size=(224, 224)):  # Adjust target size to the model's required input size
    img = image.load_img(image_path, target_size=target_size)  # Resize image
    img_array = img_to_array(img)  # Convert image to numpy array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Rescale pixel values to [0, 1]
    return img_array

# Function to test the model
def test_model(image_path):
    # Preprocess the image
    img_array = preprocess_image(image_path)

    # Predict with the model
    predictions = model.predict(img_array)

    # Get the predicted class
    class_idx = np.argmax(predictions)
    print(f"Predicted Class: {class_idx}, Confidence: {predictions[0][class_idx]}")

# Test with an image
image_path = 'image_17.png'  # Example image
test_model(image_path)
