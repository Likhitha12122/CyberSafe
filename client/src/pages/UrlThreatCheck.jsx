
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UrlThreatCheck.css";

const API_URL = "http://localhost:5000/api/url";

function UrlThreatCheck() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [scan, setScan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await axios.get(
        `${API_URL}/history`,
        authConfig
      );

      setHistory(response.data.scans || []);
    } catch (err) {
      console.error("Load URL history error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Could not load scan history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadHistory();
  }, [token, navigate, loadHistory]);

  const handleScan = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setScan(null);

    const enteredUrl = url.trim();

    if (!enteredUrl) {
      setError("Please enter a website URL.");
      return;
    }

    // Require a complete HTTP or HTTPS URL.
    let parsedUrl;

    try {
      parsedUrl = new URL(enteredUrl);

      if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes(".")
      ) {
        throw new Error("Invalid URL");
      }
    } catch {
      setError(
        "Enter a valid URL, such as https://example.com"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/scan`,
        { url: enteredUrl },
        authConfig
      );

      setScan(response.data.scan);
      setMessage(
        response.data.message || "URL scan completed."
      );

      // Refresh saved scan history after a successful scan.
      await loadHistory();
    } catch (err) {
      console.error("URL scan error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "URL scan failed. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getResultClass = (result) => {
    switch (result) {
      case "Safe":
        return "url-result-safe";
      case "Suspicious":
        return "url-result-suspicious";
      default:
        return "url-result-dangerous";
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 75) return "url-score-good";
    if (score >= 50) return "url-score-medium";
    return "url-score-bad";
  };

  return (
    <div className="url-page">
      {/* SIDEBAR */}
      <aside className="url-sidebar">
        <Link to="/" className="url-brand">
          <div className="url-brand-icon">C</div>

          <div>
            <strong>CyberSafe</strong>
            <span>STUDENT SECURITY</span>
          </div>
        </Link>

        <nav className="url-nav">
          <Link to="/dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/reports">
            <span>⚠</span>
            Incident Reports
          </Link>

          <Link to="/url-check" className="url-nav-active">
            <span>⌕</span>
            URL Threat Check
          </Link>

          <a href="#url-history">
            <span>◷</span>
            Scan History
          </a>

          <Link to="/" className="url-back-home">
            ← Back to Home
          </Link>
        </nav>

        <button
          type="button"
          className="url-logout"
          onClick={handleLogout}
        >
          ⇥ Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="url-main">
        <header className="url-header">
          <div>
            <span className="url-eyebrow">
              CYBERSECURITY TOOLS
            </span>

            <h1>URL Threat Check</h1>

            <p>
              Inspect a suspicious website address before
              you decide whether to visit it.
            </p>
          </div>

          <div className="url-header-shield">⌕</div>
        </header>

        {/* SCANNER */}
        <section className="url-scanner-card">
          <div className="url-scanner-heading">
            <div className="url-scanner-icon">🔍</div>

            <div>
              <h2>Analyze a website URL</h2>
              <p>
                Enter the complete website address below.
              </p>
            </div>
          </div>

          <form onSubmit={handleScan}>
            <label htmlFor="website-url">
              Website URL
            </label>

            <div className="url-input-row">
              <input
                id="website-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                autoComplete="url"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="url-scan-button"
              >
                {loading ? "Analyzing..." : "Scan URL →"}
              </button>
            </div>

            <p className="url-input-hint">
              Example: https://example.com
            </p>
          </form>

          {error && (
            <div className="url-message url-message-error">
              ⚠ {error}
            </div>
          )}

          {message && (
            <div className="url-message url-message-success">
              ✓ {message}
            </div>
          )}
        </section>

        {/* SCAN RESULT */}
        {scan && (
          <section className="url-result-card">
            <div className="url-result-heading">
              <div>
                <span className="url-eyebrow">
                  SCAN RESULT
                </span>

                <h2>Analysis Summary</h2>
              </div>

              <span
                className={`url-result-badge ${getResultClass(
                  scan.result
                )}`}
              >
                {scan.result}
              </span>
            </div>

            <div className="url-scanned-address">
              <span>Scanned address</span>
              <p>{scan.url}</p>
            </div>

            <div className="url-score-panel">
              <div>
                <span>Pattern-based safety score</span>

                <strong
                  className={getScoreColorClass(scan.score)}
                >
                  {scan.score}/100
                </strong>
              </div>

              <div className="url-score-track">
                <div
                  className={`url-score-fill ${getScoreColorClass(
                    scan.score
                  )}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(scan.score) || 0)
                    )}%`
                  }}
                />
              </div>

              <p>
                A higher score means fewer suspicious
                patterns were detected by this demo scanner.
              </p>
            </div>

            <div className="url-reasons">
              <h3>Analysis details</h3>

              {scan.reasons?.length > 0 ? (
                <ul>
                  {scan.reasons.map((reason, index) => (
                    <li key={`${index}-${reason}`}>
                      <span>•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No analysis details were returned.</p>
              )}
            </div>

            <div className="url-disclaimer">
              <strong>Important safety notice</strong>
              <p>
                This scanner checks basic URL patterns only.
                It does not verify a website against a live
                threat-intelligence database. A result marked
                Safe is not a guarantee that the website is
                trustworthy. Avoid entering passwords or
                payment details on unfamiliar websites.
              </p>
            </div>
          </section>
        )}

        {/* SCAN HISTORY */}
        <section id="url-history" className="url-history-section">
          <div className="url-history-heading">
            <div>
              <span className="url-eyebrow">
                YOUR ACTIVITY
              </span>

              <h2>Recent URL Scans</h2>
            </div>

            <button
              type="button"
              className="url-refresh-button"
              onClick={loadHistory}
              disabled={historyLoading}
            >
              {historyLoading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {historyLoading ? (
            <div className="url-history-empty">
              Loading your scan history...
            </div>
          ) : history.length === 0 ? (
            <div className="url-history-empty">
              <div>🔍</div>
              <h3>No scans yet</h3>
              <p>
                Your saved URL scans will appear here.
              </p>
            </div>
          ) : (
            <div className="url-history-list">
              {history.map((item) => (
                <div
                  className="url-history-item"
                  key={item._id}
                >
                  <div className="url-history-details">
                    <strong>{item.url}</strong>

                    <span>
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}
                    </span>
                  </div>

                  <div className="url-history-status">
                    <span
                      className={`url-result-badge ${getResultClass(
                        item.result
                      )}`}
                    >
                      {item.result}
                    </span>

                    <strong>{item.score}/100</strong>

                    <button
                      type="button"
                      onClick={() => {
                        setScan(item);
                        setMessage("");
                        setError("");
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth"
                        });
                      }}
                    >
                      View
                    </button>
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
export default UrlThreatCheck;
