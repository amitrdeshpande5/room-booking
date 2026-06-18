import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function initDatabase() {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'bookings.db');
  
  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_name TEXT NOT NULL DEFAULT 'Meeting Room A',
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      purpose TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(start_time, end_time)
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
    CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);
  `);

  return db;
}

export function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db!;
}
