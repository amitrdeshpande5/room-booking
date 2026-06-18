import { getClient, initDatabase, closeDatabase } from './db';

export interface Booking {
  id: number;
  room_name: string;
  user_name: string;
  user_email: string;
  purpose: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

// Initialize database on import
let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    try {
      await initDatabase();
      initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  await ensureInitialized();
  const db = getClient();
  
  const bookings = await db`
    SELECT * FROM bookings 
    ORDER BY start_time ASC
  `;
  
  return bookings as unknown as Booking[];
}

export async function getBookingById(id: number): Promise<Booking | null> {
  await ensureInitialized();
  const db = getClient();
  
  const bookings = await db`
    SELECT * FROM bookings WHERE id = ${id}
  `;
  
  return bookings.length > 0 ? (bookings[0] as unknown as Booking) : null;
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
): Promise<Booking> {
  await ensureInitialized();
  const db = getClient();
  
  const now = new Date().toISOString();
  
  const result = await db`
    INSERT INTO bookings (room_name, user_name, user_email, purpose, start_time, end_time, created_at, updated_at)
    VALUES (${booking.room_name}, ${booking.user_name}, ${booking.user_email}, ${booking.purpose}, ${booking.start_time}, ${booking.end_time}, ${now}, ${now})
    RETURNING *
  `;

  return result[0] as unknown as Booking;
}

export async function updateBooking(
  id: number,
  booking: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
): Promise<Booking | null> {
  await ensureInitialized();
  const db = getClient();
  
  const existing = await getBookingById(id);
  if (!existing) return null;

  const updated = {
    user_name: booking.user_name ?? existing.user_name,
    user_email: booking.user_email ?? existing.user_email,
    purpose: booking.purpose ?? existing.purpose,
    start_time: booking.start_time ?? existing.start_time,
    end_time: booking.end_time ?? existing.end_time,
  };

  const now = new Date().toISOString();

  const result = await db`
    UPDATE bookings 
    SET user_name = ${updated.user_name}, user_email = ${updated.user_email}, purpose = ${updated.purpose}, start_time = ${updated.start_time}, end_time = ${updated.end_time}, updated_at = ${now}
    WHERE id = ${id}
    RETURNING *
  `;

  return result.length > 0 ? (result[0] as unknown as Booking) : null;
}

export async function deleteBooking(id: number): Promise<boolean> {
  await ensureInitialized();
  const db = getClient();
  
  const result = await db`
    DELETE FROM bookings WHERE id = ${id}
  `;
  
  return result.count > 0;
}

export async function checkConflict(
  startTime: string,
  endTime: string,
  excludeId?: number
): Promise<boolean> {
  await ensureInitialized();
  const db = getClient();
  
  let query;
  if (excludeId) {
    query = await db`
      SELECT COUNT(*) as count FROM bookings 
      WHERE (start_time < ${endTime} AND end_time > ${startTime})
      AND id != ${excludeId}
    `;
  } else {
    query = await db`
      SELECT COUNT(*) as count FROM bookings 
      WHERE (start_time < ${endTime} AND end_time > ${startTime})
    `;
  }
  
  const result = query as unknown as { count: string | number }[];
  const count = typeof result[0]?.count === 'string' ? parseInt(result[0].count) : result[0]?.count || 0;
  return count > 0;
}

// Export cleanup function for graceful shutdown
export { closeDatabase };
