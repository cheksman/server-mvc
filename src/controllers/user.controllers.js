import tractorProfileModel from "../models/tractor-profile.model";
import inquiryModel from "../models/inquiry.model";
import SendGridMail from "@sendgrid/mail";
import userModel from "../models/user.model";
import leadsModel from "../models/lead.model";

SendGridMail.setApiKey(process.env.SENDGRID_API);

const sendMail = (to, from, firstName, lastName) => {
  const msg = {
  to: to, // Change to your recipient
  from: from, // Change to your verified sender
  templateId: 'd-44fbd10ccc984490b16825f23ce603c2',
  dynamicTemplateData: {
        name: `${firstName} ${lastName}`,
        phone: phone,
        email: to
      },
}
SendGridMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}



export const createLead = async (req, res, next) => {
  try {
    const {
      message = "",
      leadType = "",
      unit = "1",
      gender = "",
      crops = [],
      business = "",
      investorType = "",
      tractorNumber = "",
      operatorNumber = "1",
      tractorBrands = [],
      state = "",
      lga = "",
      town = "",
      farmSize = "",
      channel = "",
      recommendations = "",
    } = req.body;
    const { userId } = req.userData;
    let updatedUser;
    const user = await userModel.findOne({_id: userId}).lean();
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

    updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          userRole: [leadType, ...user.userRole],
        },
      },
      {
        upsert: true,
      }
    );

    if (leadType === "investor") {
      const newInvestor = await tractorProfileModel.create({
        user: userId,
        unit,
        tractorBrands,
        recommendations,
        channel,
        gender,
        investorType,
      });
      if (!newInvestor)
        return res.status(500).json({ message: "Could not add investor" });
      return res.status(200).json({
        message: "Successful",
      });
    }

    if (leadType === "contact") {
      const newContact = await inquiryModel.create({
        user: userId,
        message,
        channel,
      });
      if (!newContact)
        return res.status(500).json({ message: "Could not add contact" });
      return res.status(200).json({
        message: "Successful",
      });
    }

    const newLead = await leadsModel.create({
      user: userId,
      tractorNumber,
      farmSize,
      operatorNumber,
      unit,
      state,
      crops,
      business,
      lga,
      town,
      recommendations,
      gender,
      leadType,
      tractorBrands,
      channel,
    });
    if (!newLead)
      return res.status(500).json({ message: "Could not save lead" });
    return res.status(200).json({ message: "Successful" });
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
      gender = "",
      business = "",
      crops = [],
      message = "",
      email = "",
      phoneNumber = "",
      leadType = "",
      unit = "1",
      investorType="",
      tractorNumber = "",
      operatorNumber = "1",
      tractorBrands = [],
      state = "",
      lga = "",
      town = "",
      farmSize = "",
      recommendations = "",
      channel = "",
    } = req.body;
    let user, updatedUser;
    user = await userModel.findOne({ phone: phoneNumber }).lean().exec();
    if (user) {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            userRole: [leadType, ...user.userRole],
          },
        },
        {
          upsert: true,
        }
      );
  
      if (leadType === "investor") {
        const newInvestor = await tractorProfileModel.create({
          user: updatedUser._id,
          unit,
          tractorBrands,
          recommendations,
          channel,
          gender,
          investorType,
        });
        if (!newInvestor)
          return res.status(500).json({ message: "Could not add investor" });
        return res.status(200).json({
          message: "Successful",
        });
      }
  
      if (leadType === "contact") {
        const newContact = await inquiryModel.create({
          user: updatedUser._id,
          message,
          channel,
        });
        if (!newContact)
          return res.status(500).json({ message: "Could not add contact" });
        return res.status(200).json({
          message: "Successful",
        });
      }
  
      const newLead = await leadsModel.create({
        user: updatedUser._id,
        tractorNumber,
        farmSize,
        operatorNumber,
        unit,
        crops,
        business,
        state,
        lga,
        town,
        recommendations,
        gender,
        leadType,
        tractorBrands,
        channel,
      });
      if (!newLead)
        return res.status(500).json({ message: "Could not save lead" });
      return res.status(200).json({ message: "Successful" });
    }
    user = await userModel.findOne({ email: email }).lean().exec();
    if (user) {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            userRole: [leadType, ...user.userRole],
          },
        },
        {
          upsert: true,
        }
      );
  
      if (leadType === "investor") {
        const newInvestor = await tractorProfileModel.create({
          user: updatedUser._id,
          unit,
          tractorBrands,
          recommendations,
          channel,
          gender,
          investorType,
        });
        if (!newInvestor)
          return res.status(500).json({ message: "Could not add investor" });
        return res.status(200).json({
          message: "Successful",
        });
      }
  
      if (leadType === "contact") {
        const newContact = await inquiryModel.create({
          user: updatedUser._id,
          message,
          channel,
        });
        if (!newContact)
          return res.status(500).json({ message: "Could not add contact" });
        return res.status(200).json({
          message: "Successful",
        });
      }
  
      const newLead = await leadsModel.create({
        user: updatedUser._id,
        tractorNumber,
        farmSize,
        operatorNumber,
        unit,
        state,
        lga,
        town,
        crops,
        business,
        recommendations,
        gender,
        leadType,
        tractorBrands,
        channel,
      });
      if (!newLead)
        return res.status(500).json({ message: "Could not save lead" });
      return res.status(200).json({ message: "Successful" });
    }

    const newUser = await userModel.create({
      email,
      phone: phoneNumber,
      password: "123tractrac",
      fname: firstName,
      lname: lastName,
      userRole: ['user', leadType]
    });
    if(newUser) {
      sendMail(
        email, 
        "info@tractrac.co",
        firstName,
        lastName
        )
    }

    if (leadType === "investor") {
      const newInvestor = await tractorProfileModel.create({
        user: newUser._id,
        unit,
        tractorBrands,
        recommendations,
        channel,
        gender,
        investorType,
      });
      if (!newInvestor)
        return res.status(500).json({ message: "Could not add investor" });
      return res.status(200).json({
        message: "Successful",
      });
    }

    if (leadType === "contact") {
      const newContact = await inquiryModel.create({
        user: newUser._id,
        message,
        channel,
      });
      if (!newContact)
        return res.status(500).json({ message: "Could not add contact" });
      return res.status(200).json({
        message: "Successful",
      });
    }

    const newLead = await leadsModel.create({
      user: newUser._id,
      tractorNumber,
      farmSize,
      operatorNumber,
      unit,
      state,
      lga,
      crops,
      business,
      town,
      recommendations,
      gender,
      leadType,
      tractorBrands,
      channel,
    });
    if (!newLead)
      return res.status(500).json({ message: "Could not save lead" });
    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.log(err)
    return next({
      message: "Error, please try again",
      error: err,
    });
  }
};
