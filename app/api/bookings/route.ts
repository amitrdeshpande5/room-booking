import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, createBooking, checkConflict } from '@/lib/db/bookings';

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_name, user_email, purpose, start_time, end_time } = body;

    // Validate inputs
    if (!user_name || !user_email || !purpose || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for conflicts
    if (await checkConflict(start_time, end_time)) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    const booking = await createBooking({
      room_name: 'Meeting Room A',
      user_name,
      user_email,
      purpose,
      start_time,
      end_time,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
