import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db, howToArticles } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const articles = await db
      .select()
      .from(howToArticles)
      .where(eq(howToArticles.published, true))
      .orderBy(asc(howToArticles.title))

    return NextResponse.json(articles)
  } catch (error) {
    console.error('[v0] how-to database read failed', error)
    return NextResponse.json({ error: 'Nie udało się pobrać poradników.' }, { status: 500 })
  }
}
