import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protected routes
  const protectedPaths = ['/dashboard', '/subscription', '/notifications', '/study', '/institutions/dashboard']
  const adminPaths = ['/admin']
  const authPaths = ['/auth/login', '/auth/register', '/institutions/login', '/institutions/register']
  
  const pathname = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  
  // TODO: Check authentication token from cookies
  const token = request.cookies.get('auth-token')?.value
  const isAuthenticated = !!token

  // Admin routes için özel kontrol (API'de yapılacak)
  if (isAdminPath && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subscription/:path*',
    '/notifications/:path*',
    '/study/:path*',
    '/auth/:path*',
    '/admin/:path*',
    '/institutions/:path*',
  ],
}
