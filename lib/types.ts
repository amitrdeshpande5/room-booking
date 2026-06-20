export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  created_at: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  user_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: BookingStatus;
  created_at: string;
  room?: Pick<Room, "name" | "location" | "capacity">;
};

export type ActionState = {
  ok: boolean;
  message: string;
};
