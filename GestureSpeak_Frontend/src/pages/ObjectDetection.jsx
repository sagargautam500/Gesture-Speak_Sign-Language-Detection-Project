import React from "react";
import SignDetector from "../components/SignDetector";
import Dashboard from "../components/Dashboard";
import "./ObjectDetection.css";

const ObjectDetection = () => {
  return (
    <div className="od-page-container">
      <header className="od-header">
        <h1>Sign Language Recognition System</h1>
        <p className="od-subtitle">
          Real-time gesture detection powered by YOLOv5 with integrated learning tools
        </p>
      </header>

      <section className="od-system-overview">
        <div className="od-pipeline">
          <h2>Detection Pipeline</h2>
          <div className="pipeline-steps">
            <div className="pipeline-step">
              <h3>Input Source</h3>
              <p>Webcam stream or image upload</p>
            </div>
            <div className="pipeline-step">
              <h3>YOLOv5 Processing</h3>
              <p>Real-time gesture detection</p>
            </div>
            <div className="pipeline-step">
              <h3>Output</h3>
              <p>Text & speech translation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="od-main-content">
        <div className="od-detection-interface">
          <SignDetector />
        </div>
        
        <div className="od-dashboard">
          <Dashboard />
        </div>
      </section>

      <section className="od-feature-details">
        <h2>Learning Components</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Gesture Library</h3>
            <ul>
              <li>Comprehensive sign database</li>
              <li>3D gesture visualizations</li>
              <li>Multilingual translations</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>Practice Module</h3>
            <ul>
              <li>Interactive exercises</li>
              <li>Performance analytics</li>
              <li>Progress tracking</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ObjectDetection;