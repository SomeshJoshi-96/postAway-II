import { customErrorHandler } from "../middlewares/errorHandler.js";
import OtpRepository from "./otp.repository.js";
export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  async sendOtp(req, res, next) {
    try {
      const email = req.body.email;
      console.log(email);
      if (!email) {
        throw new customErrorHandler(400, "Email can't be empty");
      }
      const resp = await this.otpRepository.sendOtp(email);
      console.log(resp);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "OTP sent successfully!",
          res: resp.res,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }
  async verifyOtp(req, res, next) {
    try {
      const { otp, email } = req.body;
      const resp = await this.otpRepository.verifyOtp(otp, email);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "OTP verified successfully!",
          res: resp.res,
          updatedPassword: resp.updatedPassword,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }
}
