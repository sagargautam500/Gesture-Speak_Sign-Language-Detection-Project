import cv2
import os

# Define the directory where you want to save the captured images
folder_name = 'give'
if not os.path.exists(folder_name):
    os.makedirs(folder_name)  # Create the folder if it doesn't exist

# Initialize the webcam
cap = cv2.VideoCapture(0)  # 0 indicates the default webcam

img_counter = 0  # Counter to keep track of the number of images captured

while True:
    ret, frame = cap.read()  # Read a frame from the webcam
    if not ret:
        print("Failed to grab frame")
        break

    cv2.imshow('Press "Space" to Capture, "q" to Quit', frame)  # Display the live video feed

    key = cv2.waitKey(1)  # Wait for key press
    if key % 256 == 32:  # If the 'Space' key is pressed (ASCII value 32)
        img_name = f"{folder_name}/image_{img_counter}.png"  # Create the image filename
        cv2.imwrite(img_name, frame)  # Save the current frame to the folder
        print(f"{img_name} saved!")
        img_counter += 1  # Increment the image counter
    elif key % 256 == 113:  # If the 'q' key is pressed (ASCII value 113)
        print("Exiting...")
        break

# Release the webcam and close the OpenCV window
cap.release()
cv2.destroyAllWindows()
