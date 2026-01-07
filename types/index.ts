// SQLite doesn't support enums, so we define them as string literal types
export type UserRole = 'ADMIN' | 'PREMIUM_USER' | 'FREE_USER' | 'INSTITUTION_ADMIN'
export type ExamType = 'KPSS' | 'ALES' | 'YDS' | 'YKS' | 'DGS' | 'TUS' | 'STS' | 'EKPSS' | 'MEMUR_SINAVI' | 'OTHER'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL'

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
