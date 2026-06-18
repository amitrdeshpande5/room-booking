'use client';

import { useState, useEffect } from 'react';
import BookingForm from '@/app/components/BookingForm';
import BookingList from '@/app/components/BookingList';
import { Booking } from '@/lib/db/bookings';

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings. Please refresh the page.');
      console.error(err);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (selectedBooking) {
        // Update existing booking
        const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update booking');
        }

        setSelectedBooking(null);
      } else {
        // Create new booking
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create booking');
        }
      }

      await fetchBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      await fetchBookings();
    } catch (err) {
      setError('Failed to delete booking');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Meeting Room Booking</h1>
          <p className="text-gray-600">Book, manage, and organize your meeting room reservations</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <BookingForm
              booking={selectedBooking}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedBooking(null)}
              isLoading={isLoading}
            />
          </div>

          {/* Bookings List Section */}
          <div className="lg:col-span-2">
            <BookingList
              bookings={bookings}
              onEdit={setSelectedBooking}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Office Hours: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </main>
  );
}
