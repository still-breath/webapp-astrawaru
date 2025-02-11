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
  const [filteredSpareparts, setFilteredSpareparts] = useState([]); // Filtered data for search
  const [editingRow, setEditingRow] = useState(null); // State to track editing row
  const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  // Fetch spareparts data from API
  useEffect(() => {
    const fetchSpareparts = async () => {
      try {
        const response = await axios.get(
          "https://bengkel-mate-backend.vercel.app/api/sparepart_2"
        );
        const sparepartsData = response.data.spareparts.map((item) => ({
          id: item._id, // Map _id to id for DataGrid
          namaPart: item.namaPart,
          number: item.number,
          stock: item.stock,
          harga: item.harga,
          createdAt: new Date(item.createdAt).toLocaleDateString("id-ID"),
        }));
        setSpareparts(sparepartsData);
        setFilteredSpareparts(sparepartsData); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching spareparts data:", error);
      }
    };
    fetchSpareparts();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    setFilteredSpareparts(
      spareparts.filter(
        (item) =>
          item.namaPart.toLowerCase().includes(keyword) ||
          item.number.toLowerCase().includes(keyword)
      )
    );
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://bengkel-mate-backend.vercel.app/api/sparepart_2/${id}`
      );
      if (response.status === 200) {
        setSpareparts((prev) => prev.filter((item) => item.id !== id));
        setFilteredSpareparts((prev) => prev.filter((item) => item.id !== id));
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
    const editedSparepart = spareparts.find((item) => item.id === id);
    try {
      const response = await axios.patch(
        `https://bengkel-mate-backend.vercel.app/api/sparepart_2/${id}`,
        {
          namaPart: editedSparepart.namaPart,
          number: editedSparepart.number,
          stock: editedSparepart.stock,
          harga: editedSparepart.harga,
        }
      );
      if (response.status === 200) {
        setEditingRow(null); // Exit editing mode
        setSpareparts((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...response.data.sparepart } : item
          )
        );
        setFilteredSpareparts((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...response.data.sparepart } : item
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
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setFilteredSpareparts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari Nama Part atau Nomor Part..."
            value={searchKeyword}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredSpareparts} // Use filtered data for DataGrid
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Sparepart;
