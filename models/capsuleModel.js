import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isLocked: {
      type: Boolean,
      required: true,
      default: true,
    },
    isHidden: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Capsule = mongoose.model("Capsule", capsuleSchema);

export default Capsule;
