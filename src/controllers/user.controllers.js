import userModel from "../models/user.model";
import { ObjectId } from "mongodb";


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
  const lim = Number(limit)
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



export const addTractorOwner = async (req, res, next) => {
  const { userId, userRole } = req.userData;
  try {
    if (userRole === "student") {
    }
  } catch (error) {}
};
