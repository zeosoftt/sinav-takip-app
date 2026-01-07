import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// List user's sessions (optionally limit, today)
export const GET = requireAuth(async (req: NextRequest, user) => {
  const url = new URL(req.url)
  const limitParam = url.searchParams.get('limit')
  const range = url.searchParams.get('range') // 'today' | 'week' | 'month'

  const where: any = { userId: user.id }

  if (range === 'today') {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    where.createdAt = { gte: start }
  } else if (range === 'week') {
    const start = new Date()
    start.setDate(start.getDate() - 7)
    where.createdAt = { gte: start }
  } else if (range === 'month') {
    const start = new Date()
    start.setDate(start.getDate() - 30)
    where.createdAt = { gte: start }
  }

  const take = limitParam ? Math.min(parseInt(limitParam, 10) || 20, 100) : 20

  const sessions = await prisma.studySession.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
  })

  // aggregate totals for today
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const todaySessions = await prisma.studySession.findMany({
    where: { userId: user.id, createdAt: { gte: startOfDay } },
  })
  const todayTotalSeconds = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0)

  return new Response(
    JSON.stringify({ sessions, todayTotalSeconds }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
})

// Start a new session
export const POST = requireAuth(async (_req: NextRequest, user) => {
  // ensure there's no other active session
  const active = await prisma.studySession.findFirst({
    where: { userId: user.id, isActive: true },
  })
  if (active) {
    return new Response(JSON.stringify({ session: active }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const session = await prisma.studySession.create({
    data: {
      userId: user.id,
      startTime: new Date(),
      isActive: true,
    },
  })

  return new Response(JSON.stringify({ session }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
})

// Stop active session and finalize duration
export const PATCH = requireAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => ({}))
  const nowIso = body?.endedAt ? new Date(body.endedAt) : new Date()

  const active = await prisma.studySession.findFirst({
    where: { userId: user.id, isActive: true },
    orderBy: { startTime: 'desc' },
  })

  if (!active) {
    return new Response(JSON.stringify({ error: 'No active session' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const durationSeconds = Math.max(
    0,
    Math.floor((nowIso.getTime() - new Date(active.startTime).getTime()) / 1000),
  )

  const updated = await prisma.studySession.update({
    where: { id: active.id },
    data: {
      endTime: nowIso,
      durationSeconds,
      isActive: false,
    },
  })

  return new Response(JSON.stringify({ session: updated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

