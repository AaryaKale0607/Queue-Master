import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QueueStatus.scss";
import { FiClock, FiUsers, FiCheckCircle, FiArrowLeft, FiHash } from "react-icons/fi";
import axios from "axios";

const QueueStatus = () => {

    const navigate = useNavigate();

    const [activeTokens, setActiveTokens]   = useState([]);
    const [queueStatuses, setQueueStatuses] = useState({});
    const [loading, setLoading]             = useState(true);
    const [lastUpdated, setLastUpdated]     = useState(null);

    const userId = localStorage.getItem("userId");
    const token  = localStorage.getItem("token");
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const loadActiveTokens = async () => {
        if (!userId) { navigate("/login"); return []; }
        try {
            const res = await axios.get(
                `http://localhost:8080/api/v1/tokens/user/${userId}/active`,
                authHeaders
            );
            return res.data || [];
        } catch (err) {
            console.error("Failed to load tokens:", err);
            return [];
        }
    };

    const loadQueueStatuses = async (tokens) => {
        if (!tokens?.length) return {};
        const today    = new Date().toISOString().split("T")[0];
        const statuses = {};

        await Promise.all(tokens.map(async (t) => {
            try {
                const key = t.queueType === "DOCTOR"
                    ? `doctor-${t.doctorId}`
                    : `bs-${t.branchServiceId}`;

                const url = t.queueType === "DOCTOR"
                    ? `http://localhost:8080/api/v1/tokens/doctor/${t.doctorId}/queue-status`
                    : `http://localhost:8080/api/v1/tokens/branch-service/${t.branchServiceId}/queue-status`;

                const res = await axios.get(url, { params: { date: today } });
                statuses[key] = res.data;
            } catch (err) {
                console.error("Queue status error:", err);
            }
        }));

        return statuses;
    };

    const refresh = async () => {
        const tokens   = await loadActiveTokens();
        const statuses = await loadQueueStatuses(tokens);
        setActiveTokens(tokens);
        setQueueStatuses(statuses);
        setLastUpdated(new Date());
        setLoading(false);
    };

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 10000);
        return () => clearInterval(interval);
    }, []);

    const getQueueData = (t) => {
        const key = t.queueType === "DOCTOR"
            ? `doctor-${t.doctorId}`
            : `bs-${t.branchServiceId}`;
        return queueStatuses[key] || null;
    };

    const statusBadgeClass = (status) => {
        switch (status) {
            case "BOOKED":      return "badge waiting";
            case "CALLED":      return "badge called";
            case "IN_PROGRESS": return "badge serving";
            case "COMPLETED":   return "badge done";
            default:            return "badge waiting";
        }
    };

    const statusLabel = (status) => {
        switch (status) {
            case "BOOKED":      return "Waiting";
            case "CALLED":      return "Called!";
            case "IN_PROGRESS": return "Now Serving";
            case "COMPLETED":   return "Completed";
            default:            return status;
        }
    };

    const formatTime = (date) => {
        if (!date) return "";
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    };

    return (
        <div className="queue-status-page">

            {/* NAVBAR */}
            <div className="qs-navbar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>
                <h2>Live Queue Status</h2>
                <div className="live-indicator">
                    <span className="dot" />
                    Live · {formatTime(lastUpdated)}
                </div>
            </div>

            {/* PAGE HEADER */}
            {!loading && activeTokens.length > 0 && (
                <div className="qs-page-header">
                    <h1>Your Active Bookings</h1>
                    <p>Updates automatically every 10 seconds</p>
                </div>
            )}

            {/* LOADING */}
            {loading ? (
                <div className="qs-loading">
                    <div className="spinner" />
                    <p>Fetching your queue status...</p>
                </div>

            /* EMPTY */
            ) : activeTokens.length === 0 ? (
                <div className="qs-empty">
                    <div className="empty-icon">🎫</div>
                    <h3>No Active Bookings</h3>
                    <p>You have no active tokens right now.</p>
                    <button
                        className="book-btn"
                        onClick={() => navigate("/Userdashboard")}
                    >
                        Book a Token
                    </button>
                </div>

            /* TOKEN CARDS */
            ) : (
                <div className="tokens-container">
                    {activeTokens.map((t) => {
                        const q     = getQueueData(t);
                        const ahead = t.queuePosition ?? 0;
                        const wait  = t.estimatedWaitTimeMinutes ?? 0;
                        const total = q?.totalTokens ?? 0;
                        const done  = q?.completedCount ?? 0;
                        const pct   = total > 0
                            ? Math.round((done / total) * 100) : 0;

                        return (
                            <div key={t.tokenId} className="token-card">

                                {/* HEADER */}
                                <div className="tc-header">
                                    <div className="tc-left">
                                        <div className="tc-type-icon">
                                            {t.queueType === "DOCTOR" ? "🏥" : "🏦"}
                                        </div>
                                        <div>
                                            <div className="tc-title">
                                                {t.doctorName || t.branchServiceName}
                                            </div>
                                            <div className="tc-subtitle">
                                                {t.branchName} · {t.branchLocation}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tc-right">
                                        <div className="tc-token-number">
                                            {t.displayToken}
                                        </div>
                                        <div className="tc-meta">
                                            <span className={statusBadgeClass(t.status)}>
                                                {statusLabel(t.status)}
                                            </span>
                                            <span className="tc-date">
                                                {t.bookingDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* STATS */}
                                <div className="tc-stats">
                                    <div className="stat-item">
                                        <div className="stat-icon-box green">
                                            <FiCheckCircle />
                                        </div>
                                        <div>
                                            <div className="stat-label">Now Serving</div>
                                            <div className="stat-value">
                                                {q?.currentlyServingToken || "—"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon-box blue">
                                            <FiUsers />
                                        </div>
                                        <div>
                                            <div className="stat-label">Ahead of You</div>
                                            <div className="stat-value">{ahead}</div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon-box orange">
                                            <FiClock />
                                        </div>
                                        <div>
                                            <div className="stat-label">Est. Wait</div>
                                            <div className="stat-value">{wait} min</div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon-box purple">
                                            <FiHash />
                                        </div>
                                        <div>
                                            <div className="stat-label">Total Tokens</div>
                                            <div className="stat-value">{total}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* PROGRESS */}
                                <div className="tc-progress">
                                    <span className="progress-label">Progress</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="progress-count">
                                        {done} / {total} · {pct}%
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default QueueStatus;