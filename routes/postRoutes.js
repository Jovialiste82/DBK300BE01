import express from "express";
import {
  getPostsWithUsers,
  createPost,
  updatePost,
  getPostById,
} from "../controllers/postsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { checkRoomAccess } from "../middleware/roomMiddleware.js";

const router = express.Router();

router.get("/", protect, checkRoomAccess, getPostsWithUsers);
router.get("/:postId", protect, getPostById);
router.post("/", protect, createPost);
router.put("/:postId", protect, updatePost);

export default router;
