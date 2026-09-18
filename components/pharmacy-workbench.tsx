'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Calculator, CheckCircle2, ClipboardCheck, FlaskConical, Search, ShieldAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const symptoms = [
  { name: 'Ból i gorączka', triage: 'Sprawdź czas trwania, temperaturę, wiek i czerwone flagi. Nie łącz kilku produktów z paracetamolem.', options: ['Paracetamol', 'Ibuprofen'], warning: 'NLPZ wymagają oceny choroby wrzodowej, nerek, ciąży i leków przeciwkrzepliwych.' },
  { name: 'Kaszel', triage: 'Ustal typ kaszlu, czas trwania, duszność i gorączkę. Kaszel przewlekły wymaga konsultacji.', options: ['Ambroksol', 'Acetylocysteina'], warning: 'Nie łącz automatycznie leków przeciwkaszlowych z wykrztuśnymi.' },
  { name: 'Alergia sezonowa', triage: 'Zapytaj o duszność, obrzęk twarzy i reakcje uogólnione — to wskazania pilne.', options: ['Cetyryzyna', 'Loratadyna'], warning: 'Oceń senność, choroby nerek/wątroby oraz inne leki uspokajające.' },
  { name: 'Zgaga', triage: 'Objawy alarmowe, dysfagia, krwawienie lub utrata masy ciała wymagają skierowania do lekarza.', options: ['Omeprazol', 'Pantoprazol'], warning: 'Samoleczenie ma ograniczony czas; sprawdź ulotkę i aktualne wytyczne.' },
]

const formulas = [
  { name: 'Stężenie procentowe', formula: 'masa substancji / masa roztworu × 100', hint: 'Wynik podaje udział masowy w procentach.' },
  { name: 'Przeliczenie dawki na objętość', formula: 'objętość = wymagana dawka / stężenie', hint: 'Jednostki dawki i stężenia muszą być zgodne.' },
  { name: 'Skalowanie receptury', formula: 'nowa ilość = ilość bazowa × (nowa masa / masa bazowa)', hint: 'Po przeliczeniu sprawdź sumę, gęstość, trwałość i oznakowanie.' },
]

export function PharmacyWorkbench() {
  const [symptomQuery, setSymptomQuery] = useState('')
  const [selectedSymptom, setSelectedSymptom] = useState(symptoms[0])
  const [dose, setDose] = useState('500')
  const [concentration, setConcentration] = useState('100')
  const [baseMass, setBaseMass] = useState('100')
  const [targetMass, setTargetMass] = useState('250')
  const [checks, setChecks] = useState({ identity: false, calculations: false, interactions: false, label: false })

  const filteredSymptoms = useMemo(() => symptoms.filter((item) => item.name.toLowerCase().includes(symptomQuery.toLowerCase())), [symptomQuery])
  const volume = Number(dose) > 0 && Number(concentration) > 0 ? (Number(dose) / Number(concentration)).toFixed(2) : '—'
  const scale = Number(baseMass) > 0 && Number(targetMass) > 0 ? (Number(targetMass) / Number(baseMass)).toFixed(2) : '—'
  const allChecks = Object.values(checks).every(Boolean)

  return (
    <Card className="glass-panel border-0 shadow-xl">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><CardTitle className="flex items-center gap-2 text-2xl"><ClipboardCheck className="text-primary" /> Pracownia farmaceutyczna</CardTitle><CardDescription>Kompendium i kalkulatory wspierające pracę farmaceuty. Wyniki wymagają weryfikacji z ChPL, ulotką i procedurą apteki.</CardDescription></div>
          <Badge variant="outline">Tryb edukacyjny</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-5 border-amber-500/40 bg-amber-500/10"><ShieldAlert className="size-4" /><AlertTitle>Bezpieczeństwo przede wszystkim</AlertTitle><AlertDescription>Moduł nie ustala indywidualnego leczenia ani recepty dla pacjenta. Nie podawaj danych osobowych. Farmaceuta zawsze potwierdza dawkę, postać, drogę podania, przeciwwskazania i aktualność źródła przed wydaniem lub wykonaniem preparatu.</AlertDescription></Alert>
        <Tabs defaultValue="symptoms">
          <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4"><TabsTrigger value="symptoms">Objawy</TabsTrigger><TabsTrigger value="recipes">Receptariusz</TabsTrigger><TabsTrigger value="dose">Dawkowanie</TabsTrigger><TabsTrigger value="lab">Laboratorium</TabsTrigger></TabsList>
          <TabsContent value="symptoms" className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3"><Label htmlFor="symptom-search">Znajdź objaw</Label><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input id="symptom-search" className="pl-9" placeholder="np. kaszel" value={symptomQuery} onChange={(e) => setSymptomQuery(e.target.value)} /></div>{filteredSymptoms.map((item) => <Button key={item.name} variant={selectedSymptom.name === item.name ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setSelectedSymptom(item)}>{item.name}</Button>)}</div>
            <Card><CardHeader><CardTitle>{selectedSymptom.name}</CardTitle><CardDescription>{selectedSymptom.triage}</CardDescription></CardHeader><CardContent className="space-y-3"><p className="text-sm font-medium">Obszary do sprawdzenia w dokumentacji:</p><div className="flex flex-wrap gap-2">{selectedSymptom.options.map((option) => <Badge key={option} variant="secondary">{option}</Badge>)}</div><Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Kontrola ryzyka</AlertTitle><AlertDescription>{selectedSymptom.warning}</AlertDescription></Alert></CardContent></Card>
          </TabsContent>
          <TabsContent value="recipes" className="space-y-4"><Alert><FlaskConical className="size-4" /><AlertTitle>Receptariusz jako checklista</AlertTitle><AlertDescription>Pracuj wyłącznie na zatwierdzonych recepturach, surowcach z dokumentacją jakościową i procedurach obowiązujących w danej aptece. Nie traktuj przykładowej receptury jako zlecenia wykonania.</AlertDescription></Alert><div className="grid gap-3 md:grid-cols-3">{['Identyfikacja surowców i numerów serii', 'Obliczenia i zgodność jednostek', 'Kontrola jakości, etykieta i termin'].map((item, index) => <Card key={item}><CardContent className="flex gap-3 p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">{index + 1}</span><p className="text-sm">{item}</p></CardContent></Card>)}</div></TabsContent>
          <TabsContent value="dose" className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="size-5" /> Przelicznik objętości</CardTitle><CardDescription>Obliczenie matematyczne, nie rekomendacja dawki.</CardDescription></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="required-dose">Wymagana ilość (jednostka)</Label><Input id="required-dose" type="number" min="0" value={dose} onChange={(e) => setDose(e.target.value)} /></div><div><Label htmlFor="strength">Stężenie (jednostka/ml)</Label><Input id="strength" type="number" min="0" value={concentration} onChange={(e) => setConcentration(e.target.value)} /></div><div className="rounded-lg bg-muted p-4 text-center"><p className="text-sm text-muted-foreground">Wynik kontrolny</p><p className="text-2xl font-bold">{volume} ml</p></div></CardContent></Card><Card><CardHeader><CardTitle>Skalowanie receptury</CardTitle><CardDescription>Kontrola proporcji masy — bez walidacji stabilności.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="base-mass">Masa bazowa (g)</Label><Input id="base-mass" type="number" min="0" value={baseMass} onChange={(e) => setBaseMass(e.target.value)} /></div><div><Label htmlFor="target-mass">Masa docelowa (g)</Label><Input id="target-mass" type="number" min="0" value={targetMass} onChange={(e) => setTargetMass(e.target.value)} /></div></div><div className="rounded-lg bg-muted p-4 text-center"><p className="text-sm text-muted-foreground">Współczynnik skalowania</p><p className="text-2xl font-bold">× {scale}</p></div></CardContent></Card></TabsContent>
          <TabsContent value="lab" className="space-y-4"><Card><CardHeader><CardTitle>Kontrola przed wydaniem</CardTitle><CardDescription>Odznacz dopiero po sprawdzeniu w systemie aptecznym i źródłach.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{Object.entries({ identity: 'Tożsamość pacjenta i zlecenia', calculations: 'Obliczenia, jednostki i stężenia', interactions: 'Interakcje, alergie i przeciwwskazania', label: 'Etykieta, instrukcja i dokumentacja' }).map(([key, label]) => <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm"><input type="checkbox" checked={checks[key as keyof typeof checks]} onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })} />{label}</label>)}<div className="sm:col-span-2"><Alert variant={allChecks ? 'default' : 'destructive'}>{allChecks ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}<AlertTitle>{allChecks ? 'Kontrola kompletna' : 'Kontrola niepełna'}</AlertTitle><AlertDescription>{allChecks ? 'Nadal wymagana jest niezależna weryfikacja farmaceuty i zgodność z aktualną procedurą.' : 'Nie zatwierdzaj preparatu, dopóki wszystkie punkty nie zostaną sprawdzone.'}</AlertDescription></Alert></div></CardContent></Card><p className="text-xs text-muted-foreground">Źródła do weryfikacji: aktualna ChPL/ulotka, Farmakopea Polska, Urząd Rejestracji Produktów Leczniczych, EMA oraz procedury jakościowe apteki.</p></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
