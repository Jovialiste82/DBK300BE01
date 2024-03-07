// backend/models/postModel.js
import mongoose from "mongoose";
// Assuming Room model is imported correctly
import Room from "./roomModel.js"; // Ensure this path is correct

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    isAdminPost: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Post save hook to update Room's postCount
postSchema.post("save", async function (doc, next) {
  try {
    await Room.findByIdAndUpdate(doc.room, { $inc: { postCount: 1 } });
  } catch (error) {
    console.error("Error updating room postCount:", error);
    next(error);
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
