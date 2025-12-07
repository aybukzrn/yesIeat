import React from 'react';
import './IntroAnimation.css'; 

const logoPath = '/assets/LoginPages/logo.png';
const mainText = "YES I EAT";
const subText = "ORDER & EAT";

const IntroAnimation = () => {
  return (
    <div className="intro-container">
      <img src={logoPath} alt="Yes I Eat Logo" className="intro-logo-scooter" />

      <h1 className="intro-text-main">
        {mainText.split('').map((char, index) => (
          <span
            key={index}
            className="intro-char"
            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      <p className="intro-text-sub">
        {subText.split('').map((char, index) => (
          <span
            key={index}
            className="intro-char-sub"
            style={{ animationDelay: `${1.5 + index * 0.08}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default IntroAnimation;