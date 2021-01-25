/* eslint-disable max-len */
import express from "express";
import fileUpload from "express-fileupload";
import { createUser, loginUser } from "../controllers/auth.controller";
import { getAllUsers, getPagedUsers } from "../controllers/user.controllers";
import {
  createLead,
  createWebLead,
  createAgentLead,
  getPagedEntries,
  getAllEntries,
  getAllInvestors,
  getPagedInvestors
} from "../controllers/leads.controller";
import { auth } from "../utils/auth";
import { subscribeContactToMailchimp } from "./../controllers/mailchimp.controllers";

const router = express.Router();
router.use(fileUpload());

// User Routes
router.get("/user/all-users", auth, getAllUsers);
router.get("/user/page=:pageNumber&:limit", auth, getPagedUsers);

// Enries Routes
router.post("/web/create-agent", createAgentLead);
router.post("/user/create", auth, createLead);
router.post("/user/webcreate", createWebLead);
router.get("/entries/:leadType/:pageNumber&:limit", auth, getPagedEntries);
router.get("/entries/investors/:pageNumber&:limit", auth, getPagedInvestors);
router.get("/entries/all-entries/:leadType", auth, getAllEntries);
router.get("/entries/all-investors", auth, getAllInvestors);

// Authentication Routes
router.post("/login", loginUser);
router.post("/signup", createUser);

// Mailchimp Routes
router.post("/mailchimp/subscribe", subscribeContactToMailchimp);

export default router;
