// backend/routes/userRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  freezeUserAccount,
  resetUserPassword,
  getUserInfo,
} from "../controllers/adminUsersController.js";
import { getUsersStats } from "../controllers/adminUsersController.js";
import { getRoomsStats } from "../controllers/adminRoomsController.js";
import {
  getCouponsCount,
  createCoupon,
  freezeCoupon,
} from "../controllers/adminCouponsController.js";
// import { checkCoupon } from "../middleware/couponMiddleware.js";
// import { hideComment } from "../controllers/adminCommentsController.js";
// import { hidePost } from "../controllers/adminPostsController.js";

const router = express.Router();

router.post("/users/freeze", protect, admin, freezeUserAccount);
router.post("/users/reset-password", protect, admin, resetUserPassword);
router.post("/users/info", protect, admin, getUserInfo);
router.get("/users/stats", protect, admin, getUsersStats);
router.get("/rooms/stats", protect, admin, getRoomsStats);
router.get("/coupons/count", protect, admin, getCouponsCount);
router.post("/coupons/create", protect, admin, createCoupon);
router.patch("/coupons/freeze", protect, admin, freezeCoupon);
//router.post("/comments/:commentId", protect, admin, hideComment);
// router.post("/posts/:postId", protect, admin, hidePost);

export default router;
