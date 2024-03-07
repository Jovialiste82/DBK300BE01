// backend/models/badgeModel.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  label: {
    type: String,
    required: true,
    enum: [
      "Global VIP",
      "National VIP",
      "Local VIP",
      "Benefactor",
      "MENSA",
      "Nobel Laureate",
      "Oscar Winner",
    ],
  },
  weight: {
    type: Number,
    required: true,
    default: 1,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isHidden: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
