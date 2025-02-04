/* eslint-disable no-unused-vars */
import React from 'react';
import './Footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Section: Quick Links */}
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        {/* Section: Social Media */}
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100071846287638" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
            </a>
            <a href="https://x.com/sagargautam500" target="_blank" rel="noopener noreferrer">
            <FaSquareXTwitter />
            </a>
            <a href="https://www.instagram.com/sagargautam500/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/sagargautam500/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
            </a>
          </div>
          <div className="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100092283167788" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
            </a>
            <a href="https://www.instagram.com/adarshacr7/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/adarsha-rimal-86007532b/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
            </a>
          </div>
          <div className="social-icons">
            <a href="https://www.facebook.com/shivaram.dhakal.7906" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
            </a>
          
            <a href="https://www.instagram.com/sujandhakal532/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
            </a>
            
          </div>
        </div>

        {/* Section: Acknowledgments */}
        <div className="footer-section acknowledgments">
          <h3>About Us</h3>
          <p>Empowering communication through GestureSpeak.</p>
          <p>© {new Date().getFullYear()} GestureSpeak. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
