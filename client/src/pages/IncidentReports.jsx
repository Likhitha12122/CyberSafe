
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./IncidentReports.css";

function IncidentReports() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "Phishing",
    severity: "Medium",
    description: "",
  });

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* LOAD INCIDENT REPORTS */
  const fetchIncidents = async () => {
    try {
      setFetching(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/incidents/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIncidents(response.data.incidents || []);
    } catch (err) {
      console.error("Fetch incidents error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your incident reports."
      );
    } finally {
      setFetching(false);
    }
  };

  /* FORM CHANGE */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* SUBMIT INCIDENT REPORT */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter an incident title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe the incident.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/incidents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data.message ||
          "Incident reported successfully!"
      );

      setFormData({
        title: "",
        type: "Phishing",
        severity: "Medium",
        description: "",
      });

      await fetchIncidents();
    } catch (err) {
      console.error("Submit incident error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to submit incident. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  /* SEVERITY BADGES */
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Low":
        return "severity-low";
      case "High":
        return "severity-high";
      case "Critical":
        return "severity-critical";
      default:
        return "severity-medium";
    }
  };

  /* STATUS BADGES */
  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status-resolved";
      case "Under Review":
        return "status-review";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="incident-page">
      {/* SIDEBAR */}
      <aside className="incident-sidebar">
        <Link to="/dashboard" className="incident-brand">
          <div className="incident-brand-icon">C</div>

          <div>
            <strong>CyberSafe</strong>
            <span>STUDENT SECURITY</span>
          </div>
        </Link>

        <nav className="incident-nav">
          <Link to="/dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/reports"
            className="incident-nav-active"
          >
            <span>⚠</span>
            Incident Reports
          </Link>

          {/* FIXED: navigate to URL Threat Check */}
          <Link to="/url-check">
            <span>🔍</span>
            URL Threat Check
          </Link>

          <Link to="/quizzes">
            <span>✓</span>
            Cyber Quizzes
          </Link>

          {/* Use the route configured in App.jsx */}
          <Link to="/learning-hub">
            <span>📚</span>
            Learning Hub
          </Link>

          <Link to="/alerts">
            <span>🔔</span>
            Alerts
          </Link>
        </nav>

        <div className="incident-sidebar-bottom">
          <Link to="/">
            ← Back to Home
          </Link>

          <button type="button" onClick={handleLogout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="incident-main">
        {/* PAGE HEADER */}
        <header className="incident-header">
          <div>
            <span className="incident-eyebrow">
              INCIDENT MANAGEMENT
            </span>

            <h1>Report a Cyber Incident</h1>

            <p>
              Report suspicious or harmful cyber activity and
              help keep your digital environment safe.
            </p>
          </div>

          <div className="incident-header-icon">🛡️</div>
        </header>

        {/* REPORT FORM AND INFORMATION */}
        <section className="incident-content">
          <div className="incident-form-card">
            <div className="incident-card-heading">
              <div>
                <span className="small-label">NEW REPORT</span>
                <h2>Submit an Incident</h2>
                <p>
                  Provide accurate information about the incident.
                </p>
              </div>

              <div className="incident-shield">⚠</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="incident-field">
                <label htmlFor="incident-title">
                  Incident Title <span>*</span>
                </label>

                <input
                  id="incident-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Suspicious email received"
                  required
                />
              </div>

              <div className="incident-two-columns">
                <div className="incident-field">
                  <label htmlFor="incident-type">
                    Incident Type <span>*</span>
                  </label>

                  <select
                    id="incident-type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Phishing">Phishing</option>
                    <option value="Suspicious Link">
                      Suspicious Link
                    </option>
                    <option value="Cyberbullying">
                      Cyberbullying
                    </option>
                    <option value="Account Hacking">
                      Account Hacking
                    </option>
                    <option value="Malware">Malware</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="incident-field">
                  <label htmlFor="incident-severity">
                    Severity
                  </label>

                  <select
                    id="incident-severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="incident-field">
                <label htmlFor="incident-description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="incident-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what happened, when it happened, and any suspicious activity you noticed..."
                  rows={7}
                  required
                />
              </div>

              {message && (
                <div className="incident-success" role="status">
                  ✓ {message}
                </div>
              )}

              {error && (
                <div className="incident-error" role="alert">
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                className="incident-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Incident Report →"}
              </button>
            </form>
          </div>

          {/* INFORMATION CARD */}
          <div className="incident-info-card">
            <div className="info-icon">🔐</div>

            <h3>Report Safely</h3>

            <p>
              Your report is securely linked to your CyberSafe
              account. Only authenticated users can access their
              submitted reports.
            </p>

            <div className="info-points">
              <div>
                <span>✓</span>
                <p>Your report is securely stored</p>
              </div>

              <div>
                <span>✓</span>
                <p>Track your report status</p>
              </div>

              <div>
                <span>✓</span>
                <p>Help improve cyber awareness</p>
              </div>

              <div>
                <span>✓</span>
                <p>Your account remains protected</p>
              </div>
            </div>
          </div>
        </section>

        {/* MY REPORTS */}
        <section className="my-reports-section">
          <div className="reports-heading">
            <div>
              <span className="incident-eyebrow">
                YOUR ACTIVITY
              </span>

              <h2>My Incident Reports</h2>
            </div>

            <span className="report-count">
              {incidents.length}{" "}
              {incidents.length === 1 ? "Report" : "Reports"}
            </span>
          </div>

          {fetching && (
            <div className="reports-empty">
              <div className="loading-spinner">⟳</div>
              <h3>Loading your reports...</h3>
            </div>
          )}

          {!fetching && incidents.length === 0 && (
            <div className="reports-empty">
              <div className="empty-icon">🛡️</div>
              <h3>No incident reports yet</h3>
              <p>Your submitted reports will appear here.</p>
            </div>
          )}

          {!fetching && incidents.length > 0 && (
            <div className="reports-list">
              {incidents.map((incident) => (
                <div
                  className="report-item"
                  key={incident._id}
                >
                  <div className="report-main">
                    <div className="report-icon">⚠</div>

                    <div>
                      <h3>{incident.title}</h3>

                      <p>
                        {incident.type} {" • "}
                        {incident.createdAt
                          ? new Date(
                              incident.createdAt
                            ).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="report-details">
                    <span
                      className={`severity-badge ${getSeverityClass(
                        incident.severity
                      )}`}
                    >
                      {incident.severity || "Medium"}
                    </span>

                    <span
                      className={`status-badge ${getStatusClass(
                        incident.status
                      )}`}
                    >
                      {incident.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default IncidentReports;
