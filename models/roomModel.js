// backend/models/roomModel.js
import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    label: {
      type: String, // formats: "1982", "02-27", "1982-02-27"
      required: true,
      unique: true,
    },
    userCount: {
      type: Number,
      required: true,
      default: 1, // Starts with 1 when a room is first created
    },
    postCount: {
      type: Number,
      required: true,
      default: 0, // Starts with 1 when a room is first created
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
