import jwt from "jsonwebtoken";

const protectedRoute = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;
  // console.log("Token:", token);

  try {
    if (!token) {
      return res.status(401).send("Authentication token not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    if (!decoded || !decoded.userId) {
      return res.status(401).send("Invalid token");
    }

    // Store the decoded userId in the request object for later use
    req.userId = decoded.userId;
    // console.log(req.userId);

    // Proceed to the next middleware
    next();

  } catch (error) {
    console.error("Error in protectedRoute:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send("Invalid token");
    }
    return res.status(500).send("Internal server error");
  }
};

export default protectedRoute;
