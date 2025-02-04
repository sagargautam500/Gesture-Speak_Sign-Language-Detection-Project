import React from "react";
import "./GestureSpeak.css";
import LiveDemoSection from "../components/LiveDemoSection";
import DetectionSection from "../components/DetectionSection";

const GestureSpeak = () => {
  return (
    <div className="gesture-speak">
      <header className="gesture-speak__header">
        <h1 className="gesture-speak__title">Sign Language Detection System</h1>
        <p className="gesture-speak__intro">
          Experience real-time sign language translation through our AI-powered platform. 
          GestureSpeak bridges communication gaps by converting gestures into text and 
          speech instantly, using advanced computer vision models.
        </p>
      </header>

      <section className="gesture-speak__section gesture-speak__overview">
        <div className="gesture-speak__content">
          <h2>System Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Image Analysis</h3>
              <ul>
                <li>Upload or capture sign language images</li>
                <li>Automatic background removal</li>
                <li>Dual model processing (CNN & EfficientNet)</li>
                <li>Text & speech output generation</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <h3>Live Detection</h3>
              <ul>
                <li>Real-time webcam processing</li>
                <li>Continuous gesture recognition</li>
                <li>Instant text translation overlay</li>
                <li>Low-latency performance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="gesture-speak__section gesture-speak__models">
        <h2>Detection Models</h2>
        <div className="model-comparison">
          <div className="model-card">
            <h3>EfficientNet B4</h3>
            <p>Our primary model offering state-of-the-art accuracy:</p>
            <ul>
              <li>99.2% validation accuracy</li>
              <li>Advanced image preprocessing</li>
              <li>Multi-class support</li>
            </ul>
          </div>
          
          <div className="model-card">
            <h3>Custom CNN</h3>
            <p>Lightweight alternative model:</p>
            <ul>
              <li>94.7% validation accuracy</li>
              <li>Faster processing speed</li>
              <li>Basic gesture support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="gesture-speak__demo-container">
        <div className="gesture-speak__demo-section">
          <h2 className="demo-title">Image Detection</h2>
          <p className="demo-description">
            Analyze static images through our advanced processing pipeline:
          </p>
          <DetectionSection />
        </div>

        <div className="gesture-speak__demo-section">
          <h2 className="demo-title">Live Translation</h2>
          <p className="demo-description">
            Experience real-time sign language translation:
          </p>
          <LiveDemoSection />
        </div>
      </section>
    </div>
  )
}

export default GestureSpeak;