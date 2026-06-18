import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking, checkConflict } from '@/lib/db/bookings';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const body = await request.json();
    const { user_name, user_email, purpose, start_time, end_time } = body;

    // Check for time conflicts (excluding current booking)
    if (start_time || end_time) {
      const existingBooking = await getBookingById(bookingId);
      if (existingBooking) {
        const newStart = start_time || existingBooking.start_time;
        const newEnd = end_time || existingBooking.end_time;
        if (await checkConflict(newStart, newEnd, bookingId)) {
          return NextResponse.json(
            { error: 'Time slot already booked' },
            { status: 409 }
          );
        }
      }
    }

    const updated = await updateBooking(bookingId, {
      user_name,
      user_email,
      purpose,
      start_time,
      end_time,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const deleted = await deleteBooking(bookingId);
    if (!deleted) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
