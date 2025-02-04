import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from PIL import Image

# Prepare data
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2  # 20% for validation
)

train_generator = train_datagen.flow_from_directory(
    'C:\\Users\\Adarsha Rimal\\Desktop\\sign_language_detection\\Raw_dataset',
    target_size=(300, 300),  # Resize to 300x300
    batch_size=16,  # Reduce batch size
    class_mode='categorical',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    'C:\\Users\\Adarsha Rimal\\Desktop\\sign_language_detection\\Raw_dataset',
    target_size=(300, 300),  # Resize to 300x300
    batch_size=16,  # Reduce batch size
    class_mode='categorical',
    subset='validation'
)

# Define the model with mixed precision
policy = tf.keras.mixed_precision.Policy('mixed_float16')
tf.keras.mixed_precision.set_global_policy(policy)

base_model = tf.keras.applications.EfficientNetB0(include_top=False, input_shape=(300, 300, 3), pooling='avg')
base_model.trainable = False  # Freeze the base model

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.Dense(len(train_generator.class_indices), activation='softmax', dtype='float32')  # Ensure output is float32
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(
    train_generator,
    epochs=1000,
    validation_data=validation_generator,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)]
)

# Save the model
model.save('model_keras.h5')

# Plotting Loss and Accuracy
def plot_metrics(history):
    plt.figure(figsize=(14, 5))

    # Loss plot
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Loss')
    plt.plot(history.history['val_loss'], label='Val Loss')
    plt.title('Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()

    # Accuracy plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Accuracy')
    plt.plot(history.history['val_accuracy'], label='Val Accuracy')
    plt.title('Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.show()

# Plot metrics
plot_metrics(history)

# Evaluate the model
y_true = validation_generator.classes
y_pred = model.predict(validation_generator)
y_pred_classes = np.argmax(y_pred, axis=1)

# Classification Report
print(classification_report(y_true, y_pred_classes, target_names=list(train_generator.class_indices.keys())))

# Confusion Matrix
conf_matrix = confusion_matrix(y_true, y_pred_classes)
plt.figure(figsize=(12, 10))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=list(train_generator.class_indices.keys()), yticklabels=list(train_generator.class_indices.keys()))
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()

# Precision, Recall, F1 Score for each class
precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred_classes, average=None)

for i, class_name in enumerate(train_generator.class_indices.keys()):
    print(f'Class: {class_name}')
    print(f'Precision: {precision[i]:.2f}')
    print(f'Recall: {recall[i]:.2f}')
    print(f'F1 Score: {f1[i]:.2f}\n')
