import userModel from "../models/user.model";
import agentProgrammeModel from "../models/agent-programme.model";
import excelToJson from "convert-excel-to-json";
import { uploadFile } from "../utils/uploader";
import { isUserAdmin } from "../utils/helpers";
import {
  findUserByIdAndUpdate,
  findUser,
  findUserById,
  findUserByIdAndUpdateProfile,
} from "../services/user.services";
import fs from "fs";
import bcrypt from "bcryptjs";
import * as Sentry from "@sentry/node";
import { sendMail } from "../services/mail.services";
import { verifyOTP } from "../utils/twilioService";
import { hashPassword } from "../utils/hashPassword";

const twilio = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

export const getAllUsers = async (req, res, next) => {
  const { userRole } = req.userData;
  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await userModel
      .find(
        {},
        {
          _id: 1,
          fname: 1,
          lname: 1,
          phone: 1,
          email: 1,
          gender: 1,
          userRole: 1,
          activationStatus: 1,
          pixURL: 1,
        }
      )
      .sort({ _id: -1 })
      .lean()
      .exec();
    if (!users) {
      return res.status(404).json({
        message: "There are no users",
      });
    }
    res.status(201).json({
      message: "successful",
      data: users,
    });
  } catch (error) {
    return next({
      message: "Error getting users, please try again later",
      error: error,
    });
  }
};

export const getPagedUsers = async (req, res, next) => {
  const { userRole } = req.userData;
  const { pageNumber, limit } = req.params;
  const lim = Number(limit);
  let skippedDocuments = (Number(pageNumber) - 1) * lim;

  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await userModel
      .find(
        {},
        {
          _id: 1,
          fname: 1,
          lname: 1,
          phone: 1,
          email: 1,
          gender: 1,
          userRole: 1,
          activationStatus: 1,
          pixURL: 1,
        }
      )
      .skip(skippedDocuments)
      .limit(lim)
      .lean()
      .exec();
    if (!users) {
      return res.status(404).json({
        message: "There are no users",
      });
    }
    res.status(201).json({
      message: "successful",
      data: users,
    });
  } catch (error) {
    return next({
      message: "Error getting users, please try again later",
      error: error,
    });
  }
};

export const createStudentAgent = async (req, res, next) => {
  const { values } = req.body;
  const { userId } = req.userData;
  const {
    school,
    course,
    email,
    category,
    gradYear,
    dateOfBirth,
    identityType,
  } = JSON.parse(values);
  const identificationPic = req.files.idPic;
  const profilePic = req.files.profilePic;
  try {
    const idPicResponse = await uploadFile(identificationPic, "auto", "ids");
    const profilePicResponse = await uploadFile(profilePic, "auto", "profiles");
    const newAgent = await agentProgrammeModel.create({
      school: school,
      category: category,
      user: userId,
      email: email,
      course: course,
      gradYear: gradYear,
      dateOfBirth: dateOfBirth,
      identityType: identityType,
      identificationPic: idPicResponse.secure_url,
      profilePic: profilePicResponse.secure_url,
    });
    if (!newAgent) {
      return res.status(500).json({
        message: "Could not create student agent",
      });
    }
    return res.status(200).json({
      message: "Student agent created",
    });
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: error,
    });
  }
};

// export const addTractorOwner = async (req, res, next) => {
//   const { userId, userRole } = req.userData;
//   try {
//     if (userRole === "student") {
//     }
//   } catch (error) {}
// };

export const updateUserRole = async (req, res, next) => {
  const { userRole } = req.userData;
  const { userId } = req.params;
  const { newRoles } = req.body;
  try {
    if (isUserAdmin(userRole)) {
      const usersDetails = await findUserById(userId);
      const userNewData = await findUserByIdAndUpdate(
        userId,
        usersDetails.userRole,
        newRoles,
        res,
        next
      );

      if (!userNewData) {
        return res.status(500).json({ message: "Could not update user role" });
      }
      return res.status(201).json({
        message: "User role updated",
        data: userNewData,
      });
    }

    return res.status(401).json({
      message: "Only admins can update user roles",
    });
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: error,
    });
  }
};

export const getSingleUser = async (req, res, next) => {
  const { userId } = req.userData;
  try {
    const user = await findUserById(userId);
    if (!user) {
      return user.status(404).json({
        message: "user not found",
      });
    }
    return res.status(201).json({
      message: "successful",
      data: user,
    });
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: error,
    });
  }
};

export const uploadBulkUsersFromExcel = (req, res, next) => {
  const { userRole } = req.userData;
  if (!isUserAdmin(userRole)) {
    return res
      .status(403)
      .json({ message: "Only Admins can upload Bulk Users" });
  }
  const excelFile = req.files.file;
  excelFile.mv(`${__dirname}-${excelFile.name}`, async (err) => {
    if (err) {
      return next({
        message: "Generating Details from excel failed",
        error: err,
      });
    }
    try {
      const result = await excelToJson({
        source: fs.readFileSync(`${__dirname}-${excelFile.name}`),
        header: {
          rows: 1,
        },
        sheets: ["Sheet1"],
        columnToKey: {
          A: "fname",
          B: "lname",
          C: "phone",
          D: "email",
          E: "gender",
        },
      });
      fs.unlinkSync(`${__dirname}-${excelFile.name}`);
      const { Sheet1: sheet } = result;
      Promise.allSettled(
        sheet.map(
          ({ fname = "", lname = "", phone, email, gender }) =>
            new Promise(async (resolve, reject) => {
              const password = phone;
              let hashPassword;
              bcrypt.hash(password, 9, (err, hash) => {
                if (err) {
                  Sentry.captureException(err);
                }
                hashPassword = hash;
              });
              try {
                if (phone) {
                  const createdUser = await userModel.findOneAndUpdate(
                    { phone },
                    {
                      $set: {
                        ...(fname && { fname }),
                        ...(lname && { lname }),
                        ...(gender && { gender }),
                        password: hashPassword,
                        userRole: ["farmer", "user"],
                      },
                    },
                    {
                      new: true,
                      upsert: true,
                      rawResult: true,
                      lean: true,
                    }
                  );
                  if (createdUser) {
                    if (email && !createdUser.lastErrorObject.updatedExisting) {
                      await sendMail(
                        email,
                        {
                          name: "TracTrac MSL",
                          email: "info@tractrac.co",
                        },
                        fname,
                        lname
                      );
                      return res
                        .status(201)
                        .json({ message: "Created successfully" });
                    }
                  } else {
                    return reject("User not valid");
                  }
                }

                return res
                  .status(404)
                  .json({ message: "User phone not found" });
              } catch (error) {
                return reject(error.message);
              }
            })
        )
      ).then((results) => {
        const savedUsers = results.reduce((acc, curr) => {
          if (curr && curr.value && curr.value.ok === 1) return acc + 1;
          return acc;
        }, 0);
        return res.status(201).json({
          message: `${savedUsers} users created or updated successfully`,
          data: results,
        });
      });
    } catch (error) {
      return next({
        message: "Generating Users from excel failed",
        error,
      });
    }
  });
};

// For updating a user profile
export const updateUserProfile = async (req, res, next) => {
  const { userRole, userId } = req.userData;
  const { userId: Id } = req.params;
  const data = req.body;
  try {
    // check if user role is part of the data being sent and check the role of the user updating his profile
    if (data.userRole && !isUserAdmin(userRole)) {
      return res.status(500).json({
        message:
          "You are not allowed to update your user role. Only admins can do that",
      });
    }

    // check if password is available in the data
    if (data.password) {
      return res.status(500).json({
        message:
          "You are not allowed to update your password this way, navigate to change password",
      });
    }

    // confirm that it's the authenticated user that is updating his own profile
    if (userId !== Id) {
      return res.status(500).json({
        message: "Sorry this profile does not belong to you",
      });
    }

    // update the database
    const userNewData = await findUserByIdAndUpdateProfile(
      userId,
      data,
      res,
      next
    );

    return res.status(200).json({
      message: "User Profile updated",
      // data: userNewData,
    });
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: error,
    });
  }
};

// verify phone number for allowing a user reset his passowrd
export const verifyphoneforpasswordreset = async (req, res, next) => {
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
      return res.status(200).json({
        message: "Token has been verified",
      });
    } else {
      return res.status(400).json({
        message: "invalid code",
      });
    }
  } catch (e) {
    return next({
      message: "could not verify",
      error: e,
    });
  }
};

// for reseting a user's password
export const resetPassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { phoneNumber } = req.params;

  try {
    if (password === confirmPassword) {
      await bcrypt.hash(password, 9, async (err, hash) => {
        if (err) {
          return next(err);
        }
        this.password = hash;
        const newPassword = {
          $set: {
            password: hash,
          },
        };
        const updatePassword = await userModel.updateOne(
          phoneNumber,
          newPassword
        );
        if (!updatePassword) {
          return res.status(400).json({
            message: "unsuccessful! Password could not be updated",
            error: error,
          });
        } else {
          return res.status(200).json({
            message: "Password updated successfully",
          });
        }
      });
    } else {
      return res.status(200).json({
        message: "Passwords dont't match",
      });
    }
  } catch (error) {
    return {
      message: "Error, please try again",
      error: error,
    };
  }
};

// change a user passowrd
export const changePassword = async (req, res, next) => {
  const { oldPassword, password, confirmPassword } = req.body;
  const { userId } = req.userData;

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    // check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords does match",
      });
    }

    // check if any of the fields are empty
    if (!oldPassword && !password && confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check if oldPassword entered matches what is currently on db
    const comparePasswords = await bcrypt.compare(oldPassword, user.password);

    if (!comparePasswords) {
      return res.status(401).json({
        message: "Incorrect old password",
      });
    }

    // hash the password
    const hashedPasssword = await hashPassword(password, 9);

    // update the db
    const updatedPassword = await userModel.findByIdAndUpdate(userId, {
      $set: { password: hashedPasssword },
    });

    if (!updatedPassword) {
      return res.status(400).json({
        message: "unsuccessful! Password could not be updated",
        error: error,
      });
    } else {
      return res.status(200).json({
        message: "Password updated successfully",
      });
    }
  } catch (error) {
    return next({
      message: "Error updating password",
    });
  }
};
