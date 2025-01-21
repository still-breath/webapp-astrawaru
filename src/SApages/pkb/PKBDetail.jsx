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
    const fetchPkb = async () => {
      try {
        // Fetch PKB berdasarkan noPkb
        const pkbResponse = await axios.get(`https://bengkel-mate-backend.vercel.app/api/pkb?noPkb=${noPkb}`);
        const pkb = pkbResponse.data.pkbs?.find((item) => item.noPkb === noPkb);

        if (!pkb) {
          setPkbDetail(null); // Jika PKB tidak ditemukan
          return;
        }

        setPkbDetail(pkb);
      } catch (error) {
        console.error("Error fetching PKB data:", error);
        setPkbDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPkb();
  }, [noPkb]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pkbDetail) {
    return <p>Data PKB tidak ditemukan.</p>;
  }

  const {
    noPkb: pkbNumber,
    tanggalWaktu,
    kilometer,
    keluhan,
    namaMekanik,
    namaSa,
    responsMekanik,
    customer = {},
    vehicle = {},
    summary = {},
  } = pkbDetail;

  const { layanan = [], sparepart = [] } = summary;

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
                        {service.namaLayanan} - Rp {service.harga.toLocaleString()} x{" "}
                        {service.quantity} = Rp {service.total.toLocaleString()}
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
                {sparepart.length > 0 ? (
                  <ul>
                    {sparepart.map((part) => (
                      <li key={part._id}>
                        {part.namaPart} - Rp {part.harga.toLocaleString()} x{" "}
                        {part.quantity} = Rp {part.total.toLocaleString()}
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
