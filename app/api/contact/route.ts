import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const recipient = 'rocybersolutions@gmail.com'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const requestKind = String(body.kind ?? 'contact')
    const isTest = requestKind === 'test'
    const kind = requestKind === 'contact' ? 'Kontakt' : requestKind === 'test' ? 'Email testowy' : 'Opinia użytkownika'
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const subject = String(body.subject ?? '').trim()
    const message = kind === 'Kontakt' ? String(body.message ?? '').trim() : String(body.improvement ?? '').trim()
    const rating = Number(body.rating ?? 0)

    if (isTest) {
      if (!name || name.length > 120 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Podaj imię i poprawny adres email do testu.' }, { status: 400 })
    } else if (!name || !message || name.length > 120 || message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: 'Uzupełnij wymagane pola.' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Podaj poprawny adres email.' }, { status: 400 })
    if (kind === 'Opinia użytkownika' && (!Number.isInteger(rating) || rating < 1 || rating > 5)) return NextResponse.json({ error: 'Wybierz ocenę od 1 do 5.' }, { status: 400 })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Apteka na Czasie <contact@rocybersolutions.com>'
    const html = isTest ? `<h2>Test email — Apteka na Czasie</h2><p>Cześć ${escapeHtml(name)},</p><p>To jest wiadomość testowa potwierdzająca działanie formularza kontaktowego.</p><p>Jeśli ją otrzymujesz, wysyłka email działa poprawnie.</p>` : `<h2>${escapeHtml(kind)}</h2><p><strong>Imię:</strong> ${escapeHtml(name)}</p>${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}${subject ? `<p><strong>Temat:</strong> ${escapeHtml(subject)}</p>` : ''}${kind !== 'Kontakt' ? `<p><strong>Ocena:</strong> ${rating}/5</p>` : ''}<p><strong>Treść:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    const { data, error } = await resend.emails.send({ from, to: [isTest ? email : recipient], replyTo: email || undefined, subject: isTest ? 'Test email — Apteka na Czasie' : `${kind}: ${subject || name}`, html }, { idempotencyKey: `app-${isTest ? 'test' : kind.toLowerCase().replace(/\s+/g, '-')}-${email || name}-${Date.now()}` })
    if (error) return NextResponse.json({ error: error.message }, { status: 502 })
    return NextResponse.json({ ok: true, id: data?.id })
  } catch {
    return NextResponse.json({ error: 'Nie udało się wysłać wiadomości.' }, { status: 500 })
  }
}
