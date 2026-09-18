import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { pharmacyAuditEvents } from '@/lib/db'

const MAX_PAYLOAD_BYTES = 20_000

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = body?.payload && typeof body.payload === 'object' ? body.payload : {}
    if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload audytu jest zbyt duży.' }, { status: 413 })
    }
    if (!body?.eventType || !body?.mode) {
      return NextResponse.json({ error: 'Brak typu zdarzenia lub trybu pracy.' }, { status: 400 })
    }
    const [event] = await db.insert(pharmacyAuditEvents).values({
      id: randomUUID(),
      eventType: String(body.eventType).slice(0, 100),
      mode: body.mode === 'professional' ? 'professional' : 'education',
      recipeName: body.recipeName ? String(body.recipeName).slice(0, 240) : null,
      recipeVersion: Number.isInteger(body.recipeVersion) ? body.recipeVersion : null,
      batchNumber: body.batchNumber ? String(body.batchNumber).slice(0, 100) : null,
      operatorId: body.operatorId ? String(body.operatorId).slice(0, 100) : null,
      reviewerId: body.reviewerId ? String(body.reviewerId).slice(0, 100) : null,
      payload,
      createdAt: new Date(),
    }).returning({ id: pharmacyAuditEvents.id, createdAt: pharmacyAuditEvents.createdAt })
    return NextResponse.json({ ok: true, event })
  } catch {
    return NextResponse.json({ error: 'Nie udało się zapisać zdarzenia audytowego.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const events = await db.select({
      id: pharmacyAuditEvents.id,
      eventType: pharmacyAuditEvents.eventType,
      mode: pharmacyAuditEvents.mode,
      recipeName: pharmacyAuditEvents.recipeName,
      recipeVersion: pharmacyAuditEvents.recipeVersion,
      batchNumber: pharmacyAuditEvents.batchNumber,
      createdAt: pharmacyAuditEvents.createdAt,
    }).from(pharmacyAuditEvents).limit(100)
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ error: 'Nie udało się pobrać dziennika audytu.' }, { status: 500 })
  }
}
