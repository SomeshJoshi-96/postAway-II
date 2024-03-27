import express from "express";
import OtpController from "./otp.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

// 2. Initialize Express router.
const otpRouter = express.Router();

const otpController = new OtpController();

// All the paths to controller methods.
otpRouter.get("/send", (req, res, next) => {
  console.log("In send otp");
  otpController.sendOtp(req, res, next);
});

otpRouter.post("/verify", (req, res, next) => {
  console.log("In verify otp");
  otpController.verifyOtp(req, res, next);
});

export default otpRouter;
