require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const redisClient = require("./config/redis");

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ SOCKET AUTH MIDDLEWARE (IMPORTANT)
io.use((socket, next) => {
  console.log("🔥 AUTH CHECK");

  const token = socket.handshake.auth?.token;

  if (!token || token === "") {
    console.log("❌ No token provided");
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    console.log("✅ Token valid");
    next();
  } catch (err) {
    console.log("❌ Invalid token");
    return next(new Error("Invalid token"));
  }
});

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

 socket.on("joinProject", async (projectId) => {
  console.log("📦 Joined room:", projectId);

  socket.join(projectId); // join first (important)

  try {
    if (redisClient && redisClient.isOpen) {
    console.log("⚠️ Redis skipped (not connected)");

      const value = await redisClient.get(socket.id);
      console.log("🔴 Redis stored:", value);
    } else {
      console.log("⚠️ Redis not connected, skipping...");
    }
  } catch (err) {
    console.log("⚠️ Redis error, skipping...");
  }
});

  socket.on("disconnect", async () => {
  console.log("🔴 User disconnected:", socket.id);

  try {
    if (redisClient && redisClient.isOpen) {
     
      console.log("🧹 Redis deleted:", socket.id);
    }
  } catch (err) {
    console.log("⚠️ Redis delete skipped");
  }
});
});

// ✅ Make io available in controllers
app.set("io", io);
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);
// ✅ Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});