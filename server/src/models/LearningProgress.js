
import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    completedLessonIds: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "LearningProgress",
  learningProgressSchema
);
