import React, { useState, useEffect } from 'react';
import './LiveDemoSection.css';

const LiveDemoSection = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedText, setDetectedText] = useState("Start performing gestures to detect text...");
  const [errorMessage, setErrorMessage] = useState("");
  const [streamUrl, setStreamUrl] = useState(null);

  const startDemo = () => {
    setErrorMessage("");
    setIsCameraActive(true);
    setStreamUrl("http://127.0.0.1:5000/detect-gesture"); // Set backend stream URL
  };

  const stopDemo = () => {
    setStreamUrl(null);
    setIsCameraActive(false);
    setDetectedText("Start performing gestures to detect text...");
  };

  return (
    <section className="live-demo">
      <h2>GestureSpeak: Live Demo</h2>
      <p>Perform sign language gestures to see them detected in real-time.</p>

      {/* Backend Video Stream */}
      <div className="demo-area">
        {!isCameraActive && (
          <div className="demo-placeholder">
            <p>{errorMessage || "Camera feed will appear here."}</p>
          </div>
        )}
        {isCameraActive && (
          <img 
            src={streamUrl} 
            className="video-feed"
            alt="Real-time gesture detection feed"
          />
        )}
      </div>

      {/* Output Panel */}
      <div className="output-panel">
        <h3>Detected Gesture:</h3>
        <p>{detectedText}</p>
      </div>

      {/* Demo Control Buttons */}
      <div className="demo-buttons">
        <button onClick={startDemo}>Start Demo</button>
        <button onClick={stopDemo}>Stop Demo</button>
      </div>
    </section>
  );
};

export default LiveDemoSection;
