// backend/models/advertisementModel.js
import mongoose from "mongoose";

const advertisementModel = new mongoose.Schema(
  {
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    label: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    businessUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isClickable: {
      type: Boolean,
      required: true,
      default: false,
    },
    validity: {
      type: Date, // Using the Date type
      required: true,
      default: function () {
        // Dynamically calculate the date 1 month from now
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        return currentDate;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model("Badge", badgeSchema);

export default advertisementModel;
