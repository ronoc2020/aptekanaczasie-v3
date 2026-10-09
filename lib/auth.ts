import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { google } from 'better-auth/social-providers'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

function asOrigin(value?: string) {
  if (!value) return undefined
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
}

const originCandidates = [
  asOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  asOrigin(process.env.VERCEL_URL),
  asOrigin(process.env.V0_RUNTIME_URL),
  asOrigin(process.env.V0_DEV_APP_URL),
  asOrigin(process.env.V0_BUILD_URL),
  asOrigin(process.env.V0_SANDBOX_URL),
].filter((origin): origin is string => Boolean(origin))

const authSecret = process.env.BETTER_AUTH_SECRET

if (!authSecret) {
  throw new Error('BETTER_AUTH_SECRET must be configured before starting the application')
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL || originCandidates[0],
  trustedOrigins: ['http://localhost:3000', ...originCandidates],
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  ...(process.env.NODE_ENV === 'development'
    ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } }
    : {}),
})

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}
