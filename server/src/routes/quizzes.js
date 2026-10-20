
import express from "express";
import jwt from "jsonwebtoken";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

// Cybersecurity quiz answer key (kept on the server).
const questions = [
  {
    question: "What should you do if you receive a suspicious email link?",
    answer: 2,
  },
  {
    question: "Which password is the strongest?",
    answer: 3,
  },
  {
    question: "What does phishing mean?",
    answer: 1,
  },
  {
    question: "What is two-factor authentication (2FA)?",
    answer: 2,
  },
  {
    question: "What should you do when using public Wi-Fi?",
    answer: 3,
  },
  {
    question: "Why are software updates important?",
    answer: 0,
  },
  {
    question: "What should you do if an account may have been hacked?",
    answer: 1,
  },
  {
    question: "Which information should you never share publicly?",
    answer: 2,
  },
  {
    question: "What is malware?",
    answer: 1,
  },
  {
    question: "How can you help protect your online accounts?",
    answer: 3,
  },
];

// Authenticate the user using a JWT.
function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required. Please log in again.",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      message: "Authentication configuration is missing or invalid.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      decoded.user?.id ||
      decoded.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "The authentication token has no user ID.",
      });
    }

    req.userId = String(userId);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or expired. Please log in again.",
    });
  }
}

// Submit a quiz attempt.
router.post("/submit", authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return res.status(400).json({
        message: "Please answer all 10 quiz questions.",
      });
    }

    const submittedQuestions = new Set();
    const checkedAnswers = [];

    for (const submitted of answers) {
      if (
        !submitted ||
        typeof submitted.question !== "string" ||
        !Number.isInteger(submitted.selectedAnswer) ||
        submitted.selectedAnswer < 0 ||
        submitted.selectedAnswer > 3
      ) {
        return res.status(400).json({
          message: "One or more submitted answers are invalid.",
        });
      }

      const correctQuestion = questions.find(
        (item) => item.question === submitted.question
      );

      if (
        !correctQuestion ||
        submittedQuestions.has(submitted.question)
      ) {
        return res.status(400).json({
          message: "Quiz questions are invalid or duplicated.",
        });
      }

      submittedQuestions.add(submitted.question);

      checkedAnswers.push({
        question: correctQuestion.question,
        selectedAnswer: submitted.selectedAnswer,
        correctAnswer: correctQuestion.answer,
        isCorrect:
          submitted.selectedAnswer === correctQuestion.answer,
      });
    }

    if (submittedQuestions.size !== questions.length) {
      return res.status(400).json({
        message: "Please submit an answer for every question.",
      });
    }

    const score = checkedAnswers.filter(
      (answer) => answer.isCorrect
    ).length;

    const totalQuestions = questions.length;
    const percentage = Math.round(
      (score / totalQuestions) * 100
    );

    const attempt = await QuizAttempt.create({
      userId: req.userId,
      quizTitle: "Cybersecurity Quiz",
      score,
      totalQuestions,
      percentage,
      answers: checkedAnswers,
    });

    return res.status(201).json({
      message: "Quiz submitted successfully.",
      score,
      totalQuestions,
      percentage,
      attempt,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);

    return res.status(500).json({
      message: "Unable to save your quiz attempt.",
    });
  }
});

// Retrieve only the logged-in user's quiz history.
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-answers")
      .lean();

    return res.status(200).json({ attempts });
  } catch (error) {
    console.error("Quiz history error:", error);

    return res.status(500).json({
      message: "Unable to load quiz history.",
    });
  }
});

export default router;