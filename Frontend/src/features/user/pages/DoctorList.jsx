// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../styles/ServiceModern.scss";
// import BookAppointmentModal from "./BookAppointmentModal";

// const DoctorList = () => {
//   const navigate = useNavigate();
//   const { hospitalId } = useParams();
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [search, setSearch] = useState("");

//   const doctors = [
//     {
//       id: 1,
//       name: "Dr. Ananya Sharma",
//       specialization: "Cardiologist",
//       experience: "12 Years",
//       timing: "10:00 AM – 2:00 PM",
//       rating: 4.8,
//       status: "Available",
//     },
//     {
//       id: 2,
//       name: "Dr. Rahul Verma",
//       specialization: "Orthopedic Surgeon",
//       experience: "9 Years",
//       timing: "1:00 PM – 6:00 PM",
//       rating: 4.6,
//       status: "Busy",
//     },
//     {
//       id: 3,
//       name: "Dr. Meera Iyer",
//       specialization: "Dermatologist",
//       experience: "7 Years",
//       timing: "11:00 AM – 4:00 PM",
//       rating: 4.7,
//       status: "Available",
//     },
//     {
//       id: 4,
//       name: "Dr. Suresh Patil",
//       specialization: "General Physician",
//       experience: "15 Years",
//       timing: "9:00 AM – 1:00 PM",
//       rating: 4.9,
//       status: "Available",
//     },
//   ];

//   // Filter doctors by name or specialization
//   const filteredDoctors = doctors.filter(
//     (d) =>
//       d.name.toLowerCase().includes(search.toLowerCase()) ||
//       d.specialization.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="service-page">
//       {/* NAVBAR */}
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏥</div>
//           <div>
//             <h2>Doctor Board</h2>
//             <p>{decodeURIComponent(hospitalId)}</p>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search doctor or specialization..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* DOCTOR BOARD */}
//       <div className="service-table">
//         {filteredDoctors.map((d) => (
//           <div key={d.id} className="service-row doctor-board">
//             {/* LEFT SECTION */}
//             <div className="doctor-left">
//               <div className="doctor-avatar">{d.name.charAt(0)}</div>

//               <div className="doctor-info-vertical">
//                 <div className="doctor-name">{d.name}</div>
//                 <div className="doctor-line">
//                   <span className="label">Specialization:</span>
//                   <span>{d.specialization}</span>
//                 </div>
//                 <div className="doctor-line">
//                   <span className="label">Experience:</span>
//                   <span>{d.experience}</span>
//                 </div>
//                 <div className="doctor-line">
//                   <span className="label">OPD Timing:</span>
//                   <span>{d.timing}</span>
//                 </div>
//                 <div className="doctor-line">
//                   <span className="label">Rating:</span>
//                   <span>⭐ {d.rating} / 5</span>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SECTION */}
//             <div className="doctor-right">
//               <span className={`status ${d.status.toLowerCase()}`}>
//                 {d.status}
//               </span>

//               <button
//                 className="token-btn"
//                 disabled={d.status !== "Available"}
//                 onClick={() => setSelectedDoctor(d)}
//               >
//                 Get Token
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* BOOK APPOINTMENT MODAL */}
//       {selectedDoctor && (
//         <BookAppointmentModal
//           doctor={selectedDoctor}
//           onClose={() => setSelectedDoctor(null)}
//           onConfirm={() => {
//             alert(`Token booked successfully with ${selectedDoctor.name}`);
//             setSelectedDoctor(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default DoctorList;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";
import BookAppointmentModal from "./BookAppointmentModal";

const DoctorList = () => {
  const navigate = useNavigate();
  const { hospitalId } = useParams(); // branchId
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DOCTORS (Correct API)
  useEffect(() => {
    fetch(`http://localhost:8080/api/doctors/${hospitalId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, [hospitalId]);

  // 🔍 Search filter
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ BOOK TOKEN
  const bookToken = (doctor) => {
    const tokenData = {
      doctor: { id: doctor.id },
      status: "BOOKED",
    };

    fetch("http://localhost:8080/api/tokens/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Token booking failed");
        }
        return res.json();
      })
      .then((data) => {
        alert(`Token #${data.id} booked successfully with ${doctor.name}`);
        setSelectedDoctor(null);
      })
      .catch((err) => {
        console.error("Booking failed:", err);
        alert("Token booking failed!");
      });
  };

  return (
    <div className="service-page">
      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏥</div>
          <div>
            <h2>Doctor Board</h2>
            <p>Hospital ID: {hospitalId}</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* DOCTOR LIST */}
      <div className="service-table">
        {loading ? (
          <h3 style={{ padding: "20px" }}>Loading doctors...</h3>
        ) : filteredDoctors.length === 0 ? (
          <h3 style={{ padding: "20px" }}>No doctors found</h3>
        ) : (
          filteredDoctors.map((d) => (
            <div key={d.id} className="service-row doctor-board">
              {/* LEFT SIDE */}
              <div className="doctor-left">
                <div className="doctor-avatar">
                  {d.name?.charAt(0)}
                </div>

                <div className="doctor-info-vertical">
                  <div className="doctor-name">{d.name}</div>

                  <div className="doctor-line">
                    <span className="label">Specialization:</span>
                    <span>{d.specialization}</span>
                  </div>

                  <div className="doctor-line">
                    <span className="label">Experience:</span>
                    <span>{d.experience}</span>
                  </div>

                  <div className="doctor-line">
                    <span className="label">OPD Timing:</span>
                    <span>{d.timing}</span>
                  </div>

                  <div className="doctor-line">
                    <span className="label">Rating:</span>
                    <span>⭐ {d.rating} / 5</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="doctor-right">
                <span className={`status ${d.status?.toLowerCase()}`}>
                  {d.status}
                </span>

                <button
                  className="token-btn"
                  disabled={d.status !== "Available"}
                  onClick={() => setSelectedDoctor(d)}
                >
                  Get Token
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onConfirm={() => bookToken(selectedDoctor)}
        />
      )}
    </div>
  );
};

export default DoctorList;