import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./existinguser.scss";

const ExistingUser = () => {
  const [isNewVehicle, setIsNewVehicle] = useState(false); // State untuk menentukan jenis kendaraan
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [pkbData, setPkbData] = useState({
    customerName: "",
    noRangka: "",
    keluhan: "",
    summary: "",
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

  // Fetch data customer dan vehicle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(
          "https://bengkel-mate-backend.vercel.app/api/customers"
        );
        const vehiclesResponse = await axios.get(
          "https://bengkel-mate-backend.vercel.app/api/vehicles"
        );

        setCustomers(customersResponse.data.customers || []);
        setVehicles(vehiclesResponse.data.vehicles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle perubahan data PKB
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkbData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle perubahan data kendaraan baru
  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit data kendaraan baru
  const handleSubmitNewVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://bengkel-mate-backend.vercel.app/api/vehicles",
        newVehicle
      );
      alert("Kendaraan baru berhasil disimpan!");
      setPkbData((prevState) => ({
        ...prevState,
        customerName: newVehicle.customerName,
        noRangka: newVehicle.noRangka,
      }));
      setIsNewVehicle(false); // Switch to PKB form for the new vehicle
    } catch (error) {
      console.error("Error saving new vehicle:", error);
      alert("Gagal menyimpan kendaraan baru.");
    }
  };

  // Submit data PKB
  const handleSubmitPkb = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...pkbData };
      await axios.post("https://bengkel-mate-backend.vercel.app/api/pkb", payload);
      alert("Data PKB berhasil disimpan!");
    } catch (error) {
      console.error("Error saving PKB:", error);
      alert("Gagal menyimpan data PKB.");
    }
  };

  // Update kilometer kendaraan lama
  const updateVehicleKilometer = async () => {
    try {
      if (vehicleId && vehicleKilometer) {
        await axios.patch(
          `https://bengkel-mate-backend.vercel.app/api/vehicles/${vehicleId}`,
          { kilometer: vehicleKilometer }
        );
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
            <button
              id="button-lama"
              className={isNewVehicle ? "" : "active"}
              onClick={() => setIsNewVehicle(false)}
            >
              Kendaraan Lama
            </button>
            <button
              id="button-baru"
              className={isNewVehicle ? "active" : ""}
              onClick={() => setIsNewVehicle(true)}
            >
              Kendaraan Baru
            </button>
          </div>
          {isNewVehicle ? (
            <form>
              <h3>Data Kendaraan Baru</h3>
              {/* Form kendaraan baru */}
              {/* (Konten sama seperti kode sebelumnya untuk kendaraan baru) */}
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
              <h3>Data PKB Kendaraan Lama</h3>
              {/* Form PKB kendaraan lama */}
              <div className="form-group">
                <label>Nama Customer:</label>
                <select
                  name="customerName"
                  value={pkbData.customerName}
                  onChange={handleChange}
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
                <label>No Rangka:</label>
                <input
                  type="text"
                  name="noRangka"
                  value={pkbData.noRangka}
                  placeholder="Masukkan No Rangka"
                  onChange={handleChange}
                  required
                />
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
                <label>Kilometer:</label>
                <input
                  type="number"
                  name="kilometer"
                  value={pkbData.kilometer}
                  placeholder="Masukkan kilometer"
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

              {/* Update Kilometer */}
              <h3>Update Kilometer Kendaraan</h3>
              <div className="form-group">
                <label>Pilih Kendaraan:</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  required
                >
                  <option value="">Pilih Kendaraan</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.noPolisi} - {vehicle.noRangka}
                    </option>
                  ))}
                </select>
              </div>
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
