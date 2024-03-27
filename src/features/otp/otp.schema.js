import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },

  otp: {
    type: Number,
    required: true,
  },
});
