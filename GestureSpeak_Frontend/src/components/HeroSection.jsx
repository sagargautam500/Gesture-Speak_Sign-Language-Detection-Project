/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";
import heroSection from "../assets/heroSection.jpeg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate("/objdetect"); // Navigate to the ObjectDetection page
  };

  const handleLearnMore = () => {
    navigate("/about"); // Navigate to the About page
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to GestureSpeak</h1>
        <p>
          Bridging the communication gap with advanced sign language detection.
          Empowering connections for everyone.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleTryDemo}>
            Try Demo
          </button>
          <button className="btn-secondary" onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroSection} alt="Sign language illustration" />
      </div>
    </section>
  );
};

export default HeroSection;
