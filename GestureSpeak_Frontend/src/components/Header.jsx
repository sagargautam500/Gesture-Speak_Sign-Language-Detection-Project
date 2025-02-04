/* eslint-disable no-unused-vars */
// Header.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.jpeg";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="GestureSpeak Logo" />
        </NavLink>
        <span>GestureSpeak</span>
      </div>
      <button
        className="accessibility-btn"
        aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
        onClick={toggleNav}
      >
        {isNavOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={`nav ${isNavOpen ? "nav-open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          aria-current="page"
        >
          Home
        </NavLink>
        <NavLink
          to="/features"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Features
        </NavLink>
        <NavLink
          to="/gesture"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          GestureSpeak
        </NavLink>

        <NavLink
          to="/objdetect"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Object Detecter
        </NavLink>
        
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
