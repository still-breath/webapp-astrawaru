import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import "./masterdata.scss";

const initialRows = [
  { id: 1, tanggal: '2024-05-24', userName: 'snow', name: 'Asep', nomorPKB: '4021301', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'sedang servis'},
  { id: 2, tanggal: '2024-11-08', userName: 'andre345', name: 'Bruce', nomorPKB: '4029132', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'sedang servis' },
  { id: 3, tanggal: '2024-10-08', userName: 'zion_willi', name: 'Zeineddin', nomorPKB: '512031', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'selesai' },
  { id: 4, tanggal: '2024-09-03', userName: 'zucker_facebook', name: 'Zuckerberg', nomorPKB: '913201', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'selesai' },
  { id: 5, tanggal: '2024-07-27', userName: 'george981', name: 'George Washington', nomorPKB: '230124', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'sedang servis' },
  { id: 6, tanggal: '2024-06-15', userName: 'jeremypanadol', name: 'Jeremy Johnson', nomorPKB: '123841', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'sedang servis' },
  { id: 7, tanggal: '2024-09-14', userName: 'harist098', name: 'Harist Farhan', nomorPKB: '123912', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'selesai' },
  { id: 8, tanggal: '2024-09-14', userName: 'syahrul_fa', name: 'Syahrul Fathoni', nomorPKB: '12381', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'sedang servis' },
  { id: 9, tanggal: '2024-10-09', userName: 'bobi45', name: 'Bobi Nasution', nomorPKB: '712612', merkKendaraan: 'Hino Ranger Cargo', tipeKendaraan: 'Truk', platNomor: 'L 1234 AAO', statusServis: 'selesai' },
];

const Masterdata = () => {
  const [rows, setRows] = useState(initialRows);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleDelete = () => {
    const newRows = rows.filter(row => !selectedRows.includes(row.id));
    setRows(newRows);
    setSelectedRows([]);
  };

  const handleSingleDelete = (id) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'tanggal', headerName: 'Tanggal', type: 'Date', width: 130 },
    { field: 'userName', headerName: 'User name', width: 130 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'nomorPKB', headerName: 'No. PKB', width: 130 },
    { field: 'merkKendaraan', headerName: 'Merk', width: 130 },
    { field: 'tipeKendaraan', headerName: 'Tipe', width: 130 },
    { field: 'platNomor', headerName: 'Plat Nomor', width: 130 },
    { field: 'statusServis', headerName: 'Status', width: 100 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <div className="action-buttons">
          <Link to={`/masterdata/detail_${params.row.userName}`}>
            <button className="detailButton">Detail</button>
          </Link>
          <button 
            className="deleteButton"
            onClick={(e) => {
              e.stopPropagation();
              handleSingleDelete(params.row.id);
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="masterdata">
      <Sidebar />
      <div className="masterdataContainer">
        <Navbar />
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
          sx={{ border: 0 }}
          components={{
            Pagination: () => (
              <Box display="flex" justifyContent="space-between" alignItems="center" padding={1}>
                <button 
                  className="deleteButton" 
                  onClick={handleDelete} 
                  disabled={selectedRows.length === 0}
                >
                  <DeleteIcon />
                </button>
                <Box flexGrow={1} />
                <DataGrid.Pagination />
              </Box>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Masterdata;
