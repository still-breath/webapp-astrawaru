import React from "react";
import { Link } from "react-router-dom";

const SANavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/pkb">PKB</Link></li>
        <li><Link to="/estimate-sum">Estimate</Link></li>
        <li><Link to="/history">History</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default SANavbar;
