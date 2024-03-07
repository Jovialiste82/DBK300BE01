// backend/controllers/postsController.js
import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
import { formatRoomLabel } from "../utils/formatRoomLabel.js"; // Import formatRoomLabel function
import { subDays } from "date-fns"; // Import subDays function from date-fns
import { io } from "../index.js"; // Ensure you export `io` from your `index.js`

// @desc    Fetch posts created within the last 24 hours with user information for a specific room
// @route   GET /api/posts?room=RoomLabel
// @access  Private
const getPostsWithUsers = asyncHandler(async (req, res) => {
  const { room: roomLabel } = req.query; // Retrieve room label from query parameters

  // First, find the Room document by its label
  const room = await Room.findOne({ label: formatRoomLabel(roomLabel) });

  if (!room) {
    return res.status(404).send({ message: "Room not found" });
  }

  // Calculate the date 24 hours ago from the current time
  const twentyFourHoursAgo = subDays(new Date(), 1);

  // Fetch posts for the given room ObjectId created within the last 24 hours and populate the 'user' field
  const posts = await Post.find({
    room: room._id,
    createdAt: { $gte: twentyFourHoursAgo },
  }).populate("user", "username");

  // console.log("Posts within the last 24 hours: ", posts);
  res.json(posts);
});

// @desc    Fetch specific post by ID
// @route   GET /api/posts/:postId
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  // Fetch post by ID and populate the 'user' field with user information
  const post = await Post.findById(req.params.postId).populate(
    "user",
    "username"
  );
  const newPost = {
    _id: post._id,
    body: post.body,
    price: post.price,
    createdAt: post.createdAt,
    username: post.user.username,
  };
  console.log("Post 122: ", newPost);
  res.json(newPost);
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { postText, roomLabel } = req.body;
  const user = req.user;

  const formattedRoomLabel = formatRoomLabel(roomLabel);
  console.log("formattedRoomLabel", formattedRoomLabel);
  // Find the room by its label
  const room = await Room.findOne({ label: formattedRoomLabel });
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Check the current balance of the user
  const currentUser = await User.findById(user._id);
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const costOfPost = postText.length;
  if (currentUser.balance < costOfPost) {
    return res.status(400).json({ message: "Balance too low for this post" });
  }

  // Deduct the cost from the user's balance and save
  console.log("currentUser.balance", currentUser.balance);
  console.log("costOfPost", costOfPost);
  console.log(
    "currentUser.balance - costOfPost",
    currentUser.balance - costOfPost
  );
  currentUser.balance -= costOfPost;
  console.log("balance updated in database");
  const newUser = await currentUser.save();
  console.log("user saved in database");
  const newBalance = newUser.balance;

  // Create the post
  const post = new Post({
    user: user._id,
    room: room._id,
    body: postText,
  });

  const savedPost = await post.save();
  console.log("savedPost", savedPost);
  res
    .status(201)
    .json({ message: "Post created successfully", savedPost, newBalance });
  console.log("post saved in database");
  io.emit("new post", { data: savedPost });
  console.log("io emitted");
});

// @desc    Delete post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  // Find the post by ID and delete it
  const post = await Post.findById(req.params.postId);
  if (post) {
    await post.remove();
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Update post
// @route   PUT /api/posts/:postId
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  // Find the post by ID and update it
  const post = await Post.findById(req.params.postId);
  if (post) {
    post.body = req.body.body || post.body;
    post.price = req.body.price || post.price;
    post.createdAt = req.body.createdAt || post.createdAt;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

export { getPostsWithUsers, getPostById, createPost, deletePost, updatePost };
