import React from "react";
import "./Features.css";
import { FaHandRock, FaGlobe, FaChalkboardTeacher, FaPlay,  FaTachometerAlt } from "react-icons/fa";
import { IoAccessibility } from "react-icons/io5";


const Features = () => {
  return (
    <div className="features-page">
      <header className="features-header">
        <h1>Discover the Features of GestureSpeak</h1>
        <p>
          Explore the cutting-edge tools and functionalities that make GestureSpeak the ultimate platform for bridging communication gaps.
        </p>
      </header>

      <section className="features-list">
        <div className="feature-item">
          <FaHandRock className="feature-icon" />
          <h2>Real-Time Gesture Detection</h2>
          <p>
            Translate sign language gestures into text instantly using advanced machine learning algorithms.
          </p>
        </div>

        <div className="feature-item">
          <FaGlobe className="feature-icon" />
          <h2>Multi-Language Support</h2>
          <p>
            Break communication barriers with support for various languages, ensuring inclusivity for everyone.
          </p>
        </div>

        <div className="feature-item">
          <FaChalkboardTeacher className="feature-icon" />
          <h2>Gesture Training Mode</h2>
          <p>
            Teach the platform new gestures with an intuitive training mode for personalized experiences.
          </p>
        </div>

        <div className="feature-item">
          <FaPlay className="feature-icon" />
          <h2>Live Demo</h2>
          <p>
            Experience real-time gesture detection and translation with our interactive demo feature.
          </p>
        </div>

        <div className="feature-item">
          <IoAccessibility className="feature-icon" />
          <h2>Accessibility Features</h2>
          <p>
            Enhance usability with high contrast mode, adjustable text sizes, and keyboard navigation support.
          </p>
        </div>

        <div className="feature-item">
          <FaTachometerAlt className="feature-icon" />
          <h2>Dashboard and Analytics</h2>
          <p>
            Track gesture history, analyze performance, and access personalized insights from your dashboard.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Features;
