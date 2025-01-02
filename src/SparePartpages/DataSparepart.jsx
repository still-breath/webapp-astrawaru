import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar-sp/SidebarSP";
import Navbar from "../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import "./datasparepart.scss";

const Sparepart = () => {
  const [spareparts, setSpareparts] = useState([]); // State to store spareparts data
  const [editingRow, setEditingRow] = useState(null); // State to track editing row
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch spareparts data from API
  useEffect(() => {
    const fetchSpareparts = async () => {
      try {
        const response = await axios.get("/api/spareparts"); // Replace with your API endpoint
        setSpareparts(
          response.data.spareparts.map((item) => ({
            id: item._id, // Map _id to id for DataGrid
            namaPart: item.namaPart,
            number: item.number,
            stock: item.stock,
            harga: item.harga,
            createdAt: new Date(item.createdAt).toLocaleDateString("id-ID"),
          }))
        );
      } catch (error) {
        console.error("Error fetching spareparts data:", error);
      }
    };
    fetchSpareparts();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/spareparts/${id}`); // Replace with your API endpoint
      if (response.status === 200) {
        setSpareparts((prev) => prev.filter((spareparts) => spareparts.id !== id));
        alert("Data berhasil dihapus!");
      } else {
        alert("Gagal menghapus data!");
      }
    } catch (error) {
      console.error("Error deleting sparepart:", error);
      alert("Terjadi kesalahan saat menghapus data!");
    }
  };

  // Handle edit action
  const handleEdit = (id) => {
    setEditingRow(id);
  };

  // Handle save action
  const handleSave = async (id) => {
    const editedSparepart = spareparts.find((spareparts) => spareparts.id === id);
    try {
      const response = await axios.patch(`/api/spareparts/${id}`, {
        namaPart: editedSparepart.namaPart,
        number: editedSparepart.number,
        stock: editedSparepart.stock,
        harga: editedSparepart.harga,
        }); // Replace with your API endpoint
        if (response.status === 200) {
        setEditingRow(null); // Exit editing mode
        setSpareparts((prev) =>
            prev.map((sparepart) =>
            sparepart.id === id ? { ...sparepart, ...response.data } : sparepart
            )
        );
        alert("Data berhasil diperbarui!");
        } else {
        alert("Gagal memperbarui data!");
        }
        } catch (error) {
            console.error("Error saving sparepart:", error);
            alert("Terjadi kesalahan saat menyimpan data!");
        }
    };

  // Handle input change during editing
  const handleInputChange = (id, field, value) => {
    setSpareparts((prev) =>
      prev.map((sparepart) =>
        sparepart.id === id ? { ...sparepart, [field]: value } : sparepart
      )
    );
  };

const columns = [
  {
    field: "namaPart",
    headerName: "Nama Part",
    width: 200,
    renderCell: (params) =>
      editingRow === params.row.id ? (
        <input
          type="text"
          value={params.row.namaPart}
          onChange={(e) =>
            handleInputChange(params.row.id, "namaPart", e.target.value)
          }
          onKeyDown={(e) => e.stopPropagation()} // Allow space key
        />
      ) : (
        params.value
      ),
  },
  {
    field: "number",
    headerName: "Nomor Part",
    width: 200,
    renderCell: (params) =>
      editingRow === params.row.id ? (
        <input
          type="text"
          value={params.row.number}
          onChange={(e) =>
            handleInputChange(params.row.id, "number", e.target.value)
          }
          onKeyDown={(e) => e.stopPropagation()} // Allow space key
        />
      ) : (
        params.value
      ),
  },
  {
    field: "stock",
    headerName: "Stock (Qty)",
    type: "number",
    width: 100,
    renderCell: (params) =>
      editingRow === params.row.id ? (
        <input
          type="number"
          value={params.row.stock}
          onChange={(e) =>
            handleInputChange(params.row.id, "stock", e.target.value)
          }
          onKeyDown={(e) => e.stopPropagation()} // Allow space key
        />
      ) : (
        params.value
      ),
  },
  {
    field: "harga",
    headerName: "Harga (Rp)",
    type: "number",
    width: 150,
    renderCell: (params) =>
      editingRow === params.row.id ? (
        <input
          type="number"
          value={params.row.harga}
          onChange={(e) =>
            handleInputChange(params.row.id, "harga", e.target.value)
          }
          onKeyDown={(e) => e.stopPropagation()} // Allow space key
        />
      ) : (
        params.value
      ),
  },
  {
    field: "actions",
    headerName: "Edit",
    width: 180,
    renderCell: (params) => (
      <div className="action-buttons">
        {editingRow === params.row.id ? (
          <button
            className="saveButton"
            onClick={(e) => {
              e.stopPropagation();
              handleSave(params.row.id);
            }}
          >
            <SaveIcon />
          </button>
        ) : (
          <button
            className="editButton"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row.id);
            }}
          >
            <EditIcon />
          </button>
        )}
        <button
          className="deleteButton"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(params.row.id);
          }}
        >
          <DeleteIcon />
        </button>
      </div>
    ),
  },
];



  return (
    <div className="sparepart">
      <Sidebar />
      <div className="sparepartContainer">
        <Navbar />
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={spareparts}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            checkboxSelection={false}
            disableSelectionOnClick
            getRowClassName={(params) =>
              editingRow === params.id ? "editing-row" : ""
            }
          />
        </Box>
      </div>
    </div>
  );
};

export default Sparepart;
