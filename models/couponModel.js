// backend/models/couponModel.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    validity: {
      type: Date, // Using the Date type
      required: true,
      default: function () {
        // Dynamically calculate the date 4 months from now
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 4);
        return currentDate;
      },
    },
    label: {
      type: String, // name of the coupon
      required: true,
      unique: true,
    },
    type: {
      type: String,
      default: "referral",
      enum: ["referral", "topup"], // careful with "topup", user must not be able to use it several times
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    tokensGranted: {
      type: Number,
      required: true,
      default: 100000, // 100000 tokens
    },
    usageCap: {
      type: Number,
      required: true,
      default: 30000,
    },
    usageCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
