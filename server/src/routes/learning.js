
import express from "express";
import jwt from "jsonwebtoken";
import LearningProgress from "../models/LearningProgress.js";

const router = express.Router();

const validLessonIds = [1, 2, 3, 4, 5, 6];

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid user information in token.",
      });
    }

    req.userId = String(userId);
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired login token.",
    });
  }
}

// Get the logged-in student's progress
router.get("/progress", authenticateToken, async (req, res) => {
  try {
    const progress = await LearningProgress.findOne({
      userId: req.userId,
    });

    res.json({
      completedLessonIds: progress?.completedLessonIds ?? [],
    });
  } catch (error) {
    console.error("Learning progress error:", error);
    res.status(500).json({
      message: "Unable to load learning progress.",
    });
  }
});

// Mark a lesson as completed
router.put(
  "/progress/:lessonId",
  authenticateToken,
  async (req, res) => {
    try {
      const lessonId = Number(req.params.lessonId);

      if (!validLessonIds.includes(lessonId)) {
        return res.status(400).json({
          message: "Invalid lesson ID.",
        });
      }

      const progress = await LearningProgress.findOneAndUpdate(
        { userId: req.userId },
        {
          $addToSet: {
            completedLessonIds: lessonId,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      res.json({
        message: "Lesson marked as completed.",
        completedLessonIds: progress.completedLessonIds,
      });
    } catch (error) {
      console.error("Saving learning progress failed:", error);
      res.status(500).json({
        message: "Unable to save learning progress.",
      });
    }
  }
);

export default router;
