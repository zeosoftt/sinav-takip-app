import { UserRole, ExamType, SubscriptionStatus } from '@prisma/client'

export type { UserRole, ExamType, SubscriptionStatus }

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Exam {
  id: string
  name: string
  type: ExamType
  description?: string
  institution: string
  applicationStartDate: Date
  applicationEndDate: Date
  examDate: Date
  resultDate?: Date
  fee?: number
  website?: string
  isActive: boolean
}

export interface Subscription {
  id: string
  userId: string
  status: SubscriptionStatus
  planType: string
  startDate: Date
  endDate: Date
  price: number
}
