import React, { useState, useRef, useEffect } from "react";
import "./DetectionSection.css";

const DetectionSection = () => {
  // State for active image (used for prediction), original image, processed image, etc.
  const [image, setImage] = useState(null); // Active image used for prediction
  const [originalImage, setOriginalImage] = useState(null); // Original image with background
  const [processedImage, setProcessedImage] = useState(null); // Image without background
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("efficientnet");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Helper function: Convert data URL to File
  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Helper function: Convert object URL to File
  const urlToFile = async (url, filename, mimeType = "image/jpeg") => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResult(""); // Clear previous result before uploading new image
      const reader = new FileReader();
      reader.onload = () => {
        // Set both original and active image
        setOriginalImage(reader.result);
        setImage(reader.result);
        // Remove background for the uploaded image
        removeBackground(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to open camera
  const openCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      })
      .catch(() => {
        alert("Unable to access camera. Please check your device settings.");
      });
  };

  // Function to stop camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // Capture image function
  const captureImage = () => {
    if (!streaming) {
      alert("Camera is not active. Please start the camera first.");
      return;
    }
    setResult(""); // Clear previous result before capturing new image
    const context = canvasRef.current.getContext("2d");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    // Ensure captured image matches video size
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvasRef.current.toDataURL("image/png");

    // Set both original and active image
    setOriginalImage(dataUrl);
    setImage(dataUrl);
    // Remove background for the captured image
    removeBackground(dataUrl);
  };

  // Function to remove background by calling the backend API
const removeBackground = async (imageDataUrl) => {
  const formData = new FormData();
  formData.append("image", dataURLtoFile(imageDataUrl, "input.png"));
  try {
    const response = await fetch("http://127.0.0.1:5000/remove-background", {
      method: "POST",
      body: formData,
    });
    const blob = await response.blob();
    const processedImageUrl = URL.createObjectURL(blob);
    setProcessedImage(processedImageUrl);
    setImage(processedImageUrl); // Set processed image as active
  } catch (error) {
    console.error("Error removing background:", error);
  }
};
  // Function to detect sign language using the active image
  const detectSignLanguage = async () => {
    if (!image) {
      alert("Please upload or capture an image first.");
      return;
    }
    setResult("Processing..."); // Show a loading message while processing

    const formData = new FormData();
    let file;

    // Check if the active image is a data URL or an object URL
    if (image.startsWith("data:")) {
      file = dataURLtoFile(image, "gesture.png");
    } else {
      file = await urlToFile(image, "gesture.png");
    }
    
    formData.append("image", file);
    formData.append("model_type", selectedModel === "cnn" ? "cnn" : "efficientnet");

    try {
      const response = await fetch("http://127.0.0.1:5000/classify-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(
        `Detected: ${data.class} (Confidence: ${data.confidence.toFixed(2)})`
      );
      speakDetectedText(data.class);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error detecting sign language.");
    }
  };

  // Function to speak the detected text
  const speakDetectedText = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US"; // Change language as needed
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech functionality.");
    }
  };

// Cleanup effect to stop camera when component unmounts
// Add this useEffect hook near your other useEffect
useEffect(() => {
  // 1. Handle browser tab closing/refreshing
  const handleBeforeUnload = () => {
    if (streaming) {
      stopCamera();
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // 2. Handle React Router navigation (if you're using it)
  const handleRouteChange = () => {
    if (streaming) {
      stopCamera();
    }
  };

  // If using React Router v6:
  if (typeof window !== 'undefined' && window.navigation) {
    window.navigation.addEventListener('navigate', handleRouteChange);
  }

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    if (typeof window !== 'undefined' && window.navigation) {
      window.navigation.removeEventListener('navigate', handleRouteChange);
    }
  };
}, [streaming]); // Only re-run when streaming changes


  return (
    <section>
      <div className="detection-section">
        <h2>GestureSpeak: Image/Capture Image</h2>
        <div className="detection-controls">
          {/* Image Upload */}
          <div className="upload-section">
            <label htmlFor="upload-input" className="upload-label">
              Upload an Image
            </label>
            <input
              id="upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Open Camera */}
          <div className="camera-section">
            <div className="video-wrapper">
              {!streaming && (
                <div className="video-overlay">
                  <p>Camera feed will appear here when activated.</p>
                </div>
              )}
              <video ref={videoRef} className="camera-feed" autoPlay playsInline />
            </div>

            <div className="camera-buttons">
              <button onClick={openCamera} className="camera-btn">
                Open Camera
              </button>
              <button onClick={captureImage} className="capture-btn">
                Capture Image
              </button>
              {streaming && (
                <button onClick={stopCamera} className="stop-camera-btn">
                  Stop Camera
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Display Image Section */}
        <div className="image-preview">
          {/* Original Image Container */}
          {originalImage && (
            <div className="preview-container">
              <img
                src={originalImage}
                alt="Original (with background)"
                onClick={() => setImage(originalImage)}
                className={`preview-image ${image === originalImage ? "active" : ""}`}
              />
              <div className="preview-label">Original Image</div>
            </div>
          )}
          {/* Processed Image Container */}
          {processedImage && (
            <div className="preview-container">
              <img
                src={processedImage}
                alt="Processed (no background)"
                onClick={() => setImage(processedImage)}
                className={`preview-image ${image === processedImage ? "active" : ""}`}
              />
              <div className="preview-label">Background Removed</div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden-canvas"></canvas>
        </div>

        {/* Model Selection */}
        <div className="model-selection">
          <label>Select Model: </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            <option value="cnn">CNN Model</option>
            <option value="efficientnet">EfficientNet Model</option>
          </select>
        </div>

        {/* Detect Sign Language */}
        <button onClick={detectSignLanguage} className="detect-btn">
          Detect Sign Language
        </button>

        {/* Detection Result */}
        {result && <div className="result-section">{result}</div>}
      </div>
    </section>
  );
};

export default DetectionSection;
