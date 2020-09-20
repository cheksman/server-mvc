import leadModel from "../models/lead.model";
import tractorProfileModel from "../models/tractor-profile.model";
import inquiryModel from "../models/inquiry.model";
import SendGridMail from "@sendgrid/mail";
import userModel from "../models/user.model";

SendGridMail.setApiKey(
  "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"
);

export const createLead = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      fname,
      lname,
      gender,
      businessType,
      message,
      email,
      phone,
      leadType,
      tractorAmount = "1",
      operatorAmount = "1",
      tractorBrands = [],
      state = "",
      lga = "",
      town = "",
      farmSize = "",
      recommendations = "",
      reason = "",
    } = req.body;

    const newUser = await userModel.create({
      fname,
      lname,
      email,
      phone,
      gender,
      businessType,
      ...(leadType === "agent"
        ? { userRole: ["agent"] }
        : { userRole: [leadType] }),
    });
    // const token = newToken(newUser)
    // const { password: p, ...rest } = newUser
    if (leadType === "investor") {
      await tractorProfileModel.create({
        user: newUser._id,
        tractorAmount,
        operatorAmount,
        tractorBrands,
        state,
        lga,
        town,
        recommendations,
      });
    }
    await inquiryModel.create({
      user: newUser._id,
      farmSize,
      recommendations,
      message,
      reason: leadType,
    });
    await SendGridMail.send({
      from: "no-reply@tractrac.co",
      to: email,
      templateId: "d-c05f32b44f1e4babbbb655cde60b49ea",
    });
    return res.status(201).json({
      message: "Created  successfully",
    });
  } catch (err) {
    console.log(err);
    return next({
      message: "Registration failed",
      error: err,
    });
  }
};
