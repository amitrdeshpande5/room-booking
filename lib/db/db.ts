import sql from 'postgres';

// Create a reusable query client
let client: ReturnType<typeof sql> | null = null;

export function getClient() {
  if (client) return client;

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  client = sql(connectionString);

  return client;
}

export async function initDatabase() {
  const db = getClient();

  // Create tables if they don't exist
  await db`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      room_name VARCHAR(255) NOT NULL DEFAULT 'Meeting Room A',
      user_name VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      purpose TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(start_time, end_time)
    );
  `;

  // Create indexes
  await db`
    CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
  `;
  
  await db`
    CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);
  `;

  console.log('Database initialized successfully');
}

export async function closeDatabase() {
  if (client) {
    await client.end();
    client = null;
  }
}
