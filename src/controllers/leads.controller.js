import userModel from "../models/user.model";
import leadsModel from "../models/lead.model";
import investorModel from "../models/tractor-profile.model";
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
      createInvestorService(req, res, next, userId);
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
      return createAgentsService(
        reqVal,
        res,
        next,
        user._id,
        cloudinaryResponse
      );
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
      return createAgentsService(
        reqVal,
        res,
        next,
        newUser._id,
        cloudinaryResponse
      );
    }
    return res.status(500).json({
      message: "Error saving agent lead",
    });
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};

export const createMobileAgentLead = async (req, res, next) => {
  const { values } = req.body;
  const { userId } = req.userData;
  const reqVal = JSON.parse(values);
  const cvFiles = req.files.file;
  const cloudinaryResponse = await uploadFile(cvFiles, "auto", "cvs");
  try {
    if (user) {
      return createAgentsService(
        reqVal,
        res,
        next,
        userId,
        cloudinaryResponse
      );
    }
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};

export const getAllEntries = async (req, res, next) => {
  const { userRole } = req.userData;
  const { leadType } = req.params;
  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await leadsModel
      .find({ leadType: leadType })
      .populate("user")
      .sort({
        _id: -1,
      })
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

export const getAllInvestors = async (req, res, next) => {
  const { userRole } = req.userData;
  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await investorModel
      .find({})
      .populate("user")
      .sort({
        _id: -1,
      })
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

export const getPagedEntries = async (req, res, next) => {
  const { userRole } = req.userData;
  const { pageNumber, limit, leadType } = req.params;
  const lim = Number(limit);
  let skippedDocuments = (Number(pageNumber) - 1) * lim;
  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await leadsModel
      .find({ leadType: leadType })
      .populate("user")
      .sort({
        _id: -1,
      })
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

export const getPagedInvestors = async (req, res, next) => {
  const { userRole } = req.userData;
  const { pageNumber, limit, leadType } = req.params;
  const lim = Number(limit);
  let skippedDocuments = (Number(pageNumber) - 1) * lim;
  try {
    if (!userRole.includes("admin" || "superadmin")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const users = await leadsModel
      .find({ leadType: leadType })
      .populate("user")
      .sort({
        _id: -1,
      })
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