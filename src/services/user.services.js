import userModel from "../models/user.model";
import { newToken } from "../utils/auth";
import { sendOTP } from "../utils/twilioService";

export const findUser = async (userPhone) => {
  const res = await userModel.findOne({ phone: userPhone }).lean().exec();
  return res;
};

export const findUserById = async (userId) => {
  const res = await userModel.findById(userId).lean().exec();
  return res;
};

// for updating a user profile
export const findUserByIdAndUpdateProfile = async (userId, data) => {
  // find and update a user profile using his id
  const updateProfile = await userModel.findByIdAndUpdate(userId, data);

  // pass in the id on the update status in the finById method and return the updated profile
  const updatedProfile = await userModel.findById(updateProfile.id);

  // we remove the password details to avoid displaying them to the user for security reasons
  updatedProfile.password = "";
  return updatedProfile;
};

// updating user role
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
      message: "User roles not an array",
    });
  } catch (error) {
    return next({
      message: "Error saving user to database",
      error: error,
    });
  }
};

export const saveUser = async (req, res, next, user) => {
  // destructure the resquest body parameter
  const {
    phoneNumber,
    email,
    password,
    firstName,
    lastName,
    userRole,
  } = req.body;

  try {
    // create a new user
    const newUser = await userModel.create({
      phone: phoneNumber,
      fname: firstName,
      lname: lastName,
      userRole: userRole,
      ...(password !== "" && { password: password }),
      ...(email !== "" && { email: email }),
      // ...(gender && { gender: gender }),
    });

    // if the user was created, generate a token for him using the newToken method
    if (newUser) {
      const token = newToken(newUser);

      // convert to a object
      const val = newUser.toObject();

      // if val is true, destructure it and get the password(since we don't want to display the password to users)
      if (val) {
        const { password: p, ...rest } = val;
        sendOTP(req, res, next);
        return res.status(201).json({
          message: "Created  successfully",
          token,
          data: {
            ...rest,
          },
          //TODO: why pass userRole here when it's part of the user object
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
