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


// for hiring a new tractor
export const saveLeaseRequestService = async ( req, res, next, leasorId) => {

  // get the necessary values from req.body and pass either empty strings or new as defaults
  const {
    farmLocation = "",
    tractorNumberRequired = "",
    farmSize = "",
    startDate = new Date(),
    endDate = new Date(),
  } = req.body;

  try {
    // save the values to the db and return a response
    const newLeaseRequest = await leasingModel.create({
      leasor: leasorId,
      farmSize,
      farmLocation,
      tractorNumberRequired,
      startDate,
      endDate
    });

    // if saving to db fails, return this
    if (!newLeaseRequest) {
      return res.status(500).json({
        message: "Could not make request",
      });
    }

    // if saving was successful, return this
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
