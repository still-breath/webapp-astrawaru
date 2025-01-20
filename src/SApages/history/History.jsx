import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./history.scss";

const History = () => {
  const { noRangka } = useParams(); // Ambil noRangka dari URL
  const [vehicleData, setVehicleData] = useState(null);
  const [pkbData, setPkbData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data kendaraan
        const vehicleResponse = await axios.get("/api/vehicles");
        const vehicleList = vehicleResponse.data.vehicles || [];

        // Fetch PKB data
        const pkbResponse = await axios.get("/api/pkb");
        const pkbList = pkbResponse.data.pkbs || [];

        // Filter data kendaraan berdasarkan noRangka
        const selectedVehicle = vehicleList.find(
          vehicle => vehicle.noRangka === noRangka
        );

        // Filter PKB yang memiliki noRangka sama
        const filteredPkbs = pkbList.filter(
          pkb => pkb.vehicle?.noRangka === noRangka
        );

        setVehicleData(selectedVehicle);
        setPkbData(filteredPkbs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [noRangka]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="historis-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="historis-container">
          {vehicleData ? (
            <div className="vehicle-section">
              {/* Vehicle Information */}
              <div className="header-info">
                <div className="data-kendaraan">
                  <h3>Data Kendaraan</h3>
                  <p><strong>No Polisi:</strong> {vehicleData.noPolisi}</p>
                  <p><strong>No Rangka:</strong> {vehicleData.noRangka}</p>
                  <p><strong>No Mesin:</strong> {vehicleData.noMesin}</p>
                  <p><strong>Type:</strong> {vehicleData.tipe}</p>
                  <p><strong>Tahun Produksi:</strong> {vehicleData.tahun}</p>
                  <p><strong>Produk:</strong> {vehicleData.produk}</p>
                </div>
                <div className="data-pemilik">
                  <h3>Data Pemilik</h3>
                  <p><strong>Nama:</strong> {vehicleData.customer.nama || "-"}</p>
                  <p><strong>Alamat:</strong> {vehicleData.customer.alamat || "-"}</p>
                  <p><strong>Telepon:</strong> {vehicleData.customer.noTelp || "-"}</p>
                </div>
              </div>

              {/* PKB Data */}
              <div className="historis-list">
                <h4>Historis Servis</h4>
                {pkbData.length > 0 ? (
                  pkbData.map((pkb, index) => (
                    <div key={index} className="historis-card">
                      <div className="card-header">
                        <p><strong>Tanggal:</strong> {new Date(pkb.tanggalWaktu).toLocaleDateString()}</p>
                        <p><strong>No PKB:</strong> {pkb.noPkb}</p>
                        <p><strong>KM:</strong> {pkb.kilometer}</p>
                        <p><strong>S/A:</strong> {pkb.namaSa}</p>
                        <p><strong>Mekanik:</strong> {pkb.namaMekanik}</p>
                        <p><strong>Respons Mekanik:</strong> {pkb.responsMekanik.replace(/\n/g, ', ')}</p>
                      </div>
                      <div className="card-body">
                        <p><strong>Layanan:</strong></p>
                        <ul>
                          {pkb.layanan.map((layanan, idx) => (
                            <li key={idx}>
                              {layanan.namaLayanan} - Rp {layanan.harga.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                        <p><strong>Spareparts:</strong></p>
                        <ul>
                          {pkb.spareparts.map((part, idx) => (
                            <li key={idx}>
                              {part.namaPart} - Rp {part.harga.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Tidak ada riwayat servis.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Data kendaraan tidak ditemukan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
