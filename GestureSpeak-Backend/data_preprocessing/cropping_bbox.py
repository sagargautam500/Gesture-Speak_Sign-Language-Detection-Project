import os
import cv2
import xml.etree.ElementTree as ET

# Define the path to the folder containing images and annotations
folder_path = 'silent'
output_folder = 'silent_cropped'

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Process each file in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.jpg') or filename.endswith('.png'):
        image_path = os.path.join(folder_path, filename)
        annotation_path = os.path.join(folder_path, filename.replace('.jpg', '.xml').replace('.png', '.xml'))

        # Check if the corresponding annotation file exists
        if os.path.exists(annotation_path):
            # Load the image
            image = cv2.imread(image_path)

            # Load the annotation file
            tree = ET.parse(annotation_path)
            root = tree.getroot()

            # Iterate through all objects in the annotation file
            for obj in root.findall('object'):
                bbox = obj.find('bndbox')
                xmin = int(bbox.find('xmin').text)
                ymin = int(bbox.find('ymin').text)
                xmax = int(bbox.find('xmax').text)
                ymax = int(bbox.find('ymax').text)

                # Extract the bounding box from the image
                cropped_image = image[ymin:ymax, xmin:xmax]

                # Save the cropped image
                cropped_filename = f'{os.path.splitext(filename)[0]}_{xmin}_{ymin}.jpg'
                cv2.imwrite(os.path.join(output_folder, cropped_filename), cropped_image)

print("Bounding boxes have been saved as images.")
