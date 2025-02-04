import React, { useState } from "react";
import "./Dashboard.css";

// Dynamically import all images from the assets folder
const images = import.meta.glob("../assets/images/*.png", { eager: true });

const Dashboard = () => {
  const gestureLibrary = [
    { id: 1, name: "Hello", icon: "🖐️", image: images["../assets/images/hello.png"].default },
    { id: 2, name: "Thank You", icon: "👋", image: images["../assets/images/thankyou.png"].default },
    { id: 3, name: "Namaste", icon: "🙏", image: images["../assets/images/namaste.png"].default },
    { id: 4, name: "Yes", icon: "👍", image: images["../assets/images/yes.png"].default },
    { id: 5, name: "No", icon: "👎", image: images["../assets/images/no.png"].default },
    { id: 6, name: "silent", icon: "👌", image: images["../assets/images/silent.png"].default },
    { id: 7, name: "I Love You", icon: "🤟", image: images["../assets/images/iloveyou.png"].default },
    { id: 8, name: "help", icon: "✋", image: images["../assets/images/help.png"].default },
    { id: 9, name: "Fight", icon: "👊", image: images["../assets/images/fight.png"].default },
    { id: 10, name: "Heart", icon: "❤️", image: images["../assets/images/heart.png"].default },
    { id: 11, name: "Perfect", icon: "💯", image: images["../assets/images/perfect.png"].default },
    { id: 12, name: "Give", icon: "🤲", image: images["../assets/images/give.png"].default },
    { id: 13, name: "Please", icon: "🤲", image: images["../assets/images/please.png"].default },
  ];

  const [selectedGesture, setSelectedGesture] = useState(null);

  return (
    <div className="dashboard">
      <div className="gesture-library">
        <center><h3>Gesture Library</h3></center>
        <div className="gesture-grid">
          {gestureLibrary.map((gesture) => (
            <div key={gesture.id} className="gesture-card" onClick={() => setSelectedGesture(gesture)}>
              <p>{gesture.name}</p>
              <span className="emoji">{gesture.icon}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="practice-section">
        <h3>Practice Gesture</h3>
        {selectedGesture && selectedGesture.image ? (
          <div className="practice-feedback">
            <h4>Practicing: {selectedGesture.name}</h4>
            <div className="selected-gesture">
              <div className="gesture-visual-large">
                <img src={selectedGesture.image} alt={selectedGesture.name} className="gesture-image-large" />
              </div>
              <p>Perform the "{selectedGesture.name}" gesture using your camera.</p>
            </div>
          </div>
        ) : (
          <p>Select a gesture from the library to start practicing.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
