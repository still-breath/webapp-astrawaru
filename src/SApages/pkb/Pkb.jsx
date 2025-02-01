import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "./pkb.scss";

const PKB = () => {
  const [pkbData, setPkbData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPkbData = async () => {
      try {
        const response = await axios.get("https://bengkel-mate-backend.vercel.app/api/pkb");
        // Filter data to exclude rows with null or undefined fields
        const filteredData = response.data.pkbs.filter(
          (pkb) =>
            pkb.noPkb &&
            pkb.customer?.nama &&
            pkb.vehicle?.noRangka &&
            pkb.responsMekanik &&
            pkb.tanggalWaktu
        );
        setPkbData(filteredData || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PKB data:", error);
        setIsLoading(false);
      }
    };

    fetchPkbData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "noPkb", headerName: "No. PKB", width: 150 },
    { field: "namaCustomer", headerName: "Nama Customer", width: 200 },
    { field: "noRangka", headerName: "No. Rangka", width: 200 },
    { field: "responsMekanik", headerName: "Respons Mekanik", width: 300, align: "left" },
    { field: "tanggalWaktu", headerName: "Tanggal", width: 150 },
    {
      field: "action",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Link to={`/pkb/${params.row.noPkb}`}>
          <button className="detailButton">Detail</button>
        </Link>
      ),
    },
  ];

  const rows = pkbData.map((pkb, index) => ({
    id: index + 1,
    noPkb: pkb.noPkb,
    namaCustomer: pkb.customer?.nama || "-",
    noRangka: pkb.vehicle?.noRangka || "-",
    responsMekanik: pkb.responsMekanik || "-",
    tanggalWaktu: new Date(pkb.tanggalWaktu).toLocaleDateString(),
  }));

  return (
    <div className="pkb">
      <Sidebar />
      <div className="pkbContainer">
        <Navbar />
        <h3>Data PKB</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
        )}
      </div>
    </div>
  );
};

export default PKB;
