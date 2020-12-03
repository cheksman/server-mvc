import tractorModel from "../models/tractor.model";

export const findTractorService = async (tractor) => {
  return await tractorModel.findOne({ tractor }).lean().exec();
};

export const getAllTractorService = async () => {
  return await tractorModel.find().lean().exec();
};

export const getQueriedTractorsService = async (userId) => {
  return await tractorModel.find({_id: userId}).lean().exec();
}

export const saveTractorService = async (req, res, next, userId) => {
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
    location,
  } = req.body;

  try {
    const newTractor = await tractorModel.create({
      user: userId,
      brand: brand,
      model: model,
      tractorType: tractorType,
      tractorRating: tractorRating,
      purchaseYear: purchaseYear,
      chasisNum: chasisNum,
      ...(plateNum && {plateNum: plateNum}),
      manufactureYear: manufactureYear,
      insurance: insurance,
      ...(location && {location: location})
  })
  if(!newTractor) {
      return res.status(500).json({
          message: "Could not add tractor"
      })
  }
  return res.status(201).json({
      message: "Successful",
      data: newTractor
  })
  } catch (error) {
    return next({
      message: "Error saving tractor to database"
    })
  }
  
};
