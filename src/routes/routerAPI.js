/* eslint-disable max-len */
import express from "express";
import fileUpload from "express-fileupload";
import { createUser, loginUser } from "../controllers/auth.controller";
import { getAllUsers, createStudentAgent, getPagedUsers } from "../controllers/user.controllers";
import {
  createLead,
  createWebLead,
  createAgentLead,
  createMobileAgentLead,
  getPagedEntries,
  getAllEntries,
  getAllInvestors,
  getPagedInvestors
} from "../controllers/leads.controller";
import { addNewTractor, getAllUserTractors, getActivationStatus } from "../controllers/tractor.controller";
import { auth } from "../utils/auth";
import { subscribeContactToMailchimp } from "./../controllers/mailchimp.controllers";
import {addPost, getPostsById, getAllPosts} from "../controllers/posts.controller"

const router = express.Router();
router.use(fileUpload());

// User Routes
router.get("/user/all-users", auth, getAllUsers);
router.get("/user/page=:pageNumber&:limit", auth, getPagedUsers);

// Enries Routes
router.post("/user/web/create-agent", createAgentLead);
router.post("/user/create", auth, createLead);
router.post("/user/mob/create-agent", auth, createMobileAgentLead)
router.post("/user/webcreate", createWebLead);
router.get("/entries/:leadType/:pageNumber&:limit", auth, getPagedEntries);
router.get("/entries/investors/:pageNumber&:limit", auth, getPagedInvestors);
router.get("/entries/all-entries/:leadType", auth, getAllEntries);
router.get("/entries/all-investors", auth, getAllInvestors);

// Tractor Routes
router.post("/tractor/add-new", auth, addNewTractor);
router.get("/tractor/:userId/tractors", auth, getAllUserTractors);


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

export default router;
