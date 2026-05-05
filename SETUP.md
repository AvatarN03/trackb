# Complete Setup Guide

## Project Overview

This is a complete, production-ready College Discovery Platform built with:
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Deployment**: Vercel-ready

## 📋 Step-by-Step Setup

### 1. Prerequisites Installation

Ensure you have installed:
- Node.js 18+ ([https://nodejs.org/](https://nodejs.org/))
- PostgreSQL 14+ ([https://www.postgresql.org/](https://www.postgresql.org/))
- Git
- npm or yarn

### 2. Clone or Create Project

```bash
# If you already have the project folder
cd e:\Projects\trackb

# Or clone if from a repository
# git clone <repo-url>
# cd college-discovery-platform
```

### 3. Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json` including:
- Next.js, React, TypeScript
- Prisma ORM
- Authentication libraries (bcryptjs, jsonwebtoken)
- Validation (Zod)
- UI/Form libraries (React Hook Form, TanStack Query)

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Start PostgreSQL service:

**Windows (PowerShell):**
```powershell
# If PostgreSQL is installed
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

2. Create database:
```bash
createdb college_discovery
```

3. Configure connection string in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/college_discovery"
```

#### Option B: Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name college_postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=college_discovery -p 5432:5432 -d postgres:15-alpine

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/college_discovery"
```

#### Option C: Cloud Database

Use [Railway.app](https://railway.app/), [Render.com](https://render.com/), or [Supabase](https://supabase.com/):

1. Create PostgreSQL database
2. Get connection string
3. Add to `.env.local`

### 5. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/college_discovery"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**For Production**, use strong, random values:
```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Or use this command
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Create database tables (from schema.prisma)
npm run db:push

# Seed database with sample data (20 colleges + test users)
npm run db:seed
```

**Output should show:**
```
✅ Created 10 colleges
✅ Created 2 test users
✅ Created saved colleges
✅ Created comparisons
✅ Created questions and answers
🎉 Database seeding completed successfully!
```

### 7. Start Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Application

### 1. Create Account

- Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
- Enter email: `student@example.com`
- Enter password: `password123`
- Click "Create Account"

### 2. Explore Features

- **Browse Colleges**: `/colleges`
  - Search by name
  - Filter by location and fees
  - Click cards to view details

- **College Details**: `/college/[id]`
  - View comprehensive college info
  - See placement statistics
  - Click "Ask Questions" for Q&A

- **Compare**: `/compare`
  - Select 2-3 colleges
  - View side-by-side comparison
  - Print or save comparison

- **Predictor**: `/predictor`
  - Select exam type (JEE, NEET, CET)
  - Enter your rank
  - Get predicted colleges

- **Dashboard**: `/dashboard`
  - View saved colleges
  - View saved comparisons
  - Quick actions

- **Q&A**: `/college/[id]/qa`
  - View questions for a college
  - Ask new questions (login required)
  - Post answers (login required)

## 📂 Project Files Created

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.env.example` - Environment variables template
- `.env.local` - Local environment variables
- `.eslintrc.json` - ESLint configuration
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration
- `vercel.json` - Vercel deployment configuration
- `.gitignore` - Git ignore rules

### Source Code

#### API Routes (`src/app/api/`)
- `colleges/route.ts` - Get colleges with search/filters
- `colleges/[id]/route.ts` - Get college details
- `auth/login/route.ts` - Login endpoint
- `auth/signup/route.ts` - Signup endpoint
- `user/saved/route.ts` - Get saved colleges
- `user/saved/[collegeId]/route.ts` - Toggle save college
- `compare/route.ts` - Compare colleges
- `predict/route.ts` - Predict colleges
- `questions/route.ts` - Get/post questions
- `answers/route.ts` - Post answers

#### Pages (`src/app/`)
- `page.tsx` - Home page
- `layout.tsx` - Root layout
- `globals.css` - Global styles
- `colleges/page.tsx` - College listing (Feature 1)
- `college/[id]/page.tsx` - College detail (Feature 2)
- `compare/page.tsx` - Compare page (Feature 3)
- `auth/login/page.tsx` - Login page (Feature 6)
- `auth/signup/page.tsx` - Signup page (Feature 6)
- `dashboard/page.tsx` - Dashboard (Feature 6)
- `college/[id]/qa/page.tsx` - Q&A page
- `predictor/page.tsx` - Predictor page
- `error.tsx` - Error page
- `not-found.tsx` - 404 page

#### Components (`src/components/`)
- `common/Navbar.tsx` - Navigation bar
- `common/Header.tsx` - Header
- `common/Footer.tsx` - Footer
- `common/LoadingStates.tsx` - Loading, error, empty states
- `common/Toast.tsx` - Toast notifications
- `colleges/CollegeCard.tsx` - College card component

#### Libraries (`src/lib/`)
- `auth/jwt.ts` - JWT token handling
- `auth/password.ts` - Password hashing/verification
- `db/prisma.ts` - Prisma client singleton
- `api.ts` - API response helpers
- `fetch.ts` - Fetch utilities
- `format.ts` - Formatting utilities

#### Hooks (`src/hooks/`)
- `useAuth.ts` - Authentication hooks

#### Types (`src/types/`)
- `index.ts` - Type definitions
- `validation.ts` - Zod validation schemas

#### Database (`prisma/`)
- `schema.prisma` - Database schema
- `seed.ts` - Seed script with 20 colleges

#### Documentation
- `README.md` - Main documentation
- `API.md` - API documentation
- `DOCKER.md` - Docker setup guide
- `SETUP.md` - This file

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Create/update database tables
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (visual DB editor)

# Docker
docker-compose up    # Start with Docker
docker-compose down  # Stop Docker
```

## 🔑 Test Credentials

After seeding, you can login with:

```
Email: student@example.com
Password: password123
```

Or

```
Email: john@example.com
Password: password123
```

## 🐛 Common Issues & Solutions

### Issue: "Database connection refused"
**Solution:** 
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `.env.local`
- Try connecting with `psql`:
  ```bash
  psql -U postgres -d college_discovery
  ```

### Issue: "Port 3000 is already in use"
**Solution:**
- Find and kill process on port 3000:
  ```bash
  # Windows
  lsof -ti:3000 | xargs kill -9
  
  # Or use different port
  npm run dev -- -p 3001
  ```

### Issue: "npm install fails"
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: "Prisma schema errors"
**Solution:**
- Regenerate client: `npm run db:generate`
- Reset database: `npm run db:push`

### Issue: "JWT token errors"
**Solution:**
- Check `JWT_SECRET` in `.env.local`
- Clear localStorage in browser DevTools
- Try signing up and logging in again

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" and import GitHub repository
4. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (strong random string)
   - `NEXT_PUBLIC_API_URL` (your domain)
5. Click Deploy!

### Deploy Database

Use Railway, Render, or Supabase:

1. Create PostgreSQL database
2. Get connection string
3. Set in Vercel environment variables
4. Run migrations:
   ```bash
   vercel env pull
   npx prisma db push
   npx prisma db seed
   ```

## 🔒 Security Checklist

Before production, ensure:

- ✅ Change `JWT_SECRET` to strong random value
- ✅ Use HTTPS for API calls
- ✅ Set `secure: true` for cookies
- ✅ Enable CORS if needed
- ✅ Validate all inputs with Zod
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Add CSRF protection
- ✅ Enable security headers
- ✅ Regular security updates

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://www.postgresql.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React](https://react.dev)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `API.md` for API documentation
3. Check `DOCKER.md` for Docker setup
4. Review error messages in browser console and terminal

## 📝 License

This project is built as a learning resource.

---

**You're all set! Start with `npm run dev` and happy coding! 🚀**
