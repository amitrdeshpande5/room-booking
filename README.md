# Meeting Room Booking Application

A full-stack web application for managing meeting room reservations. Built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS.

## Features

- **Book Meeting Room**: Create new bookings with date, time, and purpose
- **View All Bookings**: See all current and upcoming room reservations
- **Edit Bookings**: Modify existing booking details
- **Cancel Bookings**: Delete bookings when plans change
- **Conflict Detection**: Automatic prevention of double-booking time slots
- **User Tracking**: Capture who is booking and their contact information
- **Purpose Capture**: Document the meeting purpose for each booking

## Tech Stack

- **Frontend**: Next.js 16+, React 19+, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with `postgres` client
- **Runtime**: Node.js 24+

## Project Structure

```
room-booking/
├── app/
│   ├── api/
│   │   └── bookings/          # API routes for booking CRUD
│   ├── components/            # React components
│   │   ├── BookingForm.tsx    # Form for creating/editing bookings
│   │   └── BookingList.tsx    # List of all bookings
│   ├── utils/
│   │   └── time.ts            # Time utility functions
│   └── page.tsx               # Main application page
├── lib/
│   └── db/
│       ├── db.ts              # PostgreSQL connection and initialization
│       └── bookings.ts        # Database queries and operations
├── .env.example               # Environment variables template
├── .env.local                 # Environment variables (not committed)
├── public/                    # Static assets
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 24.0 or later
- npm 11.0 or later
- PostgreSQL 12+ database (local or cloud-hosted)

### Installation

1. Navigate to the project directory:
```bash
cd room-booking
```

2. Install dependencies:
```bash
npm install
```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   ```bash
   # .env.local
   DATABASE_URL=postgresql://username:password@localhost:5432/room_booking
   ```

4. The database tables will be created automatically on first request.

### Running the Application

**Development Mode**:
```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

**Production Build**:
```bash
npm run build
npm start
```

## Database Setup

### Local PostgreSQL Setup (Windows)

1. **Install PostgreSQL** from https://www.postgresql.org/download/windows/
2. **Create a database**:
   ```bash
   psql -U postgres
   CREATE DATABASE room_booking;
   ```
3. **Update `.env.local`**:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/room_booking
   ```

### Cloud PostgreSQL Options

**Vercel Postgres** (Recommended for Vercel deployments):
```bash
# Get connection string from Vercel dashboard
DATABASE_URL=postgres://...
```

**Supabase** (PostgreSQL as a Service):
1. Create account at https://supabase.com
2. Create a new project
3. Copy the connection string to `.env.local`

**Railway, Render, or DigitalOcean**:
- All provide PostgreSQL hosting
- Copy their connection strings to `.env.local`

## Usage

1. **Create a Booking**:
   - Fill in your name and email
   - Enter the meeting purpose
   - Select date and time slots
   - Click "Create Booking"

2. **View Bookings**:
   - All bookings are displayed in a list on the right side
   - Shows booking details, duration, and creation time
   - Click "Show Details" to see the full purpose

3. **Edit a Booking**:
   - Click "Edit" on any booking
   - Modify the details in the form
   - Click "Update Booking" to save changes

4. **Cancel a Booking**:
   - Click "Delete" on any booking
   - Confirm the deletion when prompted

## Features Details

### Time Slots
- Office hours: 9:00 AM to 6:00 PM
- 30-minute increment time slots
- Maximum booking duration: 8 hours

### Conflict Prevention
- System automatically checks for overlapping bookings
- Prevents booking the same time slot twice
- Shows error message if time conflict detected

### Data Storage
- All bookings are stored in PostgreSQL database
- Database tables are created automatically on first request
- Connection pool managed by postgres client (max 20 connections)

## API Endpoints

- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get specific booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

## Validation

- User name and email are required
- Valid email format is enforced
- Meeting purpose must be provided
- End time must be after start time
- Booking duration must be 30 minutes to 8 hours
- No overlapping bookings allowed

## Future Enhancements

- Multiple meeting rooms support
- Recurring bookings
- Room availability calendar view
- Email notifications
- Admin dashboard
- Meeting history and analytics

## Troubleshooting

**Database Connection Issues**:
- Verify `DATABASE_URL` is set correctly in `.env.local`
- Check PostgreSQL server is running
- Ensure database exists: `CREATE DATABASE room_booking;`
- Test connection: `psql DATABASE_URL`

**Build Errors**:
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` directory: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Verify `.env.local` is not committed (should be in .gitignore)

**Connection Pool Errors**:
- Ensure `DATABASE_URL` doesn't have too many connections already
- Check server logs for "too many connections" errors
- Increase PostgreSQL `max_connections` if needed

## License

This project is open source and available for use.
