import "./sidebarSA.scss";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DatasetOutlinedIcon from "@mui/icons-material/DatasetOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';

const SidebarSA = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/pkb":
      case "/pkb/:id":
        setActiveItem("pkb");
        break;
      case "/master-history":
        setActiveItem("history");
        break;
      case "/estimate-sum":
        setActiveItem("estimate-sum");
        break;
      case "/ticket":
        setActiveItem("ticket");
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
        <Link to="/ticket" style={{ textDecoration: "none" }}>
          <li
            className={`menu-item ${activeItem === "ticket" ? "active" : ""}`}
            onClick={() => handleItemClick("ticket")}
          >
            <div className="icon-container">
              <ConfirmationNumberOutlinedIcon className="icon" />
            </div>
            <span className="text">Ticket</span>
          </li>
        </Link>
        <Link to="/estimate-sum" style={{ textDecoration: "none" }}>
          <li
            className={`menu-item ${
              activeItem === "estimate-sum" ? "active" : ""
            }`}
            onClick={() => handleItemClick("estimate-sum")}
          >
            <div className="icon-container">
              <ShoppingCartOutlinedIcon className="icon" />
            </div>
            <span className="text">Est.Sum</span>
          </li>
        </Link>
        <Link to="/pkb" style={{ textDecoration: "none" }}>
          <li
            className={`menu-item ${activeItem === "pkb" ? "active" : ""}`}
            onClick={() => handleItemClick("pkb")}
          >
            <div className="icon-container">
              <DatasetOutlinedIcon className="icon" />
            </div>
            <span className="text">PKB</span>
          </li>
        </Link>
        <Link to="/master-history" style={{ textDecoration: "none" }}>
          <li
            className={`menu-item ${activeItem === "history" ? "active" : ""}`}
            onClick={() => handleItemClick("history")}
          >
            <div className="icon-container">
              <HistoryOutlinedIcon className="icon" />
            </div>
            <span className="text">History</span>
          </li>
        </Link>
        <Link to="/progress" style={{ textDecoration: "none" }}>
          <li
            className={`menu-item ${activeItem === "progress" ? "active" : ""}`}
            onClick={() => handleItemClick("progress")}
          >
            <div className="icon-container">
              <DonutLargeOutlinedIcon className="icon" />
            </div>
            <span className="text">Progress</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default SidebarSA;