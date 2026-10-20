
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Quiz.css";

const API_URL = "http://localhost:5000/api/quizzes";

const questions = [
  {
    question: "What should you do if you receive a suspicious email link?",
    options: [
      "Click it immediately",
      "Forward it to everyone",
      "Avoid clicking and verify the sender",
      "Enter your password on the linked website",
    ],
    answer: 2,
    explanation:
      "Always verify suspicious messages and avoid opening unexpected links.",
  },
  {
    question: "Which password is the strongest?",
    options: [
      "password123",
      "navya123",
      "12345678",
      "T!ger_River#82Cloud",
    ],
    answer: 3,
    explanation:
      "A long, unique password with a mix of characters is harder to guess.",
  },
  {
    question: "What does phishing mean?",
    options: [
      "Improving internet speed",
      "Tricking people into revealing sensitive information",
      "Updating computer software",
      "Creating a backup",
    ],
    answer: 1,
    explanation:
      "Phishing uses deceptive messages or websites to steal information.",
  },
  {
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two usernames",
      "Sharing a password with two people",
      "Using two different types of verification",
      "Logging in twice with the same password",
    ],
    answer: 2,
    explanation:
      "2FA adds another verification step beyond your password.",
  },
  {
    question: "What should you do when using public Wi-Fi?",
    options: [
      "Access every account without caution",
      "Share your passwords with the network owner",
      "Disable all security features",
      "Avoid sensitive activities on untrusted networks",
    ],
    answer: 3,
    explanation:
      "Untrusted public networks can expose your data. Use secure connections and be cautious.",
  },
  {
    question: "Why are software updates important?",
    options: [
      "They fix bugs and security vulnerabilities",
      "They reveal your passwords",
      "They disable every security feature",
      "They are only for changing wallpapers",
    ],
    answer: 0,
    explanation:
      "Updates often patch security weaknesses that attackers could exploit.",
  },
  {
    question: "What should you do if an account may have been hacked?",
    options: [
      "Ignore the warning",
      "Change the password using the official website and secure the account",
      "Post your password online",
      "Disable account protection",
    ],
    answer: 1,
    explanation:
      "Secure the account immediately, change compromised credentials, and enable 2FA.",
  },
  {
    question: "Which information should you never share publicly?",
    options: [
      "A general hobby",
      "A favourite movie",
      "Your password or one-time verification code",
      "A public event announcement",
    ],
    answer: 2,
    explanation:
      "Passwords and one-time codes can allow others to access your accounts.",
  },
  {
    question: "What is malware?",
    options: [
      "A type of computer hardware",
      "A malicious program designed to harm or misuse a device",
      "A secure password manager",
      "A software update",
    ],
    answer: 1,
    explanation:
      "Malware is software designed to disrupt, damage, spy on, or gain unauthorized access to systems.",
  },
  {
    question: "How can you help protect your online accounts?",
    options: [
      "Reuse the same password everywhere",
      "Turn off security notifications",
      "Share login details with friends",
      "Use unique passwords and enable 2FA",
    ],
    answer: 3,
    explanation:
      "Unique passwords and two-factor authentication reduce the risk of account compromise.",
  },
];

function Quiz() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const authConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Load previous quiz attempts without crashing the page.
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setHistory([]);
          setHistoryError("Please log in to view your quiz history.");
          setHistoryLoading(false);
        }
        return;
      }

      try {
        setHistoryLoading(true);
        setHistoryError("");

        const response = await axios.get(
          `${API_URL}/history`,
          authConfig()
        );

        if (!cancelled) {
          setHistory(
            Array.isArray(response.data?.attempts)
              ? response.data.attempts
              : []
          );
        }
      } catch (err) {
        console.error("Quiz history error:", err);

        if (!cancelled) {
          if (err.response?.status === 401) {
            setHistoryError(
              "Your login session is invalid or expired. Please log in again."
            );
          } else {
            setHistoryError(
              err.response?.data?.message ||
                "Could not load quiz history. You can still take the quiz."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectAnswer = (optionIndex) => {
    if (submitted || saving) return;

    setAnswers((previous) => ({
      ...previous,
      [current]: optionIndex,
    }));
  };

  const calculateScore = () =>
    questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

  const handleSubmit = async () => {
    setError("");

    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer every question before submitting.");
      return;
    }

    const finalScore = calculateScore();
    setSaving(true);

    try {
      const response = await axios.post(
        `${API_URL}/submit`,
        {
          answers: questions.map((question, index) => ({
            question: question.question,
            selectedAnswer: answers[index],
          })),
        },
        authConfig()
      );

      const savedScore =
        typeof response.data?.score === "number"
          ? response.data.score
          : finalScore;

      setScore(savedScore);
      setSubmitted(true);

      // Refresh history after a successful submission.
      try {
        const historyResponse = await axios.get(
          `${API_URL}/history`,
          authConfig()
        );

        setHistory(
          Array.isArray(historyResponse.data?.attempts)
            ? historyResponse.data.attempts
            : []
        );
        setHistoryError("");
      } catch (historyErr) {
        console.error("Could not refresh quiz history:", historyErr);
        setHistoryError("Your quiz was submitted, but history could not refresh.");
      }
    } catch (err) {
      console.error("Quiz submission error:", err);

      if (err.response?.status === 401) {
        setError("Your login session is invalid or expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Could not save your quiz. Check that the backend is running."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setError("");
  };

  const percentage =
    score === null
      ? 0
      : Math.round((score / questions.length) * 100);

  const question = questions[current];

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <div>
          <h1>CyberSafe</h1>
          <p>Student Cybersecurity Awareness Portal</p>
        </div>

        <Link to="/dashboard" className="quiz-back">
          ← Dashboard
        </Link>
      </header>

      <main className="quiz-container">
        <section className="quiz-intro">
          <span className="quiz-shield">🛡️</span>
          <h2>Cybersecurity Quiz</h2>
          <p>
            Test your knowledge of online safety, phishing,
            passwords, and cybersecurity.
          </p>
        </section>

        {!submitted ? (
          <section className="quiz-card">
            <div className="quiz-progress-heading">
              <span>
                Question {current + 1} of {questions.length}
              </span>
              <span>
                {Object.keys(answers).length}/{questions.length} answered
              </span>
            </div>

            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-valuenow={current + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
            >
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h3 className="quiz-question">{question.question}</h3>

            <div className="quiz-options">
              {question.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`quiz-option ${
                    answers[current] === index ? "selected" : ""
                  }`}
                  onClick={() => selectAnswer(index)}
                  aria-pressed={answers[current] === index}
                >
                  <span className="quiz-option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="quiz-error" role="alert">
                <p>{error}</p>
                {error.toLowerCase().includes("log in") && (
                  <button
                    type="button"
                    className="quiz-secondary"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            )}

            <div className="quiz-navigation">
              <button
                type="button"
                className="quiz-secondary"
                onClick={() =>
                  setCurrent((value) => Math.max(0, value - 1))
                }
                disabled={current === 0 || saving}
              >
                Previous
              </button>

              {current < questions.length - 1 ? (
                <button
                  type="button"
                  className="quiz-primary"
                  onClick={() =>
                    setCurrent((value) =>
                      Math.min(questions.length - 1, value + 1)
                    )
                  }
                  disabled={saving}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className="quiz-primary"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="quiz-card quiz-results">
            <div className="quiz-result-icon">
              {percentage >= 70 ? "🎉" : "📚"}
            </div>

            <h2>Quiz Completed!</h2>

            <div className="quiz-score-circle">
              <strong>{percentage}%</strong>
              <span>Your Score</span>
            </div>

            <p className="quiz-score-text">
              You answered {score} out of {questions.length} questions
              correctly.
            </p>

            <div className="quiz-review">
              <h3>Review Your Answers</h3>

              {questions.map((item, index) => {
                const correct = answers[index] === item.answer;

                return (
                  <article
                    className="quiz-review-item"
                    key={item.question}
                  >
                    <h4>
                      {index + 1}. {item.question}
                    </h4>

                    <p className={correct ? "answer-correct" : "answer-wrong"}>
                      {correct ? "✓ Correct" : "✗ Incorrect"}
                    </p>

                    <p>
                      <strong>Correct answer:</strong>{" "}
                      {item.options[item.answer]}
                    </p>

                    <p className="quiz-explanation">
                      {item.explanation}
                    </p>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              className="quiz-primary quiz-restart"
              onClick={restartQuiz}
            >
              Try Again
            </button>
          </section>
        )}

        <section className="quiz-history">
          <h3>Previous Quiz Attempts</h3>

          {historyLoading ? (
            <p className="quiz-muted">Loading quiz history...</p>
          ) : historyError ? (
            <div>
              <p className="quiz-muted" role="alert">
                {historyError}
              </p>
              {historyError.toLowerCase().includes("log in") && (
                <button
                  type="button"
                  className="quiz-secondary"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>
              )}
            </div>
          ) : history.length === 0 ? (
            <p className="quiz-muted">No previous attempts found.</p>
          ) : (
            <div className="quiz-history-list">
              {history.map((attempt, index) => (
                <article
                  className="quiz-history-item"
                  key={attempt._id || attempt.id || index}
                >
                  <div>
                    <strong>
                      {attempt.quizTitle || "Cybersecurity Quiz"}
                    </strong>
                    <p>
                      {attempt.createdAt
                        ? new Date(attempt.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span className="quiz-history-score">
                    {attempt.score ?? 0}/
                    {attempt.totalQuestions ?? attempt.total ?? questions.length}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Quiz;
