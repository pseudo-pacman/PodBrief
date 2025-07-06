const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, 'podbrief.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err.message);
        reject(err);
        return;
      }

      // Create Guests table
      const createGuestsTable = `
        CREATE TABLE IF NOT EXISTS guests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          link TEXT,
          topic TEXT,
          interview_style TEXT DEFAULT 'Professional',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(createGuestsTable, (err) => {
        if (err) {
          console.error('Error creating guests table:', err.message);
          reject(err);
          return;
        }

        // Add interview_style column if it doesn't exist (migration)
        db.all("PRAGMA table_info(guests)", (err, rows) => {
          if (err) {
            console.error('Error checking table schema:', err.message);
            reject(err);
            return;
          }
          
          // Check if interview_style column exists
          const hasInterviewStyle = rows.some(row => row.name === 'interview_style');
          if (!hasInterviewStyle) {
            db.run('ALTER TABLE guests ADD COLUMN interview_style TEXT DEFAULT "Professional"', (err) => {
              if (err) {
                console.error('Error adding interview_style column:', err.message);
                reject(err);
                return;
              }
              console.log('Added interview_style column to guests table');
            });
          }
        });

        // Create Briefs table
        const createBriefsTable = `
          CREATE TABLE IF NOT EXISTS briefs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guest_id INTEGER NOT NULL,
            bio TEXT NOT NULL,
            questions TEXT NOT NULL,
            intro TEXT NOT NULL,
            outro TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE
          )
        `;

        db.run(createBriefsTable, (err) => {
          if (err) {
            console.error('Error creating briefs table:', err.message);
            reject(err);
            return;
          }

          console.log('Database tables created successfully');
          resolve();
        });
      });
    });
  });
}

// Database operations
const dbOperations = {
  // Create a new guest
  createGuest: (guestData) => {
    return new Promise((resolve, reject) => {
      const { name, link, topic, interviewStyle } = guestData;
      const sql = `
        INSERT INTO guests (name, link, topic, interview_style)
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(sql, [name, link || null, topic || null, interviewStyle || 'Professional'], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, link, topic, interviewStyle: interviewStyle || 'Professional' });
        }
      });
    });
  },

  // Create a new brief
  createBrief: (briefData) => {
    return new Promise((resolve, reject) => {
      const { guestId, bio, questions, intro, outro } = briefData;
      const sql = `
        INSERT INTO briefs (guest_id, bio, questions, intro, outro)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(sql, [
        guestId, 
        bio, 
        JSON.stringify(questions), 
        intro, 
        outro
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            guestId, 
            bio, 
            questions, 
            intro, 
            outro 
          });
        }
      });
    });
  },

  // Get brief by ID
  getBrief: (briefId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          b.id,
          b.guest_id as guestId,
          b.bio,
          b.questions,
          b.intro,
          b.outro,
          b.created_at as createdAt,
          g.name as guestName,
          g.link as guestLink,
          g.topic as guestTopic,
          g.interview_style as interviewStyle
        FROM briefs b
        JOIN guests g ON b.guest_id = g.id
        WHERE b.id = ?
      `;
      
      db.get(sql, [briefId], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            ...row,
            questions: JSON.parse(row.questions)
          });
        }
      });
    });
  },

  // Get all briefs
  getAllBriefs: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          b.id,
          b.guest_id as guestId,
          b.bio,
          b.questions,
          b.intro,
          b.outro,
          b.created_at as createdAt,
          g.name as guestName,
          g.link as guestLink,
          g.topic as guestTopic,
          g.interview_style as interviewStyle
        FROM briefs b
        JOIN guests g ON b.guest_id = g.id
        ORDER BY b.created_at DESC
      `;
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            ...row,
            questions: JSON.parse(row.questions)
          })));
        }
      });
    });
  },

  // Delete a brief
  deleteBrief: (briefId) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM briefs WHERE id = ?`;
      
      db.run(sql, [briefId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedRows: this.changes });
        }
      });
    });
  }
};

module.exports = {
  initDatabase,
  db: dbOperations
}; 