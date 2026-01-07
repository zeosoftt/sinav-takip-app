import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { verifyToken } from './jwt'

export async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    // JWT token'ı doğrula
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    // Kullanıcıyı veritabanından al
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

export function requireAuth(handler: (req: NextRequest, user: any) => Promise<Response>) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(req, user)
  }
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (req: NextRequest, user: any) => Promise<Response>) => {
    return async (req: NextRequest) => {
      const user = await getCurrentUser(req)
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (!allowedRoles.includes(user.role)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return handler(req, user)
    }
  }
}

export function requireAdmin(handler: (req: NextRequest, user: any) => Promise<Response>) {
  return requireRole(['ADMIN'])(handler)
}
