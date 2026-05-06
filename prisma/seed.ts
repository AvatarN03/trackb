
import { PrismaClient } from '@prisma/client/extension'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

const colleges = [
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    fees: 250000,
    rating: 4.8,
    courses: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    placements: {
      avgPackage: 25,
      placementPercentage: 98,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs'],
    },
    description: 'IIT Delhi is one of the premier engineering institutes in India offering world-class education and research facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop',
  },
  {
    name: 'Indian Institute of Technology Mumbai',
    location: 'Mumbai',
    fees: 250000,
    rating: 4.9,
    courses: ['Computer Science', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace Engineering'],
    placements: {
      avgPackage: 27,
      placementPercentage: 99,
      topRecruiters: ['Microsoft', 'Amazon', 'Google', 'Apple'],
    },
    description: 'IIT Bombay is one of the most prestigious institutions, known for exceptional academics and placements.',
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&h=300&fit=crop',
  },
  {
    name: 'National Institute of Technology Delhi',
    location: 'New Delhi',
    fees: 120000,
    rating: 4.2,
    courses: ['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering'],
    placements: {
      avgPackage: 15,
      placementPercentage: 95,
      topRecruiters: ['Infosys', 'TCS', 'HCL', 'Cognizant'],
    },
    description: 'NIT Delhi provides quality engineering education at an affordable cost with strong industry connections.',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=300&fit=crop',
  },
  {
    name: 'Delhi University - Hindu College',
    location: 'New Delhi',
    fees: 50000,
    rating: 3.8,
    courses: ['B.Com', 'B.A', 'B.Sc', 'Law'],
    placements: {
      avgPackage: 8,
      placementPercentage: 80,
      topRecruiters: ['Deloitte', 'KPMG', 'Grant Thornton', 'J.P. Morgan'],
    },
    description: 'One of the oldest and most reputed colleges in Delhi affiliated with Delhi University.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop',
  },
  {
    name: 'All India Institute of Medical Sciences',
    location: 'New Delhi',
    fees: 500000,
    rating: 4.7,
    courses: ['M.B.B.S', 'M.D', 'Nursing'],
    placements: {
      avgPackage: 20,
      placementPercentage: 100,
      topRecruiters: ['AIIMS Hospitals', 'Private Medical Colleges', 'Apollo Hospitals'],
    },
    description: 'AIIMS is the apex medical institute in India providing world-class medical education.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop',
  },
  {
    name: 'Ashoka University',
    location: 'Gurugram',
    fees: 1200000,
    rating: 4.5,
    courses: ['Liberal Arts', 'Economics', 'Political Science', 'Mathematics'],
    placements: {
      avgPackage: 18,
      placementPercentage: 92,
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs'],
    },
    description: 'Ashoka University is a leading liberal arts institution focused on holistic education and research.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=500&h=300&fit=crop',
  },
  {
    name: 'Shiv Nadar University',
    location: 'Greater Noida',
    fees: 600000,
    rating: 4.3,
    courses: ['Computer Science', 'Electronics', 'Mechanical Engineering', 'Design'],
    placements: {
      avgPackage: 14,
      placementPercentage: 88,
      topRecruiters: ['TCS', 'Infosys', 'Tech Mahindra', 'Accenture'],
    },
    description: 'Shiv Nadar University combines technology with liberal arts education for comprehensive development.',
    imageUrl: 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=500&h=300&fit=crop',
  },
  {
    name: 'Symbiosis International University',
    location: 'Pune',
    fees: 700000,
    rating: 4.1,
    courses: ['Management', 'Law', 'Engineering', 'Liberal Arts'],
    placements: {
      avgPackage: 16,
      placementPercentage: 90,
      topRecruiters: ['Wipro', 'Reliance', 'ITC', 'L&T'],
    },
    description: 'Symbiosis is known for its strong management programs and industry partnerships.',
    imageUrl: 'https://images.unsplash.com/photo-1506657404409-ba5f54fb3407?w=500&h=300&fit=crop',
  },
  {
    name: 'IIT Kanpur',
    location: 'Kanpur',
    fees: 250000,
    rating: 4.7,
    courses: ['Computer Science', 'Mechanical Engineering', 'Aerospace Engineering', 'Chemistry'],
    placements: {
      avgPackage: 24,
      placementPercentage: 97,
      topRecruiters: ['Google', 'Amazon', 'Microsoft', 'Intel'],
    },
    description: 'IIT Kanpur is known for its strong alumni network and cutting-edge research facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
  },
  {
    name: 'Manipal Institute of Technology',
    location: 'Manipal',
    fees: 450000,
    rating: 4.0,
    courses: ['Computer Science', 'Electronics', 'Mechanical Engineering', 'Civil Engineering'],
    placements: {
      avgPackage: 12,
      placementPercentage: 85,
      topRecruiters: ['Infosys', 'Wipro', 'HCL', 'Tech Mahindra'],
    },
    description: 'MIT is a leading private engineering institute with global recognition and industry partnerships.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  },
  {
    name: 'St. Stephen\'s College Delhi',
    location: 'New Delhi',
    fees: 60000,
    rating: 3.9,
    courses: ['B.A', 'B.Sc', 'B.Com'],
    placements: {
      avgPackage: 9,
      placementPercentage: 82,
      topRecruiters: ['PWC', 'EY', 'Deloitte', 'KPMG'],
    },
    description: 'An autonomous college of Delhi University known for rigorous academics and liberal arts education.',
    imageUrl: 'https://images.unsplash.com/photo-1504681869696-d977214588f9?w=500&h=300&fit=crop',
  },
]

const mockReviews = [
  { name: 'Raj Kumar', rating: 5, comment: 'Excellent faculty and campus facilities. Highly recommended!' },
  { name: 'Priya Singh', rating: 4, comment: 'Great learning environment with good placement opportunities.' },
  { name: 'Arun Patel', rating: 5, comment: 'Outstanding education quality and industry connections.' },
  { name: 'Neha Sharma', rating: 4, comment: 'Good hostel facilities and diverse student body.' },
  { name: 'Vikram Reddy', rating: 5, comment: 'Perfect blend of academics and extracurricular activities.' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.answer.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.comparison.deleteMany({})
  await prisma.savedCollege.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.college.deleteMany({})

  // Create colleges
  const createdColleges = await Promise.all(
    colleges.map((college) =>
      prisma.college.create({
        data: {
          name: college.name,
          location: college.location,
          fees: college.fees,
          rating: college.rating,
          courses: college.courses,
          placements: college.placements,
          description: college.description,
          imageUrl: college.imageUrl,
        },
      })
    )
  )

  console.log(`✅ Created ${createdColleges.length} colleges`)

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: await bcryptjs.hash('password123', 10),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 10),
    },
  })

  console.log(`✅ Created 2 test users`)

  // Add saved colleges
  await prisma.savedCollege.create({
    data: {
      userId: user1.id,
      collegeId: createdColleges[0].id,
    },
  })

  await prisma.savedCollege.create({
    data: {
      userId: user1.id,
      collegeId: createdColleges[1].id,
    },
  })

  console.log(`✅ Created saved colleges`)

  // Create comparison
  await prisma.comparison.create({
    data: {
      userId: user1.id,
      collegeIds: [createdColleges[0].id, createdColleges[1].id],
    },
  })

  console.log(`✅ Created comparisons`)

  // Create questions and answers
  const question1 = await prisma.question.create({
    data: {
      userId: user2.id,
      collegeId: createdColleges[0].id,
      title: 'What is the average package offered?',
      body: 'I want to know about the average package offered to graduates.',
    },
  })

  await prisma.answer.create({
    data: {
      questionId: question1.id,
      userId: user1.id,
      body: 'The average package at IIT Delhi is around 25 lakhs per annum. Top companies recruit heavily from here.',
    },
  })

  const question2 = await prisma.question.create({
    data: {
      userId: user1.id,
      collegeId: createdColleges[1].id,
      title: 'Are hostel facilities good?',
      body: 'Looking for information about hostel quality and accommodations.',
    },
  })

  await prisma.answer.create({
    data: {
      questionId: question2.id,
      userId: user2.id,
      body: 'Yes, hostels at IIT Bombay are well-maintained with good facilities. Three meals a day are provided.',
    },
  })

  console.log(`✅ Created questions and answers`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
