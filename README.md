# Gesture Speak - Sign Language Detection

Gesture Speak is an AI-powered sign language detection and object recognition system designed to bridge communication gaps and enhance accessibility. This project utilizes deep learning and computer vision techniques to translate sign language gestures into text or speech and to perform object detection in real-time.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Backend Details](#backend-details)
  - [Models](#models)
    - [CNN Model](#cnn-model)
    - [EfficientNet Model](#efficientnet-model)
    - [YOLO Model](#yolo-model)
- [Frontend Details](#frontend-details)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

Gesture Speak leverages advanced machine learning models to enable:
- **Sign Language Detection:** Convert sign language gestures into text/speech.
- **Object Detection:** Recognize and detect objects within an input frame using computer vision.

The project is divided into two main parts:
- A **React.js** based frontend that provides an interactive user interface.
- A **Flask** based backend that integrates multiple deep learning models using **TensorFlow** and **OpenCV**.

## Features

- **Real-time Sign Language Detection:** Utilize CNN and EfficientNet models to accurately classify sign language gestures.
- **Object Detection:** Leverage the YOLO model to detect and identify objects in real time.
- **User-Friendly Interface:** An intuitive web interface built with React.js.
- **Extensibility:** Easily add or update models and functionalities as needed.

## Architecture

The system follows a modular architecture:

- **Frontend (React.js):**
  - Provides interactive pages for both GestureSpeak and ObjectDetection.
  - Sends user input (video feed or images) to the backend for processing.
  - Displays the results (detected gestures or objects) to the user.

- **Backend (Flask):**
  - Handles API requests from the frontend.
  - Processes video/image data using deep learning models.
  - Returns predictions/results back to the frontend.

## Technologies Used

- **Frontend:**
  - React.js
  - HTML/CSS/JavaScript

- **Backend:**
  - Python (Flask)
  - TensorFlow (for deep learning model inference)
  - OpenCV (for image processing)
    
  
- **Deep Learning Models:**
  - **CNN Model:** Used on the GestureSpeak page for sign language detection.
  - **EfficientNet Model:** Also used on the GestureSpeak page for improved sign language recognition performance.
  - **YOLO Model:** Employed on the ObjectDetection page for real-time object detection.

---

## Project Structure

    
     GestureSpeakProject/
    │── GestureSpeak_Frontend/      # React.js frontend
    │   ├── node_modules/           # Installed dependencies
    │   ├── public/                 # Static files
    │   ├── src/                    # Source code
    │   │   ├── assets/             # Images, icons, etc.
    │   │   ├── components/         # Reusable UI components
    │   │   ├── pages/              # Application pages
    │   │   ├── App.jsx             # Main application component
    │   │   ├── main.jsx            # Entry point
    │   ├── index.html              # Main HTML file
    │   ├── package.json            # Frontend dependencies
    │   ├── vite.config.js          # Vite configuration
    │   ├── README.md               # Documentation
    │
    │── GestureSpeak-Backend/       # Flask backend
    │   ├── .venv/                  # Virtual environment
    │   ├── accuracy_graphs/        # Model performance graphs
    │   ├── Backend/                # Backend application
    │   │   ├── backend.py          # Main Flask app
    │   │   ├── Data_collection/    # Scripts for collecting dataset
    │   │   ├── data_preprocessing/ # Data cleaning and preparation
    │   │   ├── model_training/     # Training scripts for models
    │   │   ├── models/             # Pre-trained models (CNN, EfficientNet, YOLO)
    │
    │── README.md                   # Project documentation


     
## Backend Details

The backend is built using Flask and integrates three deep learning models:

### Models

#### CNN Model

- **Purpose:** Detect and classify sign language gestures.
- **Usage:** Employed on the **GestureSpeak** page.
- **Description:** The CNN model is optimized for recognizing static gestures with high accuracy.

#### EfficientNet Model

- **Purpose:** Enhance sign language detection accuracy.
- **Usage:** Also used on the **GestureSpeak** page.
- **Description:** EfficientNet leverages a scalable architecture that provides improved performance with fewer parameters compared to traditional CNNs.

#### YOLO Model

- **Purpose:** Perform real-time object detection.
- **Usage:** Dedicated to the **ObjectDetection** page.
- **Description:** YOLO (You Only Look Once) is utilized for its efficiency and speed in detecting objects within a video stream or images.

The Flask application defines API endpoints to:
- Accept image or video data from the frontend.
- Process the data using the respective deep learning models.
- Return the predicted gesture or detected objects as a response.

## Frontend Details

The frontend is built with React.js and provides:
- **GestureSpeak Page:** Interfaces with the CNN and EfficientNet models to capture and display sign language detection results.
- **ObjectDetection Page:** Interfaces with the YOLO model to capture video feed/images and display detected objects in real time.

## Setup and Installation

### Backend

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sagargautam500/GestureSpeak.git
   cd GestureSpeak-Backend

2. **Create a virtual environment and install dependencies:**
   ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt

3. **Run the Flask application:**
    ```bash
           python backend.py
                

### Frontend

1. **Navigate to the frontend directory:**
     ```bash
           cd ../GestureSpeak_Frontend


2. **Install the npm dependencies:**
      ```bash
              npm install

3. **Start the React application:**
     ```bash
           npm run dev

              
