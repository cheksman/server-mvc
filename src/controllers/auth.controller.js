import userModel from "../models/user.model";
import { findUser, saveUser } from "../services/user.services";

import { newToken } from "./../utils/auth";

export const createUser = async (req, res, next) => {
  try {
    // destruture phoneNumber from the request body
    const { phoneNumber } = req.body;
    let user = null;

    // check if a user with the phoneNumber entered already exist
    user = await findUser(phoneNumber); //TODO: this returns null even when a number already exist

    if (user) {
      return res.status(403).json({
        message: `Forbiden, User ${phoneNumber} already exists`,
      });
    }
    // check if phoneNumber is 08064648720, then assign admin userRole to that user
    if (phoneNumber === "08064648720") {
      saveUser(req, res, next, ["admin"]);
    }

    // call the save user function
    saveUser(req, res, next, ["user"]);
  } catch (err) {
    return next({
      message: "Registration failed",
      error: err,
    });
  }
};

export const loginUser = async (req, res, next) => {
  // get the values entered by a user through req.body
  try {
    const { email, phoneNumber, password } = req.body;
    let user;
    // if email is true, check if the email exist in our db, else check with phoneNumber
    if (email) {
      user = await userModel.findOne({ email });
    } 
    else if (phoneNumber && phoneNumber.length > 9) {
      user = await userModel.findOne({
        phone: { $regex: phoneNumber, $options: "i" },
      });
    }
    // if no user is found return a 401 error with error message
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    // if a user is found, we check if password from db matches password entered by user
    if (user) {
      const match = await user.checkPassword(password);
      if (!match) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }

    if (user) {
    // if a user is found, generate a token for that user
      const token = newToken(user);

      // remove the user password from the returned user instance
      const { password: p, ...rest } = user.toObject();

      // return a 200 status code with the user data, role, message and token
      return res.status(200).json({
        message: "Login successful",
        token,
        data: rest,
        useRole: user.useRole, // why did we add this if the userRole is part of the user object being returned
      });
    }
  } catch (error) {
    return next({
      message: "Login failed",
      error: error,
    });
  }
};
