// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const Hospitals = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");

//   const hospitals = [
//     { name: "Apollo Hospital", status: "Open", time: "24×7 Emergency", location: "Pune, Sadashiv Peth" },
//     { name: "City Care Hospital", status: "Open", time: "9:00 AM – 8:00 PM", location: "Pune, Baner" },
//     { name: "LifeLine Multispeciality", status: "Limited", time: "10:00 AM – 6:00 PM", location: "Pune, Katraj" },
//     { name: "Green Cross Clinic", status: "Busy", time: "11:00 AM – 5:00 PM", location: "Pune, Swargate" },
//     { name: "Government Civil Hospital", status: "Open", time: "24×7", location: "Aurangabad, shivaji chowk,Maharashtra" },
//   ];

//   const filteredHospitals = hospitals.filter(
//     (h) =>
//       h.name.toLowerCase().includes(search.toLowerCase()) ||
//       h.location.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="service-page">
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏥</div>
//           <div>
//             <h2>Hospitals</h2>
//             <p>Select a hospital to continue</p>
//           </div>
//         </div>

//         {/* Search Bar Inside Navbar */}
//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search hospital or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="service-table">
//         {filteredHospitals.map((h) => (
//           <div
//             key={h.name}
//             className="service-row"
//             onClick={() =>
//               navigate(`/hospitals/${encodeURIComponent(h.name)}/doctors`)
//             }
//             tabIndex="0"
//           >
//             <div>
//               <div className="service-name">{h.name}</div>
//               <div className="service-meta">⏱ {h.time}</div>
//               <div className="service-location">📍 {h.location}</div>
//             </div>

//             <div className={`status ${h.status.toLowerCase()}`}>
//               {h.status}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Hospitals;





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const Hospitals = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [hospitals, setHospitals] = useState([]);

//   // 🔥 Fetch from backend
//   useEffect(() => {
//     fetch("http://localhost:8080/api/branches/{categoryId}")
//       .then((res) => res.json())
//       .then((data) => setHospitals(data))
//       .catch((err) => console.error("Error fetching hospitals:", err));
//   }, []);

//   const filteredHospitals = hospitals.filter(
//     (h) =>
//       h.name?.toLowerCase().includes(search.toLowerCase()) ||
//       h.location?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="service-page">
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏥</div>
//           <div>
//             <h2>Hospitals</h2>
//             <p>Select a hospital to continue</p>
//           </div>
//         </div>

//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search hospital or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="service-table">
//         {filteredHospitals.map((h) => (
//           <div
//             key={h.id}
//             className="service-row"
//             onClick={() =>
//               navigate(`/hospitals/${h.id}/doctors`)
//             }
//             tabIndex="0"
//           >
//             <div>
//               <div className="service-name">{h.name}</div>
//               <div className="service-meta">⏱ {h.workingTime}</div>
//               <div className="service-location">📍 {h.location}</div>
//             </div>

//             <div className={`status ${h.status?.toLowerCase()}`}>
//               {h.status}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Hospitals;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Hospitals = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryId = 1; // Hospitals category

  useEffect(() => {
    fetch(`http://localhost:8080/api/branches/${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        return res.json();
      })
      .then((data) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hospitals:", err);
        setLoading(false);
      });
  }, []);

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-page">
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏥</div>
          <div>
            <h2>Hospitals</h2>
            <p>Select a hospital to continue</p>
          </div>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search hospital or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="service-table">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading hospitals...</p>
        ) : filteredHospitals.length === 0 ? (
          <p style={{ padding: "20px" }}>No hospitals found.</p>
        ) : (
          filteredHospitals.map((h) => (
            <div
              key={h.id}
              className="service-row"
              onClick={() => navigate(`/hospitals/${h.id}/doctors`)}
            >
              <div>
                <div className="service-name">{h.name}</div>
                <div className="service-meta">⏱ {h.time}</div>
                <div className="service-location">📍 {h.location}</div>
              </div>

              <div className={`status ${h.status?.toLowerCase()}`}>
                {h.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Hospitals;