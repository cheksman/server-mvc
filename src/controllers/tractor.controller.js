import {
  getAllTractorService,
  getQueriedTractorsService,
  saveTractorService,
} from "../services/tractor.services";
import { uploadFile } from "../utils/uploader";
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

export const addNewTractor = async (req, res, next) => {
  const { values } = req.body;
  const reqVal = JSON.parse(values);
  const tractorImage = req.files.file;
  const { userId } = req.userData;
  try {
    if (!tractorImage) {
      let cResponse = {
        secure_url:
          "https://res.cloudinary.com/tractrac-global/image/upload/v1613478588/placeholder_ul8hjl.webp",
      };
      const newTractor = await saveTractorService(
        reqVal,
        next,
        cResponse,
        userId
      );
      if (!newTractor) {
        return res.status(500).json({
          message: "Could not add Tractor",
        });
      }
      return res.status(200).json({
        message: "Tractor sucessfully added",
        data: newTractor,
      });
    }
    const cloudinaryResponse = await uploadFile(
      tractorImage,
      "auto",
      "tractors"
    );
    const newTractor = await saveTractorService(
      reqVal,
      next,
      cloudinaryResponse,
      userId
    );
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
      message: "Could not add tractor",
      err: error,
    });
  }
};

export const getAllUserTractors = async (req, res, next) => {
  const { userId } = req.params;
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
