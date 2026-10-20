import mongoose from "mongoose";

const urlScanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    result: {
      type: String,
      enum: ["Safe", "Suspicious", "Dangerous"],
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    reasons: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const UrlScan = mongoose.model("UrlScan", urlScanSchema);

export default UrlScan;