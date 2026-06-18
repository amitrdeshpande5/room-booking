# PostgreSQL Setup Guide

## Quick Start with PostgreSQL

Your Meeting Room Booking app is now configured to use PostgreSQL. Follow one of the options below to get started.

## Option 1: Local PostgreSQL (Development)

### Windows Installation

1. **Download PostgreSQL**
   - Visit https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15+ installer
   - Run installer (use default options)
   - Remember the password you set for `postgres` user

2. **Create Database**
   ```bash
   # Open Command Prompt and run:
   psql -U postgres
   # Enter your password
   
   # In psql, create the database:
   CREATE DATABASE room_booking;
   \q
   ```

3. **Update `.env.local`**
   ```bash
   # Replace with your PostgreSQL password:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/room_booking
   ```

4. **Verify Connection**
   ```bash
   psql postgresql://postgres:YOUR_PASSWORD@localhost:5432/room_booking
   \dt
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The database tables will be created automatically on first request!

---

## Option 2: Cloud PostgreSQL (Recommended for Production)

### Supabase (Easiest - Free Plan Available)

1. **Create Account**
   - Visit https://supabase.com
   - Sign up with GitHub/Email
   - Create new project

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the connection string (URI tab)
   - It looks like: `postgresql://postgres.xxxxx:xxxxx@xxxxx.pooler.supabase.com:5432/postgres`

3. **Update `.env.local`**
   ```bash
   DATABASE_URL=postgresql://postgres.xxxxx:xxxxx@xxxxx.pooler.supabase.com:5432/postgres
   ```

4. **Test and Deploy**
   ```bash
   npm run build
   npm start
   ```

---

### Railway.app (Simple Deployment)

1. **Create Account**
   - Visit https://railway.app
   - Sign up and connect GitHub

2. **Create PostgreSQL Plugin**
   - New Project → Database → PostgreSQL
   - Generate connection string

3. **Update `.env.local`**
   ```bash
   DATABASE_URL=<connection-string-from-railway>
   ```

---

### Render.com (Free Tier)

1. **Create Account** - https://render.com
2. **Create PostgreSQL** - New → PostgreSQL
3. Copy connection string to `.env.local`

---

## Connection String Format

All PostgreSQL connection strings follow this format:
```
postgresql://username:password@host:port/database
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/room_booking
```

---

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Ensure `.env.local` exists in project root
- Verify it contains `DATABASE_URL=...`
- Restart development server: `npm run dev`

### "Connection refused"
- Check PostgreSQL is running:
  - Windows: Search "Services" → PostgreSQL → Start
  - Or: `pg_isready -h localhost`
- Verify connection string is correct
- Check database exists: `psql -l`

### "too many connections"
- PostgreSQL connection limit reached
- Close other clients or increase `max_connections`
- In `postgresql.conf`: `max_connections = 200`

### Application Crashes on Startup
- Tables are created automatically on first request
- Just make sure DATABASE_URL points to an existing database
- If issues persist, manually create tables:
  ```sql
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL DEFAULT 'Meeting Room A',
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(start_time, end_time)
  );
  ```

---

## Security Notes

- ⚠️ **Never commit `.env.local`** - it's in `.gitignore`
- Use strong passwords for production databases
- Use environment variables in deployment (Vercel, Railway, etc.)
- Consider limiting connection from specific IPs
- Enable SSL/TLS for cloud databases (usually automatic)

---

## For Vercel Deployment

1. **Push to GitHub**
2. **Import to Vercel**
3. **Add environment variable** in Vercel dashboard:
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string
4. **Deploy**

Your app will be live at a `.vercel.app` domain!

---

## Next Steps

1. Set up PostgreSQL using one of the options above
2. Update `.env.local` with your connection string
3. Run `npm run dev`
4. Visit http://localhost:3000
5. Create a test booking
6. When ready: `npm run build && npm start` for production
