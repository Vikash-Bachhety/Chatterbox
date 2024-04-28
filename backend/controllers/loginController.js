import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createToken from "../utils/jwt.js";

export const LoginController = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send("User not registered. Please register.");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res.status(401).send("Incorrect password");
    }

    const token = await createToken(user._id, res);

    res.status(200).send(token);
    // console.log(token);

  } catch (error) {
    console.error("Error in LoginController:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
