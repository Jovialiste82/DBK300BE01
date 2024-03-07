// backend/controllers/adminUsersController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Capsule from "../models/capsuleModel.js";
import Coupon from "../models/couponModel.js";

// @desc    Freeze user account
// @route   POST /api/admin/users/freeze
// @access  Private / Admin
const freezeUserAccount = asyncHandler(async (req, res) => {
  const { username } = req.body;
  console.log(username);
  const user = await User.findOne({ username });
  console.log(user);

  if (user) {
    user.isFrozen = true;
    await user.save();
    res.status(200).json({ message: "User account frozen successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Reset user password
// @route   POST /api/admin/users/reset-password
// @access  Private / Admin
const resetUserPassword = asyncHandler(async (req, res) => {
  console.log("Need to setup Sendgrid and Nodemailer first");
  res.status(501).send("Not implemented");
});

// @desc    Get user information (excluding password) and related counts
// @route   POST /api/admin/users/info
// @access  Private / Admin
const getUserInfo = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    // Count posts created by user
    const postCount = await Post.countDocuments({ user: user._id });

    // Get user info excluding password
    const userInfo = {
      _id: user._id,
      email: user.email,
      username: user.username,
      dob: user.dob,
      role: user.role,
      referral: user.referral,
      balance: user.balance,
      isVerified: user.isVerified,
      isFrozen: user.isFrozen,
      badges: user.badges,
      postCount,
    };

    res.status(200).json(userInfo);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get statistics about users
// @route   GET /api/admin/users/stats
// @access  Private / Admin
const getUsersStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isFrozen: false });
  const totalCapsules = await Capsule.countDocuments();
  const totalCoupons = await Coupon.countDocuments();
  const totalPosts = await Post.countDocuments();

  // Calculate average age (optional, might be CPU intensive)
  // const users = await User.find();
  // const totalAge = users.reduce((acc, user) => acc + moment().diff(user.dob, 'years'), 0);
  // const averageAge = totalAge / totalUsers;

  console.log(
    "user stats:",
    totalUsers,
    activeUsers,
    totalCapsules,
    totalCoupons,
    totalPosts
  );
  res.status(200).json({
    totalUsers,
    activeUsers,
    totalCapsules,
    totalCoupons,
    totalPosts,
    // averageAge,
  });
});

export { freezeUserAccount, resetUserPassword, getUserInfo, getUsersStats };
