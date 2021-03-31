import userModel from "../models/user.model";
import { newToken } from "../utils/auth";

export const findUser = async (userPhone) =>
  await userModel.findOne({ userPhone }).lean().exec();

export const findUserById = async (userId) =>
  await userModel.findById(userId).lean().exec();

export const findUserByIdAndUpdate = async (
  userId,
  prevRole,
  newRole,
  res,
  next
) => {
  try {
    if (Array.isArray(prevRole) && Array.isArray(newRole)) {
      return await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            userRole: prevRole.concat(newRole),
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
    }

    return res.status(500).json({
      message: "User roles not an array"
    })
  } catch (error) {
    return next({
      message: "Error saving user to database",
      error: error,
    });
  }
};

export const saveUser = async (req, res, next, userRole) => {
  const {
    phoneNumber,
    email,
    password,
    firstName,
    lastName,
    gender,
  } = req.body;
  try {
    const newUser = await userModel.create({
      phone: phoneNumber,
      fname: firstName,
      lname: lastName,
      userRole: userRole,
      ...(password !== "" && { password: password }),
      ...(email !== "" && { email: email }),
      ...(gender && { gender: gender }),
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
          userRole: val.userRole,
        });
      }
    }
  } catch (error) {
    return next({
      message: "Error saving user to database",
    });
  }
};
