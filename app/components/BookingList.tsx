'use client';

import { useState } from 'react';
import { Booking } from '@/lib/db/bookings';
import { formatDateTime, getDurationInMinutes } from '@/app/utils/time';

interface BookingListProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
}

export default function BookingList({ bookings, onEdit, onDelete }: BookingListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No bookings yet. Create one to get started!</p>
      ) : (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{booking.user_name}</h3>
                  <p className="text-sm text-gray-600">{booking.user_email}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Duration: {getDurationInMinutes(booking.start_time, booking.end_time)} minutes
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(booking)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this booking?')) {
                        onDelete(booking.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === booking.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Purpose:</strong> {booking.purpose}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {formatDateTime(booking.created_at)}
                  </p>
                </div>
              )}
              <button
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="mt-2 text-xs text-blue-500 hover:underline"
              >
                {expandedId === booking.id ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
