const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database("./ledger.db");

// Create 'parties' table
db.run(`
  CREATE TABLE IF NOT EXISTS parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT
  )
`);

// Create 'ledger_entries' table
db.run(`
  CREATE TABLE IF NOT EXISTS ledger_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    party_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('credit', 'debit')) NOT NULL,
    amount REAL NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (party_id) REFERENCES parties(id)
  )
`);

// ================== ROUTES ================== //

// Get all parties
app.get("/api/parties", (req, res) => {
  db.all(`SELECT * FROM parties`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch parties" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Get a single party by ID
app.get("/api/parties/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM parties WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch party" });
    } else if (!row) {
      res.status(404).json({ error: "Party not found" });
    } else {
      res.status(200).json(row);
    }
  });
});

// Add a new party
app.post("/api/parties", (req, res) => {
  const { name, contact } = req.body;

  db.run(
    `INSERT INTO parties (name, contact) VALUES (?, ?)`,
    [name, contact],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add party" });
      } else {
        res.status(200).json({ message: "Party added", id: this.lastID });
      }
    }
  );
});

// Get all ledger entries for a party
app.get("/api/ledger/:partyId", (req, res) => {
  const { partyId } = req.params;

  db.all(
    `SELECT * FROM ledger_entries WHERE party_id = ? ORDER BY date DESC`,
    [partyId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch ledger entries" });
      } else {
        res.status(200).json(rows);
      }
    }
  );
});

// Add a ledger entry
app.post("/api/ledger", (req, res) => {
  const { party_id, type, amount, note, date } = req.body;

  db.run(
    `
    INSERT INTO ledger_entries (party_id, type, amount, note, date)
    VALUES (?, ?, ?, ?, ?)
    `,
    [party_id, type, amount, note, date],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add ledger entry" });
      } else {
        res.status(200).json({ message: "Entry added", id: this.lastID });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
