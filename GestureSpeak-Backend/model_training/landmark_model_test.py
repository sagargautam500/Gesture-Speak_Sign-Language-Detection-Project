import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load the trained model
model = load_model('sign_language_model_landmark.h5')

# Define the labels (adjust based on your dataset)
labels = ['Label1', 'Label2', 'Label3', 'Label4', 'Label5', 'Label6', 'Label7', 'Label8', 'Label9', 'Label10', 'Label11', 'Label12', 'Label13']

# Initialize webcam
cap = cv2.VideoCapture(0)

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if not ret:
        break

    # Preprocess the frame
    img = cv2.resize(frame, (300, 300))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)

    # Make predictions
    predictions = model.predict(img)
    accuracy = np.max(predictions)
    label = labels[np.argmax(predictions)]

    # Display the result
    cv2.putText(frame, f'Sign: {label}, Acc: {accuracy:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    cv2.imshow('Real-Time Sign Language Detection', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()
