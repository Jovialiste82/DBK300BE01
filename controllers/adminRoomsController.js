// backend/controllers/adminRoomsController.js
import asyncHandler from "express-async-handler";
import Room from "../models/roomModel.js";
import Post from "../models/postModel.js";

// @desc    Get room stats
// @route   GET /api/admin/rooms/stats
// @access  Private/Admin
// Need rework ! Does not work properly
const getRoomsStats = asyncHandler(async (req, res) => {
  const totalRooms = await Room.countDocuments();

  // Aggregate top 5 rooms with the most users
  const topRoomsByUsers = await Room.aggregate([
    {
      $project: {
        label: 1,
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Helper function to get top 5 rooms by a certain criteria within an optional time frame
  const getTopRooms = async (model, matchField, timeFrame) => {
    const match = timeFrame
      ? { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      : {};
    return model.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$" + matchField,
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          label: "$room.label",
          count: 1,
        },
      },
    ]);
  };

  const topRoomsByPosts = await getTopRooms(Post, "room", false);
  const topRoomsByPostsLast24Hours = await getTopRooms(Post, "room", true);
  console.log("topRoomsByUsers", topRoomsByUsers);
  res.json({
    totalRooms,
    topRoomsByUsers,
    topRoomsByPosts,
    topRoomsByPostsLast24Hours,
  });
});

export { getRoomsStats };
