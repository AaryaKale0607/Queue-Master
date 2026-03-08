// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const GovtOfficeList = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");

//   const offices = [
//     { 
//       name: "Passport Seva Kendra", 
//       status: "Open", 
//       time: "9:00 AM – 5:00 PM",
//       location: "Andheri East, Mumbai"
//     },
//     { 
//       name: "RTO Office", 
//       status: "Busy", 
//       time: "10:00 AM – 4:00 PM",
//       location: "Worli, Mumbai"
//     },
//     { 
//       name: "Municipal Corporation", 
//       status: "Open", 
//       time: "9:30 AM – 4:30 PM",
//       location: "Fort, Mumbai"
//     },
//     { 
//       name: "Aadhar Service Center", 
//       status: "Limited", 
//       time: "10:00 AM – 3:00 PM",
//       location: "Dadar West, Mumbai"
//     },
//     { 
//       name: "Electricity Board Office", 
//       status: "Open", 
//       time: "9:00 AM – 5:00 PM",
//       location: "Bandra East, Mumbai"
//     },
//   ];

//   // Filter by name OR location
//   const filteredOffices = offices.filter(
//     (office) =>
//       office.name.toLowerCase().includes(search.toLowerCase()) ||
//       office.location.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="service-page">
//       {/* NAVBAR */}
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏛️</div>
//           <div>
//             <h2>Government Offices</h2>
//             <p>Select an office to continue</p>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search office or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="service-table">
//         {filteredOffices.map((office) => (
//           <div
//             key={office.name}
//             className="service-row"
//             onClick={() =>
//               navigate(`/government-offices/${encodeURIComponent(office.name)}/services`)
//             }
//             tabIndex="0"
//           >
//             <div className="row-main">
//               <div className="service-name">{office.name}</div>
//               <div className="service-meta">⏱ {office.time}</div>
//               <div className="service-location">📍 {office.location}</div>
//             </div>

//             <div className={`status ${office.status.toLowerCase()}`}>
//               {office.status}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GovtOfficeList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const GovtOfficeList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryId = 3; // GOVERNMENT category

  useEffect(() => {
    fetch(`http://localhost:8080/api/branches/${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch offices");
        }
        return res.json();
      })
      .then((data) => {
        setOffices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching offices:", err);
        setLoading(false);
      });
  }, []);

  const filteredOffices = offices.filter(
    (office) =>
      office.name?.toLowerCase().includes(search.toLowerCase()) ||
      office.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-page">
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏛️</div>
          <div>
            <h2>Government Offices</h2>
            <p>Select an office to continue</p>
          </div>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search office or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="service-table">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading offices...</p>
        ) : filteredOffices.length === 0 ? (
          <p style={{ padding: "20px" }}>No offices found.</p>
        ) : (
          filteredOffices.map((office) => (
            <div
              key={office.id}
              className="service-row"
              onClick={() =>
                navigate(`/government-offices/${office.id}/services`)
              }
            >
              <div>
                <div className="service-name">{office.name}</div>
                {/* ⚠️ Use correct backend field */}
                <div className="service-meta">⏱ {office.workingTime}</div>
                <div className="service-location">📍 {office.location}</div>
              </div>

              <div className={`status ${office.status?.toLowerCase()}`}>
                {office.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GovtOfficeList;