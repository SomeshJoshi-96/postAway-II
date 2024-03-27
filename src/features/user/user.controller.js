import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      let { password } = req.body;
      password = await bcrypt.hash(password, 12);
      const resp = await this.userRepository.signUp({ ...req.body, password });
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "user signup successful",
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

  async signIn(req, res, next) {
    try {
      // 1. Find user by email.
      let password = req.body.password;
      const resp = await this.userRepository.signIn(req.body.email, password);
      if (!resp.success) {
        console.log(resp);
        return res.status(resp.error.statusCode).send(resp.error.msg);
      } else {
        console.log(resp);
        const token = jwt.sign(
          {
            userID: resp.res._id,
            email: resp.res.email,
          },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );
        //Adding token to the user field
        await this.userRepository.addTokentoLoginTokens(req.body.email, token);
        res.cookie("jwtToken", token, {
          httpOnly: true,
        });

        return res.status(200).json({
          success: true,
          msg: "user signin successful",
          res: resp.res,
          token: token,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  logOut = function (req, res, next) {
    try {
      res
        .clearCookie("jwtToken")
        .json({ success: true, msg: "logout successful" });
    } catch (err) {
      next(err);
    }
  };

  async logOutfromAlldevices(req, res, next) {
    try {
      const id = req._id;
      if (!id) {
        res.status(400).json({ success: false, msg: "Please SignIn first!" });
      }
      await this.userRepository.logOutfromAlldevices(id);
      res
        .clearCookie("jwtToken")
        .json({ success: true, msg: "Logged Out from all devices" });
    } catch (err) {
      next(err);
    }
  }

  async getDetails(req, res, next) {
    try {
      const id = req.params.id;
      console.log(id);
      const resp = await this.userRepository.getDetails(id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "User details fetched successfully",
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

  async getAlldetails(req, res, next) {
    try {
      const resp = await this.userRepository.getAlldetails();
      res.status(201).json({
        success: true,
        msg: "User details fetched successfully",
        res: resp.res,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDetails(req, res, next) {
    try {
      const userData = req.body;
      const id = req.params.id;

      if (id != req._id) {
        throw new customErrorHandler(400, "Unauthorised Action!");
      }

      // if (req.body.password) {
      //   throw new customErrorHandler(
      //     400,
      //     "Password change requires otp route!"
      //   );
      // }
      
      console.log(id, userData);
      const resp = await this.userRepository.updateDetails(id, userData);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "User details updated",
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
}
