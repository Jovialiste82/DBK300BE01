// backend/controllers/usersController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Coupon from "../models/couponModel.js";
import generateToken from "../utils/generateToken.js";
import { differenceInYears } from "date-fns";
import { validationResult } from "express-validator";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, dob } = req.body;
  const couponDoc = req.couponDoc; // Correctly accessing the middleware-attached object

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Calculate the age of the user based on their date of birth
  const age = differenceInYears(new Date(), new Date(dob));

  if (age < 18) {
    res.status(400);
    throw new Error("Must be at least 18 years old");
  }

  const user = await User.create({
    dob,
    email,
    password,
    coupon: couponDoc,
    referral: couponDoc ? couponDoc.label : "MIRACLE", // Default referral code
    balance: couponDoc ? couponDoc.tokensGranted : 0, // Default balance
  });

  if (user) {
    generateToken(res, user._id);

    // Directly increment the usageCount without needing to find the coupon again
    // since we grabbed it at middleware stage and attached it to the request object
    if (couponDoc) {
      couponDoc.usageCount += 1;
      await couponDoc.save(); // Save the updated coupon document
    }

    res.status(201).json({
      _id: user._id,
      dob: user.dob,
      email: user.email,
      role: user.role,
      username: user.username,
      balance: user.balance,
      badges: user.badges,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      email: user.email,
      dob: user.dob,
      role: user.role,
      username: user.username,
      balance: user.balance,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user; // since we already grab user object from the middleware
  const newUsername = req.body.username;
  // check what we get exactly from frontend
  console.log("req.body", req.body);
  const isNotAvailable = await User.findOne({ username: newUsername });

  if (isNotAvailable) {
    res.status(400);
    throw new Error("Username already exists");
  }

  if (user) {
    user.username = newUsername;

    // // Not implemented yet on the frontend
    // user.email = req.body.email || user.email;

    // if (req.body.password) {
    //   user.password = req.body.password;
    // }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      message: "Username successfully updated",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get users count per room
// @route   GET /api/users/count/:roomId
// @access  Private
const getUsersCountPerRoom = asyncHandler(async (req, res) => {
  const roomLabel = req.params.roomId; // Assuming roomId is the label of the room
  const usersCount = await User.countDocuments({ rooms: { $in: [roomLabel] } });
  console.log("usersCount", usersCount);
  res.json({ usersCount });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsersCountPerRoom,
};
