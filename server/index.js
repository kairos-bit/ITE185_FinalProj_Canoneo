// server/index.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 4000;
const bcrypt = require("bcryptjs"); // 👈 add this


// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Open / create SQLite DB file
const dbPath = path.join(__dirname, "app.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database at", dbPath);
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Members table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idNumber TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      profileImage TEXT
    )
  `,
    (err) => {
      if (err) console.error("Error creating members table:", err.message);
    }
  );

  // Tasks table (we'll wire this up later on the frontend)
  db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    writerId TEXT,
    mediaId TEXT,
    status TEXT,
    date TEXT
  )
  `,
    (err) => {
      if (err) console.error("Error creating tasks table:", err.message);
    }
  );
   db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating users table:", err.message);
    }
  );
});

//
// MEMBERS API
//

// GET all members
app.get("/api/members", (req, res) => {
  db.all(
    "SELECT idNumber, name, role, profileImage FROM members ORDER BY idNumber",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching members:", err.message);
        return res.status(500).json({ error: "Failed to fetch members" });
      }
      res.json(rows);
    }
  );
});

// POST create member
app.post("/api/members", (req, res) => {
  const { idNumber, name, role, profileImage } = req.body;

  if (!idNumber || !name || !role) {
    return res
      .status(400)
      .json({ error: "idNumber, name, and role are required" });
  }

  const sql =
    "INSERT INTO members (idNumber, name, role, profileImage) VALUES (?, ?, ?, ?)";
  const params = [idNumber.trim(), name.trim(), role, profileImage || null];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error inserting member:", err.message);
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "ID number already exists" });
      }
      return res.status(500).json({ error: "Failed to add member" });
    }

    // Return the created member
    res.status(201).json({
      idNumber: idNumber.trim(),
      name: name.trim(),
      role,
      profileImage: profileImage || null,
    });
  });
});

// PUT update member by idNumber
app.put("/api/members/:idNumber", (req, res) => {
  const oldIdNumber = req.params.idNumber;
  const { newIdNumber, name, role, profileImage } = req.body;

  const stmt = db.prepare(
    `
    UPDATE members
    SET idNumber = ?, name = ?, role = ?, profileImage = ?
    WHERE idNumber = ?
  `
  );

  stmt.run(
    newIdNumber,
    name,
    role,
    profileImage || null,
    oldIdNumber,
    function (err) {
      if (err) {
        console.error("Failed to update member:", err.message);
        return res.status(500).json({ error: "Failed to update member" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Cascade ID change to tasks (if ID number itself changed)
      db.serialize(() => {
        db.run(
          `
          UPDATE tasks
          SET writerId = ?
          WHERE writerId = ?
        `,
          [newIdNumber, oldIdNumber],
          (err2) => {
            if (err2) {
              console.error(
                "Failed to cascade writerId update in tasks:",
                err2.message
              );
            }
          }
        );

        db.run(
          `
          UPDATE tasks
          SET mediaId = ?
          WHERE mediaId = ?
        `,
          [newIdNumber, oldIdNumber],
          (err3) => {
            if (err3) {
              console.error(
                "Failed to cascade mediaId update in tasks:",
                err3.message
              );
            }
          }
        );

        // 🔹 Role-based cleanup:

        // If this member is now a Writer, they should not be in mediaId
        if (role === "Writer") {
          db.run(
            `
            UPDATE tasks
            SET mediaId = NULL
            WHERE mediaId = ?
          `,
            [newIdNumber],
            (err4) => {
              if (err4) {
                console.error(
                  "Failed to clear mediaId for new Writer:",
                  err4.message
                );
              }
            }
          );
        }

        // If this member is now Photo/Video, they should not be in writerId
        if (role === "Photojournalist" || role === "Videojournalist") {
          db.run(
            `
            UPDATE tasks
            SET writerId = NULL
            WHERE writerId = ?
          `,
            [newIdNumber],
            (err5) => {
              if (err5) {
                console.error(
                  "Failed to clear writerId for new Photo/Video:",
                  err5.message
                );
              }
            }
          );
        }
      });

      res.json({
        idNumber: newIdNumber,
        name,
        role,
        profileImage: profileImage || null,
      });
    }
  );
});


// DELETE member by idNumber
app.delete("/api/members/:idNumber", (req, res) => {
  const { idNumber } = req.params;

  db.run(
    "DELETE FROM members WHERE idNumber = ?",
    [idNumber],
    function (err) {
      if (err) {
        console.error("Error deleting member:", err.message);
        return res.status(500).json({ error: "Failed to delete member" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ success: true });
    }
  );
});

// Simple health check
app.get("/", (req, res) => {
  res.send("Silahis backend is running");
});

// Start server
app.listen(PORT, () => {  
  console.log(`Server running on http://localhost:${PORT}`);
});

//
// TASKS API
//

// GET all tasks
// ============ TASKS API ============

// Get all tasks
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("Failed to fetch tasks:", err.message);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
    res.json(rows);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, writerId, mediaId, status, date } = req.body;

  const stmt = db.prepare(
    `
    INSERT INTO tasks (title, description, writerId, mediaId, status, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  );

  stmt.run(
    title,
    description || "",
    writerId,
    mediaId,
    status || "Planned",
    date || null,
    function (err) {
      if (err) {
        console.error("Failed to insert task:", err.message);
        return res.status(500).json({ error: "Failed to insert task" });
      }

      // send the new task back, including date
      res.json({
        id: this.lastID,
        title,
        description: description || "",
        writerId,
        mediaId,
        status: status || "Planned",
        date: date || null,
      });
    }
  );
});
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, writerId, mediaId, status, date } = req.body;

  const stmt = db.prepare(
    `
    UPDATE tasks
    SET title = ?, description = ?, writerId = ?, mediaId = ?, status = ?, date = ?
    WHERE id = ?
  `
  );

  stmt.run(
    title,
    description || "",
    writerId,
    mediaId,
    status || "Planned",
    date || null,
    id,
    function (err) {
      if (err) {
        console.error("Failed to update task:", err.message);
        return res.status(500).json({ error: "Failed to update task" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({
        id: Number(id),
        title,
        description: description || "",
        writerId,
        mediaId,
        status: status || "Planned",
        date: date || null,
      });
    }
  );
});


// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Error deleting task:", err.message);
      return res.status(500).json({ error: "Failed to delete task" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  });
});
