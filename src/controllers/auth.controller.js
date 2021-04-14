import userModel from "../models/user.model";
import {
  findUser,
  saveUser,
  findUserByIdAndUpdateProfile,
} from "../services/user.services";
import { verifyOTP } from "../utils/twilioService";

import { newToken } from "./../utils/auth";

const twilio = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

export const createUser = async (req, res, next) => {
  try {
    // destruture phoneNumber from the request body
    const { phoneNumber, email } = req.body;
    let user = null;
    let userEmailExist;

    // check if a user with the phoneNumber entered already exist
    user = await findUser(phoneNumber); //TODO: this returns null even when a number already exist
    userEmailExist = await userModel.findOne({ email }).lean().exec();
    if (user) {
      return res.status(403).json({
        message: `Forbiden, User ${phoneNumber} already exists`,
      });
    }

    // check if email already exist
    if (userEmailExist) {
      return res.status(403).json({
        message: `Forbiden, ${email} already exists`,
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
    } else if (phoneNumber && phoneNumber.length > 9) {
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
    if (
      user.activationStatus === "pending" ||
      user.activationStatus === "declined"
    ) {
      return res.status(400).json({
        message: "This phone number has not been verified",
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

// for verifying a user's twilio token and activating his account
export const activateAccount = async (req, res, next) => {
  const { code, phoneNumber } = req.body;
  const updatedNumber = phoneNumber.replace(0, "+234");

  let verificationResult;

  try {
    // check if the number is saved in our db
    const user = await findUser(phoneNumber);

    // if no user return an error message
    if (!user) {
      return res.status(400).json({
        message: `No user with ${phoneNumber} found`,
      });
    }

    // call the twilio api to verify the token sent to the user
    verificationResult = await verifyOTP(code, updatedNumber);

    // if the status is approved, update our activationStatus field in User model to enable user login
    if (verificationResult.status === "approved") {
      const updated = await userModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            activationStatus: "activated",
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      // return message if everything works out
      if (updated !== null) {
        res.status(200).json({
          message: "Your account has been successfully activated",
        });
      }
    }
  } catch (e) {
    return next({
      message: "could not verify",
      error: e,
    });
  }
};
