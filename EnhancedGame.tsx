import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, Home, Building2, FileText, Flame, Activity, Stethoscope, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, Beaker, Pill, Thermometer, Scale, Book, Leaf, Search, Heart, ShieldCheck, SlidersHorizontal, Star, Settings, CalendarDays, BookOpen, Timer, Zap, Trophy, Swords, Moon, Sun, ClipboardCheck } from 'lucide-react'
import confetti from 'canvas-confetti'
import Script from 'next/script'
import { HowToLibrary } from '@/components/how-to-library'
import { HerbsMedicinesDatabase } from '@/components/herbs-medicines-database'
import { PharmacyWorkbench } from '@/components/pharmacy-workbench'

import { Roboto, Open_Sans } from 'next/font/google'

const roboto = Roboto({ weight: '700', subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

type Ingredient = {
  name: string
  weight: number
}

type Recipe = {
  name: string
  ingredients: Ingredient[]
  instructions: string
}

type Scenario = {
  id: string
  name: string
  icon: React.ReactNode
  questions: {
    text: string
    options: string[]
    correctAnswer: number
    explanation: string
    simulation: () => React.ReactNode
  }[]
}

type HerbMedicine = {
  name: string
  type: 'herb' | 'medicine'
  composition: string
  usage: string
  occurrence?: string
  sideEffects: string
  interactions: string
}

type Experiment = {
  name: string
  description: string
  steps: string[]
  equipment: string[]
  chemicals: string[]
  safetyPrecautions: string[]
}

const herbsMedicines: HerbMedicine[] = [
  { 
    name: "Rumianek", 
    type: "herb", 
    composition: "Zawiera chamazulen, α-bisabolol, apigeninę", 
    usage: "Łagodzi stany zapalne, wspomaga trawienie, działa uspokajająco", 
    occurrence: "Łąki, pola, ogrody", 
    sideEffects: "Rzadko: reakcje alergiczne",
    interactions: "Może wchodzić w interakcje z lekami przeciwzakrzepowymi"
  },
  { 
    name: "Mięta", 
    type: "herb", 
    composition: "Zawiera mentol, menton, limonen", 
    usage: "Łagodzi problemy trawienne, odświeża oddech, działa przeciwbólowo", 
    occurrence: "Ogrody, wilgotne tereny", 
    sideEffects: "Może powodować zgagę u niektórych osób",
    interactions: "Może wpływać na wchłanianie niektórych leków"
  },
  { 
    name: "Szałwia", 
    type: "herb", 
    composition: "Zawiera tujon, kwas rozmarynowy, flawonoidy", 
    usage: "Wspomaga trawienie, łagodzi stany zapalne jamy ustnej, reguluje pocenie", 
    occurrence: "Ogrody, tereny suche", 
    sideEffects: "W dużych ilościach może być toksyczna ze względu na zawartość tujonu",
    interactions: "Może wchodzić w interakcje z lekami przeciwpadaczkowymi"
  },
  { 
    name: "Paracetamol", 
    type: "medicine", 
    composition: "N-(4-hydroksyfenylo)acetamid", 
    usage: "Przeciwbólowy i przeciwgorączkowy", 
    sideEffects: "Rzadko: reakcje alergiczne, problemy z wątrobą przy przedawkowaniu",
    interactions: "Może wchodzić w interakcje z warfaryną i innymi lekami przeciwzakrzepowymi"
  },
  { 
    name: "Ibuprofen", 
    type: "medicine", 
    composition: "Kwas 2-(4-izobutylo-fenylo)propionowy", 
    usage: "Przeciwzapalny, przeciwbólowy, przeciwgorączkowy", 
    sideEffects: "Może powodować problemy żołądkowe, zwiększa ryzyko krwawień",
    interactions: "Nie należy łączyć z innymi NLPZ, może wchodzić w interakcje z lekami na nadciśnienie"
  },
  ...[
    ['Melisa', 'herb'], ['Lawenda', 'herb'], ['Pokrzywa', 'herb'], ['Dziurawiec', 'herb'], ['Nagietek', 'herb'], ['Tymianek', 'herb'], ['Koper włoski', 'herb'], ['Kozłek lekarski', 'herb'], ['Jeżówka', 'herb'], ['Ostropest plamisty', 'herb'], ['Mniszek lekarski', 'herb'], ['Skrzyp polny', 'herb'], ['Brzoza', 'herb'], ['Lipa', 'herb'], ['Bez czarny', 'herb'], ['Głóg', 'herb'], ['Czarnuszka', 'herb'], ['Kurkuma', 'herb'], ['Imbir', 'herb'], ['Cynamon', 'herb'], ['Goździki', 'herb'], ['Rozmaryn', 'herb'], ['Bazylia', 'herb'], ['Oregano', 'herb'], ['Majeranek', 'herb'], ['Kminek', 'herb'], ['Anyż', 'herb'], ['Melisa indyjska', 'herb'], ['Wiązówka błotna', 'herb'], ['Werbena', 'herb'], ['Arnika', 'herb'], ['Rdest ptasi', 'herb'], ['Łopian', 'herb'], ['Fiołek trójbarwny', 'herb'], ['Przywrotnik', 'herb'], ['Krwawnik', 'herb'], ['Kwiat malwy', 'herb'], ['Prawoślaz', 'herb'], ['Dzika róża', 'herb'], ['Żurawina', 'herb'], ['Borówka czarna', 'herb'], ['Rokitnik', 'herb'], ['Aloes', 'herb'], ['Wiesiołek', 'herb'], ['Nawłoć', 'herb'], ['Mącznica lekarska', 'herb'], ['Miłorząb japoński', 'herb'], ['Żeń-szeń', 'herb'], ['Ashwagandha', 'herb'], ['Czosnek', 'herb'], ['Aspiryna', 'medicine'], ['Naproksen', 'medicine'], ['Diklofenak', 'medicine'], ['Ketoprofen', 'medicine'], ['Metamizol', 'medicine'], ['Loratadyna', 'medicine'], ['Cetyryzyna', 'medicine'], ['Feksofenadyna', 'medicine'], ['Omeprazol', 'medicine'], ['Pantoprazol', 'medicine'], ['Famotydyna', 'medicine'], ['Loperamid', 'medicine'], ['Racekadotryl', 'medicine'], ['Budezonid', 'medicine'], ['Ambroksol', 'medicine'], ['Acetylocysteina', 'medicine'], ['Dekstrometorfan', 'medicine'], ['Salmeterol', 'medicine'], ['Salbutamol', 'medicine'], ['Amoksycylina', 'medicine'], ['Azitromycyna', 'medicine'], ['Cefaleksyna', 'medicine'], ['Furazydyna', 'medicine'], ['Metronidazol', 'medicine'], ['Amlodypina', 'medicine'], ['Bisoprolol', 'medicine'], ['Ramipryl', 'medicine'], ['Losartan', 'medicine'], ['Hydrochlorotiazyd', 'medicine'], ['Atorwastatyna', 'medicine'], ['Simwastatyna', 'medicine'], ['Metformina', 'medicine'], ['Insulina', 'medicine'], ['Lewotyroksyna', 'medicine'], ['Prednizon', 'medicine'], ['Hydrokortyzon', 'medicine'], ['Heparyna', 'medicine'], ['Warfaryna', 'medicine'], ['Klopidogrel', 'medicine'], ['Diazepam', 'medicine'], ['Sertralina', 'medicine'], ['Mirtazapina', 'medicine'], ['Melatonina', 'medicine'], ['Cholekalcyferol', 'medicine'], ['Kwas foliowy', 'medicine'], ['Siarczan żelaza', 'medicine'], ['Węglan wapnia', 'medicine'], ['Magnez', 'medicine'], ['Sól fizjologiczna', 'medicine'], ['Krople nawilżające', 'medicine'], ['Maść cynkowa', 'medicine'], ['Pantenol', 'medicine'], ['Chlorheksydyna', 'medicine'], ['Płyn Lugola', 'medicine'], ['Węgiel aktywny', 'medicine'], ['Probiotyk', 'medicine']
  ].map(([name, type]) => ({
    name,
    type: type as 'herb' | 'medicine',
    composition: type === 'herb' ? 'Naturalne związki roślinne; skład zależy od surowca i preparatu' : 'Substancja czynna zależna od postaci i dawki preparatu',
    usage: type === 'herb' ? 'Tradycyjne zastosowanie wspomagające; skuteczność i bezpieczeństwo zależą od preparatu' : 'Stosować wyłącznie zgodnie z ulotką, zaleceniem lekarza lub farmaceuty',
    occurrence: type === 'herb' ? 'Uprawy, ogrody lub stanowiska naturalne' : undefined,
    sideEffects: 'Możliwe działania niepożądane i alergie; sprawdź ulotkę przed użyciem',
    interactions: 'Przed połączeniem z innymi preparatami skonsultuj się z farmaceutą'
  }))
  ]

const experiments: Experiment[] = [
  {
    name: "Miareczkowanie kwasu askorbinowego",
    description: "Określenie zawartości witaminy C w soku owocowym poprzez miareczkowanie z jodyną.",
    steps: [
      "Przygotuj roztwór jodyny o znanym stężeniu",
      "Odmierz dokładną objętość soku owocowego",
      "Dodaj kilka kropel skrobi jako wskaźnika",
      "Miareczkuj sok jodyną do pojawienia się trwałego niebieskiego zabarwienia",
      "Oblicz zawartość witaminy C na podstawie zużytej objętości jodyny"
    ],
    equipment: ["Biureta", "Kolba Erlenmeyera", "Pipeta", "Statyw"],
    chemicals: ["Jodyna", "Skrobia", "Sok owocowy", "Woda destylowana"],
    safetyPrecautions: ["Używaj okularów ochronnych", "Pracuj w dobrze wentylowanym pomieszczeniu"]
  },
  {
    name: "Ekstrakcja kofeiny z liści herbaty",
    description: "Izolacja kofeiny z liści herbaty za pomocą ekstrakcji rozpuszczalnikowej.",
    steps: [
      "Zagotuj wodę i zaparz mocną herbatę",
      "Ochłodź napar i dodaj węglan sodu",
      "Ekstrahuj kofeinę chloroformem",
      "Odparuj chloroform, aby uzyskać czystą kofeinę"
    ],
    equipment: ["Zestaw do ekstrakcji", "Łaźnia wodna", "Rotacyjna wyparka próżniowa"],
    chemicals: ["Liście herbaty", "Węglan sodu", "Chloroform"],
    safetyPrecautions: ["Pracuj pod wyciągiem", "Używaj rękawic odpornych na rozpuszczalniki"]
  },
  {
    name: 'Badanie pH naparów',
    description: 'Porównanie odczynu kilku bezpiecznych naparów wodnych za pomocą papierków wskaźnikowych.',
    steps: ['Przygotuj ostudzone napary z różnych surowców', 'Zanurz papierki wskaźnikowe w próbkach', 'Porównaj barwy ze skalą producenta', 'Zapisz obserwacje w tabeli'],
    equipment: ['Kubeczki laboratoryjne', 'Pipeta', 'Papierki pH', 'Okulary ochronne'],
    chemicals: ['Woda destylowana', 'Napar ziołowy', 'Roztwór buforowy kontrolny'],
    safetyPrecautions: ['Nie spożywaj próbek', 'Pracuj pod nadzorem nauczyciela', 'Umyj ręce po doświadczeniu']
  },
  {
    name: 'Rozdzielanie barwników roślinnych',
    description: 'Prosta chromatografia bibułowa pokazująca, że ekstrakt roślinny może zawierać wiele barwników.',
    steps: ['Nanieś kroplę ekstraktu na pasek bibuły', 'Umieść pasek w niewielkiej ilości wody', 'Obserwuj wędrówkę i rozdzielanie barw', 'Porównaj wyniki próbek'],
    equipment: ['Bibuła filtracyjna', 'Słoiczki', 'Patyczki', 'Rękawiczki'],
    chemicals: ['Woda', 'Ekstrakt z liści szpinaku', 'Ekstrakt z czerwonej kapusty'],
    safetyPrecautions: ['Nie używaj rozpuszczalników organicznych w domu', 'Chroń oczy i skórę', 'Utylizuj próbki zgodnie z instrukcją']
  },
  {
    name: 'Stabilność naparu',
    description: 'Obserwacja zmian barwy naparu po ogrzewaniu i kontakcie z powietrzem.',
    steps: ['Podziel napar na trzy opisane próbki', 'Jedną pozostaw w temperaturze pokojowej', 'Drugą ogrzej w łaźni wodnej pod nadzorem', 'Porównaj barwę i zapach bez degustowania'],
    equipment: ['Probówki', 'Łaźnia wodna', 'Termometr', 'Pipety'],
    chemicals: ['Napar z herbaty', 'Woda destylowana'],
    safetyPrecautions: ['Nie ogrzewaj zamkniętych naczyń', 'Używaj rękawic termicznych', 'Nie spożywaj próbek']
  }
  ]

const recipes: Recipe[] = [
  {
    name: "Maść na oparzenia",
    ingredients: [
      { name: "Wazelina", weight: 80 },
      { name: "Alantoina", weight: 5 },
      { name: "Witamina E", weight: 10 },
      { name: "Olejek lawendowy", weight: 5 }
    ],
    instructions: "Rozpuść wazelinę w kąpieli wodnej. Dodaj alantoinę i mieszaj do rozpuszczenia. Odstaw z ognia, dodaj witaminę E i olejek lawendowy. Mieszaj do ostygnięcia."
  },
  {
    name: "Syrop na kaszel",
    ingredients: [
      { name: "Woda oczyszczona", weight: 500 },
      { name: "Sacharoza", weight: 300 },
      { name: "Ekstrakt z tymianku", weight: 50 },
      { name: "Glicerol", weight: 100 },
      { name: "Kwas cytrynowy", weight: 5 }
    ],
    instructions: "Rozpuść sacharozę w podgrzanej wodzie. Dodaj ekstrakt z tymianku i glicerol. Na końcu dodaj kwas cytrynowy. Mieszaj do uzyskania jednolitej konsystencji."
  },
  {
    name: 'Krem emulsyjny do ćwiczeń',
    ingredients: [{ name: 'Woda oczyszczona', weight: 70 }, { name: 'Emulgator', weight: 8 }, { name: 'Olej roślinny', weight: 20 }, { name: 'Glicerol', weight: 2 }],
    instructions: 'W warunkach laboratoryjnych ogrzej fazy osobno, połącz je podczas mieszania i pozostaw do ostygnięcia. Receptura ma charakter wyłącznie dydaktyczny; nie stosuj na skórę bez kontroli jakości.'
  },
  {
    name: 'Roztwór soli do demonstracji',
    ingredients: [{ name: 'Woda destylowana', weight: 98 }, { name: 'Chlorek sodu', weight: 2 }],
    instructions: 'Odważ składniki, rozpuść sól w wodzie i opisz stężenie na etykiecie. Nie jest to preparat do iniekcji ani do oczu.'
  },
  {
    name: 'Żel pokazowy z gliceryną',
    ingredients: [{ name: 'Woda oczyszczona', weight: 85 }, { name: 'Glicerol', weight: 10 }, { name: 'Karbomer', weight: 5 }],
    instructions: 'Wsypuj zagęstnik stopniowo do fazy wodnej i mieszaj do uzyskania żelu. Do celów edukacyjnych, bez użycia na skórze.'
  }
  ]

const ComicSimulation: React.FC<{ situation: string }> = ({ situation }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-teal-500 font-semibold">Symulacja sytuacji</div>
          <p className="mt-2 text-gray-500">{situation}</p>
          <div className="mt-4 flex justify-center">
            <motion.div
              className="w-64 h-64 bg-teal-200 rounded-lg flex items-center justify-center text-4xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🏥
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

const scenarios: Scenario[] = [
  {
    id: 'customer',
    name: 'Obsługa klienta',
    icon: <Building2 className="w-6 h-6" />,
    questions: [
      {
        text: "Klient skarży się na uporczywy kaszel. Co powinieneś zrobić w pierwszej kolejności?",
        options: [
          "Zaproponować syrop na kaszel bez recepty",
          "Zapytać o charakter kaszlu i towarzyszące objawy",
          "Skierować klienta do lekarza",
          "Zasugerować inhalacje z soli fizjologicznej"
        ],
        correctAnswer: 1,
        explanation: "Zawsze należy najpierw zebrać więcej informacji o objawach, aby móc zaproponować najlepsze rozwiązanie lub doradzić wizytę u lekarza.",
        simulation: () => <ComicSimulation situation="Farmaceuta rozmawia z klientem o objawach kaszlu" />
      },
      {
        text: "Klient prosi o lek na ból głowy, ale nie pamięta nazwy. Twierdzi, że 'to ta biała tabletka w niebieskim opakowaniu'. Co robisz?",
        options: [
          "Dajesz mu najpopularniejszy lek przeciwbólowy",
          "Pokazujesz różne opakowania leków przeciwbólowych i prosisz o identyfikację",
          "Pytasz o dodatkowe informacje, takie jak kształt tabletki lub dawkę",
          "Odsyłasz klienta do lekarza po receptę"
        ],
        correctAnswer: 2,
        explanation: "Najlepszym podejściem jest zebranie dodatkowych informacji, które pomogą zidentyfikować lek. Kształt tabletki, dawka czy inne szczegóły mogą być kluczowe.",
        simulation: () => <ComicSimulation situation="Farmaceuta pokazuje klientowi różne opakowania leków" />
      },
      {
        text: 'Klient przyjmuje kilka leków i pyta o nowy preparat. Jak postępujesz?',
        options: ['Sprzedajesz bez pytań', 'Sprawdzasz listę leków, alergie i kierujesz do farmaceuty', 'Polecasz podwójną dawkę', 'Ignorujesz pytanie'],
        correctAnswer: 1,
        explanation: 'Przegląd leków, alergii i przeciwwskazań pomaga ograniczyć ryzyko interakcji.',
        simulation: () => <ComicSimulation situation="Farmaceuta przeprowadza krótki wywiad z klientem" />
      },
    ]
  },
  {
    id: 'prescription',
    name: 'Recepty',
    icon: <FileText className="w-6 h-6" />,
    questions: [
      {
        text: "Otrzymujesz e-receptę na lek, którego nie ma na stanie. Co robisz?",
        options: [
          "Informujesz pacjenta, że lek jest niedostępny i odsyłasz go",
          "Proponujesz zamiennik bez konsultacji z lekarzem",
          "Sprawdzasz dostępność w innych aptekach i informujesz pacjenta",
          "Zamawiasz lek i prosisz pacjenta o przyjście następnego dnia"
        ],
        correctAnswer: 2,
        explanation: "Najlepszym rozwiązaniem jest sprawdzenie dostępności leku w innych aptekach i poinformowanie o tym pacjenta. To zapewnia pacjentowi najszybszy dostęp do przepisanego leku.",
        simulation: () => <ComicSimulation situation="Farmaceuta sprawdza dostępność leku w systemie" />
      },
      {
        text: 'Pacjent pyta o zamiennik leku na receptę. Co sprawdzasz?',
        options: ['Tylko kolor opakowania', 'Substancję czynną, dawkę i postać', 'Najdroższy odpowiednik', 'Opinie w internecie'],
        correctAnswer: 1,
        explanation: 'Zamienność ocenia się na podstawie substancji czynnej, dawki i postaci farmaceutycznej, a wątpliwości wyjaśnia farmaceuta.',
        simulation: () => <ComicSimulation situation="Farmaceuta porównuje substancję czynną i dawkę preparatów" />
      },
      {
        text: 'Pacjent zgłasza alergię po przyjęciu nowego leku. Jaka jest właściwa reakcja?',
        options: ['Zignorować objawy', 'Zalecić kolejną dawkę', 'Ocenić nasilenie i przy ciężkich objawach wezwać pomoc', 'Polecić dowolny suplement'],
        correctAnswer: 2,
        explanation: 'Duszność, obrzęk twarzy lub omdlenie wymagają natychmiastowej pomocy medycznej. Lżejsze objawy należy zgłosić lekarzowi lub farmaceucie.',
        simulation: () => <ComicSimulation situation="Farmaceuta rozpoznaje objawy wymagające pilnej pomocy" />
      }
    ]
  },
  {
    id: 'safety',
    name: 'Bezpieczeństwo w aptece',
    icon: <Flame className="w-6 h-6" />,
    questions: [
      {
        text: "W aptece wybuchł pożar. Jaka powinna być Twoja pierwsza reakcja?",
        options: [
          "Natychmiast opuścić budynek",
          "Zadzwonić po straż pożarną",
          "Ewakuować klientów i pracowników, a następnie zaalarmować służby",
          "Próbować samodzielnie ugasić pożar"
        ],
        correctAnswer: 2,
        explanation: "Bezpieczeństwo ludzi jest najważniejsze. Najpierw należy ewakuować wszystkie osoby z budynku, a następnie zaalarmować służby ratunkowe.",
        simulation: () => <ComicSimulation situation="Farmaceuta kieruje ewakuacją klientów i pracowników" />
      },
      {
        text: 'Co robisz po rozlaniu nieznanej substancji w aptece?',
        options: ['Sprzątasz gołymi rękami', 'Zabezpieczasz miejsce i informujesz przełożonego', 'Wylewasz ją do zlewu', 'Ignorujesz zdarzenie'],
        correctAnswer: 1,
        explanation: 'Miejsce należy zabezpieczyć, ograniczyć kontakt z substancją i postępować według procedury bezpieczeństwa.',
        simulation: () => <ComicSimulation situation="Pracownik zabezpiecza miejsce zdarzenia i powiadamia przełożonego" />
      },
      {
        text: 'Gdzie przechowujesz lek wymagający ochrony przed światłem?',
        options: ['Na parapecie', 'W oryginalnym opakowaniu zgodnie z ulotką', 'W otwartym pojemniku', 'Obok źródła ciepła'],
        correctAnswer: 1,
        explanation: 'Oryginalne opakowanie i warunki z ulotki chronią lek przed utratą jakości.',
        simulation: () => <ComicSimulation situation="Farmaceuta sprawdza warunki przechowywania preparatu" />
      }
    ]
  },
  {
    id: 'communication',
    name: 'Komunikacja z pacjentem',
    icon: <Stethoscope className="w-6 h-6" />,
    questions: [
      {
        text: 'Jak najlepiej sprawdzić, czy pacjent zrozumiał instrukcję?',
        options: ['Poprosić o powtórzenie własnymi słowami', 'Mówić szybciej', 'Wręczyć ulotkę bez wyjaśnienia', 'Założyć, że wszystko jest jasne'],
        correctAnswer: 0,
        explanation: 'Metoda teach-back pozwala upewnić się, że pacjent rozumie dawkowanie i najważniejsze ostrzeżenia.',
        simulation: () => <ComicSimulation situation="Farmaceuta prosi pacjenta o powtórzenie zaleceń" />
      }
    ]
  }
]

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <Clock className="w-8  h-8 text-teal-500" />
    <span className="text-2xl font-bold text-teal-500">Apteka on time</span>
  </div>
)

export default function EnhancedGame() {
  const [activeTab, setActiveTab] = useState('menu')
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSimulation, setShowSimulation] = useState(false)
  const [gameMode, setGameMode] = useState<'classic' | 'speed' | 'streak'>('classic')
  const [streak, setStreak] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [legalSection, setLegalSection] = useState<'privacy' | 'cookies' | null>(null)
  
  const [labRecipe, setLabRecipe] = useState<Recipe>({ name: '', ingredients: [], instructions: '' })
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({ name: '', weight: 0 })
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)
  const [libraryQuery, setLibraryQuery] = useState('')
  const [libraryType, setLibraryType] = useState<'all' | 'herb' | 'medicine'>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<HerbMedicine | null>(null)

  const filteredLibrary = herbsMedicines.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(libraryQuery.toLowerCase()) || item.usage.toLowerCase().includes(libraryQuery.toLowerCase())
    const matchesType = libraryType === 'all' || item.type === libraryType
    const matchesFavorites = !favoritesOnly || favorites.includes(item.name)
    return matchesQuery && matchesType && matchesFavorites
  })

  const toggleFavorite = (name: string) => {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])
  }

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setFeedback('')
    setShowExplanation(false)
    setIsCorrect(null)
    setShowSimulation(false)
    setStreak(0)
    setAnsweredQuestions(0)
    setActiveTab('game')
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentScenario) return

    const currentQuestion = currentScenario.questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer
    const nextStreak = correct ? streak + 1 : 0
    const modeBonus = gameMode === 'streak' ? nextStreak * 2 : gameMode === 'speed' ? 5 : 0
    const earnedPoints = correct ? 10 + modeBonus : 0

    setIsCorrect(correct)
    setAnsweredQuestions((value) => value + 1)
    setStreak(nextStreak)
    if (correct) {
      setScore((value) => value + earnedPoints)
      setFeedback(`Poprawna odpowiedź! +${earnedPoints} punktów${nextStreak > 1 ? ` • seria x${nextStreak}` : ''}`)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      setFeedback(`Niepoprawna odpowiedź. Spróbuj jeszcze raz!`)
    }

    setShowExplanation(true)
    setShowSimulation(true)
  }

  const handleNextQuestion = () => {
    if (!currentScenario) return

    if (currentQuestionIndex + 1 < currentScenario.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setFeedback('')
      setShowExplanation(false)
      setIsCorrect(null)
      setShowSimulation(false)
    } else {
      const newProgress = progress + Math.floor(100 / scenarios.length)
      setProgress(Math.min(newProgress, 100))
      setCompletedScenarios([...completedScenarios, currentScenario.id])
      setCurrentScenario(null)
      setShowExplanation(false)
      setIsCorrect(null)
      setShowSimulation(false)
      setActiveTab('menu')

      if (newProgress >= 100) {
        setShowCelebration(true)
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (!currentScenario || currentQuestionIndex === 0) return

    setCurrentQuestionIndex(currentQuestionIndex - 1)
    setSelectedAnswer(null)
    setFeedback('')
    setShowExplanation(false)
    setIsCorrect(null)
    setShowSimulation(false)
  }

  const handleAddIngredient = () => {
    if (currentIngredient.name && currentIngredient.weight > 0) {
      setLabRecipe({
        ...labRecipe,
        ingredients: [...labRecipe.ingredients, currentIngredient]
      })
      setCurrentIngredient({ name: '', weight: 0 })
    }
  }

  const handleSaveRecipe = () => {
    if (labRecipe.name && labRecipe.ingredients.length > 0 && labRecipe.instructions) {
      console.log('Zapisano receptę:', labRecipe)
      setLabRecipe({ name: '', ingredients: [], instructions: '' })
    }
  }

  const handleExperimentChange = (experimentName: string) => {
    const selectedExperiment = experiments.find(exp => exp.name === experimentName)
    setCurrentExperiment(selectedExperiment || null)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selectedAnswer !== null) {
        handleAnswerSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [selectedAnswer])

  const pageTransition = {
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: "-100%"
    }
  }

  return (
    <TooltipProvider>
      <div className={`game-shell game-card-shine relative min-h-screen container mx-auto overflow-hidden px-4 py-5 text-foreground sm:px-6 lg:px-8 ${openSans.className}`}>
        <motion.header 
          className="glass-panel mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl px-4 py-3 sm:px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
          <h1 className={`text-4xl font-bold text-teal-700 ${roboto.className}`}>Apteka na Czasie</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setActiveTab('menu')} className="primary-button">
              <Home className="mr-2 h-4 w-4" />
              Menu Główne
            </Button>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="out"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'menu' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Menu Główne</CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-relaxed text-slate-600">Apteka na Czasie to interaktywna aplikacja edukacyjna i pracownia wspierająca naukę bezpiecznej pracy w aptece. Łączy scenariusze triage, bibliotekę substancji i ziół, receptariusz, kalkulatory, laboratorium oraz dokumentację kontroli. Wyniki mają charakter pomocniczy i nie zastępują ChPL, Farmakopei Polskiej, procedur apteki ani decyzji uprawnionego farmaceuty.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    {[['Praktyka', 'Ćwicz wywiad, czerwone flagi i bezpieczne rekomendacje.'], ['Receptura', 'Rozwijaj receptury i kalkulacje z kontrolą jednostek.'], ['Jakość', 'Dokumentuj źródła, SOP, BUD i drugą kontrolę.']].map(([title, description]) => <div key={title} className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4"><p className="font-semibold text-teal-800">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p></div>)}
                  </div>
                  <Alert className="mb-5 border-amber-300 bg-amber-50 text-amber-950"><ShieldCheck className="size-4" /><AlertTitle>Transparentne ograniczenia</AlertTitle><AlertDescription>Aplikacja nie diagnozuje, nie dobiera samodzielnie terapii i nie zatwierdza preparatów do wydania. Każdy wynik wymaga oceny profesjonalisty i aktualnego źródła.</AlertDescription></Alert>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setActiveTab('game')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Building2 className="mr-2 h-6 w-6" />
                      Rozpocznij Grę
                    </Button>
                    <Button onClick={() => setActiveTab('lab')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Beaker className="mr-2 h-6 w-6" />
                      Laboratorium
                    </Button>
                    <Button onClick={() => setActiveTab('pharmacy')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <ClipboardCheck className="mr-2 h-6 w-6" />
                      Pracownia farmaceuty
                    </Button>
                    <Button onClick={() => setActiveTab('library')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Book className="mr-2 h-6 w-6" />
                      Biblioteka
                    </Button>
                    <Button onClick={() => setActiveTab('howto')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <BookOpen className="mr-2 h-6 w-6" />
                      WikiHow
                    </Button>
                    <Button onClick={() => setActiveTab('results')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Award className="mr-2 h-6 w-6" />
                      Wyniki i odznaki
                    </Button>
                    <Button onClick={() => { setLibraryQuery(''); setFavoritesOnly(true); setActiveTab('library') }} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Heart className="mr-2 h-6 w-6" />
                      Ulubione ({favorites.length})
                    </Button>
                    <Button onClick={() => setActiveTab('admin')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Settings className="mr-2 h-6 w-6" />
                      Panel treści
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : activeTab === 'game' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>
                    {currentScenario ? currentScenario.name : 'Wybierz scenariusz'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!currentScenario ? (
                      <motion.div
                        key="scenario-selection"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-700 to-cyan-700 p-5 text-white shadow-xl">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">Tryb gry</p><h3 className="mt-1 text-xl font-bold">Wybierz swój rytm nauki</h3><p className="mt-1 text-sm text-teal-100">Każdy tryb zmienia sposób naliczania punktów.</p></div>
                            <div className="grid grid-cols-3 gap-2">
                              {[{id:'classic', label:'Klasyczny', icon:<BookOpen className="h-4 w-4" />}, {id:'speed', label:'Turbo', icon:<Zap className="h-4 w-4" />}, {id:'streak', label:'Seria', icon:<Flame className="h-4 w-4" />}].map((mode) => <button key={mode.id} type="button" onClick={() => setGameMode(mode.id as typeof gameMode)} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${gameMode === mode.id ? 'bg-white text-teal-800 shadow-lg' : 'bg-teal-950/30 text-teal-50 hover:bg-white/20'}`}>{mode.icon}<span>{mode.label}</span></button>)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">Wybierz scenariusz, aby rozpocząć grę. Każdy scenariusz pomoże Ci rozwinąć umiejętności w różnych aspektach pracy w aptece.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {scenarios.map((scenario) => (
                            <motion.div
                              key={scenario.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => handleScenarioSelect(scenario)}
                                    className={`w-full h-24 ${
                                      completedScenarios.includes(scenario.id)
                                        ? 'bg-teal-700'
                                        : 'bg-teal-500'
                                    } hover:bg-teal-600 text-white transition-colors duration-200 flex flex-col items-center justify-center`}
                                  >
                                    {scenario.icon}
                                    <span className="mt-2 text-xs text-center">{scenario.name}</span>
                                    {completedScenarios.includes(scenario.id) && (
                                      <CheckCircle className="absolute top-1 right-1 w-4 h-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{completedScenarios.includes(scenario.id) ? 'Ukończony' : 'Nieukończony'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-900 p-3 text-white shadow-lg">
                          <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-300" /><span className="text-xs text-slate-300">Punkty</span><strong>{score}</strong></div>
                          <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-300" /><span className="text-xs text-slate-300">Seria</span><strong>x{streak}</strong></div>
                          <div className="flex items-center gap-2"><Timer className="h-4 w-4 text-cyan-300" /><span className="text-xs text-slate-300">Postęp</span><strong>{currentQuestionIndex + 1}/{currentScenario.questions.length}</strong></div>
                        </div>
                        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / currentScenario.questions.length) * 100}%` }} transition={{ duration: 0.5 }} /></div>
                        <p className="text-lg font-semibold mb-4">{currentScenario.questions[currentQuestionIndex].text}</p>
                        <RadioGroup onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                          {currentScenario.questions[currentQuestionIndex].options.map((option, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center space-x-2 mb-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`}>{option}</Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                        <div className="flex justify-between mt-4">
                          <Button 
                            onClick={handlePreviousQuestion} 
                            className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
                            disabled={currentQuestionIndex === 0}
                          >
                            <ChevronLeft className="mr-2 w-4 h-4" />
                            Poprzednie pytanie
                          </Button>
                          <Button 
                            onClick={handleAnswerSubmit} 
                            className="bg-teal-700 hover:bg-teal-800 text-white transition-colors duration-200"
                            disabled={selectedAnswer === null}
                          >
                            Zatwierdź odpowiedź
                          </Button>
                          <Button 
                            onClick={handleNextQuestion} 
                            className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
                            disabled={currentQuestionIndex === currentScenario.questions.length - 1 && !showExplanation}
                          >
                            {currentQuestionIndex + 1 < currentScenario.questions.length ? 'Następne pytanie' : 'Zakończ scenariusz'}
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Alert className={`mt-4 ${isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                              <AlertTitle className="flex items-center">
                                {isCorrect ? (
                                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                                )}
                                {isCorrect ? 'Poprawna odpowiedź!' : 'Niepoprawna odpowiedź'}
                              </AlertTitle>
                              <AlertDescription>{feedback}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Alert className="mt-4 bg-blue-100 border-blue-400">
                              <AlertTitle>Wyjaśnienie</AlertTitle>
                              <AlertDescription>{currentScenario.questions[currentQuestionIndex].explanation}</AlertDescription>
                            </Alert>
                            {showSimulation && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200">
                                    Zobacz symulację
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Symulacja</DialogTitle>
                                    <DialogDescription>
                                      Wizualizacja związana z tym pytaniem
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-center items-center p-4">
                                    {currentScenario.questions[currentQuestionIndex].simulation()}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ) : activeTab === 'lab' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Laboratorium</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recipe" className="w-full">
                    <TabsList>
                      <TabsTrigger value="recipe">Receptura</TabsTrigger>
                      <TabsTrigger value="experiment">Eksperymenty</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recipe">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipe-name">Nazwa recepty</Label>
                          <Input 
                            id="recipe-name" 
                            value={labRecipe.name} 
                            onChange={(e) => setLabRecipe({...labRecipe, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ingredient-name">Nazwa składnika</Label>
                          <Input 
                            id="ingredient-name" 
                            value={currentIngredient.name} 
                            onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ingredient-weight">Waga składnika (g)</Label>
                          <Slider
                            id="ingredient-weight"
                            min={0}
                            max={100}
                            step={1}
                            value={[currentIngredient.weight]}
                            onValueChange={(value) => setCurrentIngredient({...currentIngredient, weight: value[0]})}
                          />
                          <span>{currentIngredient.weight}g</span>
                        </div>
                        <Button onClick={handleAddIngredient} className="bg-teal-500 hover:bg-teal-600 text-white">Dodaj składnik</Button>
                        <div>
                          <h3 className="font-semibold">Składniki:</h3>
                          <ul>
                            {labRecipe.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient.name}: {ingredient.weight}g</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Label htmlFor="recipe-instructions">Instrukcje</Label>
                          <textarea
                            id="recipe-instructions"
                            className="w-full p-2 border rounded"
                            value={labRecipe.instructions}
                            onChange={(e) => setLabRecipe({...labRecipe, instructions: e.target.value})}
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleSaveRecipe} className="bg-teal-700 hover:bg-teal-800 text-white">Zapisz receptę</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="experiment">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="experiment-select">Wybierz eksperyment</Label>
                          <Select onValueChange={handleExperimentChange}>
                            <SelectTrigger id="experiment-select">
                              <SelectValue placeholder="Wybierz eksperyment" />
                            </SelectTrigger>
                            <SelectContent>
                              {experiments.map((exp, index) => (
                                <SelectItem key={index} value={exp.name}>{exp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {currentExperiment && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">{currentExperiment.name}</h3>
                            <p>{currentExperiment.description}</p>
                            <div>
                              <h4 className="font-semibold">Kroki:</h4>
                              <ol className="list-decimal list-inside">
                                {currentExperiment.steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <h4 className="font-semibold">Wyposażenie:</h4>
                              <ul className="list-disc list-inside">
                                {currentExperiment.equipment.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Chemikalia:</h4>
                              <ul className="list-disc list-inside">
                                {currentExperiment.chemicals.map((chemical, index) => (
                                  <li key={index}>{chemical}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Środki ostrożności:</h4>
                              <ul className="list-disc list-inside">
                                {currentExperiment.safetyPrecautions.map((precaution, index) => (
                                  <li key={index}>{precaution}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : activeTab === 'pharmacy' ? (
              <PharmacyWorkbench />
            ) : activeTab === 'howto' ? (
              <HowToLibrary />
            ) : activeTab === 'library' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Biblioteka</CardTitle>
                </CardHeader>
  <CardContent>
  <HerbsMedicinesDatabase />
  <div className="mb-5 mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input aria-label="Szukaj w bibliotece" placeholder="Szukaj po nazwie lub zastosowaniu..." className="pl-9" value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} /></div>
                    <div className="flex flex-wrap gap-2"><Button variant={libraryType === 'all' ? 'default' : 'outline'} onClick={() => setLibraryType('all')}>Wszystko</Button><Button variant={libraryType === 'herb' ? 'default' : 'outline'} onClick={() => setLibraryType('herb')}>Zioła</Button><Button variant={libraryType === 'medicine' ? 'default' : 'outline'} onClick={() => setLibraryType('medicine')}>Leki</Button><Button variant={favoritesOnly ? 'default' : 'outline'} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart className="mr-1 h-4 w-4" />Ulubione</Button></div>
                  </div>
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-500"><span><SlidersHorizontal className="mr-1 inline h-4 w-4" />{filteredLibrary.length} wyników z {herbsMedicines.length}</span><span><Heart className="mr-1 inline h-4 w-4" />{favorites.length} ulubionych</span></div>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredLibrary.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={item.name}>
                        <div className="flex items-center"><AccordionTrigger className="flex-1 text-left" onClick={() => setSelectedLibraryItem(item)}>{item.name}<span className="ml-2 text-xs text-gray-500">{item.type === 'herb' ? 'zioło' : 'lek'}</span></AccordionTrigger><Button aria-label={`Dodaj ${item.name} do ulubionych`} variant="ghost" size="icon" onClick={() => toggleFavorite(item.name)}><Heart className={`h-4 w-4 ${favorites.includes(item.name) ? 'fill-red-500 text-red-500' : ''}`} /></Button></div>
                        <AccordionContent><div className="space-y-2 text-sm leading-6"><p><strong>Skład:</strong> {item.composition}</p><p><strong>Zastosowanie:</strong> {item.usage}</p>{item.occurrence && <p><strong>Występowanie:</strong> {item.occurrence}</p>}<p><strong>Działania niepożądane:</strong> {item.sideEffects}</p><p><strong>Interakcje:</strong> {item.interactions}</p><p className="mt-3 rounded-md bg-amber-50 p-3 text-amber-900"><ShieldCheck className="mr-1 inline h-4 w-4" />Informacje edukacyjne. Przed użyciem sprawdź ulotkę i skonsultuj się z farmaceutą.</p><p className="text-xs text-gray-500"><CalendarDays className="mr-1 inline h-3 w-3" />Zaktualizowano: sierpień 2026 · Źródła: ulotki leków, EMA, WHO</p></div></AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredLibrary.length === 0 && <p className="py-8 text-center text-gray-500">Nie znaleziono wpisów. Spróbuj innej nazwy.</p>}
                  {selectedLibraryItem && <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm"><strong>Wybrany wpis:</strong> {selectedLibraryItem.name}. Zapisz go w ulubionych, aby wrócić do niego później.</div>}
                </CardContent>
              </Card>
            ) : activeTab === 'admin' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader><CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Panel treści</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <Alert className="border-teal-200 bg-teal-50"><ShieldCheck className="h-4 w-4" /><AlertTitle>Tryb demonstracyjny</AlertTitle><AlertDescription>Panel przygotowany do zarządzania treścią. W wersji produkcyjnej dodaj logowanie administratora i bazę danych.</AlertDescription></Alert>
                  <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg border p-4"><Book className="mb-2 h-5 w-5 text-teal-600" /><strong>{herbsMedicines.length}</strong><p className="text-sm text-gray-500">wpisów w bibliotece</p></div><div className="rounded-lg border p-4"><Beaker className="mb-2 h-5 w-5 text-teal-600" /><strong>{experiments.length}</strong><p className="text-sm text-gray-500">eksperymentów</p></div><div className="rounded-lg border p-4"><Award className="mb-2 h-5 w-5 text-teal-600" /><strong>{scenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0)}</strong><p className="text-sm text-gray-500">pytań quizowych</p></div></div>
                  <div className="flex flex-wrap gap-3"><Button onClick={() => setActiveTab('library')}><Book className="mr-2 h-4 w-4" />Przeglądaj bibliotekę</Button><Button variant="outline" onClick={() => setActiveTab('lab')}><Beaker className="mr-2 h-4 w-4" />Zarządzaj laboratorium</Button></div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Twoje Wyniki</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className={`text-xl font-semibold text-teal-700 ${roboto.className}`}>Wynik: {score}</p>
                    <p className="mt-4 mb-2 text-gray-700">Ogólny Postęp:</p>
                    <Progress value={progress} className="h-2 bg-teal-200" />
                    <p className="mt-2 text-sm text-gray-600">{progress}% ukończone</p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Ukończone scenariusze:</h3>
                      <ul className="list-disc list-inside">
                        {completedScenarios.map((scenarioId) => (
                          <li key={scenarioId} className="text-teal-700">
                            {scenarios.find(s => s.id === scenarioId)?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-8 flex flex-col items-center gap-3 border-t border-teal-100 pt-6 text-center text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setLegalSection('privacy')}>Polityka prywatności</button><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setLegalSection('cookies')}>Polityka cookies</button><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setActiveTab('pharmacy')}>Pracownia farmaceuty</button></div>
          <p>Aplikację stworzył <strong>Roman Orłowski</strong> · <a className="text-teal-700 underline" href="mailto:contact@rocybersolutions.com">contact@rocybersolutions.com</a></p>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500">Aplikacja korzysta z niezbędnych mechanizmów technicznych do działania interfejsu. Nie sprzedajemy danych użytkowników ani nie wykorzystujemy formularzy do identyfikacji pacjentów.</p>
          <Script src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" strategy="lazyOnload" data-name="bmc-button" data-slug="r0cs" data-color="#40DCA5" data-emoji="📖" data-font="Lato" data-text="Buy me a book" data-outline-color="#000000" data-font-color="#ffffff" data-coffee-color="#FFDD00" />
        </footer>

        <Dialog open={legalSection !== null} onOpenChange={(open) => !open && setLegalSection(null)}>
          <DialogContent className="max-h-[82vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{legalSection === 'privacy' ? 'Polityka prywatności' : 'Polityka cookies'}</DialogTitle><DialogDescription>Informacje dla użytkowników aplikacji Apteka na Czasie. Ostatnia aktualizacja: 18 września 2026 r.</DialogDescription></DialogHeader>
            {legalSection === 'privacy' ? <div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><section><h3 className="font-semibold text-foreground">1. Administrator i kontakt</h3><p>Administratorem aplikacji jest Roman Orłowski. Kontakt: contact@rocybersolutions.com. W sprawach prywatności użytkownik może skontaktować się pod tym adresem.</p></section><section><h3 className="font-semibold text-foreground">2. Jakie dane przetwarzamy</h3><p>Aplikacja jest zaprojektowana tak, aby nie wymagać danych identyfikujących pacjentów. Nie wpisuj imienia, nazwiska, PESEL, adresu ani innych danych pozwalających zidentyfikować osobę. Dane wpisywane do lokalnych formularzy mogą pozostać w pamięci bieżącej sesji przeglądarki.</p></section><section><h3 className="font-semibold text-foreground">3. Cel i bezpieczeństwo</h3><p>Dane służą do działania kalkulatorów, ćwiczeń, receptur i dokumentacji kontroli. Dane przesyłane do funkcji audytu powinny zawierać wyłącznie informacje zawodowe, takie jak numer serii, SOP, wersja receptury i identyfikatory operatorów zgodne z procedurą apteki.</p></section><section><h3 className="font-semibold text-foreground">4. Prawa i ograniczenia</h3><p>Użytkownik może skontaktować się w sprawie dostępu, poprawienia lub usunięcia danych technicznych. Aplikacja nie jest systemem EDM ani dokumentacją medyczną. Przed użyciem zawodowym należy przeprowadzić własną ocenę prawną, organizacyjną i bezpieczeństwa.</p></section><section><h3 className="font-semibold text-foreground">5. Zmiany</h3><p>Polityka może być aktualizowana wraz ze zmianami aplikacji, integracji i przepisów. Data aktualizacji jest widoczna w tym dokumencie.</p></section></div> : <div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><section><h3 className="font-semibold text-foreground">1. Czym są cookies</h3><p>Cookies to małe pliki lub podobne mechanizmy zapisywane przez przeglądarkę. Mogą być niezbędne do zapamiętania ustawień interfejsu i prawidłowego działania sesji.</p></section><section><h3 className="font-semibold text-foreground">2. Jakich mechanizmów używamy</h3><p>Używamy niezbędnych mechanizmów aplikacji, ustawień motywu oraz narzędzi analitycznych dostawcy hostingu, jeżeli są aktywne w danym środowisku. Zewnętrzny przycisk wsparcia może korzystać z własnych mechanizmów cookies zgodnie z polityką swojego dostawcy.</p></section><section><h3 className="font-semibold text-foreground">3. Zarządzanie</h3><p>Możesz usunąć lub zablokować cookies w ustawieniach przeglądarki. Zablokowanie niektórych mechanizmów może ograniczyć działanie aplikacji. Nie używamy cookies do przechowywania danych pacjenta.</p></section><section><h3 className="font-semibold text-foreground">4. Kontakt</h3><p>Jeśli masz pytania dotyczące cookies lub prywatności, napisz na contact@rocybersolutions.com.</p></section></div>}
          </DialogContent>
        </Dialog>

        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-8 rounded-lg text-center">
              <Award className="w-16 h-16 text-teal-500 mx-auto mb-4" />
              <h2 className={`text-2xl font-bold mb-4 ${roboto.className}`}>Gratulacje!</h2>
              <p>Ukończyłeś wszystkie scenariusze w grze "Apteka na Czasie"!</p>
              <p className="mt-2">Twój końcowy wynik: {score} punktów</p>
              <Button 
                onClick={() => setShowCelebration(false)} 
                className="mt-4 bg-teal-700 hover:bg-teal-800 text-white transition-colors duration-200"
              >
                Zamknij
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  )
}
