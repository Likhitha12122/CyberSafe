import express from "express";

import Incident from "../models/Incident.js";

import authMiddleware
  from "../middleware/authMiddleware.js";

const router = express.Router();


/*
  ======================================
  CREATE INCIDENT
  POST /api/incidents
  ======================================
*/

router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        title,
        type,
        description,
        severity
      } = req.body;


      // Validate required fields

      if (
        !title ||
        !type ||
        !description
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please fill all required fields"
        });

      }


      // Create incident

      const incident =
        await Incident.create({

          userId: req.user.id,

          title,

          type,

          description,

          severity:
            severity || "Medium"

        });


      res.status(201).json({

        success: true,

        message:
          "Incident reported successfully",

        incident

      });


    } catch (error) {

      console.error(
        "Create incident error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to create incident"

      });

    }

  }
);


/*
  ======================================
  GET MY INCIDENTS
  GET /api/incidents/my
  ======================================
*/

router.get(
  "/my",
  authMiddleware,
  async (req, res) => {

    try {

      const incidents =
        await Incident.find({

          userId: req.user.id

        }).sort({

          createdAt: -1

        });


      res.json({

        success: true,

        incidents

      });


    } catch (error) {

      console.error(
        "Get incidents error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch incidents"

      });

    }

  }
);


export default router;