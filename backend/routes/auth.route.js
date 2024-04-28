import express from "express";
import {LoginController} from "../controllers/loginController.js";
import {SignupController} from "../controllers/signupController.js";

const router = express.Router();

router.post("/login", LoginController);
router.post("/signup", SignupController);

export default router;
