'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Beaker,
  Calculator,
  CheckCircle2,
  Download,
  History,
  Info,
  RefreshCw,
  Scale,
  Stethoscope,
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
  { name: 'Ból i gorączka', triage: 'Ustal czas trwania, temperaturę, wiek, masę ciała i czerwone flagi.', options: ['Paracetamol 500-1000 mg', 'Ibuprofen 200-400 mg'], warning: 'Sprawdź choroby wątroby i nerek, odwodnienie, ciążę, NLPZ oraz łączną dawkę dobową.', redFlags: ['Gorączka > 39°C przez > 3 dni', 'Sztywność karku', 'Osłabienie świadomości', 'Zawał lub udar w wywiadzie'], recommendation: 'Paracetamol dla pacjentów z zaburzeniami nerek; Ibuprofen jeśli brak przeciwwskazań.' },
  { name: 'Kaszel', triage: 'Rozróżnij kaszel suchy i produktywny oraz zapytaj o duszność, krwioplucie i czas trwania.', options: ['Ambroksol 30 mg', 'Acetylocysteina 600 mg'], warning: 'Nie łącz automatycznie leków przeciwkaszlowych z wykrztuśnymi. Czerwone flagi wymagają skierowania.', redFlags: ['Krwioplucie', 'Duszność spoczynkowa', 'Kaszel trwający > 3 tygodnie', 'Wysoka gorączka'], recommendation: 'Ambroksol przy kaszlu produktywnym; Acetylocysteina wzmacnia wykrztuśność.' },
  { name: 'Alergia sezonowa', triage: 'Wyklucz duszność, obrzęk twarzy i reakcję uogólnioną — to wskazania pilne.', options: ['Cetyryzyna 10 mg', 'Loratadyna 10 mg'], warning: 'Oceń senność, czynność nerek i wątroby oraz inne leki uspokajające.', redFlags: ['Obrzęk języka/gardła', 'Duszność', 'Wypryszczyzna uogólniona', 'Spadek ciśnienia'], recommendation: 'Cetyryzyna nie powoduje senności; lepsze dla kierowców i maszyn.' },
  { name: 'Zgaga', triage: 'Objawy alarmowe, dysfagia, krwawienie lub utrata masy ciała wymagają konsultacji lekarskiej.', options: ['Omeprazol 20 mg', 'Pantoprazol 40 mg'], warning: 'Samoleczenie ma ograniczony czas. Sprawdź interakcje i aktualną ChPL.', redFlags: ['Krwawienie z przewodu pokarmowego', 'Dysfagia', 'Utrata masy ciała', 'Czarne stolce'], recommendation: 'Omeprazol zwykle wystarczający; Pantoprazol dla opornych przypadków.' },
  { name: 'Biegunka', triage: 'Oceń odwodnienie, gorączkę, krew w stolcu, wiek i czas trwania.', options: ['Płyny nawadniające', 'Racekadotryl 30 mg'], warning: 'Nie hamuj objawowo biegunki z krwią lub wysoką gorączką bez konsultacji.', redFlags: ['Krew w stolcu', 'Gorączka > 38°C', 'Objawy odwodnienia', 'Biegunka > 7 dni'], recommendation: 'Najważniejsze: nawodnienie; Racekadotryl gdy stabilny i zatrudniony.' },
  { name: 'Bezsenność', triage: 'Zapytaj o czas trwania, leki, używki, nastrój i objawy bezdechu.', options: ['Higiena snu', 'Melisa 300-600 mg'], warning: 'Nie łącz preparatów uspokajających z alkoholem ani lekami wpływającymi na OUN.', redFlags: ['Apnea senna', 'Depresja suicydalna', 'Bezsenność < 2 tygodnie bez przyczyny', 'Bezsenność po leku'], recommendation: 'Najpierw higiena snu; Melisa jeśli legalnie dostępna.' },
  { name: 'Wymioty', triage: 'Określ przyczynę: pożywienie, lek, chorobę żołądka, migrena czy zaburzenia równowagi.', options: ['Metoklopramid 10 mg', 'Ondansetron 4 mg'], warning: 'Metoklopramid może powodować dystonię; Ondansetron dla chemioterapii i operacji.', redFlags: ['Wymioty z krwią', 'Ból brzucha ostry', 'Wysoka gorączka', 'Znaczna utrata płynów'], recommendation: 'Metoklopramid bez specjalnych wskazań; Ondansetron dla opornych wymiotów.' },
  { name: 'Ból mięśniowy', triage: 'Zapytaj o przyczynę, czas trwania i czy bolą mięśnie czy stawy.', options: ['Ibuprofen 400 mg', 'Paracetamol 500 mg'], warning: 'Rozluźniacze mięśni mogą powodować sedację; nie podczas jazdy.', redFlags: ['Paraliż', 'Drętwienie', 'Uraz ze złamaniem', 'Ból radiacyjny'], recommendation: 'Ibuprofen przy bólach zapalnych; masaż, ciepło i ćwiczenia.' },
  { name: 'Ból gardła', triage: 'Oceń gorączkę, kaszel, naloty, trudności w połykaniu i czas trwania.', options: ['Płyny i pastylki miejscowe', 'Paracetamol'], warning: 'Jednostronny obrzęk, szczękościsk lub duszność wymagają pilnej konsultacji.', redFlags: ['Duszność', 'Ślinienie i niemożność połykania', 'Wysoka gorączka', 'Obrzęk szyi'], recommendation: 'Leczenie objawowe po ocenie czerwonych flag; antybiotyk wymaga diagnozy.' },
  { name: 'Katar i zatoki', triage: 'Zapytaj o czas trwania, ból twarzy, gorączkę i charakter wydzieliny.', options: ['Płukanie nosa', 'Ksylometazolina krótkotrwale'], warning: 'Nie stosuj donosowych leków obkurczających dłużej niż wskazano w ChPL.', redFlags: ['Obrzęk oka', 'Zaburzenia widzenia', 'Silny jednostronny ból', 'Sztywność karku'], recommendation: 'Płukanie solą jako pierwsza opcja; dekongestant tylko krótkotrwale.' },
  { name: 'Zaparcie', triage: 'Ustal czas trwania, dietę, nawodnienie, leki i objawy niedrożności.', options: ['Błonnik i płyny', 'Makrogol'], warning: 'Nagłe zaparcie z bólem i wymiotami wymaga wykluczenia niedrożności.', redFlags: ['Krew w stolcu', 'Wymioty', 'Wzdęty twardy brzuch', 'Utrata masy ciała'], recommendation: 'Najpierw modyfikacja stylu życia; lek dobierz do wieku i przyczyny.' },
  { name: 'Wysypka i świąd', triage: 'Oceń początek, ekspozycje, leki, zajęcie błon śluzowych i stan ogólny.', options: ['Emolienty', 'Cetyryzyna'], warning: 'Nowy lek i wysypka z gorączką mogą oznaczać ciężką reakcję polekową.', redFlags: ['Pęcherze', 'Zajęcie błon śluzowych', 'Obrzęk twarzy', 'Duszność'], recommendation: 'Przy łagodnych objawach pielęgnacja i obserwacja; reakcje uogólnione eskaluj.' },
  { name: 'Ból ucha', triage: 'Zapytaj o gorączkę, wyciek, uraz, ciało obce i niedosłuch.', options: ['Paracetamol', 'Konsultacja lekarska'], warning: 'Nie wkładaj patyczków ani kropli bez oceny błony bębenkowej.', redFlags: ['Wyciek ropny lub krwisty', 'Obrzęk za uchem', 'Nagła utrata słuchu', 'Silne zawroty'], recommendation: 'Farmaceuta może pomóc w łagodzeniu bólu, ale przy czerwonych flagach potrzebne badanie.' },
  { name: 'Ból krzyża', triage: 'Oceń uraz, gorączkę, niedowłady, zaburzenia czucia i pęcherza.', options: ['Ruch i ciepło', 'Paracetamol'], warning: 'Niedowład, znieczulenie siodłowe lub zatrzymanie moczu to stan pilny.', redFlags: ['Niedowład kończyn', 'Uraz', 'Gorączka', 'Zaburzenia oddawania moczu'], recommendation: 'Unikaj długiego leżenia; farmakoterapia tylko po ocenie ryzyka.' },
  { name: 'Ból zęba', triage: 'Ustal obrzęk, gorączkę, uraz, ciążę i choroby przewlekłe.', options: ['Paracetamol', 'Pilna wizyta u dentysty'], warning: 'Leki przeciwbólowe nie leczą przyczyny; nie przykładaj aspiryny do dziąsła.', redFlags: ['Obrzęk twarzy', 'Trudności w oddychaniu', 'Gorączka', 'Szczękościsk'], recommendation: 'Doraźnie kontroluj ból i kieruj do dentysty, zwłaszcza przy obrzęku.' },
  { name: 'Suchość oka', triage: 'Zapytaj o ból, uraz, soczewki kontaktowe i zaburzenia widzenia.', options: ['Sztuczne łzy bez konserwantu', 'Przerwy od ekranu'], warning: 'Ból, światłowstręt lub pogorszenie widzenia wymagają badania okulistycznego.', redFlags: ['Uraz chemiczny', 'Nagłe pogorszenie widzenia', 'Silny ból', 'Ropna wydzielina'], recommendation: 'Dobierz preparat do częstotliwości stosowania i soczewek.' },
  { name: 'Nudności lokomocyjne', triage: 'Oceń wiek, ciążę, choroby neurologiczne i leki uspokajające.', options: ['Techniki behawioralne', 'Preparat przeciwwymiotny zgodny z ChPL'], warning: 'Oceń senność i zakaz prowadzenia pojazdów po preparatach przeciwhistaminowych.', redFlags: ['Wymioty z krwią', 'Odwodnienie', 'Objawy neurologiczne', 'Silny ból głowy'], recommendation: 'Zacznij od metod niefarmakologicznych i ostrzeż o sedacji.' },
  { name: 'Opryszczka wargowa', triage: 'Ustal pierwszy epizod, rozległość, immunosupresję i zajęcie oka.', options: ['Acyklowir miejscowy', 'Higiena i ochrona zmian'], warning: 'Nie dotykaj zmian i nie dziel ręczników; zajęcie oka wymaga pilnej konsultacji.', redFlags: ['Zmiany przy oku', 'Rozległe zmiany', 'Immunosupresja', 'Pierwszy ciężki epizod'], recommendation: 'Wczesne zastosowanie zgodnie z ChPL może skrócić objawy.' },
  { name: 'Ukąszenie owada', triage: 'Oceń rozległość, objawy uogólnione, żądło i ryzyko zakażenia.', options: ['Chłodny okład', 'Lek przeciwhistaminowy'], warning: 'Objawy anafilaksji wymagają natychmiastowego wezwania pomocy.', redFlags: ['Duszność', 'Obrzęk języka', 'Omdlenie', 'Szybko narastający obrzęk'], recommendation: 'Miejscowa pielęgnacja przy łagodnej reakcji; anafilaksja to stan nagły.' },
]

const recipes = [
  { name: 'Roztwór NaCl 0,9% — ćwiczenie obliczeniowe', form: 'Roztwór', ingredients: 'NaCl 0,9 g; woda oczyszczona do 100 ml', checks: ['zgodność stężenia ± 0,05%', 'jakość surowców (EP/USP)', 'sterilność i opakowanie'], note: 'Nie jest preparatem do iniekcji ani do oczu. Wykonanie wyłącznie według zatwierdzonej procedury. Termin ważności 24 h (RT) bez konserwanta.' },
  { name: 'Żel z karbomerem — przykład technologiczny', form: 'Żel', ingredients: 'Karbomer 974P: 0,5–1,0%; glicerol: 5%; woda oczyszczona; trietanolamina: do neutralizacji pH', checks: ['pH 4,5–6,5', 'jednorodność wizualna i pod mikroskopem', 'lepkość (Brookfield)', 'termin: 6–12 miesięcy'], note: 'Przykład dydaktyczny. Wymaga neutralizacji trietanolaminy w celu uaktywnienia karbomeru. Może ulegać synerezie przy przechowywaniu.' },
  { name: 'Syrop prosty — przykład receptariuszowy', form: 'Syrop', ingredients: 'Sacharoza: 65 g; woda oczyszczona: 35 ml; proporcje: 65:35', checks: ['gęstość właściwa 1,34–1,35 g/ml', 'czystość mikrobiologiczna (< 10³ CFU/ml)', 'pH 4,5–6,0 (bez konserwanta)', 'termin: 2 lata'], note: 'Podstawowy nośnik do sypania leków. Może wymagać konserwanta w klimacie wilgotnym. Podatny na krystalizację.' },
  { name: 'Krem emulsyjny O/W — ćwiczenie faz', form: 'Krem', ingredients: 'Faza olejowa (20–30%): wazelina, cetyl alkohol; faza wodna (70–80%): woda, glicerol; emulgator: Tweens, Spans', checks: ['typ emulsji (O/W potwierdzony testem rozpuszczalności)', 'temperatura wymieszania 70–75°C', 'konsystencja: tubus vs słoik', 'stabilność (test Ostwalda)', 'termin: 6–12 miesięcy'], note: 'Wymaga kontroli procesu, temperowania i dokumentacji. Podatny na oddzielenie się faz przy przechowywaniu poniżej 15°C.' },
  { name: 'Syrop antytosjący — wzór Receptariusza', form: 'Syrop', ingredients: 'Ambroksol: 15 mg/5ml; syrop prosty: 60 ml; konserwant (sorbinian potasu): 0,1%; woda oczyszczona: do 100 ml', checks: ['stężenie ambroksolu ± 10%', 'rozpuszczalność pełna, brak frakcjonowania', 'pH 4–6', 'termin otwartego pojemnika: 30 dni'], note: 'Przechowywać w temperaturze pokojowej. Przed użyciem wstrząsnąć. Nie łączyć z innymi lekami w tym preparacie.' },
  { name: 'Maść na bazie wazeliny — przykład leku dermatologicznego', form: 'Maść', ingredients: 'Wazelina biała: 80%; lanolina: 10%; woda destylowana: 10%; ewentualnie substancja czynna w postaci olejku lub ekstraktu', checks: ['jednorodność barwy i konsystencji', 'rozprzestrzenianie się (test na szkle o 45°)', 'stabilność lipidów (test przechowywania)', 'mikrobiologia: E. coli, S. aureus, kandyda — niedopuszczalne'], note: 'Podstawowy nośnik hydrofobu. Może być wzbogacona olejkami lub ekstraktami roślin (np. nagietek, rumianek).' },
  { name: 'Kapsułki dzielone — karta procesu', form: 'Kapsułki', ingredients: 'Substancja czynna według zatwierdzonej receptury; laktoza lub celuloza mikrokrystaliczna do masy; kapsułki dobranego rozmiaru', checks: ['jednorodność mieszania proszków', 'kontrola masy jednostkowej', 'zgodność rozmiaru kapsułki', 'wilgotność i opakowanie'], note: 'Nie ustala dawki samodzielnie. Stosuj wyłącznie zatwierdzony wzór, waliduj mieszanie i wykonaj kontrolę masy.' },
  { name: 'Czopki — karta technologiczna', form: 'Czopki', ingredients: 'Substancja czynna według recepty; podłoże odpowiednie do drogi podania; q.s. do kalibru formy', checks: ['kalibracja formy', 'jednorodność rozproszenia', 'masa średnia i odchylenia', 'temperatura topnienia / mięknienia'], note: 'Dobór podłoża, temperatur i BUD wymaga aktualnego źródła oraz SOP pracowni.' },
  { name: 'Krople do nosa — tylko wzór niejałowy', form: 'Krople', ingredients: 'Substancja czynna według ChPL; rozpuszczalnik i regulator pH zgodnie z monografią; opakowanie wielodawkowe', checks: ['pH i osmolalność', 'klarowność', 'kompatybilność z zakraplaczem', 'kontrola mikrobiologiczna'], note: 'Nie jest instrukcją preparatu jałowego. Preparaty do oczu i iniekcji wymagają kwalifikowanego procesu aseptycznego.' },
  { name: 'Płyn do płukania jamy ustnej — demonstracja', form: 'Płyn', ingredients: 'Substancja czynna według zatwierdzonej receptury; woda oczyszczona; substancje pomocnicze zgodne z monografią', checks: ['pH', 'objętość napełnienia', 'klarowność i osad', 'szczelność opakowania'], note: 'Zweryfikuj drogę podania, ostrzeżenia i brak przeznaczenia do połykania.' },
  { name: 'Proszek do stosowania zewnętrznego — wzór', form: 'Proszek', ingredients: 'Substancja czynna i podłoże proszkowe według monografii; q.s. do masy', checks: ['sito i wielkość cząstek', 'jednorodność mieszania', 'brak zbryleń', 'etykieta: wyłącznie do użytku zewnętrznego'], note: 'Kontrola pylenia i higieny jest obowiązkowa. Nie stosować na rany bez potwierdzenia wskazania.' },
  { name: 'Emulsja O/W z substancją czynną — karta serii', form: 'Emulsja', ingredients: 'Faza wodna i olejowa dobrane do substancji; emulgator zgodny z recepturą; substancja czynna według źródła', checks: ['kolejność i temperatura faz', 'typ emulsji', 'pH i lepkość', 'stabilność przyspieszona'], note: 'Dodanie substancji czynnej wymaga oceny rozpuszczalności, kompatybilności i stabilności — nie jest automatycznie bezpieczne.' },
  { name: 'Roztwór buforowy — ćwiczenie molarne', form: 'Roztwór', ingredients: 'Składniki buforu według obliczeń i monografii; woda oczyszczona do objętości', checks: ['molarność i pH', 'kalibracja pH-metru', 'objętość końcowa', 'etykieta i warunki przechowywania'], note: 'Wartości pKa i zakresy muszą pochodzić z aktualnego źródła. Kalkulator nie zatwierdza receptury.' },
]

const qualityChecks = [
  ['identity', 'Tożsamość pacjenta, zlecenia i surowców'],
  ['calculations', 'Obliczenia, jednostki, stężenie i masa końcowa'],
  ['compatibility', 'Kompatybilność, interakcje i przeciwwskazania'],
  ['process', 'Proces, wyposażenie, higiena i kontrola temperatury'],
  ['label', 'Etykieta, instrukcja, termin i warunki przechowywania'],
  ['release', 'Niezależna kontrola i zwolnienie przez uprawnioną osobę'],
] as const

export function PharmacyWorkbench({ language = 'pl' }: { language?: 'pl' | 'en' }) {
  const workbenchText = language === 'en' ? { title: 'Pharmacy workbench', subtitle: 'Triage, calculations, compounding and quality controls in one workspace.', symptoms: 'Symptoms and triage', recipes: 'Compounding recipes', quality: 'Quality and audit', safetyTitle: 'Safety and professional responsibility', safetyText: 'Results are supportive only. Before preparation or dispensing, confirm identity, indication, dosage form, route, maximum dose, allergies, interactions, raw-material quality and current sources. Do not enter patient data.', doubleCheck: 'Two-person check', workflow: 'Workbench workflow', recipeLibrary: 'Compounding library', recipeDescription: 'Educational templates for approved formulas.', before: 'Before preparation', ingredients: 'Working ingredients — no patient data', addIngredient: 'Add ingredient', control: 'Quality control', sources: 'Sources' } : { title: 'Pracownia farmaceuty', subtitle: 'Triage, kalkulacje, receptura i kontrola jakości w jednym miejscu.', symptoms: 'Objawy i triage', recipes: 'Receptury', quality: 'Jakość i audyt', safetyTitle: 'Bezpieczeństwo i odpowiedzialność zawodowa', safetyText: 'Wyniki są pomocnicze. Przed wykonaniem lub wydaniem potwierdź tożsamość, wskazanie, postać, drogę podania, maksymalną dawkę, alergie, interakcje, jakość surowców i aktualność źródeł. Nie wpisuj danych osobowych pacjenta.', doubleCheck: 'Kontrola dwuosobowa', workflow: 'Workflow pracowni', recipeLibrary: 'Biblioteka receptariuszowa', recipeDescription: 'Wzorce dydaktyczne do pracy na zatwierdzonych recepturach.', before: 'Przed wykonaniem', ingredients: 'Składniki robocze — bez zapisu danych pacjenta', addIngredient: 'Dodaj składnik', control: 'Kontrola jakości', sources: 'Źródła' }
  const [symptomQuery, setSymptomQuery] = useState('')
  const [selectedSymptom, setSelectedSymptom] = useState(symptoms[0])
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0])
  const [dose, setDose] = useState('500')
  const [concentration, setConcentration] = useState('100')
  const [patientWeight, setPatientWeight] = useState('70')
  const [dosePerKg, setDosePerKg] = useState('10')
  const [maxDose, setMaxDose] = useState('1000')
  const [dosesPerDay, setDosesPerDay] = useState('2')
  const [rounding, setRounding] = useState('0.01')
  const [baseMass, setBaseMass] = useState('100')
  const [targetMass, setTargetMass] = useState('250')
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [ingredients, setIngredients] = useState([{ name: 'Substancja czynna', amount: '0', unit: 'mg' }])
  const [patientAge, setPatientAge] = useState('40')
  const [renalStatus, setRenalStatus] = useState('prawidłowa')
  const [hepaticStatus, setHepaticStatus] = useState('prawidłowa')
  const [pregnancy, setPregnancy] = useState('nie')
  const [allergies, setAllergies] = useState('brak')
  const [unitMode, setUnitMode] = useState<'mg' | 'g' | 'ml'>('mg')
  const [percent, setPercent] = useState('2')
  const [seriesSize, setSeriesSize] = useState('100')
  const [molarMass, setMolarMass] = useState('58.44')
  const [moles, setMoles] = useState('0.1')
  const [c1, setC1] = useState('10')
  const [v1, setV1] = useState('20')
  const [c2, setC2] = useState('2')
  const [ph, setPh] = useState('7')
  const [solubility, setSolubility] = useState('zgodna')
  const [stability, setStability] = useState('potwierdzona')
  const [packaging, setPackaging] = useState('dobrane')
  const [bud, setBud] = useState('')
  const [workMode, setWorkMode] = useState<'education' | 'professional'>('education')
  const [recipeVersion, setRecipeVersion] = useState(1)
  const [secondCheck, setSecondCheck] = useState(false)
  const [sourceVerified, setSourceVerified] = useState(false)
  const [egfr, setEgfr] = useState('90')
  const [crcl, setCrcl] = useState('90')
  const [bodySurface, setBodySurface] = useState('1.8')
  const [liverScore, setLiverScore] = useState('brak danych')
  const [lactation, setLactation] = useState('nie')
  const [weighingTolerance, setWeighingTolerance] = useState('2')
  const [batchNumber, setBatchNumber] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [reviewerId, setReviewerId] = useState('')
  const [sopNumber, setSopNumber] = useState('')
  const [sourceVersion, setSourceVersion] = useState('')
  const [auditTrail, setAuditTrail] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState('')

  const translatedRecipeName = (name: string) => language === 'en' ? ({ 'Roztwór NaCl 0,9% — ćwiczenie obliczeniowe': 'NaCl 0.9% solution — calculation exercise', 'Żel z karbomerem — przykład technologiczny': 'Carbomer gel — technology example', 'Syrop prosty — przykład receptariuszowy': 'Simple syrup — compounding example', 'Krem emulsyjny O/W — ćwiczenie faz': 'O/W emulsion cream — phase exercise' }[name] ?? name) : name
  const filteredSymptoms = useMemo(() => symptoms.filter((item) => item.name.toLowerCase().includes(symptomQuery.toLowerCase())), [symptomQuery])
  const numeric = (...values: string[]) => values.every((value) => Number.isFinite(Number(value)) && Number(value) > 0)
  const volume = numeric(dose, concentration) ? (Number(dose) / Number(concentration)).toFixed(2) : '—'
  const weightDose = numeric(patientWeight, dosePerKg) ? (Number(patientWeight) * Number(dosePerKg)).toFixed(2) : '—'
  const scale = numeric(baseMass, targetMass) ? (Number(targetMass) / Number(baseMass)).toFixed(3) : '—'
  const dailyDose = numeric(weightDose, dosesPerDay) ? (Number(weightDose) * Number(dosesPerDay)).toFixed(2) : '—'
  const cappedDose = numeric(weightDose, maxDose) ? Math.min(Number(weightDose), Number(maxDose)).toFixed(2) : '—'
  const roundedDose = numeric(weightDose, rounding) ? (Math.round(Number(weightDose) / Number(rounding)) * Number(rounding)).toFixed(2) : '—'
  const doseWarning = dailyDose !== '—' && Number(dailyDose) > Number(maxDose)
  const ingredientTotal = ingredients.reduce((total, ingredient) => total + (Number(ingredient.amount) || 0), 0)
  const invalidIngredients = ingredients.some((ingredient) => !ingredient.name.trim() || !Number.isFinite(Number(ingredient.amount)) || Number(ingredient.amount) <= 0 || !['mg', 'g', 'ml', 'µg'].includes(ingredient.unit))
  const percentAmount = Number.isFinite(Number(percent)) && Number(percent) > 0 && Number.isFinite(Number(targetMass)) && Number(targetMass) > 0 ? (Number(percent) / 100 * Number(targetMass)).toFixed(3) : '—'
  const molarAmount = Number.isFinite(Number(molarMass)) && Number(molarMass) > 0 && Number.isFinite(Number(moles)) && Number(moles) > 0 ? (Number(molarMass) * Number(moles)).toFixed(3) : '—'
  const dilutionVolume = Number(c1) > 0 && Number(v1) > 0 && Number(c2) > 0 ? (Number(c1) * Number(v1) / Number(c2)).toFixed(2) : '—'
  const seriesTotal = Number.isFinite(Number(seriesSize)) && Number(seriesSize) > 0 && ingredientTotal > 0 ? (ingredientTotal * Number(seriesSize)).toFixed(3) : '—'
  const invalidPatient = !Number.isFinite(Number(patientAge)) || Number(patientAge) <= 0 || Number(patientAge) > 120 || !Number.isFinite(Number(egfr)) || Number(egfr) <= 0 || !Number.isFinite(Number(crcl)) || Number(crcl) <= 0 || renalStatus !== 'prawidłowa' || hepaticStatus !== 'prawidłowa' || pregnancy === 'tak' || lactation !== 'nie'
  const invalidCalculation = !numeric(dose, concentration, patientWeight, dosePerKg, maxDose, dosesPerDay) || Number(dose) > Number(maxDose) || Number(percent) > 100 || Number(c1) <= Number(c2) || Number(ph) < 0 || Number(ph) > 14
  const invalidTolerance = !Number.isFinite(Number(weighingTolerance)) || Number(weighingTolerance) <= 0 || Number(weighingTolerance) > 20
  const auditReady = Boolean(batchNumber.trim() && operatorId.trim() && reviewerId.trim() && sopNumber.trim())
  const recipeReady = !invalidIngredients && !invalidCalculation && !invalidTolerance && ingredientTotal > 0 && solubility === 'zgodna' && stability === 'potwierdzona' && packaging === 'dobrane' && bud.trim().length > 0 && sourceVerified && secondCheck && auditReady
  const completedChecks = qualityChecks.filter(([key]) => checks[key]).length
  const allChecks = completedChecks === qualityChecks.length

  const updateIngredient = (index: number, field: string, value: string) => setIngredients((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))

  const addAuditEvent = (event: string) => {
    const entry = `${new Date().toLocaleString('pl-PL')} — ${event}`
    setAuditTrail((items) => [entry, ...items])
    setToastMessage(language === 'pl' ? 'Zmiana została zapisana w śladzie audytowym.' : 'Change saved to the audit trail.')
    window.setTimeout(() => setToastMessage(''), 2600)
    void fetch('/api/pharmacy-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: event,
        mode: workMode,
        recipeName: selectedRecipe.name,
        recipeVersion,
        batchNumber,
        operatorId,
        reviewerId,
        payload: {
          checks,
          ingredientCount: ingredients.length,
          ingredientTotal,
          sourceVersion,
          sopNumber,
          recipeReady,
        },
      }),
    }).catch(() => undefined)
  }

  const downloadAuditReport = () => {
    const report = [
      'KARTA KONTROLI — PRACOWNIA FARMACEUTYCZNA',
      `Wygenerowano: ${new Date().toLocaleString('pl-PL')}`,
      `Tryb: ${workMode === 'professional' ? 'profesjonalny' : 'edukacyjny'}`,
      `Receptura: ${selectedRecipe.name} v${recipeVersion}`,
      `Źródło: ${sourceVersion || 'nie podano'}`,
      `SOP: ${sopNumber || 'nie podano'} | Seria: ${batchNumber || 'nie podano'}`,
      `Operator: ${operatorId || 'nie podano'} | Kontroler: ${reviewerId || 'nie podano'}`,
      `Składników: ${ingredients.length} | Suma ilości: ${ingredientTotal.toFixed(3)}`,
      `Kontrola jakości: ${completedChecks}/${qualityChecks.length}`,
      `Gotowość receptury: ${recipeReady ? 'tak — do niezależnego zwolnienia' : 'nie — zablokowana'}`,
      '',
      'UWAGA: Raport pomocniczy. Nie zastępuje ChPL, Farmakopei Polskiej, SOP ani decyzji farmaceuty.',
      '',
      'ŚLAD AUDYTOWY:',
      ...(auditTrail.length ? auditTrail : ['Brak zapisanych zdarzeń']),
    ].join('\\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }))
    link.download = `karta-kontroli-${batchNumber || 'robocza'}.txt`
    link.click()
    URL.revokeObjectURL(link.href)
    addAuditEvent('Wygenerowano raport kontroli')
  }

  return (
    <>
    {toastMessage && <div role="status" className="fixed bottom-5 right-5 z-50 slide-fade-panel rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-medium text-teal-900 shadow-xl">{toastMessage}</div>}
    <Card className="glass-panel pharmacy-workbench overflow-hidden border-0 shadow-xl soft-fade-in">
      <CardHeader className="border-b border-border/60 bg-primary/[0.04]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><CardTitle className="flex items-center gap-2 text-2xl"><ClipboardCheck className="text-primary" /> {workbenchText.title}</CardTitle><CardDescription className="mt-2 max-w-3xl">{language === 'pl' ? 'Receptura → składniki → obliczenia → kontrola → instrukcja → źródła.' : 'Formula → ingredients → calculations → control → instructions → sources.'} {workbenchText.subtitle} {language === 'pl' ? 'Nie generuje indywidualnego zlecenia terapeutycznego ani nie zastępuje ChPL, Farmakopei Polskiej i procedur apteki.' : 'It does not generate an individual treatment order or replace SmPCs, pharmacopoeias or pharmacy procedures.'}</CardDescription></div>
          <Badge variant="outline" className="gap-2"><ShieldAlert /> {workbenchText.doubleCheck}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Alert className="mb-6 border-amber-500/40 bg-amber-500/10"><ShieldAlert className="size-4" /><AlertTitle>{workbenchText.safetyTitle}</AlertTitle><AlertDescription>{workbenchText.safetyText}</AlertDescription></Alert>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label={workbenchText.workflow}>{(language === 'pl' ? ['Receptura', 'Składniki', 'Obliczenia', 'Kontrola', 'Instrukcja', 'Źródła'] : ['Formula', 'Ingredients', 'Calculations', 'Control', 'Instructions', 'Sources']).map((step, index) => <div key={step} className="rounded-xl border border-teal-100 bg-teal-50/60 px-2 py-2 text-center text-xs font-semibold text-teal-800"><span className="mr-1 text-teal-500">{index + 1}</span>{step}</div>)}</div><Tabs defaultValue="recipes">
          <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-6"><TabsTrigger value="recipes">{language === 'en' ? 'Formula & ingredients' : 'Receptura i składniki'}</TabsTrigger><TabsTrigger value="dose">{language === 'en' ? 'Calculations' : 'Obliczenia'}</TabsTrigger><TabsTrigger value="lab">{language === 'en' ? 'Control & instructions' : 'Kontrola i instrukcja'}</TabsTrigger><TabsTrigger value="audit">{language === 'en' ? 'Sources & audit' : 'Źródła i audyt'}</TabsTrigger><TabsTrigger value="symptoms">{workbenchText.symptoms}</TabsTrigger><TabsTrigger value="safety">{language === 'en' ? 'Considerations' : 'Punkty do rozważenia'}</TabsTrigger></TabsList>

          <TabsContent value="symptoms" className="slide-fade-panel grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <Card><CardHeader><CardTitle className="text-base">{language === 'en' ? 'Symptom library' : 'Biblioteka objawów'}</CardTitle><CardDescription>{language === 'en' ? 'Choose a topic to review control questions, educational analysis and considerations.' : 'Wybierz temat, aby zobaczyć pytania kontrolne, analizę edukacyjną i punkty do rozważenia.'}</CardDescription></CardHeader><CardContent className="space-y-3"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Wyszukaj objaw" className="pl-9" placeholder="Szukaj np. kaszel" value={symptomQuery} onChange={(event) => setSymptomQuery(event.target.value)} /></div>{filteredSymptoms.map((item) => <Button key={item.name} variant={selectedSymptom.name === item.name ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setSelectedSymptom(item)}>{item.name}</Button>)}{filteredSymptoms.length === 0 && <p className="text-sm text-muted-foreground">{language === 'en' ? 'No results. Check the spelling or use a broader term.' : 'Brak wyników. Sprawdź pisownię lub użyj szerszego hasła.'}</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle>{selectedSymptom.name}</CardTitle><CardDescription>{selectedSymptom.triage}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2">{selectedSymptom.options.map((option) => <Badge key={option} variant="secondary">Sprawdź: {option}</Badge>)}</div><Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Czerwone flagi — wymaga konsultacji</AlertTitle><AlertDescription>{'redFlags' in selectedSymptom && (selectedSymptom as any).redFlags.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{'redFlags' in selectedSymptom && (selectedSymptom as any).redFlags.map((flag: string) => <li key={flag}>{flag}</li>)}</ul>}</AlertDescription></Alert><Alert><AlertTriangle className="size-4" /><AlertTitle>Praktyka farmaceutyczna</AlertTitle><AlertDescription>{selectedSymptom.warning}</AlertDescription></Alert><div><strong className="text-sm">Analiza edukacyjna:</strong><p className="text-sm text-muted-foreground mt-1">{'recommendation' in selectedSymptom ? (selectedSymptom as any).recommendation : 'Stosuj leki zgodnie z aktualną ChPL i profilem pacjenta.'}</p></div><div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 mt-3"><span>1. Zbierz wywiad (czas, przyczyna, towarzyszące)</span><span>2. Zweryfikuj leki i alergie</span><span>3. Oceń wskazania do konsultacji lekarskiej</span><span>4. Udokumentuj rekomendację bez danych pacjenta</span></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="recipes" className="slide-fade-panel grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card><CardHeader><CardTitle className="text-base">{workbenchText.recipeLibrary}</CardTitle><CardDescription>{workbenchText.recipeDescription}</CardDescription></CardHeader><CardContent className="space-y-2">{recipes.map((recipe) => <Button key={recipe.name} variant={selectedRecipe.name === recipe.name ? 'default' : 'outline'} className="h-auto w-full justify-start py-3 text-left" onClick={() => setSelectedRecipe(recipe)}><span><span className="block font-medium">{translatedRecipeName(recipe.name)}</span><span className="text-xs opacity-75">{recipe.form}</span></span></Button>)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical className="size-5 text-primary" /> {translatedRecipeName(selectedRecipe.name)}</CardTitle><CardDescription>Skład roboczy: {selectedRecipe.ingredients}</CardDescription></CardHeader><CardContent className="space-y-5"><Alert><FileText className="size-4" /><AlertTitle>{workbenchText.before}</AlertTitle><AlertDescription>{selectedRecipe.note}</AlertDescription></Alert><div className="grid gap-3 sm:grid-cols-3">{selectedRecipe.checks.map((check, index) => <div key={check} className="rounded-lg border bg-muted/30 p-3 text-sm"><Badge variant="outline" className="mb-2">{index + 1}</Badge><p>{check}</p></div>)}</div><div className="rounded-lg border border-dashed p-4"><p className="mb-3 text-sm font-medium">{workbenchText.ingredients}</p><div className="space-y-2">{ingredients.map((ingredient, index) => <div className="grid grid-cols-[1fr_90px_72px_auto] gap-2" key={`${index}-${ingredient.name}`}><Input aria-label={`${language === 'en' ? 'Ingredient name' : 'Nazwa składnika'} ${index + 1}`} value={ingredient.name} onChange={(event) => updateIngredient(index, 'name', event.target.value)} /><Input aria-label={`Ilość składnika ${index + 1}`} type="number" min="0" value={ingredient.amount} onChange={(event) => updateIngredient(index, 'amount', event.target.value)} /><Input aria-label={`Jednostka składnika ${index + 1}`} value={ingredient.unit} onChange={(event) => updateIngredient(index, 'unit', event.target.value)} /><Button type="button" variant="ghost" size="icon" aria-label="Usuń składnik" disabled={ingredients.length === 1} onClick={() => setIngredients((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button></div>)}</div><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setIngredients((items) => [...items, { name: '', amount: '0', unit: 'mg' }])}><Plus data-icon="inline-start" /> {workbenchText.addIngredient}</Button></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="dose" className="slide-fade-panel grid gap-5 xl:grid-cols-3">
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Calculator className="size-5" /> Objętość</CardTitle><CardDescription>Wymagana ilość ÷ stężenie.</CardDescription></CardHeader><CardContent className="space-y-3"><Label htmlFor="required-dose">Wymagana ilość</Label><Input id="required-dose" type="number" min="0" value={dose} onChange={(event) => setDose(event.target.value)} /><Label htmlFor="strength">Stężenie na ml</Label><Input id="strength" type="number" min="0" value={concentration} onChange={(event) => setConcentration(event.target.value)} /><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Wynik kontrolny</span><p className="text-2xl font-bold">{volume} ml</p></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Dawka zależna od masy</CardTitle><CardDescription>Matematyka pomocnicza — zakres i limit muszą pochodzić ze źródła.</CardDescription></CardHeader><CardContent className="space-y-3"><Label htmlFor="patient-weight">Masa ciała (kg)</Label><Input id="patient-weight" type="number" min="0" value={patientWeight} onChange={(event) => setPatientWeight(event.target.value)} /><Label htmlFor="dose-per-kg">Dawka ze źródła (mg/kg)</Label><Input id="dose-per-kg" type="number" min="0" value={dosePerKg} onChange={(event) => setDosePerKg(event.target.value)} /><Label htmlFor="doses-per-day">Liczba podań na dobę</Label><Input id="doses-per-day" type="number" min="1" step="1" value={dosesPerDay} onChange={(event) => setDosesPerDay(event.target.value)} /><Label htmlFor="max-dose">Maksimum dobowe ze źródła (mg)</Label><Input id="max-dose" type="number" min="0" value={maxDose} onChange={(event) => setMaxDose(event.target.value)} /><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Wynik matematyczny</span><p className="text-2xl font-bold">{weightDose} mg</p><p className="mt-1 text-xs text-muted-foreground">Doba: {dailyDose} mg · limit: {cappedDose} mg</p></div>{doseWarning && <Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Przekroczony limit</AlertTitle><AlertDescription>Obliczona dawka dobowa przekracza wpisany limit źródłowy. Zatrzymaj proces i zweryfikuj dane.</AlertDescription></Alert>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Skalowanie receptury</CardTitle><CardDescription>Kontrola proporcji masy, bez oceny stabilności.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2"><div><Label htmlFor="base-mass">Baza (g)</Label><Input id="base-mass" type="number" min="0" value={baseMass} onChange={(event) => setBaseMass(event.target.value)} /></div><div><Label htmlFor="target-mass">Cel (g)</Label><Input id="target-mass" type="number" min="0" value={targetMass} onChange={(event) => setTargetMass(event.target.value)} /></div></div><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Współczynnik</span><p className="text-2xl font-bold">× {scale}</p></div><p className="text-xs text-muted-foreground">Po przeliczeniu sprawdź tolerancje ważenia, sumę składników i dokumentację serii.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Stężenie, molarność i seria</CardTitle><CardDescription>Walidowane kalkulatory laboratoryjne.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2"><div><Label htmlFor="percent">Stężenie (%)</Label><Input id="percent" type="number" min="0" step="0.01" value={percent} onChange={(event) => setPercent(event.target.value)} /></div><div><Label htmlFor="series-size">Liczba jednostek serii</Label><Input id="series-size" type="number" min="1" step="1" value={seriesSize} onChange={(event) => setSeriesSize(event.target.value)} /></div><div><Label htmlFor="molar-mass">Masa molowa (g/mol)</Label><Input id="molar-mass" type="number" min="0" step="0.001" value={molarMass} onChange={(event) => setMolarMass(event.target.value)} /></div><div><Label htmlFor="moles">Liczba moli</Label><Input id="moles" type="number" min="0" step="0.001" value={moles} onChange={(event) => setMoles(event.target.value)} /></div></div><div className="grid gap-2 rounded-xl bg-muted p-4 text-center sm:grid-cols-3"><div><span className="text-xs text-muted-foreground">Ilość dla %</span><p className="font-bold">{percentAmount} g</p></div><div><span className="text-xs text-muted-foreground">Masa substancji</span><p className="font-bold">{molarAmount} g</p></div><div><span className="text-xs text-muted-foreground">Cała seria</span><p className="font-bold">{seriesTotal} {unitMode}</p></div></div><p className="text-xs text-muted-foreground">Wszystkie wejścia muszą być dodatnie i w zgodnych jednostkach. Wynik wymaga niezależnego sprawdzenia.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Rozcieńczenie C1V1 = C2V2</CardTitle><CardDescription>Oblicza objętość końcową i sygnalizuje błędne konwersje.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2"><div><Label htmlFor="c1">C1</Label><Input id="c1" type="number" min="0" step="0.01" value={c1} onChange={(event) => setC1(event.target.value)} /></div><div><Label htmlFor="v1">V1 (ml)</Label><Input id="v1" type="number" min="0" step="0.01" value={v1} onChange={(event) => setV1(event.target.value)} /></div><div><Label htmlFor="c2">C2</Label><Input id="c2" type="number" min="0" step="0.01" value={c2} onChange={(event) => setC2(event.target.value)} /></div><div><Label htmlFor="unit-mode">Jednostka serii</Label><select id="unit-mode" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={unitMode} onChange={(event) => setUnitMode(event.target.value as typeof unitMode)}><option value="mg">mg</option><option value="g">g</option><option value="ml">ml</option></select></div></div><div className="rounded-xl bg-muted p-4 text-center"><span className="text-xs text-muted-foreground">Objętość końcowa V2</span><p className="text-2xl font-bold">{dilutionVolume} ml</p></div>{dilutionVolume === '—' && <Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Nieprawidłowe wejście</AlertTitle><AlertDescription>Stężenia i V1 muszą być dodatnie oraz podane w tej samej jednostce.</AlertDescription></Alert>}</CardContent></Card>
          </TabsContent>

          <TabsContent value="lab" className="slide-fade-panel space-y-5">
            <Alert className="border-primary/30 bg-primary/[0.05]">
              <Beaker className="size-4" /><AlertTitle>Laboratorium a pracownia farmaceutyczna</AlertTitle>
              <AlertDescription><strong>Pracownia</strong> służy do wykonania leku recepturowego według zatwierdzonej recepty, receptariusza i SOP. <strong>Laboratorium</strong> służy do kwalifikacji surowców, rozwoju procesu, obliczeń, badań jakościowych i walidacji. Wynik laboratorium nie jest automatyczną zgodą na wydanie — przed użyciem wymaga zatwierdzenia przez uprawnionego farmaceutę.</AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-3">
              <Card><CardContent className="p-4"><p className="text-sm font-semibold">1. Przyjęcie zlecenia</p><p className="mt-1 text-xs text-muted-foreground">Tożsamość, postać, droga podania, dawka i aktualne źródło.</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm font-semibold">2. Weryfikacja receptury</p><p className="mt-1 text-xs text-muted-foreground">Suma, jednostki, kompatybilność, kolejność i BUD.</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm font-semibold">3. Wykonanie i zwolnienie</p><p className="mt-1 text-xs text-muted-foreground">Kontrola procesu, etykieta i niezależna kontrola drugiej osoby.</p></CardContent></Card>
            </div>
            <div className="grid gap-4 md:grid-cols-3"><Card className="border-primary/30 bg-primary/[0.04]"><CardContent className="p-4"><Beaker className="mb-2 text-primary" /><p className="text-2xl font-bold">{completedChecks}/{qualityChecks.length}</p><p className="text-sm text-muted-foreground">punkty kontroli</p></CardContent></Card><Card><CardContent className="p-4"><Calculator className="mb-2 text-primary" /><p className="text-2xl font-bold">{scale}</p><p className="text-sm text-muted-foreground">współczynnik receptury</p></CardContent></Card><Card><CardContent className="p-4"><ShieldAlert className="mb-2 text-primary" /><p className="text-2xl font-bold">{allChecks ? 'Gotowe' : 'W toku'}</p><p className="text-sm text-muted-foreground">status zwolnienia</p></CardContent></Card></div>
            <Card className="workspace-sticky-panel"><CardHeader><CardTitle>Kontrola przed wykonaniem i wydaniem</CardTitle><CardDescription>Zaznacz punkt dopiero po weryfikacji w dokumentacji jakościowej.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{qualityChecks.map(([key, label]) => <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors hover:bg-muted/50"><input className="mt-1 size-4 accent-primary" type="checkbox" checked={Boolean(checks[key])} onChange={(event) => setChecks({ ...checks, [key]: event.target.checked })} /><span>{label}</span></label>)}<Alert className="sm:col-span-2" variant={allChecks ? 'default' : 'destructive'}>{allChecks ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}<AlertTitle>{allChecks ? 'Kontrola kompletna — oczekuje na niezależne zwolnienie' : 'Kontrola niepełna'}</AlertTitle><AlertDescription>{allChecks ? 'Wynik nie jest automatyczną zgodą na użycie. Farmaceuta odpowiedzialny potwierdza zgodność z aktualnym źródłem i SOP.' : `Pozostało punktów: ${qualityChecks.length - completedChecks}. Nie zatwierdzaj preparatu przed ich sprawdzeniem.`}</AlertDescription></Alert></CardContent></Card>
            <p className="text-xs text-muted-foreground">Źródła do każdorazowej weryfikacji: aktualna ChPL i ulotka, Farmakopea Polska, URPL, EMA, monografie surowców oraz procedury jakościowe apteki. Moduł nie przechowuje danych pacjentów.</p>
          </TabsContent>

          <TabsContent value="safety" className="slide-fade-panel space-y-5">
            <Alert className={workMode === 'professional' ? 'border-amber-500/50 bg-amber-500/10' : ''}>
              <ShieldAlert className="size-4" /><AlertTitle>{workMode === 'professional' ? 'Tryb profesjonalny — kontrola obowiązkowa' : 'Tryb edukacyjny'}</AlertTitle>
              <AlertDescription>{workMode === 'professional' ? 'Obliczenia wymagają potwierdzonego źródła, drugiej osoby i zgodności z SOP. Moduł nie zatwierdza ani nie wydaje preparatu.' : 'Dane są demonstracyjne. Przełącz tryb dopiero po potwierdzeniu uprawnień i procedur apteki.'}</AlertDescription>
            </Alert>
            <div className="grid gap-5 lg:grid-cols-2">
              <Card><CardHeader><CardTitle>Tryb pracy i profil pacjenta</CardTitle><CardDescription>Bez danych identyfikujących. Wartości kliniczne wymagają oceny farmaceuty.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2 flex gap-2"><Button variant={workMode === 'education' ? 'default' : 'outline'} onClick={() => setWorkMode('education')}>Edukacyjny</Button><Button variant={workMode === 'professional' ? 'default' : 'outline'} onClick={() => setWorkMode('professional')}>Profesjonalny</Button></div>
                <div><Label htmlFor="patient-age">Wiek (lata)</Label><Input id="patient-age" type="number" min="1" max="120" value={patientAge} onChange={(event) => setPatientAge(event.target.value)} /></div>
                <div><Label htmlFor="pregnancy">Ciąża</Label><select id="pregnancy" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={pregnancy} onChange={(event) => setPregnancy(event.target.value)}><option value="nie">Nie / nie dotyczy</option><option value="tak">Tak — wymaga weryfikacji</option></select></div>
                <div><Label htmlFor="renal">Nerki</Label><select id="renal" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={renalStatus} onChange={(event) => setRenalStatus(event.target.value)}><option>prawidłowa</option><option>zaburzona</option><option>brak danych</option></select></div>
                <div><Label htmlFor="hepatic">Wątroba</Label><select id="hepatic" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={hepaticStatus} onChange={(event) => setHepaticStatus(event.target.value)}><option>prawidłowa</option><option>zaburzona</option><option>brak danych</option></select></div>
                <div><Label htmlFor="lactation">Karmienie piersią</Label><select id="lactation" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={lactation} onChange={(event) => setLactation(event.target.value)}><option>nie</option><option>tak — wymaga weryfikacji</option></select></div>
                <div><Label htmlFor="egfr">eGFR (ml/min/1,73 m²)</Label><Input id="egfr" type="number" min="0" value={egfr} onChange={(event) => setEgfr(event.target.value)} /></div>
                <div><Label htmlFor="crcl">CrCl (ml/min)</Label><Input id="crcl" type="number" min="0" value={crcl} onChange={(event) => setCrcl(event.target.value)} /></div>
                <div><Label htmlFor="body-surface">Powierzchnia ciała (m²)</Label><Input id="body-surface" type="number" min="0" step="0.01" value={bodySurface} onChange={(event) => setBodySurface(event.target.value)} /></div>
                <div><Label htmlFor="liver-score">Ocena wątroby</Label><select id="liver-score" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={liverScore} onChange={(event) => setLiverScore(event.target.value)}><option>brak danych</option><option>Child-Pugh A</option><option>Child-Pugh B</option><option>Child-Pugh C</option></select></div>
                <div className="sm:col-span-2"><Label htmlFor="allergies">Alergie i leki równoległe</Label><Input id="allergies" value={allergies} onChange={(event) => setAllergies(event.target.value)} placeholder="np. penicyliny; warfaryna" /></div>
                {invalidPatient && <Alert variant="destructive" className="sm:col-span-2"><AlertTriangle className="size-4" /><AlertTitle>Wymagana eskalacja</AlertTitle><AlertDescription>Profil zawiera czynnik ryzyka lub nieprawidłowy wiek. Nie stosuj automatycznej modyfikacji dawki — sprawdź aktualne źródło i skonsultuj decyzję.</AlertDescription></Alert>}
              </CardContent></Card>
              <Card><CardHeader><CardTitle>Kontrola receptury i BUD</CardTitle><CardDescription>Blokady nie zastępują walidacji procesu, badań ani dokumentacji jakościowej.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">
                <div><Label htmlFor="ph">pH docelowe</Label><Input id="ph" type="number" min="0" max="14" step="0.1" value={ph} onChange={(event) => setPh(event.target.value)} /></div>
                <div><Label htmlFor="bud">BUD / termin (wymagany)</Label><Input id="bud" type="date" value={bud} onChange={(event) => setBud(event.target.value)} /></div>
                <div><Label htmlFor="solubility">Rozpuszczalność</Label><select id="solubility" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={solubility} onChange={(event) => setSolubility(event.target.value)}><option>zgodna</option><option>niepotwierdzona</option><option>niezgodna</option></select></div>
                <div><Label htmlFor="stability">Stabilność</Label><select id="stability" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={stability} onChange={(event) => setStability(event.target.value)}><option>potwierdzona</option><option>niepotwierdzona</option><option>niezgodna</option></select></div>
                <div className="sm:col-span-2"><Label htmlFor="packaging">Opakowanie</Label><select id="packaging" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={packaging} onChange={(event) => setPackaging(event.target.value)}><option>dobrane</option><option>niepotwierdzone</option><option>niezgodne</option></select></div>
                <div className="sm:col-span-2 rounded-lg border p-3 text-sm"><p className="font-medium">Status: {recipeReady ? 'Można przejść do niezależnego zwolnienia' : 'Zablokowane — uzupełnij wszystkie kontrole'}</p><p className="mt-1 text-muted-foreground">Suma składników: {ingredientTotal.toFixed(3)} · pH: {ph} · BUD: {bud || 'brak'}</p></div>
              </CardContent></Card>
            </div>
            <Card className="workspace-sticky-panel"><CardHeader><CardTitle>Źródła, wersja i akceptacja</CardTitle><CardDescription>Nie traktuj źródła jako aktualnego bez ręcznej weryfikacji. Integracja z ChPL, Farmakopeą, URPL i EMA wymaga zatwierdzonego dostępu do ich aktualnych publikacji.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" checked={sourceVerified} onChange={(event) => setSourceVerified(event.target.checked)} /> Potwierdzono aktualność ChPL / FP / URPL / EMA</label><label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" checked={secondCheck} onChange={(event) => setSecondCheck(event.target.checked)} /> Wykonano niezależną kontrolę drugiej osoby</label><div className="flex items-center gap-3"><Badge variant="outline">Receptura v{recipeVersion}</Badge><Button variant="outline" size="sm" onClick={() => setRecipeVersion((version) => version + 1)}>Utwórz nową wersję</Button></div><p className="text-xs text-muted-foreground sm:col-span-2">Każdą wartość dawki porównaj z konkretną ChPL/monografią i dokumentacją apteki. Aplikacja nie wykonuje automatycznej decyzji klinicznej.</p></CardContent></Card>
          </TabsContent>

          <TabsContent value="audit" className="slide-fade-panel grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><History className="size-5 text-primary" /> Karta kontroli i ślad decyzji</CardTitle><CardDescription>Przed wydaniem zapisz źródło, wersję procedury i osobę wykonującą niezależną kontrolę.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label htmlFor="source-version">Źródło / wersja ChPL</Label><Input id="source-version" placeholder="np. ChPL, wydanie, data" value={sourceVersion} onChange={(event) => setSourceVersion(event.target.value)} /></div>
                  <div><Label htmlFor="sop-number">Numer SOP / procedury</Label><Input id="sop-number" placeholder="np. SOP-AP-014" value={sopNumber} onChange={(event) => setSopNumber(event.target.value)} /></div>
                  <div><Label htmlFor="batch-number">Numer serii</Label><Input id="batch-number" placeholder="np. 2026-001" value={batchNumber} onChange={(event) => setBatchNumber(event.target.value)} /></div>
                  <div><Label htmlFor="operator">Osoba wykonująca</Label><Input id="operator" placeholder="Inicjały lub identyfikator" value={operatorId} onChange={(event) => setOperatorId(event.target.value)} /></div>
                  <div><Label htmlFor="reviewer">Niezależny kontroler</Label><Input id="reviewer" placeholder="Inicjały lub identyfikator" value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} /></div>
                  <div><Label htmlFor="tolerance">Tolerancja ważenia (%)</Label><Input id="tolerance" type="number" min="0.01" max="20" step="0.01" value={weighingTolerance} onChange={(event) => setWeighingTolerance(event.target.value)} /></div>
                </div>
                <Alert><Info className="size-4" /><AlertTitle>Reguła niezależnej kontroli</AlertTitle><AlertDescription>Nie zatwierdzaj obliczeń własnym podpisem bez drugiej weryfikacji, jeśli wymaga tego procedura apteki lub charakter preparatu.</AlertDescription></Alert>
                <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">Składników</p><p className="text-2xl font-bold">{ingredients.length}</p></div><div className="rounded-xl border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">Suma ilości</p><p className="text-2xl font-bold">{ingredientTotal.toFixed(2)}</p></div><div className="rounded-xl border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">Kontrola</p><p className="text-2xl font-bold">{completedChecks}/{qualityChecks.length}</p></div></div>
                <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => { addAuditEvent('Otwarto wydruk karty kontroli'); window.print() }}><Download data-icon="inline-start" /> Drukuj / PDF</Button><Button type="button" variant="secondary" onClick={downloadAuditReport}><FileText data-icon="inline-start" /> Pobierz raport</Button><Button type="button" variant="ghost" onClick={() => { setChecks({}); setIngredients([{ name: 'Substancja czynna', amount: '0', unit: 'mg' }]); addAuditEvent('Wyczyszczono składniki i checklistę') }}><RefreshCw data-icon="inline-start" /> Wyczyść sesję</Button></div><div className="rounded-xl border bg-muted/20 p-4"><div className="mb-2 flex items-center justify-between gap-3"><p className="text-sm font-medium">Ślad audytowy sesji</p><Badge variant="outline">{auditTrail.length} zdarzeń</Badge></div>{auditTrail.length ? <ol className="max-h-32 space-y-1 overflow-auto text-xs text-muted-foreground">{auditTrail.map((event) => <li key={event}>{event}</li>)}</ol> : <p className="text-xs text-muted-foreground">Zdarzenia pojawią się po zapisaniu raportu lub wyczyszczeniu sesji.</p>}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="size-5 text-primary" /> Zasady kontroli obliczeń</CardTitle><CardDescription>Lista kontrolna zgodna z bezpiecznym przepływem pracy.</CardDescription></CardHeader>
              <CardContent className="space-y-3 text-sm"><p>1. Ujednolić jednostki przed obliczeniem.</p><p>2. Sprawdzić masę końcową i tolerancję wagi.</p><p>3. Porównać dawkę pojedynczą i dobową z aktualnym źródłem.</p><p>4. Zweryfikować drogę podania, stabilność i opakowanie.</p><p>5. Wykonać niezależną kontrolę oraz udokumentować wynik.</p><Alert variant="destructive"><Stethoscope className="size-4" /><AlertTitle>Nie zastępuje decyzji klinicznej</AlertTitle><AlertDescription>Kalkulator nie dobiera leku ani dawki dla konkretnej osoby. Wymaga zatwierdzonych danych wejściowych i oceny farmaceuty.</AlertDescription></Alert></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </>
  )
}
