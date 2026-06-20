create extension if not exists btree_gist;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity integer not null check (capacity > 0),
  location text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  purpose text not null check (length(trim(purpose)) >= 3),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

alter table public.bookings
  drop constraint if exists bookings_no_confirmed_overlap;

alter table public.bookings
  add constraint bookings_no_confirmed_overlap
  exclude using gist (
    room_id with =,
    tstzrange(start_time, end_time, '[)') with &&
  )
  where (status = 'confirmed');

create index if not exists bookings_room_time_idx
  on public.bookings (room_id, start_time, end_time);

create index if not exists bookings_user_time_idx
  on public.bookings (user_id, start_time desc);

insert into public.rooms (name, capacity, location, description)
values
  ('Board Room', 12, 'Floor 2, East Wing', 'Executive meeting room with display, conferencing camera, and whiteboard.'),
  ('Meeting Room 1', 6, 'Floor 1, North Wing', 'Compact meeting room for team discussions and interviews.'),
  ('Meeting Room 2', 8, 'Floor 1, South Wing', 'Medium room with screen sharing and writable wall.'),
  ('Training Room', 24, 'Floor 3, Learning Area', 'Large room suitable for workshops, onboarding, and training sessions.')
on conflict (name) do update set
  capacity = excluded.capacity,
  location = excluded.location,
  description = excluded.description;

alter table public.rooms enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Authenticated users can read rooms" on public.rooms;
create policy "Authenticated users can read rooms"
  on public.rooms for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read bookings" on public.bookings;
create policy "Authenticated users can read bookings"
  on public.bookings for select
  to authenticated
  using (true);

drop policy if exists "Users can create own bookings" on public.bookings;
create policy "Users can create own bookings"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'confirmed');

drop policy if exists "Users can cancel own bookings" on public.bookings;
create policy "Users can cancel own bookings"
  on public.bookings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'cancelled');
