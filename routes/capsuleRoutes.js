import express from "express";
import {
  deleteCapsule,
  createCapsule,
  getCapsules,
  getCapsuleById,
} from "../controllers/capsulesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCapsules);
router.get("/:capsuleId", protect, getCapsuleById);
router.post("/", protect, createCapsule);
router.delete("/:capsuleId", protect, admin, deleteCapsule);

export default router;
