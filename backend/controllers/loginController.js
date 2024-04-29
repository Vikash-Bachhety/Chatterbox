import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createToken from "../utils/jwt.js";

export const LoginController = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send(error, "User not registered. Please register.");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).send(error, "Incorrect password");
    }

    const token = await createToken(user._id, res);

    return res.status(200).send(token);

  } catch (error) {
    console.error("Error in LoginController:", error);
    return res.status(500).send(error, "Internal server error");
  }
};
