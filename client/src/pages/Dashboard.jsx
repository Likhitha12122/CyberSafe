
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-logo">🛡️</div>

          <div>
            <strong>
              Cyber<span>Safe</span>
            </strong>
            <small>STUDENT SECURITY</small>
          </div>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="active">
            <span>▣</span>
            Dashboard
          </Link>

          <Link to="/reports">
            <span>⚠</span>
            Incident Reports
          </Link>

          {/* URL THREAT CHECK */}
          <Link to="/url-check">
            <span>⌕</span>
            URL Threat Check
          </Link>

          <Link to="/quizzes">
            <span>✓</span>
            Cyber Quizzes
          </Link>

          <Link to="/learning">
            <span>◈</span>
            Learning Hub
          </Link>

          <Link to="/alerts">
            <span>●</span>
            Alerts
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">← Back to Home</Link>

          <button type="button" onClick={handleLogout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              STUDENT SECURITY CENTER
            </span>

            <h1>
              Good to see you, {user.name || "Student"} 👋
            </h1>

            <p>Stay aware. Stay protected. Stay CyberSafe.</p>
          </div>

          <div className="dashboard-profile">
            <div className="notification-button" aria-label="Notifications">
              🔔
              <span></span>
            </div>

            <div className="profile-avatar" aria-label="User profile">
              {(user.name || "S").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* SECURITY SCORE AND STATISTICS */}
        <section className="dashboard-overview">
          <div className="security-score-large">
            <div className="large-score-ring">
              <div>
                <strong>86</strong>
                <small>/100</small>
              </div>
            </div>

            <div className="score-large-info">
              <span>YOUR SECURITY SCORE</span>

              <h2>Good security posture</h2>

              <p>
                Your security habits are improving.
                Complete more learning activities to
                increase your score.
              </p>

              <Link to="/learning">Improve your score →</Link>
            </div>
          </div>

          <div className="quick-stat-card">
            <div className="quick-stat-icon blue">⚠</div>
            <span>Reports Submitted</span>
            <strong>4</strong>
            <small>+2 this month</small>
          </div>

          <div className="quick-stat-card">
            <div className="quick-stat-icon green">✓</div>
            <span>Threat Checks</span>
            <strong>18</strong>
            <small>17 safe results</small>
          </div>

          <div className="quick-stat-card">
            <div className="quick-stat-icon purple">◈</div>
            <span>Quiz Progress</span>
            <strong>72%</strong>
            <small>Keep learning</small>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="dashboard-content-grid">
          {/* QUICK ACTIONS */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>SECURITY TOOLS</span>
                <h2>Quick actions</h2>
              </div>

              <small>Protect yourself</small>
            </div>

            <div className="action-grid">
              <Link to="/reports" className="action-card">
                <div className="action-icon blue">⚠</div>
                <h3>Report Incident</h3>

                <p>
                  Report suspicious or harmful cyber activity.
                </p>

                <span>Report now →</span>
              </Link>

              {/* CHECK A URL */}
              <Link to="/url-check" className="action-card">
                <div className="action-icon orange">⌕</div>
                <h3>Check a URL</h3>

                <p>
                  Check whether a website looks suspicious.
                </p>

                <span>Check URL →</span>
              </Link>

              <Link to="/quizzes" className="action-card">
                <div className="action-icon green">✓</div>
                <h3>Take a Quiz</h3>

                <p>
                  Test your cybersecurity knowledge.
                </p>

                <span>Start quiz →</span>
              </Link>

              <Link to="/learning" className="action-card">
                <div className="action-icon purple">◈</div>
                <h3>Learn</h3>

                <p>
                  Explore cybersecurity awareness materials.
                </p>

                <span>Start learning →</span>
              </Link>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>RECENT ACTIVITY</span>
                <h2>Security activity</h2>
              </div>

              <Link to="/alerts">View all</Link>
            </div>

            <div className="activity-list">
              <div className="dashboard-activity">
                <div className="activity-status safe">✓</div>

                <div>
                  <strong>URL checked successfully</strong>
                  <small>example.com · Today</small>
                </div>

                <span className="activity-tag safe-tag">Safe</span>
              </div>

              <div className="dashboard-activity">
                <div className="activity-status report">!</div>

                <div>
                  <strong>Incident report submitted</strong>
                  <small>Suspicious message · Yesterday</small>
                </div>

                <span className="activity-tag review-tag">Review</span>
              </div>

              <div className="dashboard-activity">
                <div className="activity-status quiz">✓</div>

                <div>
                  <strong>Phishing awareness quiz</strong>
                  <small>Score: 80% · 2 days ago</small>
                </div>

                <span className="activity-tag score-tag">80%</span>
              </div>

              <div className="dashboard-activity">
                <div className="activity-status learning">◈</div>

                <div>
                  <strong>Completed learning module</strong>
                  <small>Password Security · 3 days ago</small>
                </div>

                <span className="activity-tag complete-tag">Done</span>
              </div>
            </div>
          </div>
        </section>

        {/* LEARNING PROGRESS */}
        <section className="learning-progress-panel">
          <div>
            <span className="dashboard-eyebrow">
              CONTINUE LEARNING
            </span>

            <h2>Build stronger cybersecurity habits.</h2>

            <p>
              Continue your learning journey and improve
              your ability to recognize, report and prevent
              digital threats.
            </p>

            <Link to="/learning" className="dashboard-primary-button">
              Continue Learning →
            </Link>
          </div>

          <div className="progress-circle">
            <strong>72%</strong>
            <span>Completed</span>
          </div>
        </section>

        {/* SECURITY TIP */}
        <section className="dashboard-alert">
          <div className="alert-symbol">!</div>

          <div>
            <span>SECURITY TIP</span>

            <h3>Never share your password or OTP.</h3>

            <p>
              CyberSafe will never ask you to reveal
              sensitive authentication information.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
