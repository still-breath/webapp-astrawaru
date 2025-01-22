import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Untuk membuat tabel di PDF
import "./estimateSum.scss";

const EstimateSum = () => {
  const [pkbList, setPkbList] = useState([]); // List of PKBs
  const [selectedPkb, setSelectedPkb] = useState(""); // Selected PKB

  const [services, setServices] = useState([]);
  const [spareparts, setSpareparts] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpareparts, setSelectedSpareparts] = useState([]);

  const [newService, setNewService] = useState({ name: "", price: 0, quantity: 1 });
  const [newSparepart, setNewSparepart] = useState({ name: "", price: 0, quantity: 1 });

  const [summary, setSummary] = useState(null);

  // Fetch PKBs, Layanan, and Spareparts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkbResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/pkb");
        const layananResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/layanan");
        const sparepartResponse = await axios.get("https://bengkel-mate-backend.vercel.app/api/spareparts");

        setPkbList(pkbResponse.data.pkbs || []);
        setServices(layananResponse.data.layanan || []);
        setSpareparts(sparepartResponse.data.spareparts || []);
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
  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date();

    doc.setFontSize(14);
    doc.text("Estimasi Biaya Perbaikan", 10, 10);

    // PKB Information
    doc.text(`Tanggal: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 10, 20);
    doc.text(`No PKB: ${selectedPkb}`, 10, 30);
    doc.text(`Nama Customer: ${summary?.customerName || "-"}`, 10, 40);
    doc.text(`No Polisi: ${summary?.noPolisi || "-"}`, 10, 50);
    doc.text(`Produk Kendaraan: ${summary?.produk || "-"}`, 10, 60);
    doc.text(`Tipe Kendaraan: ${summary?.tipe || "-"}`, 10, 70);

    // Layanan Table
    const layananRows = selectedServices.map((service) => [
      service.name,
      service.quantity,
      `Rp ${service.price.toLocaleString()}`,
      `Rp ${(service.price * service.quantity).toLocaleString()}`,
    ]);
    doc.autoTable({
      head: [["Layanan", "Qty", "Harga Satuan", "Total"]],
      body: layananRows,
      startY: 80,
    });

    // Sparepart Table
    const sparepartRows = selectedSpareparts.map((part) => [
      part.name,
      part.quantity,
      `Rp ${part.price.toLocaleString()}`,
      `Rp ${(part.price * part.quantity).toLocaleString()}`,
    ]);
    doc.autoTable({
      head: [["Sparepart", "Qty", "Harga Satuan", "Total"]],
      body: sparepartRows,
      startY: doc.lastAutoTable.finalY + 10,
    });

    // Total Summary
    doc.text(`Total Jasa: Rp ${jasaTotal.toLocaleString()}`, 10, doc.lastAutoTable.finalY + 30);
    doc.text(`Total Sparepart: Rp ${sparepartTotal.toLocaleString()}`, 10, doc.lastAutoTable.finalY + 40);
    doc.text(`Grand Total: Rp ${(jasaTotal + sparepartTotal).toLocaleString()}`, 10, doc.lastAutoTable.finalY + 50);

    doc.save(`Estimate-${selectedPkb}.pdf`);
  };

  // Calculate Totals
  const jasaTotal = selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sparepartTotal = selectedSpareparts.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    generatePDF();
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
              <select onChange={handleServiceChange}>
                <option value="">Pilih Layanan</option>
                {services.map((service) => (
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
              <select onChange={handleSparepartChange}>
                <option value="">Pilih Sparepart</option>
                {spareparts.map((part) => (
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
