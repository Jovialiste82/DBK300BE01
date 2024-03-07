// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import capsuleRoutes from "./routes/capsuleRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// Load environment variables from a .env file
dotenv.config();

// Connect to the database
connectDB();

// Create an Express app
const app = express();

// CORS options for Express
// Development
// const corsOptions = {
//   origin: [
//     "http://192.168.0.213:3000",
//     "http://localhost:3000",
//     "http://frontend.com:3000",
//   ], // Array of allowed origins
//   credentials: true, // Allowing credentials is important for sessions/cookies
// };

const corsOptions = {
  origin: [
    "https://dobkonektor.com", // Production domain over HTTPS
    "https://193.203.169.236", // Direct IP access for testing (consider switching to HTTPS)
  ],
  credentials: true, // Important for sessions or when using cookies / authentication headers
};

app.use(cors(corsOptions));

// Create an HTTP server from the Express app
const httpServer = http.createServer(app);

// Attach HTTP server to the io server with CORS options for Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: ["https://193.203.169.236", "https://dobkonektor.com"], // Match the allowed origins
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);
    io.emit("chat message", msg); // Broadcast the message to all connected clients
  });
});

// Additional middleware configurations for security and data parsing
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/capsules", capsuleRoutes);
app.use("/api/coupons", couponRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.send("OK");
});

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running ....");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server setup
console.log("process.env.IO_PORT", process.env.IO_PORT);
const port = process.env.IO_PORT || 6002; // Using APP_PORT for Express to avoid confusion with Socket.IO port
httpServer.listen(port, "0.0.0.0", () =>
  console.log(`IO Server started on port ${port}`)
);

export default app;
