import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./progress.scss";

const Progress = () => {
  const [progressData, setProgressData] = useState([]); // State to store progress data
  const navigate = useNavigate();

  // Fetch progress data from backend
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get("/api/progress"); // Replace with your actual backend endpoint
        setProgressData(response.data.progresses || []); // Store progress data in state
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  // Handle navigation to post-progress page
  const handleAddProgress = () => {
    navigate("/progress/post-progress");
  };

  // Optional: If you want to show details on click, handle it similarly to PKB
  const handleProgressClick = (id) => {
    // Contoh: navigasi ke halaman detail progress (jika ada)
    navigate(`/progress/detail/${id}`);
  };

  return (
    <div className="progress-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="progress-header">
          <h2>Progress List</h2>
          <button className="add-button" onClick={handleAddProgress}>
            +
          </button>
        </div>
        <div className="progress-list">
          {progressData.length > 0 ? (
            progressData.map((progress) => (
              <div
                className="progress-card"
                key={progress._id}
                onClick={() => handleProgressClick(progress._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="progress-id">{progress.id || "ID"}</div>
                <div className="progress-details">
                  <p>
                    <strong>No PKB:</strong> {progress.pkb.noPkb || "Data tidak tersedia"}
                  </p>
                  <p>
                    <strong>Status:</strong> {progress.status || "Data tidak tersedia"}
                  </p>
                  <p>
                    <strong>Persentase:</strong> {progress.persentase || "0"}%
                  </p>
                  <p>
                    <strong>No Polisi:</strong> {progress.vehicle.noPolisi || "Data tidak tersedia"}
                  </p>
                  <p>
                    <strong>Tipe:</strong> {progress.vehicle.tipe || "Data tidak tersedia"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No progress data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
