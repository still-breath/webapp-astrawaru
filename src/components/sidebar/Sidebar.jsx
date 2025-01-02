import "./sidebar.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setActiveItem("pkb");
        break;
      case "/servis":
        setActiveItem("servis");
        break;
      case "/masterdata":
        setActiveItem("masterdata");
        break;
      case "/progress":
        setActiveItem("progress");
        break;
      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar">
        <ul className="menu">
          <Link to="/" style={{ textDecoration: "none" }}>
            <li 
              className={`menu-item ${activeItem === "home" ? "active" : ""}`}
              onClick={() => handleItemClick("home")}
            >
              <div className="icon-container">
                <HomeOutlinedIcon className="icon"/>
              </div>
              <span className="text">Home</span>
            </li>
          </Link>
          <Link to="/servis" style={{ textDecoration: "none" }}>
            <li 
              className={`menu-item ${activeItem === "servis" ? "active" : ""}`}
              onClick={() => handleItemClick("servis")}
            >
              <div className="icon-container">
                <BuildOutlinedIcon className="icon"/>
              </div>
              <span className="text">Servis</span>
            </li>
          </Link>
          <Link to="/masterdata" style={{ textDecoration: "none" }}>
            <li 
              className={`menu-item ${activeItem === "masterdata" ? "active" : ""}`}
              onClick={() => handleItemClick("masterdata")}
            >
              <div className="icon-container">
                <DatasetOutlinedIcon className="icon"/>
              </div>
              <span className="text">Masterdata</span>
            </li>
          </Link>
          <Link to="/progress" style={{ textDecoration: "none" }}>
            <li 
              className={`menu-item ${activeItem === "progress" ? "active" : ""}`}
              onClick={() => handleItemClick("progress")}
            >
              <div className="icon-container">
                <UpdateOutlinedIcon className="icon"/>
              </div>
              <span className="text">Progress</span>
            </li>
          </Link>
        </ul>
      </div>
  );
};

export default Sidebar;