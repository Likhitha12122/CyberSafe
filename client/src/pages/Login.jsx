
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your details."
        );
      }

      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error(
          "No login token was returned. Please check your backend response."
        );
      }

      // Preserve the existing authentication storage.
      localStorage.setItem("token", token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Return to the originally requested page when available.
      const requestedPath = location.state?.from;
      const destination =
        typeof requestedPath === "string"
          ? requestedPath
          : requestedPath?.pathname || "/dashboard";

      const safeDestination =
        destination.startsWith("/") &&
        !destination.startsWith("//") &&
        destination !== "/login" &&
        destination !== "/register"
          ? destination
          : "/dashboard";

      navigate(safeDestination, { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Cannot connect to the server. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="cyber-grid" aria-hidden="true"></div>
      <div className="cyber-glow cyber-glow-one" aria-hidden="true"></div>
      <div className="cyber-glow cyber-glow-two" aria-hidden="true"></div>

      {/* Header */}
      <header className="login-navbar">
        <Link to="/" className="login-brand">
          <div className="login-brand-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M24 4L40 10V21C40 31 33 39 24 44C15 39 8 31 8 21V10L24 4Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M17 24L22 29L32 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="login-brand-text">
            <strong>
              Cyber<span>Safe</span>
            </strong>
            <small>STUDENT SECURITY PORTAL</small>
          </div>
        </Link>

        <nav className="login-nav">
          <Link to="/" className="login-home-link">
            Home
          </Link>

          <Link to="/register" className="login-nav-cta">
            Create Account <span>↗</span>
          </Link>
        </nav>
      </header>

      {/* Main layout */}
      <main className="login-layout">
        {/* Left hero section */}
        <section className="login-hero">
          <div className="login-status">
            <span className="status-dot"></span>
            YOUR DIGITAL SAFETY STARTS HERE
          </div>

          <div className="hero-visual">
            <div className="hero-orbit hero-orbit-outer"></div>
            <div className="hero-orbit hero-orbit-middle"></div>
            <div className="hero-orbit hero-orbit-inner"></div>

            <div className="orbit-point orbit-point-one"></div>
            <div className="orbit-point orbit-point-two"></div>
            <div className="orbit-point orbit-point-three"></div>

            <div className="hero-shield">
              <svg
                viewBox="0 0 120 140"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M60 7L105 24V57C105 88 86 112 60 132C34 112 15 88 15 57V24L60 7Z"
                  fill="url(#shieldGradient)"
                  stroke="#00E5FF"
                  strokeWidth="2.5"
                />

                <path
                  d="M60 19L94 32V57C94 81 80 101 60 117C40 101 26 81 26 57V32L60 19Z"
                  stroke="#8AF5FF"
                  strokeOpacity=".55"
                  strokeWidth="1.5"
                />

                <path
                  d="M42 68L54 80L79 52"
                  stroke="#FFFFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <defs>
                  <linearGradient
                    id="shieldGradient"
                    x1="20"
                    y1="10"
                    x2="100"
                    y2="130"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#087BFF" />
                    <stop offset="1" stopColor="#031B45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="hero-floating-tag tag-top">
              <span className="tag-icon">✓</span>
              <div>
                <strong>Threat Detection</strong>
                <small>Stay protected</small>
              </div>
            </div>

            <div className="hero-floating-tag tag-bottom">
              <span className="tag-icon">⌁</span>
              <div>
                <strong>Digital Defense</strong>
                <small>Security first</small>
              </div>
            </div>

            <div className="hero-spark spark-one">✦</div>
            <div className="hero-spark spark-two">✧</div>
          </div>

          <div className="hero-copy">
            <span className="hero-kicker">WELCOME TO YOUR SAFE ZONE</span>

            <h1>
              Secure your world.
              <span>Protect your future.</span>
            </h1>

            <p>
              Learn cybersecurity, detect suspicious links, report online
              threats, and build safer digital habits with CyberSafe.
            </p>
          </div>

          <div className="login-benefits">
            <div className="login-benefit">
              <span className="benefit-icon">⌕</span>
              <div>
                <strong>Detect Online Threats</strong>
                <p>Recognize suspicious links and cyber risks.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="benefit-icon">⚡</span>
              <div>
                <strong>Build Cyber Skills</strong>
                <p>Practice through quizzes and learning modules.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="benefit-icon">◈</span>
              <div>
                <strong>Report Incidents</strong>
                <p>Help create a safer digital community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right login card */}
        <section className="login-card">
          <div className="card-top-line"></div>

          <div className="login-card-heading">
            <div className="login-card-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="10"
                  y="21"
                  width="28"
                  height="22"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="M16 21V15C16 10.6 19.6 7 24 7C28.4 7 32 10.6 32 15V21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="31" r="3" fill="currentColor" />
                <path
                  d="M24 34V37"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <div className="login-eyebrow">SECURE AUTHENTICATION</div>
              <h2>
                Login <span>Page</span>
              </h2>
              <p>Sign in to access your security dashboard.</p>
            </div>
          </div>

          <div className="card-divider">
            <span></span>
            <span className="divider-symbol">◆</span>
            <span></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>

              <div className="login-input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>

              <div className="login-input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                </svg>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span>Remember me</span>
              </label>

              <span className="forgot-note">
                Keep your password safe
              </span>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>{loading ? "AUTHENTICATING..." : "SIGN IN SECURELY"}</span>
              {!loading && <span className="submit-arrow">→</span>}
              {loading && <span className="loading-spinner"></span>}
            </button>
          </form>

          <div className="login-security-note">
            <span className="security-lock">✓</span>
            <div>
              <strong>SECURE CONNECTION</strong>
              <p>Your CyberSafe account is one step away.</p>
            </div>
            <span className="security-status">ACTIVE</span>
          </div>

          <div className="login-register">
            <p>NEW TO CYBERSAFE?</p>
            <Link to="/register">
              CREATE YOUR ACCOUNT <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="login-footer">
        <div className="footer-brand">
          <span className="footer-dot"></span>
          CYBERSAFE SECURITY PORTAL
        </div>

        <div className="footer-motto">
          LEARN <span>•</span> DETECT <span>•</span> PROTECT
        </div>

        <div className="footer-version">DIGITAL SAFETY STARTS WITH YOU</div>
      </footer>
    </div>
  );
}
