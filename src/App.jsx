import React, { useState } from "react";
import Home from "./adminpages/home/Home";
import Login from "./login/Login";
import Register from "./login/Register";
import Masterdata from "./adminpages/masterdata/Masterdata";
import Pkb from "./SApages/pkb/Pkb";
import PKBDetail from "./SApages/pkb/PKBDetail";
import EstimateSum from "./SApages/estimate/EstimateSum";
import History from "./SApages/history/History";
import MasterHistory from "./SApages/history/MasterHistory";
import Ticket from "./SApages/ticket/Ticket";
import DataCustomer from "./SApages/ticket/DataCustomer";
import ExistingUser from "./SApages/ticket/ExistingUser";
import Progress from "./SApages/Progress/Progress"; 
import PostProgress from "./SApages/Progress/PostProgress";
import DetailProgress from "./SApages/Progress/DetailProgress";
import Sparepart from "./SparePartpages/DataSparepart";
import TambahDataSP from "./SparePartpages/TambahDataSP";
import Logout from "./login/Logout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Future from "./SApages/history/Future";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ element, allowedRole }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login route */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                userRole === "admin" ? (
                  <Navigate to="/" />
                ) : userRole === "SA" ? (
                  <Navigate to="/ticket" />
                ) : userRole === "sparepart" ? (
                  <Navigate to="/spareparts" />
                ) : (
                  <Navigate to="/notfound" />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/logout"
            element={
              <Logout onLogout={handleLogout} />
            }
          />

          {/* Register route */}
          <Route
            path="/register"
            element={<Register onRegisterSuccess={() => setIsLoggedIn(false)} />}
          />

          {/* Admin routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<Home />}
                allowedRole="admin"
              />
            }
          />
          <Route
            path="/masterdata"
            element={
              <ProtectedRoute
                element={<Masterdata />}
                allowedRole="admin"
              />
            }
          />

          {/* Service Advisor (SA) routes */}
          <Route
            path="/pkb"
            element={
              <ProtectedRoute
                element={<Pkb />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/pkb/:id"
            element={
              <ProtectedRoute
                element={<PKBDetail />}
                allowedRole="SA"
              />
            }
          />

          <Route
            path="/estimate-sum"
            element={
              <ProtectedRoute
                element={<EstimateSum />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/master-history"
            element={
              <ProtectedRoute
                element={<MasterHistory />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/history/:noRangka"
            element={
              <ProtectedRoute
                element={<History />}
                allowedRole="SA"
              />
            }
          />

          <Route
            path="/future/:noRangka"
            element={
              <ProtectedRoute
                element={<Future />}
                allowedRole="SA"
              />
            }
          />

          <Route
            path="/future/edit/:id"
            element={
              <ProtectedRoute
                element={<Future />}
                allowedRole="SA"
              />
            }
          />

          <Route
            path="/ticket"
            element={
              <ProtectedRoute
                element={<Ticket />}
                allowedRole="SA"
              />
            }
          />

          {/* Dynamic Route for DataCustomer */}
          <Route
            path="/ticket/DataCustomer/:noPolisi"
            element={
              <ProtectedRoute
                element={<DataCustomer />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/ticket/ExistingUser/:noPolisi"
            element={
              <ProtectedRoute
                element={<ExistingUser />}
                allowedRole="SA"
              />
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute
                element={<Progress />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/progress/post-progress"
            element={
              <ProtectedRoute
                element={<PostProgress />}
                allowedRole="SA"
              />
            }
          />
          <Route
            path="/progress/detail/:id"
            element={
              <ProtectedRoute
                element={<DetailProgress />}
                allowedRole="SA"
              />
            }
          />

          {/* Sparepart routes */}
          <Route
            path="/spareparts"
            element={
              <ProtectedRoute
                element={<Sparepart />}
                allowedRole="sparepart"
              />
            }
          />
          <Route
            path="/tambahSP"
            element={
              <ProtectedRoute
                element={<TambahDataSP />}
                allowedRole="sparepart"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
