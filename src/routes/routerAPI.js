/* eslint-disable max-len */
import express from "express";
import { createLead } from "../controllers/user.controllers";
import { subscribeContactToMailchimp } from './../controllers/mailchimp.controllers';

const router = express.Router();

// User Routes
router.post("/user/create", createLead);

// Mailchimp Routes
router.post('/mailchimp/subscribe', subscribeContactToMailchimp);


export default router;
