/* eslint-disable max-len */
import express from "express";
import { createUser, loginUser } from "../controllers/auth.controller";
import { createLead, createWebLead, getAllUsers } from "../controllers/user.controllers";
import { auth } from "../utils/auth";
import { subscribeContactToMailchimp } from './../controllers/mailchimp.controllers';

const router = express.Router();

// User Routes
router.post("/user/create", auth, createLead);
router.post("/user/webcreate", createWebLead);
router.get("/user/all-users", auth, getAllUsers)

// Authentication Routes
router.post('/login', loginUser)
router.post('/signup', createUser)

// Mailchimp Routes
router.post('/mailchimp/subscribe', subscribeContactToMailchimp);


export default router;
