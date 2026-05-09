import { z } from 'zod'

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const collegeFilterSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
})

export const compareSchema = z.object({
  collegeIds: z.array(z.string()).min(2, 'Select at least 2 colleges').max(3, 'Select at most 3 colleges'),
})

export const predictSchema = z.object({
  exam: z.enum(['JEE', 'NEET', 'CET']),
  rank: z.number().min(1, 'Rank must be positive'),
})

export const questionSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(5, 'Title must be at least 5 characters'),
  body: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
})

export const answerSchema = z.object({
  body: z.string({ required_error: 'Answer is required' }).min(5, 'Answer must be at least 5 characters'),
})

// Type exports
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CollegeFilterInput = z.infer<typeof collegeFilterSchema>
export type CompareInput = z.infer<typeof compareSchema>
export type PredictInput = z.infer<typeof predictSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type AnswerInput = z.infer<typeof answerSchema>
