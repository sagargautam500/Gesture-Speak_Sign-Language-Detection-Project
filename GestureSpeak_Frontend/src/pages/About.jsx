import React from "react";
import "./About.css";
import sagar from "../assets/sagar.jpg"
import adarsha from "../assets/adarsha.jpg"
import shivram from "../assets/shivram.jpg"

const teamMembers = [
  {
    name: "Sagar Gautam",
    role: "Front-End Developer, Project Lead",
    photo: sagar,  // Replace with actual photo URL
    address: "Kathmandu, Nepal",
    contact: "sagargautam389@gmail.com",
    dob: "2058/01/20"
  },
  {
    name: "Adarsha Rimal",
    role: "Back-End Developer",
    photo: adarsha,  // Replace with actual photo URL
    address: "Kathmandu, Nepal",
    contact: "adarsharimal389@gmail.com",
    dob:"2058/06/20"
  },
  {
    name: "Shiv Ram Dhakal",
    role: "UX/UI Designer",
    photo: shivram,  // Replace with actual photo URL
    address: "Bhaktapur, Nepal",
    contact: "shivaram389@gmail.com",
    dob:"2059/01/13"
  }
];

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About GestureSpeak</h1>
        <p>
          GestureSpeak is a revolutionary platform designed to bridge the communication gap between the deaf and hearing communities.
        </p>
      </header>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          GestureSpeak aims to provide an accessible and inclusive tool for sign language recognition and translation. Our goal is to empower individuals by breaking down communication barriers and fostering greater understanding between different communities.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <p>
          GestureSpeak is the result of a dedicated team of developers, designers, and accessibility experts, all committed to making sign language more accessible.
        </p>
        <div className="team-cards">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.photo} alt={member.name} className="team-photo" />
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-detail"><strong>Address:</strong> {member.address}</p>
              <p className="team-detail"><strong>Contact:</strong> {member.contact}</p>
              <p className="team-detail"><strong>Dob:</strong> {member.dob}</p>
            </div>
          ))}
        </div>
      </section>
     
      <section className="about-tech">
        <h2>Technology Behind GestureSpeak</h2>
        <p>
          GestureSpeak leverages state-of-the-art machine learning algorithms and web technologies to provide real-time gesture-to-text translation. The platform uses React.js, HTML, CSS, and JavaScript to create a seamless, user-friendly experience.
        </p>
      </section>

      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you! Reach out to us through our contact page.
        </p>
      </section>
    </div>
  );
};

export default About;
