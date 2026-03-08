// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const Banks = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");

//   const banks = [
//     { 
//       name: "State Bank of India", 
//       status: "Open", 
//       time: "10:00 AM – 4:00 PM",
//       location: "MG Road, Pune"
//     },
//     { 
//       name: "HDFC Bank", 
//       status: "Open", 
//       time: "9:30 AM – 3:30 PM",
//       location: "FC Road, Pune"
//     },
//     { 
//       name: "ICICI Bank", 
//       status: "Limited", 
//       time: "10:00 AM – 3:00 PM",
//       location: "Shivaji Nagar, Pune"
//     },
//     { 
//       name: "Axis Bank", 
//       status: "Open", 
//       time: "9:00 AM – 4:00 PM",
//       location: "Camp Area, Pune"
//     },
//     { 
//       name: "Punjab National Bank", 
//       status: "Busy", 
//       time: "10:00 AM – 4:00 PM",
//       location: "Kothrud, Pune"
//     },
//   ];

//   const filteredBanks = banks.filter(
//     (bank) =>
//       bank.name.toLowerCase().includes(search.toLowerCase()) ||
//       bank.location.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="service-page">
//       {/* NAVBAR */}
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏦</div>
//           <div>
//             <h2>Banks</h2>
//             <p>Select a bank to continue</p>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search bank or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="service-table">
//         {filteredBanks.map((bank) => (
//           <div
//             key={bank.name}
//             className="service-row"
//             onClick={() =>
//               navigate(`/banks/${encodeURIComponent(bank.name)}/services`)
//             }
//             tabIndex="0"
//           >
//             <div className="row-main">
//               <div className="service-name">{bank.name}</div>
//               <div className="service-meta">⏱ {bank.time}</div>
//               <div className="service-location">📍 {bank.location}</div>
//             </div>

//             <div className={`status ${bank.status.toLowerCase()}`}>
//               {bank.status}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Banks;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Banks = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryId = 2; // BANK category

  useEffect(() => {
    fetch(`http://localhost:8080/api/branches/${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch banks");
        }
        return res.json();
      })
      .then((data) => {
        setBanks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching banks:", err);
        setLoading(false);
      });
  }, []);

  const filteredBanks = banks.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-page">
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏦</div>
          <div>
            <h2>Banks</h2>
            <p>Select a bank to continue</p>
          </div>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search bank or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="service-table">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading banks...</p>
        ) : filteredBanks.length === 0 ? (
          <p style={{ padding: "20px" }}>No banks found.</p>
        ) : (
          filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="service-row"
              onClick={() => navigate(`/banks/${bank.id}/services`)}
            >
              <div>
                <div className="service-name">{bank.name}</div>
                <div className="service-meta">⏱ {bank.workingTime}</div>
                <div className="service-location">📍 {bank.location}</div>
              </div>

              <div className={`status ${bank.status?.toLowerCase()}`}>
                {bank.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Banks;