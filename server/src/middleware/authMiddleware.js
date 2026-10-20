import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    // Get Authorization header
    const authHeader =
      req.headers.authorization;

    // Check if token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Extract token
    const token =
      authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;