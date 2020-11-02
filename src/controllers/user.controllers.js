import leadModel from "../models/lead.model";
import tractorProfileModel from "../models/tractor-profile.model";
import inquiryModel from "../models/inquiry.model";
import SendGridMail from "@sendgrid/mail";
import userModel from "../models/user.model";

SendGridMail.setApiKey(process.env.SENDGRID_API);

export const createLead = async (req, res, next) => {
  try {
    const {
      fname = "",
      lname = "",
      gender = "",
      businessType = "",
      message = "",
      email = "",
      phone = "",
      phoneNumber = "",
      leadType = "",
      unit = "1",
      tractorNumber = "",
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
      phone: phone || phoneNumber,
      gender,
      ...(businessType && { businessType }),
      ...(leadType === "agent"
        ? { userRole: ["agent"] }
        : { userRole: [leadType] }),
    });
    // const token = newToken(newUser)
    // const { password: p, ...rest } = newUser
    if (leadType === "investor") {
      await tractorProfileModel.create({
        user: newUser._id,
        unit,
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
      tractorNumber,
      state,
      lga,
      town,
      reason: leadType,
    });
    // await SendGridMail.send({
    //   from: "no-reply@tractrac.co",
    //   to: "tractracnigeria@gmail.com",
    //   subject: "Tractrac Inquiry made",
    //   text: "A new inquiry was made into Tractrac",
    //   html: `<div>
    //   <p>Hi,</p>
    //   <p>A new inquiry has been made, see below for details</p>
    //   <p>Firstname: ${fname}</p>,
    //   <p>Lastname: ${lname}</p>,
    //   <p>Gender: ${gender}</p>,
    //   <p>Business type: ${businessType}</p>,
    //   <p>Message: ${message}</p>,
    //   <p>Email: ${email}</p>,
    //   <p>Phone: ${phone}</p>,
    //   <p>Phone2: ${phoneNumber}</p>,
    //   <p>Type of Lead: ${leadType}</p>,
    //   <p>Number of tractors requested: ${tractorAmount}</p>,
    //   <p>Number of Operators: ${operatorAmount}</p>,
    //   <p>Tractor brands: ${tractorBrands}</p>,
    //   <p>State: ${state}</p>,
    //   <p>Lga: ${lga}</p>,
    //   <p>Size of farm: ${farmSize}</p>,
    //   <p>Recommendations: ${recommendations}</p>,
    //   <div>
    //   `,
    // });
    return res.status(201).json({
      message: "Submitted  successfully",
    });
  } catch (err) {
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};
