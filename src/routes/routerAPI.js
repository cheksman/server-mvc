/* eslint-disable max-len */
import express from "express";
import { createLead } from "../controllers/user.controllers";

const router = express.Router();

// User Routes
router.post("/user/create", createLead);

export default router;
