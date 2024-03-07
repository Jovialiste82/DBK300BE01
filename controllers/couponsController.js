// backend/models/couponModel.js
import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

// Create a coupon with a unique invitation code
export const generateInvitationCode = asyncHandler(async (req, res) => {
  // Check if the user is not an admin and then check the last coupon created by the user
  if (req.user.role !== "admin") {
    const lastCoupon = await Coupon.findOne({ origin: req.user._id }).sort({
      createdAt: -1,
    });

    // Check if the last coupon's usage hasn't reached its cap
    if (lastCoupon && lastCoupon.usageCount < lastCoupon.usageCap) {
      return res.status(400).json({
        message:
          "You still have an active coupon that hasn't reached its usage cap.",
        coupon: lastCoupon,
      });
    }
  }

  const generateRandomCode = () => {
    let label = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 20; i++) {
      label += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return label;
  };

  let label;
  let existingCoupon;
  do {
    label = generateRandomCode();
    existingCoupon = await Coupon.findOne({ label });
  } while (existingCoupon);

  const coupon = new Coupon({
    origin: req.user._id,
    label,
    type: "referral",
    usageCap: 10,
    usageCount: 0, // Assuming this is the initial count
  });

  const savedCoupon = await coupon.save();
  res.status(201).json(savedCoupon);
});
