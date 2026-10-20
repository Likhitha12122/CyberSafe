import express from "express";
import { URL } from "url";

import UrlScan from "../models/UrlScan.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================================================
   URL ANALYSIS ENGINE
========================================================= */

function analyzeUrl(inputUrl) {

  const reasons = [];

  let score = 100;

  let parsedUrl;


  /* ---------------------------------------------------------
     BASIC URL VALIDATION
  --------------------------------------------------------- */

  try {

    parsedUrl = new URL(inputUrl);

  } catch (error) {

    return {
      result: "Dangerous",
      score: 0,
      reasons: [
        "The entered value is not a valid URL."
      ]
    };

  }


  /* ---------------------------------------------------------
     HTTP CHECK
  --------------------------------------------------------- */

  if (parsedUrl.protocol !== "https:") {

    score -= 20;

    reasons.push(
      "The website does not use HTTPS."
    );

  }


  /* ---------------------------------------------------------
     IP ADDRESS CHECK
  --------------------------------------------------------- */

  const hostname = parsedUrl.hostname;

  const ipPattern =
    /^(?:\d{1,3}\.){3}\d{1,3}$/;

  if (ipPattern.test(hostname)) {

    score -= 25;

    reasons.push(
      "The URL uses an IP address instead of a normal domain name."
    );

  }


  /* ---------------------------------------------------------
     SUSPICIOUS KEYWORDS
  --------------------------------------------------------- */

  const suspiciousKeywords = [
    "login",
    "verify",
    "verification",
    "password",
    "account",
    "secure",
    "update",
    "confirm",
    "bank",
    "payment",
    "wallet",
    "signin"
  ];


  const lowerUrl =
    inputUrl.toLowerCase();


  const matchedKeywords =
    suspiciousKeywords.filter(
      (keyword) =>
        lowerUrl.includes(keyword)
    );


  if (matchedKeywords.length >= 3) {

    score -= 25;

    reasons.push(
      "The URL contains several keywords commonly used in phishing pages."
    );

  } else if (matchedKeywords.length > 0) {

    score -= 10;

    reasons.push(
      "The URL contains security-sensitive keywords."
    );

  }


  /* ---------------------------------------------------------
     URL LENGTH
  --------------------------------------------------------- */

  if (inputUrl.length > 150) {

    score -= 15;

    reasons.push(
      "The URL is unusually long."
    );

  }


  /* ---------------------------------------------------------
     @ SYMBOL
  --------------------------------------------------------- */

  if (inputUrl.includes("@")) {

    score -= 25;

    reasons.push(
      "The URL contains an @ symbol, which can be used to disguise the destination."
    );

  }


  /* ---------------------------------------------------------
     MULTIPLE SUBDOMAINS
  --------------------------------------------------------- */

  const domainParts =
    hostname.split(".");

  if (domainParts.length >= 5) {

    score -= 15;

    reasons.push(
      "The domain contains an unusually large number of subdomains."
    );

  }


  /* ---------------------------------------------------------
     SUSPICIOUS EXTENSIONS
  --------------------------------------------------------- */

  const suspiciousExtensions = [
    ".exe",
    ".scr",
    ".bat",
    ".cmd",
    ".zip"
  ];


  const hasSuspiciousExtension =
    suspiciousExtensions.some(
      (extension) =>
        parsedUrl.pathname
          .toLowerCase()
          .endsWith(extension)
    );


  if (hasSuspiciousExtension) {

    score -= 30;

    reasons.push(
      "The URL points to a potentially dangerous file type."
    );

  }


  /* ---------------------------------------------------------
     FINAL SCORE
  --------------------------------------------------------- */

  score = Math.max(
    0,
    Math.min(100, score)
  );


  let result = "Safe";


  if (score < 50) {

    result = "Dangerous";

  } else if (score < 75) {

    result = "Suspicious";

  }


  if (reasons.length === 0) {

    reasons.push(
      "No obvious suspicious patterns were detected."
    );

  }


  return {
    result,
    score,
    reasons
  };

}


/* =========================================================
   SCAN URL
========================================================= */

router.post(
  "/scan",
  authMiddleware,
  async (req, res) => {

    try {

      const { url } = req.body;


      if (!url || !url.trim()) {

        return res.status(400).json({
          success: false,
          message: "Please enter a URL."
        });

      }


      const cleanUrl =
        url.trim();


      const analysis =
        analyzeUrl(cleanUrl);


      const scan =
        await UrlScan.create({

          userId: req.user.id,

          url: cleanUrl,

          result: analysis.result,

          score: analysis.score,

          reasons: analysis.reasons

        });


      return res.status(201).json({

        success: true,

        message: "URL scan completed.",

        scan

      });

    } catch (error) {

      console.error(
        "URL scan error:",
        error
      );


      return res.status(500).json({

        success: false,

        message: "Failed to scan URL."

      });

    }

  }
);


/* =========================================================
   GET MY SCAN HISTORY
========================================================= */

router.get(
  "/history",
  authMiddleware,
  async (req, res) => {

    try {

      const scans =
        await UrlScan.find({
          userId: req.user.id
        })
        .sort({
          createdAt: -1
        })
        .limit(20);


      return res.json({

        success: true,

        scans

      });

    } catch (error) {

      console.error(
        "URL history error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load URL scan history."

      });

    }

  }
);


export default router;