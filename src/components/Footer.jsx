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
  marginTop: "auto",
  textAlign: "center",
  padding: "1rem",
  color: "#6c757d", 
  fontSize: "0.9rem"
};

export default Footer;