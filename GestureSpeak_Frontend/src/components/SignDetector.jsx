import React, { useState, useRef } from "react";
import "./SignDetector.css";

const SignDetector = () => {
  const [srcImage, setSrcImage] = useState(null); // Original image (Data URL)
  const [processedImage, setProcessedImage] = useState(null); // Annotated image (Base64)
  const [labels, setLabels] = useState([]); // Detected class names
  const [infoMsg, setInfoMsg] = useState(""); // Informational message
  const [camActive, setCamActive] = useState(false); // Camera status
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection from hidden input.
  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInfoMsg("");
      setProcessedImage(null);
      const reader = new FileReader();
      reader.onload = () => {
        setSrcImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start the camera.
  const activateCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCamActive(true);
      })
      .catch(() => {
        alert("Unable to access the camera. Please check your device settings.");
      });
  };

  // Stop the camera.
  const deactivateCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCamActive(false);
  };

  // Capture a photo from the camera.
  const capturePhoto = () => {
    if (!camActive) {
      alert("Please start the camera before capturing a photo.");
      return;
    }
    setInfoMsg("");
    setProcessedImage(null);
    const context = canvasRef.current.getContext("2d");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);
    const imageDataURL = canvasRef.current.toDataURL("image/png");
    setSrcImage(imageDataURL);
  };

  // Helper: Convert Data URL to Blob.
  const dataURLtoBlob = (dataUrl) => {
    const parts = dataUrl.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Send the image to the backend for processing.
  const processImage = async () => {
    if (!srcImage) {
      alert("Please upload or capture an image first.");
      return;
    }
    setInfoMsg("Processing image, please wait...");
    const formData = new FormData();
    const blob = dataURLtoBlob(srcImage);
    formData.append("image", new File([blob], "sign_input.png", { type: blob.type }));

    try {
      const response = await fetch("http://127.0.0.1:5000/object-detection", {
        method: "POST",
        body: formData,
      });
      const resultData = await response.json();
      if (resultData.error) {
        setInfoMsg("Error: " + resultData.error);
      } else {
        setProcessedImage(resultData.annotated_image);
        setLabels(resultData.classes);
        const labelText = resultData.classes.join(", ");
        setInfoMsg("Detected: " + labelText);
        speakText(labelText);
      }
    } catch (error) {
      console.error("Processing error:", error);
      setInfoMsg("Failed to process the image.");
    }
  };

  // Use text-to-speech to speak the detected labels.
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  return (
    <article className="sd-container">
      <header className="sd-header">
        <h2>Sign Language Detector</h2>
      </header>
      <section className="sd-control-panel">
        {/* Upload Container */}
        <div className="sd-upload-section">
          <label htmlFor="sd-file-input" className="sd-upload-button">
            Choose File
          </label>
          <input
            type="file"
            id="sd-file-input"
            accept="image/*"
            onChange={handleFileSelection}
            className="sd-file-input"
          />
        </div>

        {/* Camera Container */}
        <div className="sd-camera-section">
          <div className="sd-video-box">
            {!camActive && (
              <div className="sd-video-overlay">
                <p>Camera is off</p>
              </div>
            )}
            <video ref={videoRef} className="sd-video-feed" autoPlay playsInline></video>
          </div>
          <div className="sd-camera-controls">
            <button onClick={activateCamera} className="sd-button">
              Start Camera
            </button>
            <button onClick={capturePhoto} className="sd-button">
              Capture Photo
            </button>
            {camActive && (
              <button onClick={deactivateCamera} className="sd-button">
                Stop Camera
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="sd-preview-section">
        {srcImage && (
          <div className="sd-preview-container">
            <h3>Input Image</h3>
            <img src={srcImage} alt="User provided" className="sd-preview-img" />
          </div>
        )}
        <canvas ref={canvasRef} className="sd-hidden-canvas"></canvas>
      </section>

      {/* Action Section */}
      <section className="sd-action-section">
        <button onClick={processImage} className="sd-process-button">
          Process Image
        </button>
      </section>

      {/* Result Section */}
      <section className="sd-result-section">
        {infoMsg && <div className="sd-info-msg">{infoMsg}</div>}
        {processedImage && (
          <div className="sd-result-img-container">
            <h3>Annotated Image</h3>
            <img
              src={`data:image/jpeg;base64,${processedImage}`}
              alt="Annotated result"
              className="sd-result-img"
            />
          </div>
        )}
        {labels.length > 0 && (
          <div className="sd-labels-container">
            <h3>Detected Labels</h3>
            <ul className="sd-labels-list">
              {labels.map((label, index) => (
                <li key={index} className="sd-label-item">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </article>
  );
};

export default SignDetector;
