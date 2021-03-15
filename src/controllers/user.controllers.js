import userModel from "../models/user.model";
import agentProgrammeModel from "../models/agent-programme.model";
import { uploadFile } from "../utils/uploader";
import { isUserAdmin } from "../utils/helpers";
import {
  findUserByIdAndUpdate,
  findUser,
  findUserById,
} from "../services/user.services";

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
    // console.log(error)
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

export const addTractorOwner = async (req, res, next) => {
  const { userId, userRole } = req.userData;
  try {
    if (userRole === "student") {
    }
  } catch (error) {}
};

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
