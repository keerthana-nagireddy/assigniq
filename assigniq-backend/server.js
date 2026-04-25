const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔌 CONNECT TO POSTGRES */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "assigniq",
  password: "keeru",
  port: 5432,
});

/* 🔥 CREATE SERVER + SOCKET */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* 🔌 SOCKET CONNECTION */
io.on("connection", (socket) => {
  console.log("⚡ User connected");

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

/* 📥 GET ALL TASKS */
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ GET error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/* ➕ ADD TASK (WITH DEADLINE ✅) */
app.post("/tasks", async (req, res) => {
  try {
    const { id, title, type, status, assignee, deadline } = req.body;

    await pool.query(
      `INSERT INTO tasks 
       (id, title, type, status, assignee, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, title, type, status, assignee, deadline]
    );

    console.log("➕ Added:", req.body);

    io.emit("taskAdded", req.body);

    res.json(req.body);
  } catch (err) {
    console.error("❌ ADD error:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

/* 🔄 UPDATE TASK STATUS */
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("🔄 Updated ID:", id, "→", status);

    io.emit("taskUpdated", { id, status });

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error("❌ UPDATE error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

/* 🗑 DELETE TASK */
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("🗑 Deleted ID:", id);

    io.emit("taskDeleted", { id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

/* 🧪 HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("PostgreSQL + Socket.io Connected 🚀");
});

/* 🚀 START SERVER */
server.listen(5000, () => {
  console.log("🔥 Server running on http://localhost:5000");
});