// backend/middleware/invitationMiddleware.js
import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

const checkCoupon = asyncHandler(async (req, res, next) => {
  const { coupon } = req.body;
  console.log("coupon", coupon);
  const couponDoc = await Coupon.findOne({ label: coupon });
  console.log("couponDoc", couponDoc);

  if (!couponDoc) {
    res.status(401);
    throw new Error("Invitation code not valid (3)");
  }

  if (!couponDoc.isActive) {
    res.status(401);
    throw new Error("Invitation code not valid (4)");
  }

  if (couponDoc.validity < new Date()) {
    res.status(401);
    throw new Error("Invitation code not valid (5)");
  }

  if (couponDoc.usageCount >= couponDoc.usageCap) {
    res.status(401);
    throw new Error("Invitation code not valid (6)");
  }

  const couponPresent = !!couponDoc;

  console.log("couponDoc 1", couponDoc);

  if (couponPresent) {
    try {
      req.couponDoc = couponDoc;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Invitation code not valid (1)");
    }
  } else {
    res.status(401);
    throw new Error("Invitation code not valid (2)");
  }
});

export { checkCoupon };
