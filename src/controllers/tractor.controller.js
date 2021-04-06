import {
  getAllTractorService,
  getQueriedTractorsService,
  findTractorAndUpdateService,
  saveTractorService,
  findTractorService
} from "../services/tractor.services";
import { findLeasingRequestAndUpdateService, 
 getLeasingRequestAndUpdateService} from "../services/leasing.services"
import { uploadFile } from "../utils/uploader";
import { isUserAdmin, isUserStudent } from "../utils/helpers";
import userModel from "../models/user.model";


// for getting list of all contractors
export const getAllTractors = async (req, res, next) => {

  // destructure to get the userRole
  const { userRole } = req.userData;

  try {
    // checks if the user is an Admin
    const isAdmin = isUserAdmin(userRole);

    // is isAdmin is true, we call the getAllTractorService method
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


// for adding new tractors
export const addNewTractor = async (req, res, next) => {
  // destructure the values from req,body
  const { ...values } = req.body;

  // convert to javascript object
  const reqVal = JSON.parse(JSON.stringify(values)); 

  // get the uploaded image from req.files
  const tractorImage = req.files && req.files.file;

  
  const { userId } = req.userData;
  try {
    if (!tractorImage) {
      let cResponse = {
        secure_url:
          "https://res.cloudinary.com/tractrac-global/image/upload/v1613478588/placeholder_ul8hjl.webp",
      };
      return saveTractorService(reqVal, res, next, cResponse, userId);
    }
    const cloudinaryResponse = await uploadFile(
      tractorImage,
      "auto",
      "tractors"
    );
    return saveTractorService(reqVal, res, next, cloudinaryResponse, userId);
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

export const getActivationStatus = async (req, res, next) => {
  console.log("running")
  const { userRole, userId } = req.userData;
  const isStudent = isUserStudent(userRole);
  console.log(isStudent, "is student")
  try {
    if (isStudent) {
      const user = await userModel.findById(userId).lean().exec();
      if (user) {
        return res.status(200).json({
          message: "succesful",
          data: user.activationStatus,
        });
      }
      return res.status(404).json({
        message: "User not found please log into app and try again",
      });
    }
  } catch (error) {
    return next({
      message: "Query failed",
      err: error,
    });
  }
};

export const verifyTractor = async (req, res, next) => {
  const { tractorId } = req.params;
  const { userRole } = req.userData;
  try {
    if (isUserAdmin(userRole)) {
      const tractor = await findTractorAndUpdateService(tractorId, {
        status: "verified",
      });
      if (tractor) {
        return res.status(200).json({
          message: "Tractor Verified",
          data: tractor,
        });
      }
      return res.status(404).json({
        message: "Tractor verification failed, could not find tractor",
      });
    }
    return res.status(401).json({
      message: "Unauthorized, Only Admins can verify tractors",
    });
  } catch (error) {
    return next({
      message: "Verification failed",
      err: error,
    });
  }
};


export const assignTractorToUsers = async (req, res, next) => {
  console.log("running", req.params)
  const { tractorId, leasingId} = req.params;
  const { status } = req.body
  const { userRole } = req.userData;
  try {
    // check if user is has Admin role
    if (isUserAdmin(userRole)) {

      // find the tractor with the specified ID and check if it has been verified
      const tractorStatus = await findTractorService(tractorId);
      if(tractorStatus.status == "unverified"){
        return res.status(500).json({
          message: "sorry you can't assign this tractor. It is yet to be verified"
        })
      }


      // check if the lease request has already been assigned a tractor
      const leaseStatus = await findLeasingRequestService(leasingId)
      if(leaseStatus.status === "assigned"){
        return res.status(500).json({
          message: "Tractor has already been assigned"
        })
      }

      // check if tractor is in the array of assigned tractors in the leasing model db
      const tractorAlreadyAssigned = leaseStatus.tractorsAssigned.includes(tractorId)
      if(tractorAlreadyAssigned === true){
        return res.status(500).json({
          message: "This tractor is already assigned to this user"
        })
      }

      if(status === "accepted"){
        const leasingStatus = await getLeasingRequestAndUpdateService(leasingId, tractorId, status);
        console.log(leasingStatus, "leasing status")

        if(leasingStatus !== null){
          const res = await findTractorAndUpdateService(tractorId, {assigned: true})
          console.log(res)
        }
      }
    }
    }catch(error){
      console.log(error)
    }


};

export const assignTractor = async (req, res, next) => {
  const { tractorId, leasingId } = req.params;
  const { userRole } = req.userData;
  try {
    if (isUserAdmin(userRole)) {
      const tractor = await findTractorAndUpdateService(tractorId, {
        assigned: true,
        assignedTo: leasingId,
      });
      if (tractor) {
        const leasing = await findLeasingRequestAndUpdateService()
        return res.status(201).json({
          message: "Tractor assigned",
          data: tractor,
        });
      }
      return res.status(404).json({
        message: "Tractor assigning failed, could not find tractor",
      });
    }
    return res.status(401).json({
      message: "Unauthorized, Only Admins can assign tractors",
    });
  } catch (error) {
    return next({
      message: "Assignation failed",
      err: error,
    });
  }
};
