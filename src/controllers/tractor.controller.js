import {
  getAllTractorService,
  getQueriedTractorsService,
} from "../services/tractor.services";
import { isUserAdmin } from "../utils/helpers";

export const getAllTractors = async (req, res, next) => {
  const { userRole } = req.userData;
  try {
    const isAdmin = isUserAdmin(userRole);
    if (isAdmin) {
      const tractors = await getAllTractorService();
      if (tractors && tractors.length) {
        return res.status(200).json({
          message: "succesful",
          data: tractors,
        });
      }
      return res.status(404).json({
        message: "No tractors found",
      });
    }
    return res.status(403).json({
      message: "Forbidden, Only Administrators can view all tractors",
    });
  } catch (error) {
    return next({
      message: "Query failed",
      err: error,
    });
  }
};

export const getAllUserTractors = async (req, res, next) => {
  const { userId } = req.userData;
  try {
    const tractors = await getQueriedTractorsService(userId);
    if (tractors && tractors.length) {
      return res.status(200).json({
        message: "succesful",
        data: tractors,
      });
    }
    return res.status(404).json({
      message: "No tractors found",
    });
  } catch (error) {
    return next({
      message: "Query failed",
      err: error,
    });
  }
};
