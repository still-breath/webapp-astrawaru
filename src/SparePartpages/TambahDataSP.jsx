import React, { useState } from "react";
import Sidebar from "../components/sidebar-sp/SidebarSP";
import Navbar from "../components/navbar/Navbar";
import axios from "axios";
import "./tambahdatasp.scss";

const TambahDataSP = () => {
  const [formData, setFormData] = useState({
    namaPart: "",
    number: "",
    stock: "",
    harga: "",
  });

  const [fileData, setFileData] = useState(null); // Untuk file upload
  const [message, setMessage] = useState("");
  const [fileMessage, setFileMessage] = useState("");

  // Handle perubahan untuk data sparepart
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle perubahan untuk file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  // Handle submit untuk data sparepart
  const handleDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://bengkel-mate-backend.vercel.app/api/sparepart_2", {
        ...formData,
        stock: parseInt(formData.stock, 10), // Konversi stock ke integer
        harga: parseFloat(formData.harga), // Konversi harga ke float
      });

      if (response.status === 201) {
        setMessage("Data berhasil ditambahkan!");
        setFormData({ namaPart: "", number: "", stock: "", harga: "" });
      } else {
        setMessage("Gagal menambahkan data. Coba lagi!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  // Handle submit untuk upload file
  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!fileData) {
      setFileMessage("Harap pilih file terlebih dahulu.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("files", fileData); // Tambahkan file ke FormData

      const response = await axios.post("https://bengkel-mate-backend.vercel.app/api/sparepart_2", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Header untuk FormData
        },
      });

      if (response.status === 201) {
        setFileMessage("File berhasil diunggah!");
        setFileData(null);
      } else {
        setFileMessage("Gagal mengunggah file. Coba lagi!");
      }
    } catch (error) {
      console.error("Error:", error);
      setFileMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="tambah-data-sp">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="form-container">
          <h2>Tambah Data Sparepart</h2>

          {/* Form untuk menambahkan data sparepart */}
          <form onSubmit={handleDataSubmit} className="form">
            <div className="form-group">
              <label htmlFor="namaPart">Nama Part</label>
              <input
                type="text"
                id="namaPart"
                name="namaPart"
                value={formData.namaPart}
                onChange={handleDataChange}
                placeholder="Masukkan Nama Part"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Nomor Part</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleDataChange}
                placeholder="Masukkan Nomor Part"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleDataChange}
                placeholder="Masukkan Jumlah Stock"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="harga">Harga</label>
              <input
                type="number"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleDataChange}
                placeholder="Masukkan Harga"
                required
              />
            </div>
            <button type="submit" className="submit-button">Tambah Data</button>
            {message && <p className="message">{message}</p>}
          </form>

          <h2>Upload File</h2>

          {/* Form untuk mengunggah file */}
          <form onSubmit={handleFileSubmit} className="form">
            <div className="form-group">
              <label htmlFor="file">Pilih File</label>
              <input
                type="file"
                id="file"
                name="file"
                accept=".jpg,.png,.pdf,.docx,.xlsx"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Upload File</button>
            {fileMessage && <p className="message">{fileMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahDataSP;
