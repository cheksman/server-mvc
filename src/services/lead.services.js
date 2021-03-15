import inquiryModel from "../models/inquiry.model";
import leadsModel from "../models/lead.model";
import tractorProfileModel from "../models/tractor-profile.model";

export const createInvestorService = async (req, res, next, userId) => {
  const {
    unit,
    tractorBrands = [],
    recommendations = "",
    channel = "web",
    gender = "",
    investorType = "",
  } = req.body;
  try {
    const newInvestor = await tractorProfileModel.create({
      user: userId,
      unit: unit,
      tractorBrands: tractorBrands,
      recommendations: recommendations,
      channel: channel,
      gender: gender,
      investorType: investorType,
    });

    if (!newInvestor)
      return res.status(500).json({ message: "Could not add investor" });
    return res.status(200).json({
      message: "Successful",
    });
  } catch (error) {
    return next({
      message: "Error saving investor to database",
    });
  }
};

export const createContactService = async (req, res, next, userId) => {
  const { message = "", channel = "web" } = req.body;
  try {
    const newContact = await inquiryModel.create({
      user: userId,
      message: message,
      channel: channel,
    });
    if (!newContact)
      return res.status(500).json({ message: "Could not add contact" });
    return res.status(200).json({
      message: "Successful",
    });
  } catch (error) {
    return next({
      message: "Error saving contact to database",
    });
  }
};

export const createLeadsService = async (req, res, next, userId) => {
  const {
    leadType = "",
    unit = "1",
    gender = "",
    crops = [],
    business = "",
    tractorNumber = "",
    operatorNumber = "1",
    tractorBrands = [],
    state = "",
    lga = "",
    town = "",
    farmSize = "",
    channel = "web",
    recommendations = "",
  } = req.body;
  try {
    const newLead = await leadsModel.create({
      user: userId,
      tractorNumber: tractorNumber,
      farmSize: farmSize,
      operatorNumber: operatorNumber,
      unit: unit,
      state: state,
      crops: crops,
      business: business,
      lga: lga,
      town: town,
      recommendations: recommendations,
      gender: gender,
      leadType: leadType,
      tractorBrands: tractorBrands,
      channel: channel,
    });
    if (!newLead)
      return res.status(500).json({ message: "Could not save lead" });
    return res.status(200).json({ message: "Successful" });
  } catch (error) {
    return next({
      message: "Error saving lead to database",
    });
  }
};

export const createAgentsService = async (
  reqVal,
  res,
  next,
  userId,
  cloudinary
) => {
  const {
    leadType = "enlistor",
    unit = "1",
    gender = "",
    crops = [],
    business = "",
    contact = "",
    tractorNumber = "",
    operatorNumber = "1",
    tractorBrands = [],
    state = "",
    lga = "",
    town = "",
    farmSize = "",
    channel = "web",
    recommendations = "",
  } = reqVal;

  try {
    const newLead = await leadsModel.create({
      user: userId,
      tractorNumber: tractorNumber,
      farmSize: farmSize,
      operatorNumber: operatorNumber,
      unit: unit,
      state: state,
      crops: crops,
      business: business,
      contact: contact,
      lga: lga,
      town: town,
      ...(cloudinary && { cvUrl: cloudinary.secure_url }),
      recommendations: recommendations,
      gender: gender,
      leadType: leadType,
      tractorBrands: tractorBrands,
      channel: channel,
    });
    if (!newLead)
      return res.status(500).json({ message: "Could not save lead" });
    return res.status(200).json({ message: "Successful", data: newLead });
  } catch (error) {
    return next({
      message: "Error saving message to database",
    });
  }
};
