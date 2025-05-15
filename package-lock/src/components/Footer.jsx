// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer style={footerStyle}>
      <p>© 2025 by SDGR & AAHV</p>
    </footer>
  );
}

const footerStyle = {
  position: "fixed",
  bottom:   0,
  left:     0,
  width:    "100%",
  textAlign:  "center",
  padding:    "1rem",
  color:      "#6c757d",
  fontSize:   "0.9rem",
   zIndex:     1000,
};

export default Footer;
