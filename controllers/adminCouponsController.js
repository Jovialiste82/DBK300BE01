import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

// @desc    Freeze a coupon
// @route   PATCH /api/admin/coupons/freeze
// @access  Private/Admin
export const freezeCoupon = asyncHandler(async (req, res) => {
  const { label } = req.body; // Assuming label is passed in the body of the request
  const coupon = await Coupon.findOneAndUpdate(
    { label: label },
    { isActive: false },
    { new: true }
  );

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  res.json({
    message: `Coupon ${label} has been frozen.`,
    coupon,
  });
});

// @desc    Create a coupon
// @route   POST /api/admin/coupons/create
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    user,
    origin,
    validity,
    label,
    type,
    tokensGranted,
    usageCap,
    usageCount,
  } = req.body;

  // You could add validation here to ensure all required fields are present

  const couponExists = await Coupon.findOne({ label });

  if (couponExists) {
    res.status(400);
    throw new Error("Coupon label already exists");
  }

  const coupon = new Coupon({
    user,
    origin,
    validity,
    label,
    type,
    isActive: true, // Coupons are active by default
    tokensGranted,
    usageCap,
    usageCount,
  });

  const createdCoupon = await coupon.save();

  res.status(201).json(createdCoupon);
});

// @desc    Get total number of coupons
// @route   GET /api/admin/coupons/count
// @access  Private/Admin
export const getCouponsCount = asyncHandler(async (req, res) => {
  const count = await Coupon.countDocuments();
  res.json({ totalCoupons: count });
});
