// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  console.log("req.body", req.body);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("No user found with this id");
      }

      if (user.isFrozen) {
        res.status(401);
        throw new Error("User is blocked. Please contact support.");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const isAdmin = user.role === "admin";

  if (isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

export { protect, admin };
