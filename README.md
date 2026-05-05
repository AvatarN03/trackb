# 🎓 College Discovery Platform

A comprehensive full-stack web application for college discovery, comparison, and Q&A. Built with Next.js 14, PostgreSQL, and Prisma.

## ✨ Features

### 1. **College Listing & Search** (Feature 1)
- Browse all available colleges
- Search by college name (debounced)
- Filter by location and fees range
- Paginated results (10 per page)
- Responsive grid layout

### 2. **College Detail Page** (Feature 2)
- Comprehensive college information
- Courses offered
- Placement statistics and top recruiters
- Related colleges
- Save colleges for later

### 3. **Compare Colleges** (Feature 3)
- Select 2-3 colleges to compare
- Side-by-side comparison table
- Compare fees, placement %, rating, location
- Save comparisons for logged-in users
- Print comparison results

### 4. **College Predictor**
- Enter exam type (JEE, NEET, CET) and rank
- Get list of colleges you can get into
- View admission probability
- Rule-based prediction engine

### 5. **Q&A & Discussion**
- Ask questions about colleges
- Get answers from community
- View answers on college detail page
- Only logged-in users can ask/answer

### 6. **Authentication & Saved Items** (Feature 6)
- Email/password signup and login
- JWT-based authentication
- Save favorite colleges
- View saved colleges in dashboard
- Save comparisons
- Secure API routes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **HTTP Client**: Axios
- **State Management**: React Query (TanStack Query)
- **Form Management**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd college-discovery-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/college_discovery"
JWT_SECRET="your-secret-key-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
college-discovery-platform/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── colleges/          # College endpoints
│   │   │   ├── compare/           # Comparison endpoints
│   │   │   ├── predict/           # Predictor endpoints
│   │   │   ├── questions/         # Q&A endpoints
│   │   │   └── user/              # User endpoints
│   │   ├── auth/                  # Auth pages (login, signup)
│   │   ├── colleges/              # College pages
│   │   ├── college/               # College detail page
│   │   ├── compare/               # Compare page
│   │   ├── predictor/             # Predictor page
│   │   ├── dashboard/             # User dashboard
│   │   ├── page.tsx               # Home page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── common/                # Common components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── LoadingStates.tsx
│   │   │   └── Toast.tsx
│   │   └── colleges/              # College-specific components
│   │       └── CollegeCard.tsx
│   ├── lib/
│   │   ├── auth/                  # Auth utilities
│   │   │   ├── jwt.ts
│   │   │   └── password.ts
│   │   └── db/                    # Database utilities
│   │       └── prisma.ts
│   └── types/
│       ├── index.ts               # Type definitions
│       └── validation.ts          # Zod schemas
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed script
├── public/
│   └── images/                    # Static images
├── .env.example                   # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

## 📚 API Documentation

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response: { success: true, data: { token, expiresIn } }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response: { success: true, data: { token, expiresIn } }
```

### Colleges

#### Get Colleges
```
GET /api/colleges?search=&location=&minFees=&maxFees=&page=1

Response: {
  success: true,
  data: {
    data: [...colleges],
    total: 10,
    page: 1,
    pageSize: 10,
    totalPages: 1
  }
}
```

#### Get College Details
```
GET /api/colleges/:id

Response: {
  success: true,
  data: { ...college }
}
```

### Comparisons

#### Create Comparison
```
POST /api/compare
Content-Type: application/json

{
  "collegeIds": ["id1", "id2", "id3"]
}

Response: {
  success: true,
  data: {
    comparison: [
      {
        collegeId: "id1",
        name: "...",
        location: "...",
        fees: 250000,
        rating: 4.8,
        placementPercentage: 98,
        avgPackage: 25
      }
    ]
  }
}
```

### Predictor

#### Predict Colleges
```
POST /api/predict
Content-Type: application/json

{
  "exam": "JEE",
  "rank": 500
}

Response: {
  success: true,
  data: {
    exam: "JEE",
    rank: 500,
    predictions: [
      {
        collegeId: "...",
        name: "...",
        location: "...",
        fees: 250000,
        rating: 4.8,
        probability: "High"
      }
    ]
  }
}
```

### Q&A

#### Get Questions
```
GET /api/questions?collegeId=:id

Response: {
  success: true,
  data: [
    {
      id: "...",
      title: "...",
      body: "...",
      createdAt: "...",
      user: { email: "..." },
      answers: [...]
    }
  ]
}
```

#### Post Question
```
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "...",
  "body": "...",
  "collegeId": "..."
}
```

### User

#### Get Saved Colleges
```
GET /api/user/saved
Authorization: Bearer <token>

Response: {
  success: true,
  data: [{ ...colleges }]
}
```

#### Toggle Save College
```
POST /api/user/saved/:collegeId
Authorization: Bearer <token>

Response: {
  success: true,
  data: { saved: true/false }
}
```

## 🗄️ Database Schema

### College
- id: String (CUID)
- name: String (unique)
- location: String
- fees: Int
- rating: Float
- courses: String[]
- placements: Json
- description: Text
- imageUrl: String (optional)
- Relations: savedByUsers, comparisons, questions

### User
- id: String (CUID)
- email: String (unique)
- password: String (hashed)
- Relations: savedColleges, comparisons, questions, answers

### SavedCollege
- id: String (CUID)
- userId: String (FK)
- collegeId: String (FK)
- Unique constraint: userId + collegeId

### Comparison
- id: String (CUID)
- userId: String (FK)
- collegeIds: String[]

### Question
- id: String (CUID)
- userId: String (FK)
- collegeId: String (FK)
- title: String
- body: Text
- Relations: answers

### Answer
- id: String (CUID)
- questionId: String (FK)
- userId: String (FK)
- body: Text

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Secure HTTP-only cookies
- ✅ CORS support

## 📊 Sample Data

The application comes with 20 pre-seeded colleges including:
- Indian Institute of Technology (IIT) Delhi
- IIT Mumbai
- IIT Kanpur
- National Institute of Technology (NIT) Delhi
- AIIMS Delhi
- And more...

Each college includes:
- 20+ detailed colleges
- Realistic placement data
- Mock reviews
- Sample Q&A

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Create new project from GitHub repository
4. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`
5. Deploy!

### Deploy Backend Database

Use Railway or Render:
- Create PostgreSQL database
- Get connection string
- Set `DATABASE_URL` in environment variables

## 📝 Environment Variables

### Development
```env
DATABASE_URL="postgresql://localhost/college_discovery"
JWT_SECRET="dev-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production
```env
DATABASE_URL="postgresql://prod-user:pwd@prod-host:5432/college_discovery"
JWT_SECRET="long-random-secret-key-for-production"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
NODE_ENV="production"
```

## 🐛 Debugging

### Enable verbose logging
Set `DEBUG=*` before running:
```bash
DEBUG=* npm run dev
```

### Check database connection
```bash
npm run db:studio  # Open Prisma Studio
```

### View database schema
```bash
npx prisma db push  # Show migrations
```

## 📈 Future Enhancements

- [ ] Social authentication (Google, GitHub)
- [ ] Wishlist feature
- [ ] College reviews and ratings
- [ ] Video tours
- [ ] Chat with students
- [ ] Virtual campus tours
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Mobile app
- [ ] Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@collegediscovery.com or create an issue on GitHub.

## 👨‍💻 Authors

- Built with ❤️ by the College Discovery Team

---

**Built with Next.js 14, PostgreSQL, and Prisma** 🚀
