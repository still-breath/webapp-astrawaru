import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Panggil fungsi logout dari App.jsx
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem("token"); // Hapus token dari localStorage
    // Arahkan pengguna ke halaman login setelah logout
    navigate("/login");
  }, [onLogout, navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
