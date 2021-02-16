import tractorModel from "../models/tractor.model";

export const findTractorService = async (tractor) => {
  return await tractorModel.findOne({ tractor }).lean().exec();
};

export const getAllTractorService = async () => {
  return await tractorModel.find().populate("user").lean().exec();
};

export const getQueriedTractorsService = async (userId) => {
  return await tractorModel.find({_id: userId}).lean().exec();
}

export const saveTractorService = async (reqVal, next, cloudinaryResponse, userId) => {
  const {
    brand,
    model,
    tractorType,
    tractorRating,
    purchaseYear,
    chasisNum,
    plateNum,
    manufactureYear,
    insurance,
    tracker,
    state,
    lga,
    town
  } = reqVal;

  try {
    const newTractor = await tractorModel.create({
      user: userId,
      brand: brand,
      model: model,
      ...(tractorType && {tractorType: tractorType}),
      tractorRating: tractorRating,
      ...(purchaseYear && {purchaseYear: purchaseYear}),
      ...(chasisNum && {chasisNum: chasisNum}),
      ...(plateNum && {plateNum: plateNum}),
      ...(manufactureYear && {manufactureYear: manufactureYear}),
      insurance: insurance,
      tracker: tracker,
      state: state,
      lga: lga,
      town: town,
      tractorImageUrl: cloudinaryResponse?.secure_url
  })
  return newTractor
  } catch (error) {
    return next({
      message: "Error saving tractor to database"
    })
  }
  
};
