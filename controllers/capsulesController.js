// backend/controllers/capsulesController.js
import asyncHandler from "express-async-handler";
import Capsule from "../models/capsuleModel.js";
import User from "../models/userModel.js";

// @desc    Fetch Capsules of a specific user
// @route   GET /api/capsules
// @access  Private
const getCapsules = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  // Use lean() to get plain JavaScript objects
  // console.log("user in getCapsules got from middleware", req.user);
  const capsules = await Capsule.find({
    user: req.user._id,
    isHidden: { $ne: true }, // Exclude hidden capsules
  }).lean(); // This ensures the documents returned are plain JavaScript objects
  // console.log("capsules found", capsules);

  const modifiedCapsules = capsules.map((capsule) => {
    // Hide body if the deadline has not passed yet
    if (new Date(capsule.deadline) > currentDate) {
      return {
        ...capsule, // Now we're spreading a plain object
        body: "This content is locked until the deadline.",
      };
    }
    return capsule;
  });

  // console.log("modifiedCapsules", modifiedCapsules);
  res.status(200).json({ success: true, data: modifiedCapsules });
});

// @desc    Fetch specific Capsule by ID
// @route   GET /api/capsules/:capsuleId
// @access  Private
const getCapsuleById = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const capsule = await Capsule.findOne({
    _id: req.params.capsuleId,
    user: req.user._id,
  });

  if (!capsule) {
    return res.status(404).json({ success: false, error: "Capsule not found" });
  } else if (capsule.isHidden) {
    return res
      .status(403)
      .json({ success: false, error: "Access to this capsule is restricted" });
  } else if (new Date(capsule.deadline) > currentDate) {
    // If the deadline has not passed, do not show the body
    const modifiedCapsule = {
      ...capsule._doc,
      body: "This content is locked until the deadline.",
    };
    return res.status(200).json({ success: true, data: modifiedCapsule });
  } else {
    return res.status(200).json({ success: true, data: capsule });
  }
});

// @desc    Create Capsule
// @route   POST /api/capsules
// @access  Private
const createCapsule = asyncHandler(async (req, res) => {
  const { capsuleBody, deadline } = req.body;
  const user = req.user;
  console.log("user in createCapsule", user);
  const price = capsuleBody.length;

  const newCapsule = new Capsule({
    user: user._id,
    body: capsuleBody,
    deadline: deadline,
    price: price,
  });

  // Check the current balance of the user
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const costOfCapsule = price;
  if (currentUser.balance < costOfCapsule) {
    return res.status(400).json({ message: "Balance too low for this post" });
  }

  currentUser.balance -= costOfCapsule;
  console.log("balance updated in database");
  const newUser = await currentUser.save();
  console.log("user saved in database");
  const newBalance = newUser.balance;

  const createdCapsule = await newCapsule.save();
  // console.log("createdCapsule", createdCapsule);
  console.log("Capsule created successfully");
  res.status(201).json({
    success: true,
    message: "Capsule created successfully",
    data: createdCapsule,
    savedComment,
    newBalance,
  });
});

// @desc    Delete Capsule
// @route   DELETE /api/capsules/:capsuleId
// @access  Private
const deleteCapsule = asyncHandler(async (req, res) => {
  const capsule = await Capsule.findById(req.params.capsuleId);

  if (!capsule) {
    return res.status(404).json({ success: false, error: "Capsule not found" });
  } else if (capsule.user.toString() !== req.user._id.toString()) {
    // Ensure string comparison
    // Forbidden access if the user does not own the capsule
    return res.status(403).json({
      success: false,
      error: "User not authorized to perform this action",
    });
  } else {
    capsule.isHidden = true;
    await capsule.save();
    res.status(200).json({ success: true, data: {} });
  }
});

// @desc    Update Capsule
// @route   PATCH /api/capsules/capsuleId
// @access  Private
// const openCapsule = asyncHandler(async (req, res) => {
//   try {
//     const capsule = await Capsule.findById(req.params.capsuleId);
//     if (!capsule) {
//       res.status(404).json({ success: false, error: "Capsule not found" });
//     } else {
//       capsule.isLocked = false;
//       await capsule.save();
//       res.status(200).json({ success: true, data: capsule });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

export { getCapsuleById, deleteCapsule, createCapsule, getCapsules };
