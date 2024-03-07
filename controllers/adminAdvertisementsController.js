// backend/controllers/advertisementController.js
// Not in use at the moment
import asyncHandler from "express-async-handler";
import Advertisement from "../models/advertisementModel.js";

// @desc    Create a new Advertisement
// @route   POST /api/admin/advertisements
// @access  Private / Admin
const createAdvertisement = asyncHandler(async (req, res) => {
  const {
    advertiser,
    label,
    imageUrl,
    businessUrl,
    isActive,
    isClickable,
    validity,
  } = req.body;

  // Create Advertisement
  const advertisement = await Advertisement.create({
    advertiser,
    label,
    imageUrl,
    businessUrl,
    isActive,
    isClickable,
    validity,
  });

  if (advertisement) {
    res.status(201).json(advertisement);
  } else {
    res.status(400);
    throw new Error("Invalid Advertisement data");
  }
});

export { createAdvertisement };
