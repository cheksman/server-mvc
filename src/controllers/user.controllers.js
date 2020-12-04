import userModel from "../models/user.model";
import { findUser } from "../services/user.services";
import { uploadFile } from "../utils/uploader";
import {
  createInvestorService,
  createLeadsService,
  createContactService,
  createAgentsService,
} from "../services/lead.services";
import { sendMail } from "../services/mail.services";


export const createLead = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    const user = await findUser(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (leadType === "") {
      return res.status(403).json({
        message: "You need to have a reason to contact us",
      });
    }
    if (leadType === "investor") {
      createInvestorService(req,res, next, userId);
    }
    if (leadType === "contact") {
      createContactService(req, res, next, userId);
    }
    createLeadsService(req, res, next, userId);
  } catch (err) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};

export const createWebLead = async (req, res, next) => {
  try {
    const {
      firstName = "",
      lastName = "",
      email = "",
      phoneNumber = "",
      leadType = "",
    } = req.body;
    let user;
    user = await userModel.findOne({ phone: phoneNumber }).lean().exec();
    if (user) {
      if (leadType === "investor") {
        return createInvestorService(req, res, next, user._id);
      }
      if (leadType === "contact") {
        return createContactService(req, res, next, user._id);
      }
      return createLeadsService(req, res, next, user._id);
    }
    const newUser = await userModel.create({
      email,
      phone: phoneNumber,
      password: "123tractrac",
      fname: firstName,
      lname: lastName,
      userRole: ["user"],
    });
    if (newUser) {
      sendMail(email, "info@tractrac.co", firstName, lastName, phoneNumber);
    }
    if (leadType === "investor") {
      return createInvestorService(req, res, next, newUser._id);
    }
    if (leadType === "contact") {
      return createContactService(req, res, next, newUser._id);
    }
    return createLeadsService(req, res, next, newUser._id);
  } catch (err) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};

export const createAgentLead = async (req, res, next) => {
  const { values } = req.body;
  const reqVal = JSON.parse(values);
  const cvFiles = req.files.file;
  const cloudinaryResponse = await uploadFile(cvFiles, "auto", "cvs");
  const {
    phoneNumber = "",
    firstName = "",
    lastName = "",
    email = "",
  } = reqVal;
  try {
    let user;
    user = await userModel.findOne({ phone: phoneNumber }).lean().exec();
    if (user) {
      return createAgentsService(reqVal, res, next, user._id, cloudinaryResponse);
    }
    const newUser = await userModel.create({
      email,
      phone: phoneNumber,
      password: "123tractrac",
      fname: firstName,
      lname: lastName,
      userRole: ["user"],
    });
    if (newUser) {
      sendMail(email, "info@tractrac.co", firstName, lastName, phoneNumber);
      return createAgentsService(reqVal, res, next, newUser._id, cloudinaryResponse);
    }
    return res.status(500).json({
      message: "Error saving agent lead"
    })
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};

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

export const addTractorOwner = async (req, res, next) => {
  const { userId, userRole } = req.userData;
  try {
    if (userRole === "student") {
    }
  } catch (error) {}
};
