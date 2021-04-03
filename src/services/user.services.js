import userModel from "../models/user.model";
import { newToken } from "../utils/auth";

export const findUser = async (userPhone) => {
  const res = await userModel.findOne({ phone: userPhone }).lean().exec();
  return res
}

export const findUserById = async (userId) =>{
  const res = await userModel.findById(userId).lean().exec();
  return res
}
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

export const saveUser = async (req, res, next, userRole) => {
  // destructure the resquest body parameter
  const {
    phoneNumber,
    email,
    password,
    firstName,
    lastName,
    gender,
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
      ...(gender && { gender: gender }),
    });

    console.log("running to this point");

    // if the user was created, generate a token for him using the newToken method
    if (newUser) {
      const token = newToken(newUser);

      // convert to a object
      const val = newUser.toObject();

      // if val is true, destructure it and get the passowrd(since we don't want to display the password to users)
      if (val) {
        const { password: p, ...rest } = val;
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
