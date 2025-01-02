import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar-sa/SidebarSA";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./ticket.scss";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Import ikon sampah

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  return { formattedDate, formattedTime };
};

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("/api/tickets");
        setTickets(response.data.services || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  const handleExistingUserClick = (noPolisi) => {
    navigate(`/ticket/ExistingUser/${noPolisi}`);
  };

  const handleNewUserClick = (noPolisi) => {
    navigate(`/ticket/DataCustomer/${noPolisi}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!ticketId) {
      console.error("Invalid ticket ID:", ticketId);
      alert("Invalid ticket ID.");
      return;
    }

    try {
      console.log("Deleting ticket ID:", ticketId);
      await axios.delete(`/api/tickets/${ticketId}`);
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketId)
      );
      alert("Ticket deleted successfully!");
    } catch (error) {
      console.error("Error deleting ticket:", error.response || error.message);
      alert(
        `Failed to delete ticket. Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="ticket-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="ticket-list">
          {tickets.length > 0 ? (
            tickets.map((ticket) => {
              const { formattedDate, formattedTime } = formatDate(
                ticket.tanggalMasuk
              );

              return (
                <div className="ticket-card" key={ticket._id}>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTicket(ticket._id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="ticket-details">
                    <p>
                      <strong>No Polisi:</strong> {ticket.noPolisi}
                    </p>
                    <p>
                      <strong>Kilometer:</strong> {ticket.kilometer}
                    </p>
                    <p>
                      <strong>Tanggal Masuk:</strong> {formattedDate}
                    </p>
                    <p>
                      <strong>Jam Masuk:</strong> {formattedTime}
                    </p>
                  </div>
                  <div className="ticket-actions">
                    <button
                      className="action-button existing-user"
                      onClick={() =>
                        handleExistingUserClick(ticket.noPolisi)
                      }
                    >
                      Existing User
                    </button>
                    <button
                      className="action-button new-user"
                      onClick={() =>
                        handleNewUserClick(ticket.noPolisi)
                      }
                    >
                      New User
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-tickets">No tickets available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
