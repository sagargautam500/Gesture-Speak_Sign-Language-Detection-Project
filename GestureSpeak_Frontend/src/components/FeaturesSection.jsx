/* eslint-disable no-unused-vars */
import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'https://cdn-icons-png.flaticon.com/128/4729/4729355.png',
      title: 'High Accuracy',
      description: 'Detects sign language gestures with exceptional precision.',
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/128/15603/15603329.png',
      title: 'Real-Time Detection',
      description: 'Instant translation of gestures into text or speech.',
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/128/17062/17062528.png',
      title: 'Multilingual Support',
      description: 'Supports translations in multiple languages.',
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/128/9767/9767338.png',
      title: 'Accessible to All',
      description: 'Designed for ease of use for people of all abilities.',
    },
  ];

  return (
    <section className="features">
      <div className="features-header">
        <h2>Why Choose GestureSpeak?</h2>
        <p>Explore the cutting-edge features that make communication seamless.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <img src={feature.icon} alt={feature.title} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
