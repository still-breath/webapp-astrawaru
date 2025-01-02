import React, { useState } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import "./datacustomer.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

const DataCustomer = () => {
  const { noPolisi } = useParams();

  const [ownerData, setOwnerData] = useState({
    nama: "",
    alamat: "",
    noTelp: "",
    userName: "",
  });

  const [vehicleData, setVehicleData] = useState({
    noPolisi: noPolisi || "",
    noRangka: "",
    noMesin: "",
    tipe: "",
    tahun: "",
    produk: "",
    kilometer: "",
    customerName: "",
  });

  const [pkbData, setPkbData] = useState({
    keluhan: "",
    namaMekanik: "",
    namaSa: "",
    layananNames: "",
    sparepartNames: "",
    responsMekanik: "",
  });

  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePkbChange = (e) => {
    const { name, value } = e.target;
    setPkbData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/customers", ownerData);
      setMessage("Data pemilik berhasil disimpan!");
      setStep(2);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal menyimpan data pemilik.");
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleRequest = {
        ...vehicleData,
        customerName: ownerData.nama,
      };
      await axios.post("/api/vehicles", vehicleRequest);
      setMessage("Data kendaraan berhasil disimpan!");
      setStep(3);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal menyimpan data kendaraan.");
    }
  };

  const handlePkbSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyRequest = {
        ...pkbData,
        kilometer: vehicleData.kilometer,
        layananNames: pkbData.layananNames.split(",").map((item) => item.trim()),
        sparepartNames: pkbData.sparepartNames.split(",").map((item) => item.trim()),
        customerName: ownerData.nama,
        noRangka: vehicleData.noRangka, 
      };
      await axios.post("/api/pkb", bodyRequest);
      setMessage("Data PKB berhasil disimpan!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal menyimpan data PKB.");
    }
  };

  return (
    <div className="data-customer-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="form-container">
          
          {step === 1 && (
            <form onSubmit={handleOwnerSubmit} className="data-form">
              <h2>Data Customer</h2>
              <div className="form-group">
                <label>Nama:</label>
                <input
                  type="text"
                  name="nama"
                  value={ownerData.nama}
                  onChange={handleOwnerChange}
                  placeholder="Masukkan Nama"
                  required
                />
              </div>
              <div className="form-group">
                <label>Alamat:</label>
                <input
                  type="text"
                  name="alamat"
                  value={ownerData.alamat}
                  onChange={handleOwnerChange}
                  placeholder="Masukkan Alamat"
                  required
                />
              </div>
              <div className="form-group">
                <label>No Telepon:</label>
                <input
                  type="text"
                  name="noTelp"
                  value={ownerData.noTelp}
                  onChange={handleOwnerChange}
                  placeholder="Masukkan No Telepon"
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="userName"
                  value={ownerData.userName}
                  onChange={handleOwnerChange}
                  placeholder="Masukkan Username"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Simpan Data Customer
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVehicleSubmit} className="data-form">
              <h2>Data Kendaraan</h2>
              <div className="form-group">
                <label>No Polisi:</label>
                <input
                  type="text"
                  name="noPolisi"
                  value={vehicleData.noPolisi}
                  onChange={handleVehicleChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>No Rangka:</label>
                <input
                  type="text"
                  name="noRangka"
                  value={vehicleData.noRangka}
                  onChange={handleVehicleChange}
                />
              </div>
              <div className="form-group">
                <label>No Mesin:</label>
                <input
                  type="text"
                  name="noMesin"
                  value={vehicleData.noMesin}
                  onChange={handleVehicleChange}
                  placeholder="Masukkan No Mesin"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipe:</label>
                <input
                  type="text"
                  name="tipe"
                  value={vehicleData.tipe}
                  onChange={handleVehicleChange}
                  placeholder="Masukkan Tipe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tahun:</label>
                <input
                  type="text"
                  name="tahun"
                  value={vehicleData.tahun}
                  onChange={handleVehicleChange}
                  placeholder="Masukkan Tahun"
                  required
                />
              </div>
              <div className="form-group">
                <label>Produk:</label>
                <input
                  type="text"
                  name="produk"
                  value={vehicleData.produk}
                  onChange={handleVehicleChange}
                  placeholder="Masukkan Produk"
                  required
                />
              </div>
              <div className="form-group">
                <label>Kilometer:</label>
                <input
                  type="text"
                  name="kilometer"
                  value={vehicleData.kilometer}
                  onChange={handleVehicleChange}
                  placeholder="Masukkan Kilometer"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Simpan Data Kendaraan
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePkbSubmit} className="data-form pkb-form">
              <h2>Data PKB</h2>
              <div className="form-group">
                <label>Keluhan:</label>
                <input
                  type="text"
                  name="keluhan"
                  value={pkbData.keluhan}
                  onChange={handlePkbChange}
                  placeholder="Masukkan Keluhan"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nama Mekanik:</label>
                <input
                  type="text"
                  name="namaMekanik"
                  value={pkbData.namaMekanik}
                  onChange={handlePkbChange}
                  placeholder="Masukkan Nama Mekanik"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nama SA:</label>
                <input
                  type="text"
                  name="namaSa"
                  value={pkbData.namaSa}
                  onChange={handlePkbChange}
                  placeholder="Masukkan Nama SA"
                  required
                />
              </div>
              <div className="form-group">
                <label>Layanan (pisahkan dengan koma):</label>
                <input
                  type="text"
                  name="layananNames"
                  value={pkbData.layananNames}
                  onChange={handlePkbChange}
                  placeholder="Contoh: Servis Awal, Balancing Ban"
                  required
                />
              </div>
              <div className="form-group">
                <label>Sparepart (pisahkan dengan koma):</label>
                <input
                  type="text"
                  name="sparepartNames"
                  value={pkbData.sparepartNames}
                  onChange={handlePkbChange}
                  placeholder="Contoh: Filter Oli, Busi"
                  required
                />
              </div>
              <div className="form-group">
                <label>Respons Mekanik:</label>
                <input
                  type="text"
                  name="responsMekanik"
                  value={pkbData.responsMekanik}
                  onChange={handlePkbChange}
                  placeholder="Masukkan Respons Mekanik"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Simpan Data PKB
              </button>
            </form>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DataCustomer;
