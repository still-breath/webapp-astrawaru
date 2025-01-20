import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "./future.scss";

const Future = () => {
  const { noRangka } = useParams();
  const navigate = useNavigate();

  const [futureDataList, setFutureDataList] = useState([]); // Semua data future
  const [formData, setFormData] = useState({
    noRangka: noRangka,
    tanggalServisKembali: "",
    nextKm: "",
    namaLayanan: [],
  });
  const [services, setServices] = useState([]); // Daftar layanan
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showForm, setShowForm] = useState(false); // Tampilkan form jika tidak ada data future
  const [futureData, setFutureData] = useState(null); // Data untuk patch jika diperlukan

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch layanan
        const serviceResponse = await axios.get("/api/layanan");
        setServices(serviceResponse.data.layanan || []);

        // Fetch semua data future
        const futureResponse = await axios.get("/api/futures");
        const futuresData = futureResponse.data.futures || [];

        // Filter future data berdasarkan noRangka
        const filteredFutures = futuresData.filter(
          (future) => future.vehicle.noRangka === noRangka
        );

        if (filteredFutures.length > 0) {
          // Jika ada data future, tampilkan datatable
          setFutureDataList(filteredFutures);
          setShowForm(false);
        } else {
          // Jika tidak ada data future, tampilkan form tambah
          setShowForm(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [noRangka]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLayananChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prevState) => ({
      ...prevState,
      namaLayanan: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        noRangka: formData.noRangka,
        tanggalServisKembali: formData.tanggalServisKembali,
        nextKm: formData.nextKm,
        namaLayanan: formData.namaLayanan,
      };

      if (futureData) {
        // PATCH untuk edit data
        await axios.patch(`/api/futures/${futureData._id}`, payload);
        alert("Data berhasil diperbarui!");
      } else {
        // POST untuk tambah data baru
        await axios.post("/api/futures", payload);
        alert("Data berhasil ditambahkan!");
      }

      // Konfirmasi untuk menambah atau kembali
      const confirm = window.confirm("Apakah masih ada yang perlu ditambah lagi?");
      if (confirm) {
        setFormData({
          noRangka: noRangka,
          tanggalServisKembali: "",
          nextKm: "",
          namaLayanan: [],
        });
        setFutureData(null); // Reset data untuk input baru
      } else {
        navigate("/master-history");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleEdit = (id) => {
    const selectedFuture = futureDataList.find((future) => future._id === id);
    if (selectedFuture) {
      setFutureData(selectedFuture);
      setFormData({
        noRangka: selectedFuture.vehicle.noRangka,
        tanggalServisKembali: selectedFuture.tanggalServisKembali.split("T")[0],
        nextKm: selectedFuture.nextKm,
        namaLayanan: selectedFuture.layanan.map((layanan) => layanan.namaLayanan),
      });
      setShowForm(true);
    }
  };

  const columns = [
    { field: "noRangka", headerName: "No. Rangka", width: 200 },
    { field: "tanggalServisKembali", headerName: "Tanggal Servis Kembali", width: 200 },
    { field: "nextKm", headerName: "Kilometer Selanjutnya", width: 200 },
    {
        field: "namaLayanan",
        headerName: "Layanan",
        width: 300,
        renderCell: (params) => {
            const layananList = params.value; // Ambil array namaLayanan
            return (
            <span>
                {layananList.join(", ")} {/* Gabungkan dengan koma */}
            </span>
            );
        },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          className="edit-button"
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </button>
      ),
    },
  ];

  const rows = futureDataList.map((future) => ({
    id: future._id,
    noRangka: future.vehicle.noRangka,
    tanggalServisKembali: future.tanggalServisKembali.split("T")[0],
    nextKm: future.nextKm,
    namaLayanan: future.layanan.map((layanan) => layanan.namaLayanan),
  }));

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="future-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {showForm ? (
          <div className="form-container">
            <h2>{futureData ? "Edit Servis Selanjutnya" : "Tambah Servis Selanjutnya"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>No Rangka:</label>
                <input type="text" name="noRangka" value={formData.noRangka} disabled />
              </div>
              <div className="form-group">
                <label>Tanggal Servis Kembali:</label>
                <input
                  type="date"
                  name="tanggalServisKembali"
                  value={formData.tanggalServisKembali}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Kilometer Selanjutnya:</label>
                <input
                  type="number"
                  name="nextKm"
                  value={formData.nextKm}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Layanan:</label>
                <select
                  name="layanan"
                  multiple
                  value={formData.namaLayanan}
                  onChange={handleLayananChange}
                  required
                >
                  {services.map((service) => (
                    <option key={service._id} value={service.namaLayanan}>
                      {service.namaLayanan}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="save-button">
                Simpan
              </button>
            </form>
          </div>
        ) : (
          <div className="table-container">
            <h2>Data Servis Selanjutnya</h2>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10]}
              autoHeight
            />
            <button
              className="add-button"
              onClick={() => {
                setFormData({
                  noRangka,
                  tanggalServisKembali: "",
                  nextKm: "",
                  namaLayanan: [],
                });
                setFutureData(null); // Reset untuk tambah data baru
                setShowForm(true);
              }}
            >
              Tambah Servis Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Future;
