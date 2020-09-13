import leadModel from "../models/lead.model";
import tractorProfileModel from "../models/tractor-profile.model";
import inquiryModel from "../models/inquiry.model";
import SendGridMail from "@sendgrid/mail";

SendGridMail.setApiKey(
  "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"
);

export const createLead = async (req, res, next) => {
  try {
    const {
      fname,
      lname,
      gender,
      businessType,
      message,
      email,
      phone,
      password,
      leadType,
      tractorAmount,
      operatorAmount,
      tractorBrands,
      state = "",
      lga = "",
      town = "",
      farmSize,
      recommendations,
      reason,
    } = req.body;

    const newUser = await leadModel.create({
      fname,
      lname,
      email,
      phone,
      password,
      gender,
      businessType,
      ...(leadyType === "agent" ? { userRole: ["agent"] } : ["lead"]),
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
      });
    }
    if (leadType === "inquiry") {
      await inquiryModel.create({
        user: newUser._id,
        farmSize,
        recommendations,
        message,
        reason,
      });
    }

    await SendGridMail.send({
      from: "no-reply@gmail.com",
      to: email,
      templateId: "d-c05f32b44f1e4babbbb655cde60b49ea",
    });
    return res.status(201).json({
      message: "Created  successfully",
    });
  } catch (err) {
    return next({
      message: "Registration failed",
      error: err,
    });
  }
};
