import userModel from "../models/user.model";
import { findUser, saveUser } from "../services/user.services";

import { newToken } from "./../utils/auth";

export const createUser = async (req, res, next) => {
  try {
    const { email = "", phoneNumber } = req.body;
    let user = null;

    user = await findUser(phoneNumber);
    if (user) {
      return res.status(403).json({
        message: `Forbiden, User ${phoneNumber} already exists`,
      });
    }
    if (email === "info@tractrac.co" || email === "tractracnigeria@gmail.com") {
      saveUser(req, res, next, ["admin"]);
    }
    saveUser(req, res, next, ["user"]);
  } catch (err) {
    return next({
      message: "Registration failed",
      error: err,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;
    let user;
    if (email) {
      user = await userModel.findOne({ email });
    } else if (phoneNumber && phoneNumber.length > 9) {
      user = await userModel.findOne({
        phone: { $regex: phoneNumber, $options: "i" },
      });
    }
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    if (user) {
      const match = await user.checkPassword(password);
      if (!match) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }

    if (user) {
      const token = newToken(user);
      const { password: p, ...rest } = user.toObject();
      return res.status(200).json({
        message: "Login successful",
        token,
        data: rest,
        useRole: user.useRole,
      });
    }
  } catch (error) {
    return next({
      message: "Login failed",
      error: error,
    });
  }
};
