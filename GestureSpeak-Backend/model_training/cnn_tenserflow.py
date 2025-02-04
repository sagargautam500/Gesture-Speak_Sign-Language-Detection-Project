import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt
import os

# Enable Mixed Precision Training
from tensorflow.keras import mixed_precision
policy = mixed_precision.Policy('mixed_float16')
mixed_precision.set_global_policy(policy)

# Clear any previous session
tf.keras.backend.clear_session()

# Define paths
dataset_path = 'C:\\Users\\Adarsha Rimal\\Desktop\\sign_language_detection\\dataset'

# ImageDataGenerator for training and validation
datagen = ImageDataGenerator(rescale=1./255,
                             shear_range=0.2,
                             zoom_range=0.2,
                             horizontal_flip=True,
                             validation_split=0.2)  # 20% for validation

batch_size = 8  # Further reduced batch size to manage memory usage

train_generator = datagen.flow_from_directory(dataset_path,
                                              target_size=(640, 480),  # Original image size
                                              batch_size=batch_size,
                                              class_mode='categorical',
                                              subset='training')  # set as training data

validation_generator = datagen.flow_from_directory(dataset_path,
                                                   target_size=(640, 480),  # Original image size
                                                   batch_size=batch_size,
                                                   class_mode='categorical',
                                                   subset='validation')  # set as validation data

# Build CNN model
model = Sequential([
    # First Convolutional Block
    Conv2D(32, (3, 3), activation='relu', input_shape=(640, 480, 3)),
    MaxPooling2D((2, 2)),

    # Second Convolutional Block
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    # Third Convolutional Block
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    # Fourth Convolutional Block
    Conv2D(256, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    # Fifth Convolutional Block
    Conv2D(512, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),

    # Flattening the output
    Flatten(),

    # Fully Connected Layers
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(256, activation='relu'),
    Dropout(0.5),

    # Output Layer
    Dense(15, activation='softmax')  # 15 classes for sign language
])

# Define the optimizer with a specific learning rate
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)

# Compile model with the specified optimizer
model.compile(optimizer=optimizer,
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
history = model.fit(train_generator,
                    steps_per_epoch=train_generator.samples // train_generator.batch_size,
                    validation_data=validation_generator,
                    validation_steps=validation_generator.samples // validation_generator.batch_size,
                    epochs=50)  # Adjust epochs based on your time and dataset size

# Save the model
model.save('sign_language_cnn_model.h5')

# Plot training & validation accuracy values
plt.figure(figsize=(14, 5))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend(['Train', 'Validation'], loc='upper left')

# Plot training & validation loss values
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend(['Train', 'Validation'], loc='upper left')

plt.tight_layout()
plt.show()
