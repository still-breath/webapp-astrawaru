import React, { useState } from "react";
import "./navbar.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import logoAstra from "../../resource/img/logo-astra.png";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    onLogout(); // Panggil fungsi logout dari App.jsx
    setMenuOpen(false); // Tutup menu dropdown
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <img src={logoAstra} alt="Logo Astra" className="logo" />
        </div>
        <div className="items">
          <div className="item">
            <MoreVertIcon onClick={toggleMenu} />
            {menuOpen && (
              <div className="dropdown-menu">
                <Link to="/logout">
                  <button>Logout</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
