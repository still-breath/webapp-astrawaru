import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./estimateSum.scss";

const EstimateSum = () => {
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

  const [summary, setSummary] = useState(null);

  const [searchService, setSearchService] = useState("");
  const [searchSparepart, setSearchSparepart] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkbResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/pkb");
        const layananResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/layanan");
        const sparepartResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/sparepart_2");

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
  const handlePkbChange = (e) => {
    setSelectedPkb(e.target.value);
  };

  // Handle Search for Services and Spareparts
  const handleSearchService = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchService(searchValue);
    setFilteredServices(
      services.filter((service) =>
        service.namaLayanan.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleSearchSparepart = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchSparepart(searchValue);
    setFilteredSpareparts(
      spareparts.filter((part) =>
        part.namaPart.toLowerCase().includes(searchValue)
      )
    );
  };

  // Handle Dropdown Change for Service and Sparepart
  const handleServiceChange = (e) => {
    const service = services.find((s) => s.namaLayanan === e.target.value);
    setNewService({ ...newService, name: service.namaLayanan, price: service.harga });
  };

  const handleSparepartChange = (e) => {
    const part = spareparts.find((p) => p.namaPart === e.target.value);
    setNewSparepart({ ...newSparepart, name: part.namaPart, price: part.harga });
  };

  // Add Service and Sparepart
  const addService = () => {
    setSelectedServices([...selectedServices, newService]);
    setNewService({ name: "", price: 0, quantity: 1 });
  };

  const addSparepart = () => {
    setSelectedSpareparts([...selectedSpareparts, newSparepart]);
    setNewSparepart({ name: "", price: 0, quantity: 1 });
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

  const jasaTotal = selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sparepartTotal = selectedSpareparts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit Data to API and Generate PDF
  const handleSubmit = async () => {
    try {
    const layanan = selectedServices.map((s) => ({
      namaLayanan: s.name,
      quantity: s.quantity,
    }));
    const sparepart = selectedSpareparts.map((sp) => ({
      namaPart: sp.name,
      quantity: sp.quantity,
    }));

    // Payload untuk POST ke summary
    const summaryPayload = {
      noPkb: selectedPkb,
      layanan,
      sparepart,
  };
      // Kirim data ke summary
    const response = await axios.post("https://bengkel-mate-backend.vercel.app/api/summary", summaryPayload);
    setSummary(response.data.summaries); // Simpan respons summary

    // Reset state setelah menyimpan
    setSelectedServices([]);
    setSelectedSpareparts([]);
    setSummary(null);

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
              <option key={pkb._id} value={pkb.noPkb}>
                {pkb.noPkb}
              </option>
            ))}
          </select>
        </div>

        <div className="operationAndMaterial">
          {/* Layanan Section */}
          <div className="jasaOperasi">
            <h3>Jasa Operasi</h3>
            <div className="form">
              <input
                type="text"
                placeholder="Cari Layanan"
                value={searchService}
                onChange={handleSearchService}
              />
              <select onChange={handleServiceChange}>
                <option value="">Pilih Layanan</option>
                {filteredServices.map((service) => (
                  <option key={service._id} value={service.namaLayanan}>
                    {service.namaLayanan}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={newService.quantity}
                onChange={(e) => setNewService({ ...newService, quantity: parseInt(e.target.value) || 1 })}
              />
              <button onClick={addService}>Tambah Jasa</button>
            </div>
            <ul>
              {selectedServices.map((item, index) => (
                <li key={index}>
                  {item.name} - Rp {item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <h4>Total Jasa: Rp {jasaTotal}</h4>
          </div>

          {/* Spareparts Section */}
          <div className="barangMaterial">
            <h3>Barang Material</h3>
            <div className="form">
              <input
                type="text"
                placeholder="Cari Sparepart"
                value={searchSparepart}
                onChange={handleSearchSparepart}
              />
              <select onChange={handleSparepartChange}>
                <option value="">Pilih Sparepart</option>
                {filteredSpareparts.map((part) => (
                  <option key={part._id} value={part.namaPart}>
                    {part.namaPart}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={newSparepart.quantity}
                onChange={(e) => setNewSparepart({ ...newSparepart, quantity: parseInt(e.target.value) || 1 })}
              />
              <button onClick={addSparepart}>Tambah Sparepart</button>
            </div>
            <ul>
              {selectedSpareparts.map((item, index) => (
                <li key={index}>
                  {item.name} - Rp {item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <h4>Total Sparepart: Rp {sparepartTotal}</h4>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary">
          <h3>Ringkasan</h3>
          <div className="summary-content">
            <p>Total Jasa: <span>Rp {jasaTotal}</span></p>
            <p>Total Sparepart: <span>Rp {sparepartTotal}</span></p>
            <p>Grand Total: <span>Rp {jasaTotal + sparepartTotal}</span></p>
          </div>
          <button className="submit-button" onClick={handleSubmit}>Simpan dan Unduh PDF</button>
        </div>
      </div>
    </div>
  );
};

export default EstimateSum;
