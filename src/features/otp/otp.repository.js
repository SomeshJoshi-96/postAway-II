import mongoose from "mongoose";
import { otpSchema } from "./otp.schema.js";
import nodemailer from "nodemailer";
import { userSchema } from "../user/user.schema.js";
import bcrypt from "bcrypt";
import { UserModel } from "../user/user.repository.js";
export const OtpModel = mongoose.model("Otp", otpSchema);

export default class OtpRepository {
  generateRandomSixDigitNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
  }

  generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }

  async sendOtp(email) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Unregistered email!",
          },
        };
        return resp;
      }
      const OTP = this.generateRandomSixDigitNumber();
      console.log(OTP);
      const mailOptions = {
        from: "joshi.somesh1996@gmail.com",
        to: email,
        subject: "OTP for password reset",
        text: OTP.toString(),
      };
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "joshi.somesh1996@gmail.com",
          pass: "gahd uuvn jztn igqt",
        },
      });
      const ifOtpalreadySent = await OtpModel.findOne({ email: email });
      if (ifOtpalreadySent) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Already sent OTP to the email!",
          },
        };
        return resp;
      }
      const otpdetails = {
        email: email,
        otp: OTP,
        verified: false,
      };

      let newOTP = new OtpModel(otpdetails);
      newOTP = await newOTP.save();
      const result = await transporter.sendMail(mailOptions);
      console.log(result);

      const resp = {
        success: true,
        res: newOTP,
      };
      return resp;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        // Handle validation errors
        const firstError = Object.values(err.errors)[0];
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: firstError.message,
          },
        };
        return resp;
      }
      throw new Error();
    }
  }

  async verifyOtp(otp, email) {
    try {
      const ifOtpPresent = await OtpModel.findOneAndDelete({
        otp: otp,
        email: email,
      });
      if (ifOtpPresent) {
        const user = await UserModel.findOne({ email: email });
        const newPassword = this.generateRandomString(10);
        user.password = await bcrypt.hash(newPassword, 12);
        const updatedUser = await user.save();
        const mailOptions = {
          from: "joshi.somesh1996@gmail.com",
          to: email,
          subject: "OTP for password reset",
          text: newPassword,
        };
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "joshi.somesh1996@gmail.com",
            pass: "gahd uuvn jztn igqt",
          },
        });
        const result = await transporter.sendMail(mailOptions);
        const resp = {
          success: true,
          res: ifOtpPresent,
          updatedPassword: newPassword,
        };
        return resp;
      } else {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Incorrect Email or Otp!",
          },
        };
        return resp;
      }
    } catch (err) {
      throw new Error();
    }
  }
}
