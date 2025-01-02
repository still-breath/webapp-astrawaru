import "./sidebarSP.scss";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';

const SidebarSP = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/spareparts":
        setActiveItem("spareparts");
        break;
      case "/tambahSP":
        setActiveItem("tambahSP");
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
          <Link to="/spareparts" style={{ textDecoration: "none" }}>
            <li
              className={`menu-item ${activeItem === "spareparts" ? "active" : ""}`}
              onClick={() => handleItemClick("spareparts")}
            >
              <div className="icon-container">
                <DnsOutlinedIcon className="icon" />
              </div>
              <span class="text">Spareparts</span>
            </li>
          </Link>
          <Link to="/tambahSP" style={{ textDecoration: "none" }}>
            <li
              className={`menu-item ${activeItem === "tambahSP" ? "active" : ""}`}
              onClick={() => handleItemClick("tambahSP")}
            >
              <div className="icon-container">
                <PostAddOutlinedIcon className="icon" />
              </div>
              <span class="text">TambahSP</span>
            </li>
          </Link>
        </ul>
    </div>
  );
};

export default SidebarSP;
