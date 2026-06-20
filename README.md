# Room Booking

A production-ready MVP for internal meeting room reservations. Built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase Postgres, and Vercel-friendly defaults.

## Features

- Email/password signup and login with Supabase Auth
- Protected booking, rooms, admin placeholder, and personal booking pages
- Seeded rooms: Board Room, Meeting Room 1, Meeting Room 2, Training Room
- Booking form with room, date, start time, end time, and purpose
- Overlap prevention in both application logic and a Postgres exclusion constraint
- Dashboard for today's confirmed bookings
- Room-wise availability view
- My bookings page with user-owned cancellation
- Responsive, minimal corporate UI with loading, empty, validation, and pending states

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth and Postgres
- Vercel deployment-ready structure

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
cp .env.example .env.local
```

3. Fill in the Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. In Supabase, go to **Project Settings > API** and copy:
   - Project URL into `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Authentication > Providers > Email** and enable email/password signups.
4. Run the database migration from `supabase/migrations/001_initial_schema.sql`.

You can run the migration in either of these ways:

```bash
supabase db push
```

Or paste the SQL into **Supabase Dashboard > SQL Editor** and run it once.

The migration creates `rooms` and `bookings`, enables RLS, seeds the four MVP rooms, and adds the `bookings_no_confirmed_overlap` exclusion constraint so confirmed bookings cannot overlap for the same room.

## Vercel Deployment

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the same environment variables in **Vercel Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

No serverless database connection string is needed because the app uses Supabase client APIs and cookie-based SSR auth.

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Manual Admin Notes

Room creation/editing is intentionally a placeholder for the MVP. Manage rooms by changing the seed rows in `supabase/migrations/001_initial_schema.sql` or directly editing the `rooms` table in Supabase. Add role-based admin policies before exposing room editing in the app.
