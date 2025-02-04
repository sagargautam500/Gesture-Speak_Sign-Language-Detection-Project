// Home.js
import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import DetectionSection from "../components/DetectionSection"
import LiveDemoSection from "../components/LiveDemoSection"
import Dashboard from "../components/Dashboard";
import SignDetector from "../components/SignDetector";

const Home = () => {
  return (
    <div className="home">
    <HeroSection />
    <FeaturesSection />
    <LiveDemoSection />
    <DetectionSection/>
    <SignDetector />
    <Dashboard />
    </div>
  );
};

export default Home;
