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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/spareparts", {
        ...formData,
        stock: parseInt(formData.stock, 10), // Ensure stock is an integer
        harga: parseFloat(formData.harga), // Ensure harga is a float
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

  return (
    <div className="tambah-data-sp">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="form-container">
          <h2>Tambah Data Sparepart</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="namaPart">Nama Part</label>
              <input
                type="text"
                id="namaPart"
                name="namaPart"
                value={formData.namaPart}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Masukkan Harga"
                required
              />
            </div>
            <button type="submit" className="submit-button">Tambah</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahDataSP;
