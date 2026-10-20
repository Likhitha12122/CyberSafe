
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answers: [
      {
        question: String,
        selectedAnswer: mongoose.Schema.Types.Mixed,
        correctAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);

export default QuizAttempt;