import jwt from "jsonwebtoken";

const createToken = async (userId) => {
  try {
    // Ensure that a proper secret key is always provided
    const secretKey = process.env.JWT_SECRET;
    
    // Generate JWT token with user ID and expiration time
    const token =  jwt.sign({ userId }, secretKey, {
      expiresIn: "1d",
    });

    // Return the generated token
    return token;
  } catch (error) {
    console.error("Error in createToken:", error);
    // Throw an error with a meaningful message
    throw new Error("Failed to create token: " + error.message);
  }
};

export default createToken;
