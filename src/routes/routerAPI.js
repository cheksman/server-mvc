/* eslint-disable max-len */
import express from "express";
import fileUpload from "express-fileupload";
import {
  activateAccount,
  createUser,
  loginUser,
} from "../controllers/auth.controller";
import {
  getAllUsers,
  createStudentAgent,
  getPagedUsers,
  getSingleUser,
  updateUserRole,
  uploadBulkUsersFromExcel,
  updateUserProfile,
  verifyphoneforpasswordreset,
  resetPassword,
  changePassword,
} from "../controllers/user.controllers";
import {
  createLead,
  createWebLead,
  createAgentLead,
  createMobileAgentLead,
  getPagedEntries,
  getAllEntries,
  getAllInvestors,
  getPagedInvestors,
} from "../controllers/leads.controller";
import {
  addNewTractor,
  getAllUserTractors,
  getActivationStatus,
  getTractorProfile,
  getAllTractors,
  assignTractor,
  verifyTractor,
  assignTractorToUsers,
} from "../controllers/tractor.controller";
import {
  getAllLeasings,
  getAllLeasingsByStatus,
  getAllUsersLeasings,
  leaseTractorRequest,
} from "../controllers/leasing.controller";
import { auth } from "../utils/auth";
import { subscribeContactToMailchimp } from "./../controllers/mailchimp.controllers";
import {
  addPost,
  getPostsById,
  getAllPosts,
} from "../controllers/posts.controller";
import { sendOTP } from "../utils/twilioService";

const router = express.Router();
router.use(fileUpload());

// User Routes
router.get("/user/all-users", auth, getAllUsers);
router.get("/user/page=:pageNumber&:limit", auth, getPagedUsers);
router.post("/user/update/role/:userId", auth, updateUserRole);
router.get("/user/single", auth, getSingleUser);
router.post("/users/bulk-create", auth, uploadBulkUsersFromExcel);
router.patch("/user/updateProfile/:userId", auth, updateUserProfile);
router.post("/user/account-activation", activateAccount);
router.patch("/user/change-password", auth, changePassword);

// Enries Routes
router.post("/user/web/create-agent", createAgentLead);
router.post("/user/create", auth, createLead);
router.post("/user/mob/create-agent", auth, createMobileAgentLead);
router.post("/user/webcreate", createWebLead);
router.get("/entries/:leadType/:pageNumber&:limit", auth, getPagedEntries);
router.get("/entries/investors/:pageNumber&:limit", auth, getPagedInvestors);
router.get("/entries/all-entries/:leadType", auth, getAllEntries);

// route for getting all investors
router.get("/entries/all-investors", auth, getAllInvestors);

// Tractor Routes

router.post("/tractor/add-new", auth, addNewTractor);
router.get("/tractor/:userId/tractors", auth, getAllUserTractors);
router.get("/tractor/all", auth, getAllTractors);
router.get("/tractor/profile/:tractorId", auth, getTractorProfile);
// to update a tractor after verification
router.put("/tractor/verify/:tractorId", auth, verifyTractor);

//
//router.put("/tractor/:tractorId/assign-to=:leasingId", auth, assignTractor); //TODO: complete this part

//TODO: explain that this was aded recently
router.put(
  "/tractor/:tractorId/assign-to=:leasingId",
  auth,
  assignTractorToUsers
);

// Leasing Routes
router.post("/leasing/new-request", auth, leaseTractorRequest); // for request to hire a new tractor
router.get("/leasing/all", auth, getAllLeasings);
router.get("/leasing/user/all", auth, getAllUsersLeasings);
router.get("/leasing/all/status=:status", auth, getAllLeasingsByStatus);

// Agent Programme Routes
router.get("/tractor/activation-status", auth, getActivationStatus);
router.post("/user/student/create-agent", auth, createStudentAgent);

// Post Routes
router.post("/posts/add-new", auth, addPost);
router.get("/posts/all-posts", getAllPosts);
router.get("/posts/:postId", getPostsById);

// Authentication Routes
router.post("/login", loginUser);
router.post("/signup", createUser);

// Mailchimp Routes
router.post("/mailchimp/subscribe", subscribeContactToMailchimp);

// for sending OTP to a user's phone
router.post("/send-otp-code", sendOTP);

// verify the OTP code for reseting a user password
router.get("/verify", verifyphoneforpasswordreset);

// change user password
router.put("/reset", resetPassword);

export default router;
