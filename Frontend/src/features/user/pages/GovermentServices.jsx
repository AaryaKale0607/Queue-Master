// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const GovernmentServices = () => {
//   const navigate = useNavigate();
//   const { officeName } = useParams();
//   const [selectedService, setSelectedService] = useState(null);
//   const [search, setSearch] = useState("");

//   const services = [
//     {
//       id: 1,
//       name: "Document Verification",
//       description: "ID, address and certificate verification",
//       counter: "Verification Desk",
//       timing: "10:00 AM – 1:00 PM",
//       status: "Available",
//     },
//     {
//       id: 2,
//       name: "Application Submission",
//       description: "Submit government forms & applications",
//       counter: "Counter 2",
//       timing: "10:30 AM – 3:30 PM",
//       status: "Busy",
//     },
//     {
//       id: 3,
//       name: "License / Permit Services",
//       description: "Driving, trade and other permit services",
//       counter: "Service Counter",
//       timing: "11:00 AM – 2:00 PM",
//       status: "Limited",
//     },
//     {
//       id: 4,
//       name: "Certificate Collection",
//       description: "Birth, caste, income & residence certificates",
//       counter: "Collection Desk",
//       timing: "12:00 PM – 4:00 PM",
//       status: "Available",
//     },
//   ];

//   const filteredServices = services.filter(
//     (s) =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.description.toLowerCase().includes(search.toLowerCase()) ||
//       s.counter.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleGetToken = (service) => {
//     setSelectedService(service);
//   };

//   const closeModal = () => {
//     setSelectedService(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(
//       `Token booked for ${selectedService.name} at ${decodeURIComponent(
//         officeName
//       )}`
//     );
//     closeModal();
//   };

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
//             <h2>Government Service Board</h2>
//             <p>{decodeURIComponent(officeName)}</p>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="navbar-search">
//           <input
//             type="text"
//             placeholder="Search service..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* SERVICE BOARD */}
//       <div className="service-table">
//         {filteredServices.map((s) => (
//           <div key={s.id} className="service-row doctor-board">
//             <div className="doctor-left">
//               <div className="doctor-avatar">{s.name.charAt(0)}</div>

//               <div className="doctor-info-vertical">
//                 <div className="doctor-name">{s.name}</div>
//                 <div className="doctor-line">
//                   <span className="label">Service:</span>
//                   <span>{s.description}</span>
//                 </div>
//                 <div className="doctor-line">
//                   <span className="label">Counter:</span>
//                   <span>{s.counter}</span>
//                 </div>
//                 <div className="doctor-line">
//                   <span className="label">Service Time:</span>
//                   <span>{s.timing}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="doctor-right">
//               <span className={`status ${s.status.toLowerCase()}`}>
//                 {s.status}
//               </span>

//               <button
//                 className="token-btn"
//                 disabled={s.status !== "Available"}
//                 onClick={() => handleGetToken(s)}
//               >
//                 Get Token
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* BOOKING MODAL */}
//       {selectedService && (
//         <div className="modal-overlay">
//           <div className="modal-card compact">
//             <div className="modal-header">
//               <div>
//                 <h3>Book Government Service Token</h3>
//                 <div className="doctor-ref">
//                   {selectedService.name} — {decodeURIComponent(officeName)}
//                 </div>
//               </div>
//               <button className="close-btn" onClick={closeModal}>✕</button>
//             </div>

//             <form className="modal-form" onSubmit={handleSubmit}>
//               <div className="form-grid">
//                 <input type="text" placeholder="Full Name" required />
//                 <input type="tel" placeholder="Mobile Number" required />
//                 <input type="email" placeholder="Email Address" />
//                 <input type="text" placeholder="Document / Application ID (if any)" />
//                 <input type="date" required />
//                 <input type="time" required />
//               </div>

//               <textarea
//                 rows="2"
//                 placeholder="Purpose or Additional Notes"
//               ></textarea>

//               <div className="modal-actions">
//                 <button type="button" className="cancel-btn" onClick={closeModal}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="confirm-btn">
//                   Confirm Booking
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GovernmentServices;









import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";

const GovernmentServices = () => {
  const navigate = useNavigate();
  const { officeId, officeName } = useParams();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    documentId: "",
    date: "",
    time: "",
    notes: "",
  });

  // ✅ FETCH SERVICES FROM BACKEND
  useEffect(() => {
    fetch(`http://localhost:8080/api/branch-services/${officeId}`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, [officeId]);

  // ✅ FILTER
  const filteredServices = services.filter(
    (s) =>
      s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.counterName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetToken = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SUBMIT TOKEN TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenData = {
      branchServiceId: selectedService.id,
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      documentId: formData.documentId,
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      notes: formData.notes,
    };

    try {
      const response = await fetch("http://localhost:8080/api/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData),
      });

      if (response.ok) {
        alert("Token booked successfully!");
        closeModal();
      } else {
        alert("Failed to book token.");
      }
    } catch (error) {
      console.error("Error booking token:", error);
    }
  };

  return (
    <div className="service-page">
      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏛️</div>
          <div>
            <h2>Government Service Board</h2>
            <p>{decodeURIComponent(officeName)}</p>
          </div>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* SERVICE LIST */}
      <div className="service-table">
        {filteredServices.map((s) => (
          <div key={s.id} className="service-row doctor-board">
            <div className="doctor-left">
              <div className="doctor-avatar">
                {s.serviceName?.charAt(0)}
              </div>

              <div className="doctor-info-vertical">
                <div className="doctor-name">{s.serviceName}</div>

                <div className="doctor-line">
                  <span className="label">Service:</span>
                  <span>{s.description}</span>
                </div>

                <div className="doctor-line">
                  <span className="label">Counter:</span>
                  <span>{s.counterName}</span>
                </div>

                <div className="doctor-line">
                  <span className="label">Service Time:</span>
                  <span>{s.timing}</span>
                </div>
              </div>
            </div>

            <div className="doctor-right">
              <span className={`status ${s.status?.toLowerCase()}`}>
                {s.status}
              </span>

              <button
                className="token-btn"
                disabled={s.status !== "Available"}
                onClick={() => handleGetToken(s)}
              >
                Get Token
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="modal-card compact">
            <div className="modal-header">
              <div>
                <h3>Book Government Service Token</h3>
                <div className="doctor-ref">
                  {selectedService.serviceName} —{" "}
                  {decodeURIComponent(officeName)}
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="documentId"
                  placeholder="Document / Application ID"
                  value={formData.documentId}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
                rows="2"
                name="notes"
                placeholder="Purpose or Additional Notes"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentServices;