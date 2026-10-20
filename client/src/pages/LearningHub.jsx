
import { useEffect, useMemo, useState } from "react";
import "./LearningHub.css";

const lessons = [
  {
    id: 1,
    title: "Understanding Phishing",
    category: "Email Security",
    level: "Beginner",
    icon: "🎣",
    duration: "5 min",
    description: "Learn how to identify fake emails, messages, and websites.",
    content: [
      {
        heading: "What is phishing?",
        text: "Phishing is an attempt to trick people into revealing passwords, financial information, or other sensitive data through deceptive messages or websites.",
      },
      {
        heading: "Warning signs",
        text: "Look for unexpected attachments, urgent demands, suspicious links, unusual sender addresses, and requests for confidential information.",
      },
      {
        heading: "How to stay safe",
        text: "Verify the sender through a separate trusted channel. Avoid clicking unexpected links. Visit the official website directly and report suspicious messages to your institution.",
      },
    ],
  },
  {
    id: 2,
    title: "Strong Passwords",
    category: "Password Safety",
    level: "Beginner",
    icon: "🔐",
    duration: "4 min",
    description: "Protect your accounts with strong, unique passwords.",
    content: [
      {
        heading: "Why passwords matter",
        text: "A weak or reused password can put several accounts at risk if one service is compromised.",
      },
      {
        heading: "Create stronger passwords",
        text: "Use long, unique passwords or passphrases. A reputable password manager can help you create and store them securely.",
      },
      {
        heading: "Extra protection",
        text: "Enable multifactor authentication whenever possible. Never share verification codes, and change a password promptly if you suspect it has been exposed.",
      },
    ],
  },
  {
    id: 3,
    title: "Social Engineering",
    category: "Online Threats",
    level: "Intermediate",
    icon: "🎭",
    duration: "6 min",
    description: "Recognize manipulation used to steal information.",
    content: [
      {
        heading: "What is social engineering?",
        text: "Social engineering uses deception, pressure, trust, or impersonation to persuade someone to reveal information or take an unsafe action.",
      },
      {
        heading: "Common tactics",
        text: "Attackers may pretend to be technical support, a teacher, a bank employee, or someone in authority. They may create urgency or promise rewards.",
      },
      {
        heading: "Protect yourself",
        text: "Pause before acting. Independently verify unusual requests, especially those involving money, account access, passwords, or confidential information.",
      },
    ],
  },
  {
    id: 4,
    title: "Malware Awareness",
    category: "Online Threats",
    level: "Intermediate",
    icon: "🦠",
    duration: "7 min",
    description: "Understand viruses, spyware, ransomware, and safer downloads.",
    content: [
      {
        heading: "What is malware?",
        text: "Malware is software designed to perform harmful or unauthorized actions. Examples include spyware, viruses, and ransomware.",
      },
      {
        heading: "How infections happen",
        text: "Risks include untrusted downloads, malicious attachments, compromised websites, and outdated software.",
      },
      {
        heading: "Reduce your risk",
        text: "Install updates, use reputable security software, download apps from trusted sources, and keep backups of important files.",
      },
    ],
  },
  {
    id: 5,
    title: "Safe Browsing",
    category: "Web Security",
    level: "Beginner",
    icon: "🌐",
    duration: "4 min",
    description: "Browse safely and identify suspicious websites.",
    content: [
      {
        heading: "Check website addresses",
        text: "Read the domain carefully. Look for misspellings, unexpected subdomains, and misleading names.",
      },
      {
        heading: "Understand HTTPS",
        text: "HTTPS encrypts the connection, but it does not prove that a website is honest or safe.",
      },
      {
        heading: "Browse responsibly",
        text: "Avoid unknown downloads, review website permissions, and enter sensitive information only on the intended, verified service.",
      },
    ],
  },
  {
    id: 6,
    title: "Public Wi-Fi Safety",
    category: "Web Security",
    level: "Intermediate",
    icon: "📶",
    duration: "5 min",
    description: "Reduce risks when connecting to public wireless networks.",
    content: [
      {
        heading: "Know the risks",
        text: "An untrusted network can expose you to deceptive hotspots and other attacks.",
      },
      {
        heading: "Before connecting",
        text: "Confirm the network name with the venue. Disable automatic connections to unknown networks and keep your device updated.",
      },
      {
        heading: "Stay protected",
        text: "Prefer trusted connections for sensitive activity. A reputable VPN can help protect network traffic, but it does not make every website safe.",
      },
    ],
  },
];

const categories = [
  "All Topics",
  ...new Set(lessons.map((lesson) => lesson.category)),
];

export default function LearningHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Topics");
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cybersafeCompletedLessons") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [progressLoaded, setProgressLoaded] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [progressError, setProgressError] = useState("");

  // Load saved progress from the backend.
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setProgressError("Please log in to save your learning progress.");
          setProgressLoaded(true);
        }
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/learning/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load learning progress."
          );
        }

        if (cancelled) return;

        const savedIds = Array.isArray(data.completedLessonIds)
          ? data.completedLessonIds
          : [];

        setCompleted(savedIds);

        localStorage.setItem(
          "cybersafeCompletedLessons",
          JSON.stringify(savedIds)
        );
      } catch (error) {
        if (!cancelled) {
          setProgressError(error.message || "Could not load progress.");
        }
      } finally {
        if (!cancelled) {
          setProgressLoaded(true);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLessons = useMemo(() => {
    const term = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesCategory =
        category === "All Topics" || lesson.category === category;

      const matchesSearch =
        !term ||
        lesson.title.toLowerCase().includes(term) ||
        lesson.description.toLowerCase().includes(term) ||
        lesson.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  async function markCompleted(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      setProgressError("Please log in to save your progress.");
      return;
    }

    if (savingLesson) return;

    setSavingLesson(true);
    setProgressError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/progress/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save progress.");
      }

      const savedIds = Array.isArray(data.completedLessonIds)
        ? data.completedLessonIds
        : [...new Set([...completed, id])];

      setCompleted(savedIds);

      localStorage.setItem(
        "cybersafeCompletedLessons",
        JSON.stringify(savedIds)
      );

      setSelectedLesson(null);
    } catch (error) {
      setProgressError(error.message || "Could not save progress.");
    } finally {
      setSavingLesson(false);
    }
  }

  const progress = Math.round(
    (completed.length / lessons.length) * 100
  );

  return (
    <main className="learning-page">
      {!progressLoaded && (
        <p>Loading your saved learning progress...</p>
      )}

      {progressError && (
        <p role="alert" className="learning-error">
          {progressError}
        </p>
      )}

      <section className="learning-hero">
        <span className="learning-label">
          CYBERSAFE LEARNING CENTRE
        </span>

        <h1>Build your cyber confidence.</h1>

        <p>
          Explore practical lessons, recognize online threats, and
          develop safer digital habits.
        </p>

        <div className="learning-progress">
          <div className="progress-copy">
            <span>Your learning progress</span>
            <strong>
              {completed.length} of {lessons.length} completed
            </strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Learning progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="progress-percent">
            {progress}% complete
          </span>
        </div>
      </section>

      <section className="learning-controls">
        <input
          type="search"
          placeholder="Search cybersecurity lessons..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search lessons"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter lessons by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <section className="lesson-section">
        <div className="lesson-heading">
          <div>
            <h2>Explore lessons</h2>
            <p>Choose a topic to start learning.</p>
          </div>

          <span>{filteredLessons.length} lessons</span>
        </div>

        <div className="lesson-grid">
          {filteredLessons.map((lesson) => {
            const isCompleted = completed.includes(lesson.id);

            return (
              <article className="lesson-card" key={lesson.id}>
                <div className="lesson-card-top">
                  <span className="lesson-icon">{lesson.icon}</span>

                  {isCompleted && (
                    <span className="completed-badge">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <span className="lesson-category">
                  {lesson.category}
                </span>

                <h3>{lesson.title}</h3>

                <p className="lesson-description">
                  {lesson.description}
                </p>

                <div className="lesson-meta">
                  <span>{lesson.level}</span>
                  <span>⏱ {lesson.duration}</span>
                </div>

                <button
                  className="lesson-button"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {isCompleted ? "Review Lesson" : "Start Learning"} →
                </button>
              </article>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="no-lessons">
            <h3>No lessons found</h3>
            <p>
              Try another search term or choose a different category.
            </p>
          </div>
        )}
      </section>

      {selectedLesson && (
        <div
          className="lesson-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLesson(null);
            }
          }}
        >
          <section
            className="lesson-reader"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-title"
          >
            <button
              className="reader-close"
              onClick={() => setSelectedLesson(null)}
              aria-label="Close lesson"
            >
              ×
            </button>

            <span className="reader-icon">
              {selectedLesson.icon}
            </span>

            <span className="lesson-category">
              {selectedLesson.category}
            </span>

            <h2 id="reader-title">{selectedLesson.title}</h2>

            <p className="reader-intro">
              {selectedLesson.description}
            </p>

            {selectedLesson.content.map((section, index) => (
              <article
                className="reader-section"
                key={section.heading}
              >
                <h3>
                  {index + 1}. {section.heading}
                </h3>
                <p>{section.text}</p>
              </article>
            ))}

            <button
              className="lesson-button reader-complete"
              onClick={() => markCompleted(selectedLesson.id)}
              disabled={savingLesson || !progressLoaded}
            >
              {savingLesson
                ? "Saving..."
                : completed.includes(selectedLesson.id)
                  ? "Completed ✓"
                  : "Mark as Completed ✓"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
