import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const recipient = 'rocybersolutions@gmail.com'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = body.type === 'contact' ? 'Kontakt' : 'Opinia użytkownika'
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()
    const rating = Number(body.rating ?? 0)

    if (!name || !message || message.length > 5000 || name.length > 120) {
      return NextResponse.json({ error: 'Uzupełnij wymagane pola.' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Podaj poprawny adres email.' }, { status: 400 })
    }
    if (type === 'Opinia użytkownika' && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Wybierz ocenę od 1 do 5.' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Apteka na Czasie <contact@rocybersolutions.com>'
    const subject = `${type}: ${name}`
    const replyTo = email || undefined
    const html = `<h2>${escapeHtml(type)}</h2><p><strong>Imię:</strong> ${escapeHtml(name)}</p>${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}${type === 'Opinia użytkownika' ? `<p><strong>Ocena:</strong> ${rating}/5</p>` : ''}<p><strong>Treść:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    const { data, error } = await resend.emails.send({ from, to: [recipient], replyTo, subject, html }, { idempotencyKey: `feedback/${type.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}` })

    if (error) return NextResponse.json({ error: error.message }, { status: 502 })
    return NextResponse.json({ ok: true, id: data?.id })
  } catch {
    return NextResponse.json({ error: 'Nie udało się wysłać wiadomości.' }, { status: 500 })
  }
}
