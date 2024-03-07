// backend/routes/userRoutes.js
import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsersCountPerRoom,
} from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkCoupon } from "../middleware/couponMiddleware.js";
import {
  registerValidationRules,
  authValidationRules,
} from "../utils/validationRules.js";

const router = express.Router();

router.post("/", registerValidationRules, checkCoupon, registerUser);
router.post("/auth", authValidationRules, authUser);
router.post("/logout", logoutUser);
router.get("/count/:roomId", protect, getUsersCountPerRoom);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

export default router;
