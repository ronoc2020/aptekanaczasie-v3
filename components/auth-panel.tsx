'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthPanel({ onSuccess }: { onSuccess?: () => void }) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)
    const result = mode === 'sign-in'
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name })
    setPending(false)
    if (result.error) { setError('Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.'); return }
    onSuccess?.()
  }

  async function signInWithGoogle() {
    setError('')
    setPending(true)
    const result = await authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/` })
    setPending(false)
    if (result.error) {
      console.error('[v0] Google sign-in failed:', result.error.message)
      setError('Logowanie przez Google jest chwilowo niedostępne. Spróbuj ponownie lub użyj emaila i hasła.')
      return
    }
    if (result.data?.url) window.location.assign(result.data.url)
  }

  return <div className="w-full min-w-0 space-y-4"><div className="grid grid-cols-2 gap-2"><Button type="button" variant={mode === 'sign-in' ? 'default' : 'outline'} onClick={() => setMode('sign-in')} className="min-w-0 px-2 text-sm">Zaloguj się</Button><Button type="button" variant={mode === 'sign-up' ? 'default' : 'outline'} onClick={() => setMode('sign-up')} className="min-w-0 px-2 text-sm">Utwórz konto</Button></div><form onSubmit={submit} className="space-y-3">{mode === 'sign-up' && <div className="space-y-1"><Label htmlFor="auth-name">Imię</Label><Input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>}<div className="space-y-1"><Label htmlFor="auth-email">Email</Label><Input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="space-y-1"><Label htmlFor="auth-password">Hasło</Label><Input id="auth-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={pending} className="w-full" type="submit">{pending ? 'Przetwarzanie…' : mode === 'sign-in' ? 'Zaloguj się' : 'Zarejestruj się'}</Button></form><div className="relative text-center text-xs text-muted-foreground"><span className="bg-background px-2">lub</span></div><Button type="button" variant="outline" className="w-full" onClick={signInWithGoogle}>Kontynuuj z Google</Button></div>
}
