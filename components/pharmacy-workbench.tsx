'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Beaker,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const symptoms = [
  { name: 'Ból i gorączka', triage: 'Ustal czas trwania, temperaturę, wiek, masę ciała i czerwone flagi.', options: ['Paracetamol', 'Ibuprofen'], warning: 'Sprawdź choroby wątroby i nerek, odwodnienie, ciążę, NLPZ oraz łączną dawkę dobową.' },
  { name: 'Kaszel', triage: 'Rozróżnij kaszel suchy i produktywny oraz zapytaj o duszność, krwioplucie i czas trwania.', options: ['Ambroksol', 'Acetylocysteina'], warning: 'Nie łącz automatycznie leków przeciwkaszlowych z wykrztuśnymi. Czerwone flagi wymagają skierowania.' },
  { name: 'Alergia sezonowa', triage: 'Wyklucz duszność, obrzęk twarzy i reakcję uogólnioną — to wskazania pilne.', options: ['Cetyryzyna', 'Loratadyna'], warning: 'Oceń senność, czynność nerek i wątroby oraz inne leki uspokajające.' },
  { name: 'Zgaga', triage: 'Objawy alarmowe, dysfagia, krwawienie lub utrata masy ciała wymagają konsultacji lekarskiej.', options: ['Omeprazol', 'Pantoprazol'], warning: 'Samoleczenie ma ograniczony czas. Sprawdź interakcje i aktualną ChPL.' },
  { name: 'Biegunka', triage: 'Oceń odwodnienie, gorączkę, krew w stolcu, wiek i czas trwania.', options: ['Płyny nawadniające', 'Racekadotryl'], warning: 'Nie hamuj objawowo biegunki z krwią lub wysoką gorączką bez konsultacji.' },
  { name: 'Bezsenność', triage: 'Zapytaj o czas trwania, leki, używki, nastrój i objawy bezdechu.', options: ['Higiena snu', 'Melisa'], warning: 'Nie łącz preparatów uspokajających z alkoholem ani lekami wpływającymi na OUN.' },
]

const recipes = [
  { name: 'Roztwór NaCl 0,9% — ćwiczenie obliczeniowe', form: 'Roztwór', ingredients: 'NaCl 0,9 g; woda oczyszczona do 100 ml', checks: ['zgodność stężenia', 'jakość surowców', 'opakowanie i oznakowanie'], note: 'Nie jest preparatem do iniekcji ani do oczu. Wykonanie wyłącznie według zatwierdzonej procedury.' },
  { name: 'Żel z karbomerem — przykład technologiczny', form: 'Żel', ingredients: 'Karbomer, glicerol, woda oczyszczona; ilości zgodnie z recepturą zakładową', checks: ['pH i jednorodność', 'zawartość netto', 'trwałość i termin'], note: 'Przykład dydaktyczny. Nie stosować u pacjenta bez walidacji i zwolnienia jakościowego.' },
  { name: 'Syrop prosty — przykład receptariuszowy', form: 'Syrop', ingredients: 'Sacharoza i woda oczyszczona; proporcje zgodnie z aktualnym receptariuszem', checks: ['stężenie cukru', 'czystość mikrobiologiczna', 'etykieta i przechowywanie'], note: 'Nie zastępuje monografii Farmakopei Polskiej ani procedury apteki.' },
  { name: 'Krem emulsyjny — ćwiczenie faz', form: 'Krem', ingredients: 'Faza wodna, olejowa i emulgator; skład dobiera technolog farmaceutyczny', checks: ['temperatura faz', 'typ emulsji', 'stabilność'], note: 'Wymaga kontroli procesu, kompatybilności i dokumentacji serii.' },
]

const qualityChecks = [
  ['identity', 'Tożsamość pacjenta, zlecenia i surowców'],
  ['calculations', 'Obliczenia, jednostki, stężenie i masa końcowa'],
  ['compatibility', 'Kompatybilność, interakcje i przeciwwskazania'],
  ['process', 'Proces, wyposażenie, higiena i kontrola temperatury'],
  ['label', 'Etykieta, instrukcja, termin i warunki przechowywania'],
  ['release', 'Niezależna kontrola i zwolnienie przez uprawnioną osobę'],
] as const

export function PharmacyWorkbench() {
  const [symptomQuery, setSymptomQuery] = useState('')
  const [selectedSymptom, setSelectedSymptom] = useState(symptoms[0])
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0])
  const [dose, setDose] = useState('500')
  const [concentration, setConcentration] = useState('100')
  const [patientWeight, setPatientWeight] = useState('70')
  const [dosePerKg, setDosePerKg] = useState('10')
  const [baseMass, setBaseMass] = useState('100')
  const [targetMass, setTargetMass] = useState('250')
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [ingredients, setIngredients] = useState([{ name: 'Substancja czynna', amount: '0', unit: 'mg' }])

  const filteredSymptoms = useMemo(() => symptoms.filter((item) => item.name.toLowerCase().includes(symptomQuery.toLowerCase())), [symptomQuery])
  const numeric = (...values: string[]) => values.every((value) => Number.isFinite(Number(value)) && Number(value) > 0)
  const volume = numeric(dose, concentration) ? (Number(dose) / Number(concentration)).toFixed(2) : '—'
  const weightDose = numeric(patientWeight, dosePerKg) ? (Number(patientWeight) * Number(dosePerKg)).toFixed(2) : '—'
  const scale = numeric(baseMass, targetMass) ? (Number(targetMass) / Number(baseMass)).toFixed(3) : '—'
  const completedChecks = qualityChecks.filter(([key]) => checks[key]).length
  const allChecks = completedChecks === qualityChecks.length

  const updateIngredient = (index: number, field: string, value: string) => setIngredients((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))

  return (
    <Card className="glass-panel overflow-hidden border-0 shadow-xl">
      <CardHeader className="border-b border-border/60 bg-primary/[0.04]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><CardTitle className="flex items-center gap-2 text-2xl"><ClipboardCheck className="text-primary" /> Pracownia farmaceutyczna</CardTitle><CardDescription className="mt-2 max-w-3xl">Workbench do dokumentowania receptury, obliczeń i kontroli jakości. Nie generuje indywidualnego zlecenia terapeutycznego ani nie zastępuje ChPL, Farmakopei Polskiej i procedur apteki.</CardDescription></div>
          <Badge variant="outline" className="gap-2"><ShieldAlert /> Kontrola dwuosobowa</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Alert className="mb-6 border-amber-500/40 bg-amber-500/10"><ShieldAlert className="size-4" /><AlertTitle>Bezpieczeństwo i odpowiedzialność zawodowa</AlertTitle><AlertDescription>Wyniki są pomocnicze. Przed wykonaniem lub wydaniem potwierdź tożsamość, wskazanie, postać, drogę podania, maksymalną dawkę, alergie, interakcje, jakość surowców i aktualność źródeł. Nie wpisuj danych osobowych pacjenta.</AlertDescription></Alert>

        <Tabs defaultValue="symptoms">
          <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-4"><TabsTrigger value="symptoms">Objawy i triage</TabsTrigger><TabsTrigger value="recipes">Receptariusz</TabsTrigger><TabsTrigger value="dose">Dawkowanie i obliczenia</TabsTrigger><TabsTrigger value="lab">Laboratorium</TabsTrigger></TabsList>

          <TabsContent value="symptoms" className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <Card><CardHeader><CardTitle className="text-base">Biblioteka objawów</CardTitle><CardDescription>Wybierz temat, aby zobaczyć pytania kontrolne.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Wyszukaj objaw" className="pl-9" placeholder="Szukaj np. kaszel" value={symptomQuery} onChange={(event) => setSymptomQuery(event.target.value)} /></div>{filteredSymptoms.map((item) => <Button key={item.name} variant={selectedSymptom.name === item.name ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setSelectedSymptom(item)}>{item.name}</Button>)}{filteredSymptoms.length === 0 && <p className="text-sm text-muted-foreground">Brak wyników. Sprawdź pisownię lub użyj szerszego hasła.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle>{selectedSymptom.name}</CardTitle><CardDescription>{selectedSymptom.triage}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2">{selectedSymptom.options.map((option) => <Badge key={option} variant="secondary">Sprawdź: {option}</Badge>)}</div><Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Czerwone flagi i ryzyko</AlertTitle><AlertDescription>{selectedSymptom.warning}</AlertDescription></Alert><div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2"><span>1. Zbierz wywiad i czas trwania</span><span>2. Zweryfikuj leki i alergie</span><span>3. Oceń wskazania do konsultacji</span><span>4. Udokumentuj rekomendację</span></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="recipes" className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card><CardHeader><CardTitle className="text-base">Biblioteka receptariuszowa</CardTitle><CardDescription>Wzorce dydaktyczne do pracy na zatwierdzonych recepturach.</CardDescription></CardHeader><CardContent className="space-y-2">{recipes.map((recipe) => <Button key={recipe.name} variant={selectedRecipe.name === recipe.name ? 'default' : 'outline'} className="h-auto w-full justify-start py-3 text-left" onClick={() => setSelectedRecipe(recipe)}><span><span className="block font-medium">{recipe.name}</span><span className="text-xs opacity-75">{recipe.form}</span></span></Button>)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical className="size-5 text-primary" /> {selectedRecipe.name}</CardTitle><CardDescription>Skład roboczy: {selectedRecipe.ingredients}</CardDescription></CardHeader><CardContent className="space-y-5"><Alert><FileText className="size-4" /><AlertTitle>Przed wykonaniem</AlertTitle><AlertDescription>{selectedRecipe.note}</AlertDescription></Alert><div className="grid gap-3 sm:grid-cols-3">{selectedRecipe.checks.map((check, index) => <div key={check} className="rounded-lg border bg-muted/30 p-3 text-sm"><Badge variant="outline" className="mb-2">{index + 1}</Badge><p>{check}</p></div>)}</div><div className="rounded-lg border border-dashed p-4"><p className="mb-3 text-sm font-medium">Składniki robocze — bez zapisu danych pacjenta</p><div className="space-y-2">{ingredients.map((ingredient, index) => <div className="grid grid-cols-[1fr_90px_72px_auto] gap-2" key={`${index}-${ingredient.name}`}><Input aria-label={`Nazwa składnika ${index + 1}`} value={ingredient.name} onChange={(event) => updateIngredient(index, 'name', event.target.value)} /><Input aria-label={`Ilość składnika ${index + 1}`} type="number" min="0" value={ingredient.amount} onChange={(event) => updateIngredient(index, 'amount', event.target.value)} /><Input aria-label={`Jednostka składnika ${index + 1}`} value={ingredient.unit} onChange={(event) => updateIngredient(index, 'unit', event.target.value)} /><Button type="button" variant="ghost" size="icon" aria-label="Usuń składnik" disabled={ingredients.length === 1} onClick={() => setIngredients((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button></div>)}</div><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setIngredients((items) => [...items, { name: '', amount: '0', unit: 'mg' }])}><Plus data-icon="inline-start" /> Dodaj składnik</Button></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="dose" className="grid gap-5 xl:grid-cols-3">
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Calculator className="size-5" /> Objętość</CardTitle><CardDescription>Wymagana ilość ÷ stężenie.</CardDescription></CardHeader><CardContent className="space-y-3"><Label htmlFor="required-dose">Wymagana ilość</Label><Input id="required-dose" type="number" min="0" value={dose} onChange={(event) => setDose(event.target.value)} /><Label htmlFor="strength">Stężenie na ml</Label><Input id="strength" type="number" min="0" value={concentration} onChange={(event) => setConcentration(event.target.value)} /><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Wynik kontrolny</span><p className="text-2xl font-bold">{volume} ml</p></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Dawka zależna od masy</CardTitle><CardDescription>Matematyka pomocnicza — zakres i limit muszą pochodzić ze źródła.</CardDescription></CardHeader><CardContent className="space-y-3"><Label htmlFor="patient-weight">Masa ciała (kg)</Label><Input id="patient-weight" type="number" min="0" value={patientWeight} onChange={(event) => setPatientWeight(event.target.value)} /><Label htmlFor="dose-per-kg">Dawka ze źródła (mg/kg)</Label><Input id="dose-per-kg" type="number" min="0" value={dosePerKg} onChange={(event) => setDosePerKg(event.target.value)} /><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Wynik matematyczny</span><p className="text-2xl font-bold">{weightDose} mg</p></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Skalowanie receptury</CardTitle><CardDescription>Kontrola proporcji masy, bez oceny stabilności.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2"><div><Label htmlFor="base-mass">Baza (g)</Label><Input id="base-mass" type="number" min="0" value={baseMass} onChange={(event) => setBaseMass(event.target.value)} /></div><div><Label htmlFor="target-mass">Cel (g)</Label><Input id="target-mass" type="number" min="0" value={targetMass} onChange={(event) => setTargetMass(event.target.value)} /></div></div><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Współczynnik</span><p className="text-2xl font-bold">× {scale}</p></div><p className="text-xs text-muted-foreground">Po przeliczeniu sprawdź tolerancje ważenia, sumę składników i dokumentację serii.</p></CardContent></Card>
          </TabsContent>

          <TabsContent value="lab" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3"><Card className="border-primary/30 bg-primary/[0.04]"><CardContent className="p-4"><Beaker className="mb-2 text-primary" /><p className="text-2xl font-bold">{completedChecks}/{qualityChecks.length}</p><p className="text-sm text-muted-foreground">punkty kontroli</p></CardContent></Card><Card><CardContent className="p-4"><Calculator className="mb-2 text-primary" /><p className="text-2xl font-bold">{scale}</p><p className="text-sm text-muted-foreground">współczynnik receptury</p></CardContent></Card><Card><CardContent className="p-4"><ShieldAlert className="mb-2 text-primary" /><p className="text-2xl font-bold">{allChecks ? 'Gotowe' : 'W toku'}</p><p className="text-sm text-muted-foreground">status zwolnienia</p></CardContent></Card></div>
            <Card><CardHeader><CardTitle>Kontrola przed wykonaniem i wydaniem</CardTitle><CardDescription>Zaznacz punkt dopiero po weryfikacji w dokumentacji jakościowej.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{qualityChecks.map(([key, label]) => <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors hover:bg-muted/50"><input className="mt-1 size-4 accent-primary" type="checkbox" checked={Boolean(checks[key])} onChange={(event) => setChecks({ ...checks, [key]: event.target.checked })} /><span>{label}</span></label>)}<Alert className="sm:col-span-2" variant={allChecks ? 'default' : 'destructive'}>{allChecks ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}<AlertTitle>{allChecks ? 'Kontrola kompletna — oczekuje na niezależne zwolnienie' : 'Kontrola niepełna'}</AlertTitle><AlertDescription>{allChecks ? 'Wynik nie jest automatyczną zgodą na użycie. Farmaceuta odpowiedzialny potwierdza zgodność z aktualnym źródłem i SOP.' : `Pozostało punktów: ${qualityChecks.length - completedChecks}. Nie zatwierdzaj preparatu przed ich sprawdzeniem.`}</AlertDescription></Alert></CardContent></Card>
            <p className="text-xs text-muted-foreground">Źródła do każdorazowej weryfikacji: aktualna ChPL i ulotka, Farmakopea Polska, URPL, EMA, monografie surowców oraz procedury jakościowe apteki. Moduł nie przechowuje danych pacjentów.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
