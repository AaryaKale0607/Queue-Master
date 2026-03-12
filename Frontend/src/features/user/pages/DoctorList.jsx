import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";
import BookAppointmentModal from "./BookAppointmentModal";

const DoctorList = () => {

    const navigate       = useNavigate();
    const { hospitalId } = useParams();

    const [doctors, setDoctors]               = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [search, setSearch]                 = useState("");
    const [loading, setLoading]               = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingResult, setBookingResult]   = useState(null);
    const [currentUserId, setCurrentUserId]   = useState(null);

    // ── Fetch userId from DB on mount ─────────────────────────
    useEffect(() => {
        const fetchUserId = async () => {
            const email = localStorage.getItem("email");
            const token = localStorage.getItem("token");

            console.log("📧 Email:", email);
            console.log("🔑 Token:", token ? "exists" : "MISSING");

            if (!email || !token) {
                console.warn("⚠️ Not logged in — redirecting");
                navigate("/login");
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:8080/api/users/email/${encodeURIComponent(email)}`,
                    {
                        method : "GET",
                        headers: {
                            "Content-Type" : "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || `HTTP ${res.status}`);
                }

                const data = await res.json();
                console.log("✅ User from DB:", data);
                setCurrentUserId(data.userId);

            } catch (err) {
                console.error("❌ fetchUserId failed:", err.message);
            }
        };

        fetchUserId();
    }, []);

    // ── Fetch Doctors ─────────────────────────────────────────
    useEffect(() => {
        if (!hospitalId) return;

        const fetchDoctors = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/doctors/${hospitalId}`,
                    {
                        method : "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch doctors");
                const data = await res.json();
                setDoctors(data);
            } catch (err) {
                console.error("❌ Error fetching doctors:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [hospitalId]);

    // ── Search Filter ─────────────────────────────────────────
    const filteredDoctors = doctors.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Book Doctor Token ─────────────────────────────────────
    const bookToken = async (doctor, bookingDate) => {
        if (bookingLoading) return;

        const token = localStorage.getItem("token");

        if (!currentUserId) {
            alert("❌ Could not identify your account. Please log in again.");
            navigate("/login");
            return;
        }

        if (!token) {
            alert("❌ Session expired. Please login again.");
            navigate("/login");
            return;
        }

        // ── Convert bookingDate to "yyyy-MM-dd" string safely ─
        let selected;
        if (!bookingDate) {
            selected = new Date().toISOString().split("T")[0];
        } else if (typeof bookingDate === "string") {
            selected = bookingDate;
        } else if (bookingDate instanceof Date) {
            selected = bookingDate.toISOString().split("T")[0];
        } else {
            selected = new Date().toISOString().split("T")[0];
        }

        console.log("📅 bookingDate received:", bookingDate, "→ converted:", selected);

        // ── Date validation ───────────────────────────────────
        const today        = new Date().toISOString().split("T")[0];
        const todayDate    = new Date(today);
        const selectedDate = new Date(selected);
        const maxDate      = new Date(today);
        maxDate.setDate(maxDate.getDate() + 7);

        if (selectedDate < todayDate) {
            alert("❌ Cannot book a token for a past date.");
            return;
        }
        if (selectedDate > maxDate) {
            alert("❌ Advance booking is limited to 7 days.");
            return;
        }

        const payload = {
            queueType  : "DOCTOR",
            doctorId   : doctor.id,
            userId     : currentUserId,
            bookingDate: selected        // ✅ always "yyyy-MM-dd" string
        };

        console.log("📤 Booking Payload:", JSON.stringify(payload));

        setBookingLoading(true);
        setSelectedDoctor(doctor);

        try {
            const res = await fetch(
                "http://localhost:8080/api/v1/tokens/book",
                {
                    method : "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        "Accept"       : "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error("❌ Booking error response:", text);
                let errorMessage = `HTTP ${res.status}`;
                try {
                    const json   = JSON.parse(text);
                    errorMessage = json.message || json.error || errorMessage;
                } catch {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            console.log("✅ Booking Success:", data);
            setBookingResult(data);
            setSelectedDoctor(null);

        } catch (err) {
            console.error("🚨 Booking Error:", err.message);
            alert(`❌ Booking Failed!\n\n${err.message}`);
            setSelectedDoctor(null);
        } finally {
            setBookingLoading(false);
        }
    };

    // ── Cancel Token ──────────────────────────────────────────
    const cancelToken = async (tokenId) => {
        if (!currentUserId || !tokenId) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/tokens/${tokenId}/cancel?userId=${currentUserId}`,
                {
                    method : "DELETE",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) {
                const text = await res.text();
                let json;
                try   { json = JSON.parse(text); }
                catch { json = null; }
                throw new Error(json?.message || text || "Cancel failed");
            }

            const data = await res.json();
            alert(`✅ ${data.message}`);
            setBookingResult(null);

        } catch (err) {
            alert(`❌ Cancel Failed!\n${err.message}`);
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
                    <div className="logo">🏥</div>
                    <div>
                        <h2>Doctor Board</h2>
                        <p>Hospital ID: {hospitalId}</p>
                    </div>
                </div>
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search doctor or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ── BOOKING SUCCESS CARD ── */}
            {bookingResult && (
    <div className="booking-success-overlay">
        <div className="booking-success-card">

            {/* GREEN HEADER */}
            <div className="card-header">
                <div className="check-circle">✅</div>
                <h3>Booking Confirmed!</h3>
                <p>Your token has been successfully booked</p>
            </div>

            {/* TOKEN NUMBER */}
            <div className="token-strip">
                <span className="token-label">Your Token</span>
                <span className="token-number">{bookingResult.displayToken}</span>
            </div>

            {/* INFO ROWS */}
            <div className="info-list">
                <div className="info-row">
                    <span className="info-key">Doctor</span>
                    <span className="info-val">{bookingResult.doctorName}</span>
                </div>
                <div className="info-row">
                    <span className="info-key">Specialization</span>
                    <span className="info-val">{bookingResult.doctorSpecialization}</span>
                </div>
                <div className="info-row">
                    <span className="info-key">OPD Timing</span>
                    <span className="info-val">{bookingResult.doctorTiming}</span>
                </div>
                <div className="info-row">
                    <span className="info-key">Branch</span>
                    <span className="info-val">{bookingResult.branchName}</span>
                </div>
                <div className="info-row">
                    <span className="info-key">Date</span>
                    <span className="info-val">{bookingResult.bookingDate}</span>
                </div>
                <div className="info-row">
                    <span className="info-key">Queue Position</span>
                    <span className="info-val">#{bookingResult.queuePosition ?? 1} in line</span>
                </div>
            </div>

            {/* WAIT TIME BANNER */}
            <div className="wait-banner">
                <span className="wait-left">⏱ Estimated Wait Time</span>
                <span className="wait-time">
                    {bookingResult.estimatedWaitTimeMinutes ?? 0} min
                </span>
            </div>

            {/* ACTIONS */}
            <div className="card-actions">
                <button
                    className="btn-close"
                    onClick={() => setBookingResult(null)}
                >
                    Done
                </button>
                <button
                    className="btn-cancel"
                    onClick={() => cancelToken(bookingResult.tokenId)}
                >
                    Cancel Token
                </button>
            </div>

        </div>
    </div>
)}
            {/* DOCTOR LIST */}
            <div className="service-table">
                {loading ? (
                    <h3 style={{ padding: "20px" }}>Loading doctors...</h3>
                ) : filteredDoctors.length === 0 ? (
                    <h3 style={{ padding: "20px" }}>No doctors found</h3>
                ) : (
                    filteredDoctors.map((d) => (
                        <div key={d.id} className="service-row doctor-board">

                            {/* LEFT */}
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

                            {/* RIGHT */}
                            <div className="doctor-right">
                                <span className={`status ${d.status?.toLowerCase()}`}>
                                    {d.status}
                                </span>
                                <button
                                    className="token-btn"
                                    disabled={d.status !== "Available" || bookingLoading}
                                    onClick={() => setSelectedDoctor(d)}
                                >
                                    {bookingLoading && selectedDoctor?.id === d.id
                                        ? "Booking..." : "Get Token"}
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* BOOK APPOINTMENT MODAL */}
            {selectedDoctor && !bookingLoading && (
                <BookAppointmentModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onConfirm={(bookingDate) => bookToken(selectedDoctor, bookingDate)}
                />
            )}

        </div>
    );
};

export default DoctorList;