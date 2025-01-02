import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/masterdata">Master Data</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
