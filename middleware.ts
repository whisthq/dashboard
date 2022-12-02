// middleware.ts

import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

/**
 * An authenticated user's browser policy can be read from /api/me/policy, but
 * it used to be available at /api/policies. For backward compability, we proxy
 * GET requests to /api/policies to /api/me/policy.
 */
export function middleware(req: NextRequest) {
  if (req.method === 'GET' && req.nextUrl.pathname === '/api/policies') {
    return NextResponse.rewrite(new URL('/api/me/policy', req.url))
  }
}
