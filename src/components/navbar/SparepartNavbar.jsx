import React from "react";
import { Link } from "react-router-dom";

const SparepartNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/request">Request Spare Parts</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default SparepartNavbar;
