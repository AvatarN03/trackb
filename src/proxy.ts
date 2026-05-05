import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add any middleware logic here
  // For example, redirect unauthenticated users from dashboard
  
  const token = request.cookies.get('auth-token')
  const pathname = request.nextUrl.pathname

  // Redirect to login if accessing protected routes without auth
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/api/user') || pathname.startsWith('/api/compare')) && !token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
