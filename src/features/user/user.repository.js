import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import bcrypt from "bcrypt";
// creating model from schema.
export const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async signUp(userData) {
    console.log(userData);
    try {
      // create instance of model.
      let newUser = new UserModel(userData);
      newUser = await newUser.save();
      const selectedUserDetails = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      };
      const resp = {
        success: true,
        res: selectedUserDetails,
      };
      return resp;
    } catch (err) {
      console.log(err);
      console.log(err.message);
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }

  async signIn(email, password) {
    try {
      console.log(email, password);
      const user = await UserModel.findOne({
        email: email,
      });
      if (!user) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "User Not Found",
          },
        };
        return resp;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Password is Incorrect!",
          },
        };
        return resp;
      }

      const selectedUserDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        // Add more fields as needed
      };

      const resp = {
        success: true,
        res: selectedUserDetails,
      };
      console.log(resp);
      return resp;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async addTokentoLoginTokens(email, token) {
    try {
      const user = await UserModel.findOne({ email: email });
      console.log(user);
      user.loginTokens.push(token);
      const savedUser = await user.save();
      console.log(savedUser.loginTokens);
      return;
    } catch (err) {
      throw new Error();
    }
  }

  async logOutfromAlldevices(id) {
    try {
      const user = await UserModel.findById(id);
      user.loginTokens = [];
      await user.save();
      return;
    } catch (err) {
      throw new Error();
    }
  }

  async getDetails(id) {
    try {
      const user = await UserModel.findById(id);
      if (user) {
        const selectedUserDetails = {
          _id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
        };
        const resp = {
          success: true,
          res: selectedUserDetails,
        };
        return resp;
      } else {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "User Not Found",
          },
        };
        return resp;
      }
    } catch (err) {
      throw new Error();
    }
  }

  async getAlldetails(id) {
    try {
      const allUsers = await UserModel.find();
      console.log(allUsers);
      const allUsersArray = [];
      for (let i of allUsers) {
        allUsersArray.push({
          _id: i._id,
          name: i.name,
          email: i.email,
          gender: i.gender,
        });
      }
      console.log(allUsersArray);
      const resp = {
        success: true,
        res: allUsersArray,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async updateDetails(id, userData) {
    console.log(userData);
    try {
      const password = await bcrypt.hash(userData.password, 12);
      const updatedData = { ...userData, password };

      const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      const selectedUserDetails = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender,
      };
      const resp = {
        success: true,
        res: selectedUserDetails,
      };
      return resp;
    } catch (err) {
      console.log(err);
      console.log(err.message);
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }
}
