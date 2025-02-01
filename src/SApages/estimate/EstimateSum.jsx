import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Untuk membuat tabel di PDF
import "./estimateSum.scss";

const EstimateSum = () => {
  const [summary, setSummary] = useState(null);
  const [pkbList, setPkbList] = useState([]);
  const [selectedPkb, setSelectedPkb] = useState("");
  const [services, setServices] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredSpareparts, setFilteredSpareparts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpareparts, setSelectedSpareparts] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: 0, quantity: 1 });
  const [newSparepart, setNewSparepart] = useState({ name: "", price: 0, quantity: 1 });
  const [searchService, setSearchService] = useState("");
  const [searchSparepart, setSearchSparepart] = useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isSparepartDropdownOpen, setIsSparepartDropdownOpen] = useState(false);

  // Fetch PKBs, Layanan, and Spareparts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkbResponse, layananResponse, sparepartResponse] = await Promise.all([
          axios.get("https://bengkel-mate-backend.vercel.app/api/pkb"),
          axios.get("https://bengkel-mate-backend.vercel.app/api/layanan"),
          axios.get("https://bengkel-mate-backend.vercel.app/api/spareparts"),
        ]);
        setPkbList(pkbResponse.data.pkbs || []);
        setServices(layananResponse.data.layanan || []);
        setSpareparts(sparepartResponse.data.spareparts || []);
        setFilteredServices(layananResponse.data.layanan || []);
        setFilteredSpareparts(sparepartResponse.data.spareparts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle PKB Selection
  const handlePkbChange = (e) => setSelectedPkb(e.target.value);

  // Handle Dropdown Change for Service and Sparepart
  const handleSearchService = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchService(searchValue);
    setFilteredServices(services.filter((service) => service.namaLayanan.toLowerCase().includes(searchValue)));
    setIsServiceDropdownOpen(true);
  };

  const handleSearchSparepart = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchSparepart(searchValue);
    setFilteredSpareparts(spareparts.filter((part) => part.namaPart.toLowerCase().includes(searchValue)));
    setIsSparepartDropdownOpen(true);
  };

  const handleServiceSelect = (service) => {
    setNewService({ name: service.namaLayanan, price: service.harga, quantity: 1 });
    setSearchService(service.namaLayanan);
    setIsServiceDropdownOpen(false);
  };

  const handleSparepartSelect = (part) => {
    setNewSparepart({ name: part.namaPart, price: part.harga, quantity: 1 });
    setSearchSparepart(part.namaPart);
    setIsSparepartDropdownOpen(false);
  };

  const addService = () => {
    if (newService.name) {
      setSelectedServices([...selectedServices, newService]);
      setNewService({ name: "", price: 0, quantity: 1 });
      setSearchService("");
    }
  };

  const addSparepart = () => {
    if (newSparepart.name) {
      setSelectedSpareparts([...selectedSpareparts, newSparepart]);
      setNewSparepart({ name: "", price: 0, quantity: 1 });
      setSearchSparepart("");
    }
  };

  // Generate PDF
  const generatePDF = async () => {
  try {
    // Fetch data PKB berdasarkan noPkb yang dipilih
    const pkbResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/pkb");
    const pkbList = pkbResponse.data.pkbs || [];
    const selectedPkbData = pkbList.find((pkb) => pkb.noPkb === selectedPkb);

    if (!selectedPkbData) {
      alert("Data PKB tidak ditemukan!");
      return;
    }

    const doc = new jsPDF();
    const date = new Date();

    doc.setFontSize(14);
    doc.text("Estimasi Biaya Perbaikan", 10, 10);

    // PKB Information
    doc.text(`Tanggal: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 10, 20);
    doc.text(`No PKB: ${selectedPkbData.noPkb}`, 10, 30);
    doc.text(`Nama Customer: ${selectedPkbData.customer.nama}`, 10, 40);
    doc.text(`No Polisi: ${selectedPkbData.vehicle.noPolisi}`, 10, 50);
    doc.text(`Produk Kendaraan: ${selectedPkbData.vehicle.produk}`, 10, 60);
    doc.text(`Tipe Kendaraan: ${selectedPkbData.vehicle.tipe}`, 10, 70);

    // Layanan Table
    const layananRows = selectedPkbData.summary.layanan.map((service) => [
      service.namaLayanan,
      service.quantity,
      `Rp ${service.harga.toLocaleString()}`,
      `Rp ${service.total.toLocaleString()}`,
    ]);
    doc.autoTable({
      head: [["Layanan", "Qty", "Harga Satuan", "Total"]],
      body: layananRows,
      startY: 80,
    });

    // Sparepart Table
    const sparepartRows = selectedPkbData.summary.sparepart.map((part) => [
      part.namaPart,
      part.quantity,
      `Rp ${part.harga.toLocaleString()}`,
      `Rp ${part.total.toLocaleString()}`,
    ]);
    doc.autoTable({
      head: [["Sparepart", "Qty", "Harga Satuan", "Total"]],
      body: sparepartRows,
      startY: doc.lastAutoTable.finalY + 10,
    });

    // Total Summary
    doc.text(`Total Jasa: Rp ${selectedPkbData.summary.layanan.reduce((sum, item) => sum + item.total, 0).toLocaleString()}`, 10, doc.lastAutoTable.finalY + 30);
    doc.text(`Total Sparepart: Rp ${selectedPkbData.summary.sparepart.reduce((sum, item) => sum + item.total, 0).toLocaleString()}`, 10, doc.lastAutoTable.finalY + 40);
    doc.text(`Grand Total: Rp ${selectedPkbData.summary.totalHarga.toLocaleString()}`, 10, doc.lastAutoTable.finalY + 50);

    doc.save(`Estimate-${selectedPkbData.noPkb}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal menghasilkan PDF.");
  }
};

  // Calculate Totals
  const jasaTotal = selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sparepartTotal = selectedSpareparts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async () => {
  if (!selectedPkb) {
      alert("Pilih PKB terlebih dahulu!");
      return;
    }
    if (selectedServices.length === 0 && selectedSpareparts.length === 0) {
      alert("Tambahkan setidaknya satu layanan atau sparepart!");
      return;
    }
    try {
      const summaryPayload = {
        noPkb: selectedPkb,
        layanan: selectedServices.map((s) => ({ namaLayanan: s.name, quantity: s.quantity })),
        sparepart: selectedSpareparts.map((sp) => ({ namaPart: sp.name, quantity: sp.quantity })),
      };
      const response = await axios.post("https://bengkel-mate-backend.vercel.app/api/summary", summaryPayload);
      setSummary(response.data.summaries);
      setSelectedServices([]);
      setSelectedSpareparts([]);
      alert("Summary berhasil disimpan!");

    // Generate PDF setelah data disimpan
    await generatePDF();
  } catch (error) {
    console.error("Error saving summary:", error);
    alert("Terjadi kesalahan saat menyimpan data.");
  }
};

  return (
    <div className="estsum">
      <Sidebar />
      <div className="estsumContainer">
        <Navbar />
        <div className="pkb-selection">
          <h3>Pilih PKB</h3>
          <select onChange={handlePkbChange} value={selectedPkb}>
            <option value="">Pilih No PKB</option>
            {pkbList.map((pkb) => (
              <option key={pkb._id} value={pkb.noPkb}>{pkb.noPkb}</option>
            ))}
          </select>
        </div>

        <div className="operationAndMaterial">
          <div className="jasaOperasi">
            <h3>Jasa Operasi</h3>
            <div className="form">
              <input
                type="text"
                placeholder="Cari Layanan"
                value={searchService}
                onChange={handleSearchService}
                onFocus={() => setIsServiceDropdownOpen(true)}
              />
              {isServiceDropdownOpen && (
                <ul className="dropdown">
                  {filteredServices.map((service) => (
                    <li key={service._id} onClick={() => handleServiceSelect(service)}>
                      {service.namaLayanan}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={addService}>Tambah Jasa</button>
            </div>
          </div>

          <div className="barangMaterial">
            <h3>Barang Material</h3>
            <div className="form">
              <input
                type="text"
                placeholder="Cari Sparepart"
                value={searchSparepart}
                onChange={handleSearchSparepart}
                onFocus={() => setIsSparepartDropdownOpen(true)}
              />
              {isSparepartDropdownOpen && (
                <ul className="dropdown">
                  {filteredSpareparts.map((part) => (
                    <li key={part._id} onClick={() => handleSparepartSelect(part)}>
                      {part.namaPart}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={addSparepart}>Tambah Sparepart</button>
            </div>
          </div>
        </div>

        <div className="summary">
          <h3>Total</h3>
          <div className="summary-content">
            <p>Total Jasa: <span>Rp {selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0)}</span></p>
            <p>Total Sparepart: <span>Rp {selectedSpareparts.reduce((sum, sp) => sum + sp.price * sp.quantity, 0)}</span></p>
          </div>
          <button className="submit-button" onClick={handleSubmit}>Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default EstimateSum;
