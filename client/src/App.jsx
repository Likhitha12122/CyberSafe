
import { Link, Navigate, Route, Routes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IncidentReports from "./pages/IncidentReports";
import UrlThreatCheck from "./pages/UrlThreatCheck";
import Quiz from "./pages/Quiz";
import LearningHub from "./pages/LearningHub";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function Home() {
  return (
    <div className="cybersafe">
      <header className="navbar">
        <Link to="/" className="brand">
          <div className="brand-icon">C</div>
          <div>
            <strong>CyberSafe</strong>
            <span>STUDENT SECURITY PLATFORM</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-register">
            Get Started
          </Link>
        </nav>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-content">
          <span className="hero-pill">
            CYBERSECURITY AWARENESS PLATFORM
          </span>

          <h1>
            Stay ahead of <span>digital threats.</span>
          </h1>

          <p>
            Learn cybersecurity, report incidents, check suspicious
            URLs, and develop safer digital habits with CyberSafe.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started →
            </Link>

            <a href="#features" className="secondary-button">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-heading">
          <span>PLATFORM FEATURES</span>
          <h2>One platform for smarter cyber safety.</h2>
          <p>Learn, identify, report, and protect.</p>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Incident Reporting</h3>
            <p>Report phishing, cyberbullying, hacking, and malware.</p>
            <Link to="/reports">Report an incident →</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>URL Threat Check</h3>
            <p>Check suspicious URLs before visiting them.</p>
            <Link to="/url-check">Check a URL →</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Cyber Quiz</h3>
            <p>Test your knowledge of cybersecurity threats.</p>
            <Link to="/quizzes">Take a quiz →</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learning Hub</h3>
            <p>Learn about phishing, passwords, malware, and safe browsing.</p>
            <Link to="/learning-hub">Start learning →</Link>
          </article>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <IncidentReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/url-check"
        element={
          <ProtectedRoute>
            <UrlThreatCheck />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={<Navigate to="/quizzes" replace />}
      />

      <Route
        path="/learning-hub"
        element={
          <ProtectedRoute>
            <LearningHub />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learning"
        element={<Navigate to="/learning-hub" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
