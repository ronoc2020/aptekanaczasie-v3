import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, userActivityEvents } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: new Headers(request.headers) })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  if (!body || typeof body.module !== 'string' || typeof body.action !== 'string') return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  await db.insert(userActivityEvents).values({ userId: session.user.id, module: body.module.slice(0, 80), action: body.action.slice(0, 80), metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : {} })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: new Headers(request.headers) })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select({ module: userActivityEvents.module }).from(userActivityEvents).where(eq(userActivityEvents.userId, session.user.id)).limit(100)
  const counts = rows.reduce<Record<string, number>>((result, row) => ({ ...result, [row.module]: (result[row.module] ?? 0) + 1 }), {})
  return NextResponse.json({ recommendations: Object.entries(counts).sort(([, a], [, b]) => b - a).map(([module]) => module).slice(0, 3) })
}
