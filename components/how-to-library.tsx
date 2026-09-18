"use client"

import * as React from 'react'
import useSWR from 'swr'
import { BookOpen, Clock3, ExternalLink, Loader2, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Article = { id: string; title: string; summary: string; category: string; difficulty: string; durationMinutes: number; materials: string[]; steps: string[]; safetyNotes: string[]; sourceUrl: string | null }
const fetcher = (url: string) => fetch(url).then((response) => { if (!response.ok) throw new Error('Nie udało się pobrać poradników'); return response.json() as Promise<Article[]> })

export function HowToLibrary() {
  const { data, error, isLoading } = useSWR<Article[]>('/api/how-to', fetcher)
  const [query, setQuery] = React.useState('')
  const filtered = (data ?? []).filter((article) => `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(query.toLowerCase()))
  return <Card className="bg-white shadow-lg"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="flex items-center gap-2 text-2xl text-teal-700"><BookOpen className="h-6 w-6" />Poradniki praktyczne</CardTitle><p className="mt-2 text-sm text-slate-600">Baza instrukcji krok po kroku, opracowana edukacyjnie na podstawie publicznych materiałów.</p></div></div></CardHeader><CardContent><Input aria-label="Szukaj poradników" placeholder="Szukaj poradnika..." value={query} onChange={(event) => setQuery(event.target.value)} />{isLoading && <div className="flex items-center gap-2 py-8 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Ładowanie bazy...</div>}{error && <p className="py-8 text-red-700">Nie udało się połączyć z bazą poradników.</p>}{!isLoading && !error && <Accordion type="single" collapsible className="mt-4">{filtered.map((article) => <AccordionItem key={article.id} value={article.id}><AccordionTrigger><div className="text-left"><span className="font-semibold">{article.title}</span><span className="ml-2 text-xs text-slate-500">{article.category}</span></div></AccordionTrigger><AccordionContent><div className="space-y-4 text-sm leading-6"><p>{article.summary}</p><div className="flex flex-wrap gap-2"><Badge variant="outline">{article.difficulty}</Badge><Badge variant="outline"><Clock3 className="mr-1 inline h-3 w-3" />{article.durationMinutes} min</Badge></div><div><strong>Potrzebujesz:</strong><ul className="list-disc pl-5">{article.materials.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>Instrukcja:</strong><ol className="list-decimal pl-5">{article.steps.map((step) => <li key={step}>{step}</li>)}</ol></div><div className="rounded-md bg-amber-50 p-3 text-amber-900"><ShieldCheck className="mr-1 inline h-4 w-4" /><strong>Bezpieczeństwo:</strong><ul className="mt-1 list-disc pl-5">{article.safetyNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>{article.sourceUrl && <a className="inline-flex items-center gap-1 text-teal-700 underline" href={article.sourceUrl} target="_blank" rel="noreferrer">Źródło wikiHow <ExternalLink className="h-3 w-3" /></a>}</div></AccordionContent></AccordionItem>)}</Accordion>}{!isLoading && !error && filtered.length === 0 && <p className="py-8 text-center text-slate-500">Brak poradników dla tego wyszukiwania.</p>}</CardContent></Card>
}
