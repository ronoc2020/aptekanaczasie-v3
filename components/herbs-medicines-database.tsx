"use client"

import * as React from 'react'
import useSWR from 'swr'
import { Search, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Entry = { id: string; name: string; kind: 'herb' | 'medicine'; latinName: string | null; activeCompounds: string[]; uses: string[]; contraindications: string[]; sideEffects: string[]; interactions: string[]; dosageNotes: string | null; evidenceLevel: string; sourceUrl: string | null }
const fetcher = (url: string) => fetch(url).then((response) => { if (!response.ok) throw new Error('Nie udało się pobrać bazy'); return response.json() as Promise<Entry[]> })

export function HerbsMedicinesDatabase() {
  const { data, error, isLoading } = useSWR<Entry[]>('/api/herbs-medicines', fetcher)
  const [query, setQuery] = React.useState('')
  const [kind, setKind] = React.useState<'all' | Entry['kind']>('all')
  const filtered = (data ?? []).filter((entry) => {
    const matchesKind = kind === 'all' || entry.kind === kind
    const text = [entry.name, entry.latinName, ...entry.uses, ...entry.activeCompounds].filter(Boolean).join(' ').toLowerCase()
    return matchesKind && text.includes(query.toLowerCase())
  })

  return <Card className="bg-white shadow-lg"><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-2xl text-teal-700">Baza leków i ziół</CardTitle><p className="mt-2 text-sm text-slate-600">Edukacyjne informacje, przeciwwskazania i interakcje. Nie zastępuje porady lekarza ani farmaceuty.</p></div></div></CardHeader><CardContent><div className="slide-fade-panel grid gap-3 md:grid-cols-[1fr_auto]"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input aria-label="Szukaj leków i ziół" placeholder="Szukaj po nazwie, zastosowaniu lub składniku..." className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="flex gap-2"><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'all' ? 'bg-teal-600 text-white' : 'border text-slate-700'}`} onClick={() => setKind('all')}>Wszystko</button><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'herb' ? 'bg-teal-600 text-white' : 'border text-slate-700'}`} onClick={() => setKind('herb')}>Zioła</button><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'medicine' ? 'bg-teal-600 text-white' : 'border text-slate-700'}`} onClick={() => setKind('medicine')}>Leki</button></div></div>{isLoading && <div className="space-y-3 py-6" aria-label="Ładowanie bazy leków i ziół"><div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" /><div className="h-12 animate-pulse rounded-xl bg-slate-100" /><div className="h-12 animate-pulse rounded-xl bg-slate-100" /><div className="h-12 animate-pulse rounded-xl bg-slate-100" /></div>}{error && <p className="py-8 text-red-700">Nie udało się połączyć z bazą.</p>}{!isLoading && !error && <Accordion type="single" collapsible className="slide-fade-panel mt-4">{filtered.map((entry) => <AccordionItem key={entry.id} value={entry.id}><AccordionTrigger><div className="text-left"><span className="font-semibold">{entry.name}</span><span className="ml-2 text-xs text-slate-500">{entry.kind === 'herb' ? 'zioło' : 'lek'}</span></div></AccordionTrigger><AccordionContent><div className="space-y-3 text-sm leading-6"><div className="flex flex-wrap gap-2"><Badge variant="outline">{entry.evidenceLevel}</Badge>{entry.latinName && <Badge variant="outline"><i>{entry.latinName}</i></Badge>}</div><p><strong>Zastosowanie:</strong> {entry.uses.join(', ')}</p><p><strong>Składniki:</strong> {entry.activeCompounds.join(', ')}</p><p><strong>Przeciwwskazania:</strong> {entry.contraindications.join('; ')}</p><p><strong>Działania niepożądane:</strong> {entry.sideEffects.join('; ')}</p><p><strong>Interakcje:</strong> {entry.interactions.join('; ')}</p>{entry.dosageNotes && <p><strong>Ważne:</strong> {entry.dosageNotes}</p>}<div className="rounded-md bg-amber-50 p-3 text-amber-900"><ShieldCheck className="mr-1 inline h-4 w-4" />Informacje mają charakter edukacyjny. W razie wątpliwości skonsultuj się z profesjonalistą medycznym.</div></div></AccordionContent></AccordionItem>)}</Accordion>}{!isLoading && !error && filtered.length === 0 && <p className="py-8 text-center text-slate-500">Brak wyników dla podanego wyszukiwania.</p>}</CardContent></Card>
}
