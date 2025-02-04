import tensorflow as tf
from tensorflow.keras.models import load_model

# Verify TensorFlow and Keras versions
print("TensorFlow version:", tf.__version__)
print("Keras version:", tf.keras.__version__)

# Load a sample model
try:
    model = load_model('sign_language_model_landmark.h5')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
