// server/db-menu.js
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");

// Connect to your database
const db = new sqlite3.Database("./app.db", (err) => {
  if (err) console.error("DB error:", err);
});

// Terminal input setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main Menu
function showMenu() {
  console.log("\n========== DATABASE MENU ==========");
  console.log("1. Show all members");
  console.log("2. Show all tasks");
  console.log("3. Show tasks by status");
  console.log("4. Show tasks by member ID");
  console.log("5. Exit");
  console.log("====================================");

  rl.question("Choose an option (1-5): ", (choice) => {
    switch (choice) {
      case "1":
        showMembers();
        break;
      case "2":
        showTasks();
        break;
      case "3":
        askStatus();
        break;
      case "4":
        askMember();
        break;
      case "5":
        console.log("Goodbye!");
        rl.close();
        db.close();
        break;
      default:
        console.log("Invalid option!");
        showMenu();
    }
  });
}

// Option 1 — Show Members
function showMembers() {
  db.all("SELECT idNumber, name, role FROM members", (err, rows) => {
    if (err) return console.error(err);

    console.log("\n--- MEMBERS ---");
    rows.forEach((row) => {
      console.log(`${row.idNumber} | ${row.name} | ${row.role}`);
    });

    showMenu();
  });
}

// Option 2 — Show Tasks
function showTasks() {
  db.all(
    `SELECT id, title, description, writerId, mediaId, status, date 
     FROM tasks`,
    (err, rows) => {
      if (err) return console.error(err);

      console.log("\n--- TASKS ---");
      rows.forEach((row) => {
        console.log(
          `${row.id} | ${row.title} | ${row.status} | Writer: ${row.writerId} | Media: ${row.mediaId} | Date: ${row.date}`
        );
      });

      showMenu();
    }
  );
}

// Option 3 — Ask for Status Input
function askStatus() {
  rl.question("Enter status (Planned / In Progress / Completed): ", (status) => {
    db.all(
      `SELECT id, title, status FROM tasks WHERE status = ?`,
      [status],
      (err, rows) => {
        if (err) return console.error(err);

        console.log(`\n--- TASKS WITH STATUS: ${status} ---`);
        rows.forEach((row) => {
          console.log(`${row.id} | ${row.title} | ${row.status}`);
        });

        showMenu();
      }
    );
  });
}

// Option 4 — Ask for Member ID Input
function askMember() {
  rl.question("Enter member ID number (e.g., 2022-0001): ", (idNumber) => {
    db.all(
      `SELECT id, title, status FROM tasks 
       WHERE writerId = ? OR mediaId = ?`,
      [idNumber, idNumber],
      (err, rows) => {
        if (err) return console.error(err);

        console.log(`\n--- TASKS ASSIGNED TO ${idNumber} ---`);
        rows.forEach((row) => {
          console.log(`${row.id} | ${row.title} | ${row.status}`);
        });

        showMenu();
      }
    );
  });
}

// Start program
showMenu();
