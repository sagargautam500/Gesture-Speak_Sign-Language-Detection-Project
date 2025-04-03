import React, { useState, useEffect, useRef } from 'react';
import './LiveDemoSection.css';

const LiveDemoSection = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedText, setDetectedText] = useState("Start performing gestures to detect text...");
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startDemo = async () => {
    setErrorMessage("");
    try {
      // Check if camera is already active
      if (isCameraActive) return;
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // or 'environment' for rear camera
        } 
      });
      
      streamRef.current = stream;
      
      // Check if videoRef exists before assigning stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            setErrorMessage(`Video play error: ${err.message}`);
          });
        };
      }
      
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMessage(`Camera error: ${err.message}`);
      setIsCameraActive(false);
    }
  };

  const stopDemo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDemo();
    };
  }, []);

  return (
    <section className="live-demo">
      <h2>GestureSpeak: Live Demo</h2>
      <p>Perform sign language gestures to see them detected in real-time.</p>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          {errorMessage.includes('permission') && (
            <p>Please check your browser permissions and allow camera access.</p>
          )}
        </div>
      )}

      <div className="demo-area">
        {!isCameraActive ? (
          <div className="demo-placeholder">
            <p>Camera feed will appear here when activated.</p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-feed"
          />
        )}
      </div>

      <div className="output-panel">
        <h3>Detected Gesture:</h3>
        <p>{detectedText}</p>
      </div>

      <div className="demo-buttons">
        <button 
          onClick={startDemo} 
          disabled={isCameraActive}
          className={isCameraActive ? 'disabled' : ''}
        >
          {isCameraActive ? 'Camera Active' : 'Start Demo'}
        </button>
        <button 
          onClick={stopDemo} 
          disabled={!isCameraActive}
          className={!isCameraActive ? 'disabled' : ''}
        >
          Stop Demo
        </button>
      </div>
    </section>
  );
};

export default LiveDemoSection;