import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createToken from "../utils/jwt.js";

export const SignupController = async (req, res) => {
  const { fullName, email, password, confirm_password, gender, profilePic } =
    req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send("User already registered. Please login.");
    }
    if (password !== confirm_password) {
      res.status(422).send("password not matched");
    }

    const boypic = "https://avatar.iran.liara.run/public/boy";
    const girlpic = "https://avatar.iran.liara.run/public/girl";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boypic : girlpic,
    });

    const token = await createToken(newUser._id, res);

    res.status(201).send(token);
    console.log(token);
  } catch (error) {
    console.error("Error in SignupController:", error);
    res.status(500).send("Internal server error");
  }
};
