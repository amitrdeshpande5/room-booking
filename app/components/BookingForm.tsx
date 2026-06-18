'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/lib/db/bookings';
import { getTimeSlots, createDateTime, isValidTimeRange } from '@/app/utils/time';

interface BookingFormProps {
  booking?: Booking | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookingForm({ booking, onSubmit, onCancel, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (booking) {
      const startDate = new Date(booking.start_time);
      const endDate = new Date(booking.end_time);
      setFormData({
        user_name: booking.user_name,
        user_email: booking.user_email,
        purpose: booking.purpose,
        date: startDate.toISOString().split('T')[0],
        start_time: startDate.toTimeString().slice(0, 5),
        end_time: endDate.toTimeString().slice(0, 5),
      });
    }
  }, [booking]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_name.trim()) newErrors.user_name = 'Name is required';
    if (!formData.user_email.trim()) newErrors.user_email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = 'Invalid email address';
    }
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (formData.start_time >= formData.end_time) {
      newErrors.end_time = 'End time must be after start time';
    }

    const startTime = createDateTime(formData.date, formData.start_time);
    const endTime = createDateTime(formData.date, formData.end_time);
    if (!isValidTimeRange(startTime, endTime)) {
      newErrors.end_time = 'Duration must be between 30 minutes and 8 hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const startTime = createDateTime(formData.date, formData.start_time);
    const endTime = createDateTime(formData.date, formData.end_time);

    try {
      await onSubmit({
        user_name: formData.user_name,
        user_email: formData.user_email,
        purpose: formData.purpose,
        start_time: startTime,
        end_time: endTime,
      });
      setFormData({
        user_name: '',
        user_email: '',
        purpose: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
      });
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save booking' });
    }
  };

  const timeSlots = getTimeSlots(formData.date);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {booking ? 'Edit Booking' : 'New Booking'}
      </h2>

      {errors.submit && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errors.submit}</div>}

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="Your name"
          />
          {errors.user_name && <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.user_email}
            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="your@email.com"
          />
          {errors.user_email && <p className="text-red-500 text-sm mt-1">{errors.user_email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="What is the meeting for?"
            rows={3}
          />
          {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <select
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <select
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
