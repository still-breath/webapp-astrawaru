import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./existinguser.scss";

const ExistingUser = () => {
  const [isNewVehicle, setIsNewVehicle] = useState(false); // State untuk menentukan jenis kendaraan
  const [customers, setCustomers] = useState([]);
  const [vehicle, setVehicles] = useState([]);
  const [pkbData, setPkbData] = useState({
    customerName: "",
    noRangka: "",
    layananNames: [],
    sparepartNames: [],
    keluhan: "",
    namaMekanik: "",
    namaSa: "",
    responsMekanik: "",
    kilometer: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    noPolisi: "",
    noRangka: "",
    noMesin: "",
    tipe: "",
    tahun: "",
    produk: "",
    kilometer: "",
    customerName: "",
  });

  const [vehicleKilometer, setVehicleKilometer] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [showPkbForm, setShowPkbForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/customers");
        const vehiclesResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/vehicles");

        setCustomers(customersResponse.data.customers || []);
        setVehicles(vehiclesResponse.data.vehicles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkbData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMultipleSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setPkbData((prevState) => ({
      ...prevState,
      [field]: selectedOptions,
    }));
  };

  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitNewVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://bengkel-mate-backend.vercel.app/api/vehicles", newVehicle);
      alert("Kendaraan baru berhasil disimpan!");
      setShowPkbForm(true); // Tampilkan form PKB baru setelah kendaraan disimpan
      setPkbData((prevState) => ({
        ...prevState,
        customerName: newVehicle.customerName,
        noRangka: newVehicle.noRangka,
      }));
    } catch (error) {
      console.error("Error saving new vehicle:", error);
      alert("Gagal menyimpan kendaraan baru.");
    }
  };

  const handleSubmitPkb = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://bengkel-mate-backend.vercel.app/api/pkb", pkbData);
      alert("Data PKB berhasil disimpan!");
    } catch (error) {
      console.error("Error saving PKB:", error);
      alert("Gagal menyimpan data PKB.");
    }
  };


  const updateVehicleKilometer = async () => {
    try {
      if (vehicleId && vehicleKilometer) {
        await axios.patch(`https://bengkel-mate-backend.vercel.app/api/vehicles/${vehicleId}`, { kilometer: vehicleKilometer });
        alert("Kilometer kendaraan berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Error updating vehicle kilometer:", error);
      alert("Gagal memperbarui kilometer kendaraan.");
    }
  };

  return (
    <div className="existing-user-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="form-container">
          <div className="toggle-buttons">
            <button id="button-lama"
              className={isNewVehicle ? "" : "active"}
              onClick={() => setIsNewVehicle(false)}
            >
              Kendaraan Lama
            </button>
            <button id="button-baru"
              className={isNewVehicle ? "active" : ""}
              onClick={() => setIsNewVehicle(true)}
            >
              Kendaraan Baru
            </button>
          </div>
          {isNewVehicle ? (
            !showPkbForm ? (
              <form>
                <h3>Data Kendaraan Baru</h3>
                <div className="form-group">
                  <label>No Polisi:</label>
                  <input
                    type="text"
                    name="noPolisi"
                    value={newVehicle.noPolisi}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>No Rangka:</label>
                  <input
                    type="text"
                    name="noRangka"
                    value={newVehicle.noRangka}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>No Mesin:</label>
                  <input
                    type="text"
                    name="noMesin"
                    value={newVehicle.noMesin}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipe:</label>
                  <input
                    type="text"
                    name="tipe"
                    value={newVehicle.tipe}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tahun:</label>
                  <input
                    type="number"
                    name="tahun"
                    value={newVehicle.tahun}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Produk:</label>
                  <input
                    type="text"
                    name="produk"
                    value={newVehicle.produk}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kilometer:</label>
                  <input
                    type="number"
                    name="kilometer"
                    value={newVehicle.kilometer}
                    onChange={handleNewVehicleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama Customer:</label>
                  <select
                    name="customerName"
                    value={newVehicle.customerName}
                    onChange={handleNewVehicleChange}
                    required
                  >
                    <option value="">Pilih Customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer.nama}>
                        {customer.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="button"
                  onClick={handleSubmitNewVehicle}
                >
                  Simpan Kendaraan Baru
                </button>
              </form>
              ) : (
                <form>
                  <h3>Data PKB Kendaraan Baru</h3>
                  <div className="form-group">
                  <label>Nama Customer:</label>
                  <select
                    name="customerName"
                    value={pkbData.customerName}
                    onChange={handleNewVehicleChange}
                    required
                  >
                    <option value="">Pilih Customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer.nama}>
                        {customer.nama}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="form-group">
                    <label>Keluhan:</label>
                    <input
                      type="text"
                      name="keluhan"
                      value={pkbData.keluhan}
                      placeholder="Masukkan keluhan"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Mekanik:</label>
                    <input
                      type="text"
                      name="namaMekanik"
                      value={pkbData.namaMekanik}
                      placeholder="Masukkan nama mekanik"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama SA:</label>
                    <input
                      type="text"
                      name="namaSa"
                      value={pkbData.namaSa}
                      placeholder="Masukkan nama SA"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Respons Mekanik:</label>
                    <input
                      type="text"
                      name="responsMekanik"
                      value={pkbData.responsMekanik}
                      placeholder="Masukkan respons mekanik"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kilometer (PKB):</label>
                    <input
                      type="number"
                      name="kilometer"
                      value={pkbData.kilometer}
                      placeholder="Masukkan Kilometer"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="button"
                    onClick={handleSubmitPkb}
                  >
                    Simpan PKB
                  </button>
                </form>
              )
            ) : (
            <form>
              <h3>Data PKB Kendaraan Lama</h3>
              <div className="form-group">
                  <label>Nama Customer:</label>
                  <select
                    name="customerName"
                    value={pkbData.customerName}
                    onChange={handleNewVehicleChange}
                    required
                  >
                    <option value="">Pilih Customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer.nama}>
                        {customer.nama}
                      </option>
                    ))}
                  </select>
                </div>
              <div className="form-group">
                <label>Keluhan:</label>
                <input
                  type="text"
                  name="keluhan"
                  value={pkbData.keluhan}
                  placeholder="Masukkan keluhan"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nama Mekanik:</label>
                <input
                  type="text"
                  name="namaMekanik"
                  value={pkbData.namaMekanik}
                  placeholder="Masukkan nama mekanik"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nama SA:</label>
                <input
                  type="text"
                  name="namaSa"
                  value={pkbData.namaSa}
                  placeholder="Masukkan nama SA"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Respons Mekanik:</label>
                <input
                  type="text"
                  name="responsMekanik"
                  value={pkbData.responsMekanik}
                  placeholder="Masukkan respons mekanik"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Kilometer (PKB):</label>
                <input
                  type="number"
                  name="kilometer"
                  value={pkbData.kilometer}
                  placeholder="Masukkan Kilometer"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                className="button"
                onClick={handleSubmitPkb}
              >
                Simpan PKB
              </button>

              <h3>Update Kilometer Kendaraan</h3>
              <div className="form-group">
                <label>Kilometer:</label>
                <input
                  type="number"
                  value={vehicleKilometer}
                  onChange={(e) => setVehicleKilometer(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="button"
                onClick={updateVehicleKilometer}
              >
                Update Kilometer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExistingUser;
