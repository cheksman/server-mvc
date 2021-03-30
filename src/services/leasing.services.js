import leasingModel from "../models/leasing.model";

export const findLeasingRequestService = async (leasingId) => {
  return await leasingModel.findById(leasingId).populate('leasor', 'tractorsAssigned').lean().exec();
};

export const findLeasingRequestAndUpdateService = async (leasingId, props) => {
  return await leasingModel.findByIdAndUpdate(leasingId, {
    $set: {
      ...props
    }},
    {
      new: true,
      upsert: true
    }
  ).populate('leasor', 'tractorsAssigned')
};

export const getAllLeasingsService = async () => {
  return await leasingModel.find().populate("leasor", "tractorsAssigned").lean().exec();
};

export const getQueriedLeasingsService = async (queries) => {
  return await leasingModel.find({ ...queries }).populate("leasor", "tractorsAssigned").lean().exec();
};

export const saveLeaseRequestService = async (
  req,
  res,
  next,
  leasorId
) => {
  const {
    farmLocation = "",
    tractorNumberRequired = "",
    farmSize = "",
    startDate = new Date(),
    endDate = new Date(),
  } = req.body;

  try {
    const newLeaseRequest = await leasingModel.create({
      leasor: leasorId,
      farmSize,
      farmLocation,
      tractorNumberRequired,
      startDate,
      endDate
    });
    if (!newLeaseRequest) {
      return res.status(500).json({
        message: "Could not make request",
      });
    }
    return res.status(200).json({
      message: "Request successfully made",
      data: newLeaseRequest,
    });
  } catch (error) {
    return next({
      message: "Error making request",
    });
  }
};
