import React from 'react';

export default function Footer() {
    return (
      <footer className="footer">
        <p>
          Desenvolvido por <strong>Waleriano Metzker Magalhães</strong> © {new Date().getFullYear()}
        </p>
      </footer>
    );
  }