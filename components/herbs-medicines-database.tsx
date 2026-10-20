"use client"

import * as React from 'react'
import useSWR from 'swr'
import { Search, ShieldCheck, ExternalLink, ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Entry = { id: string; slug: string; name: string; kind: 'herb' | 'medicine'; latinName: string | null; activeCompounds: string[]; uses: string[]; contraindications: string[]; sideEffects: string[]; interactions: string[]; dosageNotes: string | null; evidenceLevel: string; sourceUrl: string | null }
const fetcher = (url: string) => fetch(url).then((response) => { if (!response.ok) throw new Error('Nie udało się pobrać bazy'); return response.json() as Promise<Entry[]> })

const herbGallery: Record<string, { image: string; alt: string }> = {
  'białoporek-brzozowy': { image: '/herbal/birch-polypore.png', alt: 'Białoporek brzozowy na korze brzozy' },
  rumianek: { image: '/herbal/chamomile.png', alt: 'Kwiaty rumianku na łące' },
  'mięta-pieprzowa': { image: '/herbal/mint.png', alt: 'Świeże liście mięty pieprzowej' },
  'reishi': { image: '/herbal/reishi.png', alt: 'Lakownica lśniąca na pniu' },
  'pokrzywa': { image: '/herbal/nettle.png', alt: 'Liście pokrzywy zwyczajnej' },
  'nagietek': { image: '/herbal/calendula.png', alt: 'Kwiaty nagietka lekarskiego' },
  'czarny-bez': { image: '/herbal/elderflower.png', alt: 'Kwiatostan czarnego bzu' },
}

export function HerbsMedicinesDatabase({ language = 'pl' }: { language?: 'pl' | 'en' }) {
  const { data, error, isLoading } = useSWR<Entry[]>('/api/herbs-medicines', fetcher)
  const [query, setQuery] = React.useState('')
  const [kind, setKind] = React.useState<'all' | Entry['kind']>('all')
  const isEnglish = language === 'en'
  const copy = isEnglish ? { title: 'Medicines & herbs database', description: 'Evidence-aware educational records with preparation notes, contraindications and interactions. Never use this as an individual treatment plan.', search: 'Search medicines and herbs', placeholder: 'Search by name, use or ingredient...', all: 'All', herbs: 'Herbs', medicines: 'Medicines', loading: 'Loading database', error: 'Could not connect to the database.', compounds: 'Active compounds', uses: 'Traditional uses', contraindications: 'Contraindications', sideEffects: 'Possible effects', interactions: 'Interactions', preparation: 'Preparation note', evidence: 'Evidence', source: 'Source' } : { title: 'Baza leków i ziół', description: 'Szczegółowe, edukacyjne rekordy z notatkami o przygotowaniu, przeciwwskazaniami i interakcjami. Nie jest to indywidualny plan leczenia.', search: 'Szukaj leków i ziół', placeholder: 'Szukaj po nazwie, zastosowaniu lub składniku...', all: 'Wszystko', herbs: 'Zioła', medicines: 'Leki', loading: 'Ładowanie bazy leków i ziół', error: 'Nie udało się połączyć z bazą.', compounds: 'Składniki aktywne', uses: 'Tradycyjne zastosowanie', contraindications: 'Przeciwwskazania', sideEffects: 'Możliwe działania niepożądane', interactions: 'Interakcje', preparation: 'Notatka o przygotowaniu', evidence: 'Poziom danych', source: 'Źródło' }
  const filtered = (data ?? []).filter((entry) => {
    const matchesKind = kind === 'all' || entry.kind === kind
    const text = [entry.name, entry.latinName, ...entry.uses, ...entry.activeCompounds].filter(Boolean).join(' ').toLowerCase()
    return matchesKind && text.includes(query.toLowerCase())
  })

  return <Card className="herbal-database overflow-hidden bg-white shadow-lg"><CardHeader className="space-y-3"><div><CardTitle className="text-2xl text-teal-700">{copy.title}</CardTitle><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{copy.description}</p></div><div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto]"><div className="relative min-w-0"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><Input aria-label={copy.search} placeholder={copy.placeholder} className="min-w-0 pl-9" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="flex flex-wrap gap-2"><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'all' ? 'bg-teal-600 text-white' : 'border border-slate-300 text-slate-800'}`} onClick={() => setKind('all')}>{copy.all}</button><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'herb' ? 'bg-teal-600 text-white' : 'border border-slate-300 text-slate-800'}`} onClick={() => setKind('herb')}>{copy.herbs}</button><button type="button" className={`rounded-md px-3 py-2 text-sm ${kind === 'medicine' ? 'bg-teal-600 text-white' : 'border border-slate-300 text-slate-800'}`} onClick={() => setKind('medicine')}>{copy.medicines}</button></div></div></CardHeader><CardContent className="min-w-0"><div className="herbal-gallery mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(herbGallery).map(([slug, item]) => <figure key={slug} className="overflow-hidden rounded-xl border border-teal-100 bg-teal-50"><img src={item.image} alt={item.alt} className="aspect-[4/3] w-full object-cover" /><figcaption className="flex items-center gap-2 p-2 text-xs font-medium leading-4 text-teal-900"><ImageIcon className="h-3.5 w-3.5 shrink-0" />{item.alt}</figcaption></figure>)}</div>{isLoading && <div className="space-y-3 py-6" aria-label={copy.loading}><div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" /><div className="h-12 animate-pulse rounded-xl bg-slate-100" /><div className="h-12 animate-pulse rounded-xl bg-slate-100" /></div>}{error && <p className="py-8 text-red-700">{copy.error}</p>}{!isLoading && !error && <Accordion type="single" collapsible className="mt-4">{filtered.map((entry) => <AccordionItem key={entry.id} value={entry.id} className="min-w-0"><AccordionTrigger className="min-w-0 text-left"><span className="min-w-0 break-words pr-3 font-semibold">{entry.name}<span className="ml-2 text-xs font-normal text-slate-600">{entry.kind === 'herb' ? 'zioło' : 'lek'}</span></span></AccordionTrigger><AccordionContent><div className="grid min-w-0 gap-5 overflow-hidden text-sm leading-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">{herbGallery[entry.slug] && <img src={herbGallery[entry.slug].image} alt={herbGallery[entry.slug].alt} className="aspect-[4/3] w-full max-w-md rounded-xl object-cover" />}<div className="min-w-0 space-y-4"><InfoBlock title={copy.compounds} items={entry.activeCompounds} /><InfoBlock title={copy.uses} items={entry.uses} /><InfoBlock title={copy.contraindications} items={entry.contraindications} tone="warning" /><InfoBlock title={copy.sideEffects} items={entry.sideEffects} /><InfoBlock title={copy.interactions} items={entry.interactions} tone="warning" />{entry.dosageNotes && <div className="rounded-lg border border-teal-200 bg-teal-50 p-3"><strong className="text-teal-950">{copy.preparation}:</strong><p className="mt-1 break-words text-teal-950">{entry.dosageNotes}</p></div>}<div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{copy.evidence}: {entry.evidenceLevel}</Badge>{entry.sourceUrl && <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 break-all text-teal-800 underline"><ExternalLink className="h-3 w-3 shrink-0" />{copy.source}</a>}</div></div></div></AccordionContent></AccordionItem>)}</Accordion>}</CardContent></Card>
}

function InfoBlock({ title, items, tone = 'default' }: { title: string; items: string[]; tone?: 'default' | 'warning' }) {
  return <section className={`min-w-0 rounded-lg p-3 ${tone === 'warning' ? 'bg-amber-50' : 'bg-slate-50'}`}><h4 className="mb-1 break-words font-semibold text-slate-950">{title}</h4><ul className="list-disc space-y-1 pl-5 text-slate-800">{items.map((item) => <li key={item} className="break-words">{item}</li>)}</ul></section>
}
