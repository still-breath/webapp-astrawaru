import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "./masterhistory.scss";

const MasterHistory = () => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch progress data and filter "Completed"
        const progressResponse = await fetch("/api/progress");
        const progressData = await progressResponse.json();

        const completedProgress = progressData.progresses.filter(
          (progress) => progress.status === "Completed"
        );

        // Extract noRangka from progress "Completed"
        const completedNoRangka = completedProgress.map(
          (progress) => progress.vehicle.noRangka
        );

        // Fetch vehicle data
        const vehicleResponse = await fetch("/api/vehicles");
        const vehicleData = await vehicleResponse.json();

        // Filter vehicles that match noRangka from completed progress
        const filteredVehicles = vehicleData.vehicles.filter((vehicle) =>
          completedNoRangka.includes(vehicle.noRangka)
        );

        // Format rows for DataGrid
        const formattedRows = filteredVehicles.map((vehicle, index) => ({
          id: index + 1,
          noPolisi: vehicle.noPolisi || "N/A",
          noRangka: vehicle.noRangka || "N/A",
          noMesin: vehicle.noMesin || "N/A",
          tipe: vehicle.tipe || "N/A",
          tahun: vehicle.tahun || "N/A",
          produk: vehicle.produk || "N/A",
          customerName: vehicle.customer?.nama || "N/A",
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "noPolisi", headerName: "Plat Nomor", width: 130 },
    { field: "noRangka", headerName: "No. Rangka", width: 200 },
    { field: "noMesin", headerName: "No. Mesin", width: 150 },
    { field: "tipe", headerName: "Tipe Kendaraan", width: 150 },
    { field: "tahun", headerName: "Tahun Produksi", width: 130 },
    { field: "produk", headerName: "Produk", width: 130 },
    { field: "customerName", headerName: "Nama Customer", width: 200 },
    {
      field: "future",
      headerName: "Servis Selanjutnya",
      width: 150,
      renderCell: (params) => (
        <Link to={`/future/${params.row.noRangka}`}>
          <button className="detailButton">Next Services</button>
        </Link>
      ),
    },
    {
        field: "action",
        headerName: "Actions",
        width: 120,
        renderCell: (params) => (
            <Link to={`/history/${params.row.noRangka}`}>
            <button className="detailButton">Detail</button>
            </Link>
        ),
    },
  ];

  return (
    <div className="masterhistory">
      <Sidebar />
      <div className="masterhistoryContainer">
        <Navbar />
        <div className="tableContainer">
          <h3>Master History</h3>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default MasterHistory;
