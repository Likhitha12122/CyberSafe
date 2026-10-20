import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Phishing",
        "Suspicious Link",
        "Cyberbullying",
        "Account Hacking",
        "Malware",
        "Other"
      ]
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical"
      ],
      default: "Medium"
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Resolved"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Incident = mongoose.model(
  "Incident",
  incidentSchema
);

export default Incident;