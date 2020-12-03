import userModel from "../models/user.model";
import { newToken } from "../utils/auth";

export const findUser = async (userPhone) => {
  return await userModel.findOne({ userPhone }).lean().exec();
};

export const saveUser = async (req, res, userRole) => {
  const { phoneNumber, email, password, firstName, lastName } = req.body;
  try {
    const newUser = await userModel.create({
      phone: phoneNumber,
      password,
      fname: firstName,
      lname: lastName,
      userRole: userRole,
      ...(password !== "" && { password: password }),
      ...(email !== "" && { email: email }),
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
