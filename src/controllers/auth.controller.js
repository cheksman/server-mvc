import userModel from "../models/user.model";

import { newToken } from "./../utils/auth";

export const createUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      phoneNumber,
      password,
      firstName,
      lastName,
    } = req.body;
    let user = null;
    user = await userModel.findOne({ phoneNumber }).lean().exec();
    if (user) {
      return res.status(403).json({
        message: `${phoneNumber} already exists`,
      });
    }
    user = await userModel.findOne({ email }).lean().exec();
    if (user) {
      return res.status(403).json({
        message: `${email} already exists`,
      });
    }
    const newUser = await userModel.create({
      email,
      phone: phoneNumber,
      password,
      fname: firstName,
      lname: lastName,
    });
    if (newUser) {
      const token = newToken(newUser);
      const val = newUser.toObject();
      if (val) {
        const { password: p, ...rest } = val;
        return res.status(201).json({
          message: "Created  successfully",
          token,
          data: {
            ...rest,
          },
        });
      }
    }
  } catch (err) {
    return next({
      message: "Registration failed",
      error: err,
    });
  }
};

export const loginUser = async (
  req,
  res,
  next
) => {
  try {
    const { email, phone, password } = req.body;
    let user;
    if (email) {
      user = await userModel.findOne({ email });
    } else if (phone && phone.length > 9) {
      user = await userModel.findOne({
        phone: { $regex: phone, $options: "i" },
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
      });
    }
  } catch (error) {
    return next({
      message: "Login failed",
      error: error,
    });
  }
};