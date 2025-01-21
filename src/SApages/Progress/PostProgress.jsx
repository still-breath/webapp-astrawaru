import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./postprogress.scss";

const PostProgress = () => {
  const navigate = useNavigate(); // To redirect after submission

  const [noPkbList, setNoPkbList] = useState([]); // State to store list of noPKB
  const [noRangkaList, setNoRangkaList] = useState([]); // State to store list of noRangka
  const [progressData, setProgressData] = useState({
    persentase: 0,
    status: "Pending",
    progresLayanan: "",
    noPkb: "",
    noRangka: "",
  }); // State for progress form
  const [message, setMessage] = useState(""); // State for messages

  // Fetch list of noPKB from database PKB
  useEffect(() => {
    const fetchNoPkbList = async () => {
      try {
        const response = await axios.get("https://bengkel-mate-backend.vercel.app/api/pkb"); // Fetch all PKB
        const pkbList = response.data.pkbs || []; // Extract PKBs
        setNoPkbList(pkbList); // Save list of PKBs
      } catch (error) {
        console.error("Error fetching noPKB list:", error);
      }
    };

    fetchNoPkbList(); // Fetch noPKB list on component mount
  }, []);

  // Fetch list of noRangka from database vehicles
  useEffect(() => {
    const fetchNoRangkaList = async () => {
      try {
        const response = await axios.get("https://bengkel-mate-backend.vercel.app/api/vehicles"); // Fetch all vehicles
        const vehicles = response.data.vehicles || []; // Extract vehicles
        const noRangkaOptions = vehicles.map((vehicle) => vehicle.noRangka); // Extract noRangka
        setNoRangkaList(noRangkaOptions); // Save list of noRangka
      } catch (error) {
        console.error("Error fetching noRangka list:", error);
      }
    };

    fetchNoRangkaList(); // Fetch noRangka list on component mount
  }, []);

  const handleProgressChange = (e) => {
    const { name, value } = e.target;
    setProgressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyRequest = {
        ...progressData,
        persentase: parseInt(progressData.persentase, 10), // Ensure persentase is an integer
      };

      // Post progress to API
      await axios.post("https://bengkel-mate-backend.vercel.app/api/progress", bodyRequest);
      setMessage("Progress berhasil disimpan!");
      setTimeout(() => {
        navigate("/progress"); // Redirect to progress page
      }, 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
      setMessage("Gagal menyimpan progress.");
    }
  };

  return (
    <div className="post-progress-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="form-container">
          <h2>Post Progress</h2>
          <form onSubmit={handleProgressSubmit} className="data-form">
            {/* Dropdown for NoPKB */}
            <div className="form-group">
              <label>No PKB:</label>
              <select
                name="noPkb"
                value={progressData.noPkb}
                onChange={handleProgressChange}
                required
              >
                <option value="">Pilih No PKB</option>
                {noPkbList.map((pkb) => (
                  <option key={pkb.noPkb} value={pkb.noPkb}>
                    {pkb.noPkb}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown for NoRangka */}
            <div className="form-group">
              <label>No Rangka:</label>
              <select
                name="noRangka"
                value={progressData.noRangka}
                onChange={handleProgressChange}
                required
              >
                <option value="">Pilih No Rangka</option>
                {noRangkaList.map((noRangka, index) => (
                  <option key={index} value={noRangka}>
                    {noRangka}
                  </option>
                ))}
              </select>
            </div>

            {/* Input for Progres Layanan */}
            <div className="form-group">
              <label>Progres Layanan:</label>
              <input
                type="text"
                name="progresLayanan"
                value={progressData.progresLayanan}
                onChange={handleProgressChange}
                placeholder="Masukkan progres layanan"
                required
              />
            </div>

            {/* Progress Form */}
            <div className="form-group">
              <label>Persentase:</label>
              <input
                type="number"
                name="persentase"
                value={progressData.persentase}
                onChange={handleProgressChange}
                placeholder="Masukkan persentase progress (0-100)"
                required
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={progressData.status}
                onChange={handleProgressChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              Simpan Progress
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PostProgress;
