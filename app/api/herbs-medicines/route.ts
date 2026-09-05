import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db, herbsMedicines } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const entries = await db
      .select()
      .from(herbsMedicines)
      .orderBy(asc(herbsMedicines.name))

    return NextResponse.json(entries)
  } catch (error) {
    console.error('[v0] herbs and medicines database read failed', error)
    return NextResponse.json({ error: 'Nie udało się pobrać bazy leków i ziół.' }, { status: 500 })
  }
}
