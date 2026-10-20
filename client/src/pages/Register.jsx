
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      setMessage(
        response.data.message || "Account created successfully!"
      );

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-navbar">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">C</span>
          <span className="auth-brand-text">
            <strong>Cyber<span>Safe</span></strong>
            <small>STUDENT SECURITY PLATFORM</small>
          </span>
        </Link>

        <nav className="auth-nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <a href="#register-form" className="nav-cta">
            Get Started
          </a>
        </nav>
      </header>

      <div className="auth-main">
        <section className="auth-hero">
          <div className="shield-art" aria-hidden="true">
            <div className="shield-ring">🛡️</div>
            <div className="shield-caption">YOUR DIGITAL WORLD, PROTECTED</div>
          </div>

          <p className="auth-eyebrow">YOUR SAFER INTERNET STARTS HERE</p>

          <h1>
            Join <span>CyberSafe</span>
            <br /> Today
          </h1>

          <p className="hero-description">
            Learn to recognize online threats, report suspicious
            activity, and build safer digital habits.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">◈</span>
              <div>
                <strong>Stay Protected</strong>
                <p>Learn how to avoid cyber threats.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">⌘</span>
              <div>
                <strong>Gain Knowledge</strong>
                <p>Explore practical cybersecurity guides.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">◎</span>
              <div>
                <strong>Make a Difference</strong>
                <p>Help build a safer student community.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card" id="register-form">
          <div className="auth-card-top">
            <div className="auth-logo">🛡️</div>
            <div>
              <span className="auth-eyebrow">
                JOIN THE COMMUNITY
              </span>
              <h2>Create your account</h2>
            </div>
          </div>

          <p className="auth-subtitle">
            Start your journey towards a safer online experience.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <small className="input-hint">
                Use at least 6 characters.
              </small>
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span> →</span>}
            </button>
          </form>

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <div className="security-note">
            <span>🔒</span>
            <div>
              <strong>Your security matters</strong>
              <p>Your journey to safer browsing starts here.</p>
            </div>
          </div>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>

      <footer className="auth-bottom-note">
        🛡️ &nbsp; CYBERSAFE · LEARN · REPORT · PROTECT
      </footer>
    </main>
  );
}

export default Register;
