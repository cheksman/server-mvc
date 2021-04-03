import tractorModel from "../models/tractor.model";

export const findTractorService = async (tractorId) => {
  return await tractorModel.findById({ tractorId }).populate('user', 'assignedTo').lean().exec();
};

export const findTractorAndUpdateService = async (tractorId, props) => {
  return await tractorModel.findByIdAndUpdate(tractorId, {
    $set: {
      ...props
    }},
    {
      new: true,
      upsert: true
    }
  ).populate('user', 'assignedTo')
};

export const getAllTractorService = async () => {
  return await tractorModel.find().populate("user").lean().exec();
};

export const getQueriedTractorsService = async (userId) => {
  return await tractorModel.find({ user: userId }).populate("user", "assignedTo").lean().exec();
};

export const saveTractorService = async (
  reqVal,
  res,
  next,
  cloudinaryResponse,
  userId
) => {
  const {
    brand = "",
    model = "",
    tractorType = "",
    tractorRating = "",
    purchaseYear = "",
    chasisNum = "",
    plateNum = "",
    manufactureYear = "",
    insurance = "",
    insuranceCompany = "",
    insuranceExpiry = "",
    tracker = "",
    state = "",
    lga = "",
    address = "",
    status = ""
  } = reqVal;

  try {
    const newTractor = await tractorModel.create({
      user: userId,
      brand: brand,
      model: model,
      ...(tractorType && { tractorType: tractorType }),
      tractorRating: tractorRating,
      ...(purchaseYear && { purchaseYear: purchaseYear }),
      ...(chasisNum && { chasisNum: chasisNum }),
      ...(plateNum && { plateNum: plateNum }),
      ...(manufactureYear && { manufactureYear: manufactureYear }),
      insuranceCompany: insuranceCompany,
      insuranceExpiry: insuranceExpiry,
      insurance: insurance,
      tracker: tracker,
      state: state,
      lga: lga,
      address: address,
      tractorImageUrl: cloudinaryResponse.secure_url,
    });
    if (!newTractor) {
      return res.status(500).json({
        message: "Could not add Tractor",
      });
    }
    return res.status(200).json({
      message: "Tractor sucessfully added",
      data: newTractor,
    });
  } catch (error) {
    return next({
      message: "Error saving tractor to database",
    });
  }
};
