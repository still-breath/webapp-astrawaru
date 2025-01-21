import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./detailprogress.scss";

const DetailProgress = () => {
  const { id } = useParams(); // Get progress ID from URL
  const [progressDetail, setProgressDetail] = useState(null); // Store progress detail data
  const [layananOptions, setLayananOptions] = useState([]); // Layanan options for dropdown
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [updatedData, setUpdatedData] = useState({
    persentase: 0,
    status: "",
    progresLayanan: "",
  }); // Store updated values
  const [message, setMessage] = useState(""); // Message for success or error

  // Fetch progress detail and layanan options on load
  useEffect(() => {
    const fetchProgressDetail = async () => {
      try {
        const response = await axios.get(`https://bengkel-mate-backend.vercel.app/api/progress/${id}`);
        const progressData = response.data.progress;

        setProgressDetail(progressData);
        setUpdatedData({
          persentase: progressData.persentase,
          status: progressData.status,
          progresLayanan: progressData.progresLayanan || "-",
        });

        // Fetch layanan options based on pkb.layanan
        const layananIds = progressData.pkb.layanan || [];
        const layananResponses = await Promise.all(
          layananIds.map((layananId) => axios.get(`https://bengkel-mate-backend.vercel.app/api/layanan/${layananId}`))
        );
        setLayananOptions(layananResponses.map((res) => res.data.layanan));
      } catch (error) {
        console.error("Error fetching progress details:", error);
      }
    };

    fetchProgressDetail();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (field) => {
    try {
      const bodyRequest = {
        [field]: updatedData[field],
      };

      // Update the specific field
      await axios.patch(`https://bengkel-mate-backend.vercel.app/api/progress/${id}`, bodyRequest);

      setMessage("Data berhasil diperbarui!");
      setEditField(null); // Close edit mode
    } catch (error) {
      console.error("Error updating progress:", error);
      setMessage("Gagal memperbarui data.");
    }
  };

  if (!progressDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="detail-progress-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="detail-container">
          <h2>Detail Progress</h2>
          <div className="progress-details">
            {/* Data PKB */}
            <p>
              <strong>No PKB:</strong> {progressDetail.pkb.noPkb}
            </p>
            <p>
                <strong>No Polisi:</strong> {progressDetail.vehicle?.noPolisi || "Data tidak tersedia"}
            </p>
            <p>
                <strong>No Rangka:</strong> {progressDetail.vehicle?.noRangka || "Data tidak tersedia"}
            </p>
            <p>
                <strong>Tipe:</strong> {progressDetail.vehicle?.tipe || "Data tidak tersedia"}
            </p>
            <p>
                <strong>Produk:</strong> {progressDetail.vehicle?.produk || "Data tidak tersedia"}
            </p>
            <p>
                <strong>Kilometer:</strong> {progressDetail.vehicle?.kilometer || "Data tidak tersedia"}
            </p>
            <p>
              <strong>Keluhan:</strong> {progressDetail.pkb.keluhan}
            </p>

            {/* Data yang Dapat Diedit */}
            <p>
              <strong>Status:</strong>{" "}
              {editField === "status" ? (
                <select
                  name="status"
                  value={updatedData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                progressDetail.status
              )}
              {editField === "status" ? (
                <button onClick={() => handleSave("status")}>Save</button>
              ) : (
                <button onClick={() => setEditField("status")}>Edit</button>
              )}
            </p>
            <p>
              <strong>Persentase:</strong>{" "}
              {editField === "persentase" ? (
                <input
                  type="number"
                  name="persentase"
                  value={updatedData.persentase}
                  onChange={handleInputChange}
                />
              ) : (
                `${progressDetail.persentase}%`
              )}
              {editField === "persentase" ? (
                <button onClick={() => handleSave("persentase")}>Save</button>
              ) : (
                <button onClick={() => setEditField("persentase")}>Edit</button>
              )}
            </p>
            <p>
              <strong>Layanan:</strong>{" "}
              {editField === "progresLayanan" ? (
                <select
                  name="progresLayanan"
                  value={updatedData.progresLayanan}
                  onChange={handleInputChange}
                >
                  <option value="-">Pilih Layanan</option>
                  {layananOptions.map((layanan, index) => (
                    <option key={index} value={layanan.namaLayanan}>
                      {layanan.namaLayanan}
                    </option>
                  ))}
                </select>
              ) : (
                progressDetail.progresLayanan
              )}
              {editField === "progresLayanan" ? (
                <button onClick={() => handleSave("progresLayanan")}>Save</button>
              ) : (
                <button onClick={() => setEditField("progresLayanan")}>Edit</button>
              )}
            </p>
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DetailProgress;
