import {
  saveLeaseRequestService,
  getAllLeasingsService,
  getQueriedLeasingsService,
} from "../services/leasing.services";
import { isUserAdmin } from "../utils/helpers";

export const leaseTractorRequest = async (req, res, next) => {
  const { userId } = req.userData;
  try {
    return saveLeaseRequestService(req, res, next, userId);
  } catch (error) {
    return next({
      message: "Tractor request failed",
      err: error,
    });
  }
};

export const getAllLeasings = async (req, res, next) => {
  const { userRole } = req.userData;
  try {
    if (isUserAdmin(userRole)) {
      const leasings = await getAllLeasingsService();
      if (leasings && leasings.length) {
        return res.status(201).json({
          message: "successful",
          data: leasings,
        });
      }
      return res.status(500).json({
        message: "Could not get requests",
      });
    }
    return res.status(401).json({
      message: "Unauthorized, only administrators can view all requests",
    });
  } catch (error) {
    return next({
      message: "Error getting requests",
      err: error,
    });
  }
};

export const getAllUsersLeasings = async (req, res, next) => {
  const { userId } = req.userData;
  try {
    const leasings = await getQueriedLeasingsService({ leasor: userId });
    if (leasings && leasings.length) {
      return res.status(201).json({
        message: "successful",
        data: leasings,
      });
    }
    return res.status(500).json({
      message: "Could not get requests",
    });
  } catch (error) {
    return next({
      message: "Error getting requests",
      err: error,
    });
  }
};

export const getAllLeasingsByStatus = async (req, res, next) => {
  const { userRole } = req.userData;
  const { status } = req.params
  try {
    if (isUserAdmin(userRole)) {
      const leasings = await getQueriedLeasingsService({
        status: status,
      });
      if (leasings && leasings.length) {
        return res.status(201).json({
          message: "successful",
          data: leasings,
        });
      }
      return res.status(500).json({
        message: "Could not get requests",
      });
    }
    return res.status(401).json({
        message: "Unauthorized, only administrators can view all requests",
      });
  } catch (error) {
    return next({
      message: "Error getting requests",
      err: error,
    });
  }
};
