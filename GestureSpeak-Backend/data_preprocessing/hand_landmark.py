import cv2
import mediapipe as mp
import os

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_drawing = mp.solutions.drawing_utils

# Directory containing input images
input_dir = "silent_cropped"
# Directory to save images with landmarks
output_dir = "silent_landmark"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

image_files = [f for f in os.listdir(input_dir) if os.path.isfile(os.path.join(input_dir, f))]
image_count = 0

for image_file in image_files:
    image_path = os.path.join(input_dir, image_file)
    frame = cv2.imread(image_path)

    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)

    # Draw hand landmarks
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    # Save image
    output_path = os.path.join(output_dir, f"hand_landmark_{image_count}.jpg")
    cv2.imwrite(output_path, frame)
    print(f"Saved image with landmarks: {output_path}")
    image_count += 1

print("Processing completed.")
