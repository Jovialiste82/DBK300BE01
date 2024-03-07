import express from "express";
import { generateInvitationCode } from "../controllers/couponsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// Define the routes and associate them with controller functions
router.post("/", protect, generateInvitationCode);

export default router;
