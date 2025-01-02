import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./pkbdetail.scss";

const PKBDetail = () => {
  const { id: noPkb } = useParams(); // Ambil noPkb dari URL
  const [pkbDetail, setPkbDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPkbByNoPkb = async () => {
      try {
        // Step 1: Fetch all PKB data
        const response = await axios.get("/api/pkb");
        const allPkbs = response.data.pkbs || [];

        // Step 2: Find the _id that matches the noPkb
        const pkb = allPkbs.find((item) => item.noPkb === noPkb);

        if (pkb && pkb._id) {
          // Step 3: Fetch detailed data using the _id
          const detailResponse = await axios.get(`/api/pkb/${pkb._id}`);
          setPkbDetail(detailResponse.data.pkb);
        } else {
          setPkbDetail(null); // No matching PKB found
        }
      } catch (error) {
        console.error("Error fetching PKB detail:", error);
        setPkbDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPkbByNoPkb();
  }, [noPkb]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pkbDetail) {
    return <p>Data not found.</p>;
  }

  const {
    noPkb: pkbNumber,
    tanggalWaktu,
    kilometer,
    keluhan,
    namaMekanik,
    namaSa,
    layanan = [],
    spareparts = [],
    responsMekanik,
    customer = {},
    vehicle = {},
  } = pkbDetail;

  return (
    <div className="pkb-detail-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="detail-container">
          <h2>Detail PKB</h2>
          <div className="detail-sections">
            <div className="upper-section">
              {/* Informasi Customer */}
              <div className="detail-section">
                <h3>Informasi Customer</h3>
                <p><strong>Nama:</strong> {customer.nama || "-"}</p>
                <p><strong>Alamat:</strong> {customer.alamat || "-"}</p>
                <p><strong>No Telepon:</strong> {customer.noTelp || "-"}</p>
              </div>

              {/* Informasi Kendaraan */}
              <div className="detail-section">
                <h3>Informasi Kendaraan</h3>
                <p><strong>No Polisi:</strong> {vehicle.noPolisi || "-"}</p>
                <p><strong>No Rangka:</strong> {vehicle.noRangka || "-"}</p>
                <p><strong>No Mesin:</strong> {vehicle.noMesin || "-"}</p>
                <p><strong>Tipe:</strong> {vehicle.tipe || "-"}</p>
                <p><strong>Tahun:</strong> {vehicle.tahun || "-"}</p>
                <p><strong>Produk:</strong> {vehicle.produk || "-"}</p>
                <p><strong>Kilometer:</strong> {vehicle.kilometer || "-"}</p>
              </div>
            </div>

            {/* Informasi PKB */}
            <div className="lower-section">
              <div className="detail-section">
                <h3>Informasi PKB</h3>
                <p><strong>No PKB:</strong> {pkbNumber}</p>
                <p>
                  <strong>Tanggal & Waktu:</strong>{" "}
                  {new Date(tanggalWaktu).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p><strong>Kilometer:</strong> {kilometer}</p>
                <p><strong>Keluhan:</strong> {keluhan}</p>
                <p><strong>Respons Mekanik:</strong> {responsMekanik}</p>
                <p><strong>Nama Mekanik:</strong> {namaMekanik}</p>
                <p><strong>Nama SA:</strong> {namaSa}</p>
              </div>

              {/* Layanan */}
              <div className="detail-section">
                <h3>Layanan</h3>
                {layanan.length > 0 ? (
                  <ul>
                    {layanan.map((service) => (
                      <li key={service._id}>
                        {service.namaLayanan} - Rp {service.harga.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada layanan.</p>
                )}
              </div>

              {/* Spareparts */}
              <div className="detail-section">
                <h3>Spareparts</h3>
                {spareparts.length > 0 ? (
                  <ul>
                    {spareparts.map((part) => (
                      <li key={part._id}>
                        {part.namaPart} - {part.number} - Rp{" "}
                        {part.harga.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada spareparts.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PKBDetail;
