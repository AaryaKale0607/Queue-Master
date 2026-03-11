import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.scss";

/* Icons */
import {
  FiMenu,
  FiClipboard,
  FiList,
  FiClock,
  FiFileText,
  FiBell,
  FiCalendar,
  FiLogOut,
  FiXCircle
} from "react-icons/fi";

import hospitalImg from "../../../assets/hospital.jpg";
import hotelImg from "../../../assets/hotel.jpg";
import bankImg from "../../../assets/bank.jpg";
import govtImg from "../../../assets/govt.jpg";
import userImg from "../../../assets/user.png";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔥 SOFTCODED SERVICES */
  const [services, setServices] = useState([]);

  /* 🔥 FETCH FROM SPRING BOOT */
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  /* 🔥 MAP IMAGE BASED ON SERVICE CODE */
  const getServiceImage = (code) => {
    switch (code) {
      case "HOSPITAL":
        return hospitalImg;
      case "BANK":
        return bankImg;
      case "GOVT":
        return govtImg;
      case "HOTEL":
        return hotelImg;
      default:
        return hospitalImg;
    }
  };

  const handleCancelToken = () => navigate("/cancel-token");

  const handleGetToken = (code) => {
    if (code === "HOSPITAL") navigate("/hospitals");
    if (code === "BANK") navigate("/banks");
    if (code === "GOVT") navigate("/government-offices");
    if (code === "HOTEL") navigate("/hotels");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="top-navbar">
        <div className="nav-left">
          <button
            className="menu-btn"
            type="button"
            onClick={() => setSidebarOpen(prev => !prev)}
          >
            <FiMenu />
          </button>

          <div className="app-logo">
            <strong>QueueMaster</strong>
          </div>
        </div>

        <div className="nav-center">
          <input type="text" placeholder="Search queues..." />
        </div>

        <div className="nav-right">
          <FiBell className="nav-icon" />
          <img src={userImg} alt="user" />
          <span>Abhi</span>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <aside
        className="sidebar"
        style={{ left: sidebarOpen ? "0px" : "-260px" }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">Q</div>
          <h3>QueueMaster</h3>
        </div>

        <div className="profile">
          <img src={userImg} alt="user" />
          <h4>Abhi</h4>
          <span>Active User</span>
        </div>

        <ul>
          <li onClick={() => navigate("/queue-status")}>
            <FiClipboard /> Queue Status
          </li>

          <li onClick={() => navigate("/token-history")}>
            <FiList /> Token History
          </li>

          <li onClick={() => navigate("/estimated-wait")}>
            <FiClock /> Estimated Wait
          </li>

          <li onClick={() => navigate("/appointments")}>
            <FiCalendar /> Appointments
          </li>

          <li onClick={handleCancelToken}>
            <FiXCircle /> Cancel Token
          </li>

          <li onClick={handleLogout}>
            <FiLogOut /> Logout
          </li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`main-content ${sidebarOpen ? "shift" : ""}`}>
        <div className="welcome-box">
          <h2>Welcome to QueueMaster 👋</h2>
          <p>Manage your queues, tokens and appointments easily</p>
        </div>

        <div className="summary-grid">
          <div className="summary-card blue">
            <FiClipboard className="icon" />
            <div>
              <h4>Current Queue</h4>
              <span>A21</span>
            </div>
          </div>

          <div className="summary-card green">
            <FiList className="icon" />
            <div>
              <h4>Pending Tickets</h4>
              <span>14</span>
            </div>
          </div>

          <div className="summary-card yellow">
            <FiClock className="icon" />
            <div>
              <h4>Estimated Wait</h4>
              <span>25 mins</span>
            </div>
          </div>

          <div className="summary-card pink">
            <FiFileText className="icon" />
            <div>
              <h4>Total Visits</h4>
              <span>12</span>
            </div>
          </div>
        </div>

        <div className="extra-info">
          <div className="info-card">
            <FiBell />
            <div>
              <h4>Notifications</h4>
              <p>No new alerts</p>
            </div>
          </div>

          <div className="info-card">
            <FiCalendar />
            <div>
              <h4>Next Appointment</h4>
              <p>Tomorrow · 11:30 AM</p>
            </div>
          </div>
        </div>

        <h3 className="section-title">Available Services</h3>

        {/* 🔥 SERVICES FROM DATABASE (UI SAME) */}
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.id}>
              <img src={getServiceImage(s.code)} alt={s.name} />
              <h4>{s.name}</h4>
              <button onClick={() => handleGetToken(s.code)}>
                Get Token
              </button>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="pro-footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <h2>QueueMaster</h2>
                <p>Enterprise Queue & Appointment Management System</p>
                <p className="footer-tagline">
                  Streamlining public and private service experiences.
                </p>
              </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()}{" "}
                <strong>QueueMaster Technologies Pvt. Ltd.</strong> All rights reserved.
              </p>

              <div className="footer-badges">
                <span>🔒 Secure Platform</span>
                <span>✔ ISO 27001 Certified</span>
                <span>🌐 Trusted by Organizations</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;