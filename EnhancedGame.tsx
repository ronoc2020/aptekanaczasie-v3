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
import { AuthPanel } from '@/components/auth-panel'
import { authClient } from '@/lib/auth-client'
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, Home, Building2, FileText, Flame, Activity, Stethoscope, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, Beaker, Pill, Thermometer, Scale, Book, Leaf, Search, Heart, ShieldCheck, SlidersHorizontal, Star, Settings, CalendarDays, BookOpen, Timer, Zap, Trophy, Swords, Moon, Sun, ClipboardCheck, FlaskConical, Sparkles, Play, Target, Mail, MessageSquare } from 'lucide-react'
import confetti from 'canvas-confetti'
import { HowToLibrary } from '@/components/how-to-library'
import { HerbsMedicinesDatabase } from '@/components/herbs-medicines-database'
import { PharmacyWorkbench } from '@/components/pharmacy-workbench'

import { Roboto, Open_Sans } from 'next/font/google'

const roboto = Roboto({ weight: '700', subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame = 0
    const started = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

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
  },
  {
    name: 'Zawiesina demonstracyjna',
    ingredients: [{ name: 'Woda oczyszczona', weight: 90 }, { name: 'Substancja modelowa', weight: 5 }, { name: 'Glicerol', weight: 5 }],
    instructions: 'Rozprosz substancję modelową w glicerolu, następnie stopniowo dodawaj wodę przy mieszaniu. Obserwuj sedymentację i opisz konieczność oznakowania: wstrząsnąć przed użyciem. Wyłącznie do ćwiczeń laboratoryjnych.'
  },
  {
    name: 'Proszek do oceny jednorodności',
    ingredients: [{ name: 'Laktoza jako nośnik modelowy', weight: 95 }, { name: 'Barwnik spożywczy do demonstracji', weight: 5 }],
    instructions: 'Wymieszaj składniki metodą rozcieńczeń geometrycznych i oceń wizualną jednorodność próbki. Nie jest to produkt leczniczy ani preparat do stosowania u ludzi.'
  },
  {
    name: 'Emulsja demonstracyjna',
    ingredients: [{ name: 'Woda oczyszczona', weight: 65 }, { name: 'Olej roślinny modelowy', weight: 30 }, { name: 'Emulgator dydaktyczny', weight: 5 }],
    instructions: 'Przygotuj fazy zgodnie z instrukcją stanowiskową, połącz je pod kontrolą prowadzącego i obserwuj zmianę konsystencji. Dokumentuj temperaturę, czas mieszania i wygląd próbki.'
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
              <FlaskConical className="h-16 w-16 text-teal-700" aria-hidden="true" />
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
          "Odsyłasz klienta do lekarza po recept����"
        ],
        correctAnswer: 2,
        explanation: "Najlepszym podejściem jest zebranie dodatkowych informacji, które pomogą zidentyfikować lek. Kształt tabletki, dawka czy inne szczegó��y mogą być kluczowe.",
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
  },
  {
    id: 'compounding',
    name: 'Receptura i kontrola jakości',
    icon: <FlaskConical className="w-6 h-6" />,
    questions: [
      {
        text: 'Przed rozpoczęciem wykonania preparatu recepturowego zauważasz niezgodność jednostek. Co robisz?',
        options: ['Kontynuujesz i poprawiasz wynik później', 'Zatrzymujesz proces, ujednolicasz jednostki i dokumentujesz weryfikację', 'Zaokrąglasz wartość według uznania', 'Pytasz pacjenta o właściwą dawkę'],
        correctAnswer: 1,
        explanation: 'Niezgodne jednostki mogą zmienić dawkę wielokrotnie. Proces trzeba zatrzymać, sprawdzić źródło, obliczenia i procedurę, a następnie wykonać niezależną kontrolę.',
        simulation: () => <ComicSimulation situation="Farmaceuta zatrzymuje wykonanie receptury i sprawdza jednostki" />
      },
      {
        text: 'Który zestaw informacji powinien znaleźć się w dokumentacji serii?',
        options: ['Tylko nazwa preparatu', 'Numer serii, wersja receptury, źródło, operator i kontroler', 'Wyłącznie cena surowców', 'Sama data wydania'],
        correctAnswer: 1,
        explanation: 'Ślad audytowy pozwala odtworzyć decyzje i niezależną kontrolę. Kalkulator jest pomocą, a zwolnienie wymaga uprawnionej osoby i SOP.',
        simulation: () => <ComicSimulation situation="Druga osoba weryfikuje kartę serii przed zwolnieniem" />
      }
    ]
  }
]

const scenarioNamesEn: Record<string, string> = { 'Obsługa klienta': 'Customer service', 'Recepty': 'Prescriptions', 'Bezpieczeństwo w aptece': 'Pharmacy safety', 'Komunikacja z pacjentem': 'Patient communication', 'Receptura i kontrola jakości': 'Compounding and quality control' }
const scenarioTranslationsEn: Record<string, Array<{ text: string; options: string[]; explanation: string; situation: string }>> = {
  customer: [
    { text: 'A customer reports a persistent cough. What should you do first?', options: ['Offer an over-the-counter cough syrup', 'Ask about the cough and accompanying symptoms', 'Refer the customer to a doctor', 'Suggest saline inhalations'], explanation: 'First gather more information about the symptoms before recommending a solution or a medical consultation.', situation: 'A pharmacist discusses cough symptoms with a customer' },
    { text: 'A customer asks for a headache medicine but cannot remember the name. They say it is a white tablet in a blue package. What do you do?', options: ['Give the most popular painkiller', 'Show different packages and ask the customer to identify it', 'Ask for more details such as tablet shape or strength', 'Send the customer to a doctor for a prescription'], explanation: 'Additional details such as tablet shape, strength and packaging may help identify the medicine safely.', situation: 'A pharmacist shows different medicine packages to a customer' },
    { text: 'A customer takes several medicines and asks about a new product. How do you proceed?', options: ['Sell it without questions', 'Check medicines, allergies and refer to a pharmacist', 'Recommend a double dose', 'Ignore the question'], explanation: 'Reviewing medicines, allergies and contraindications helps reduce interaction risks.', situation: 'A pharmacist conducts a short customer interview' },
  ],
  prescription: [
    { text: 'You receive an e-prescription for a medicine that is out of stock. What do you do?', options: ['Tell the patient it is unavailable and send them away', 'Offer a substitute without consultation', 'Check availability at other pharmacies and inform the patient', 'Order it and ask the patient to return tomorrow'], explanation: 'Checking availability elsewhere can give the patient the fastest access to the prescribed medicine.', situation: 'A pharmacist checks medicine availability in the system' },
    { text: 'A patient asks about a substitute for a prescription medicine. What do you check?', options: ['Only the package colour', 'Active substance, strength and pharmaceutical form', 'The most expensive equivalent', 'Online opinions'], explanation: 'Substitution is assessed using the active substance, strength and pharmaceutical form.', situation: 'A pharmacist compares active substances and strengths' },
    { text: 'A patient reports an allergy after taking a new medicine. What is the appropriate response?', options: ['Ignore the symptoms', 'Recommend another dose', 'Assess severity and call for help for severe symptoms', 'Recommend any supplement'], explanation: 'Breathing difficulty, facial swelling or fainting require immediate medical help.', situation: 'A pharmacist recognizes symptoms requiring urgent help' },
  ],
  safety: [
    { text: 'A fire breaks out in the pharmacy. What should be your first response?', options: ['Leave the building immediately', 'Call the fire service', 'Evacuate customers and staff, then alert emergency services', 'Try to extinguish it yourself'], explanation: 'People come first: evacuate everyone and then alert emergency services.', situation: 'A pharmacist directs an evacuation' },
    { text: 'What do you do after an unknown substance spills in the pharmacy?', options: ['Clean it with bare hands', 'Secure the area and inform a supervisor', 'Pour it down the sink', 'Ignore the incident'], explanation: 'Secure the area, limit contact and follow the safety procedure.', situation: 'A staff member secures an incident area' },
    { text: 'Where do you store a medicine requiring protection from light?', options: ['On a windowsill', 'In its original packaging according to the leaflet', 'In an open container', 'Next to a heat source'], explanation: 'Original packaging and leaflet conditions protect medicine quality.', situation: 'A pharmacist checks storage conditions' },
  ],
  communication: [{ text: 'What is the best way to check whether a patient understood the instruction?', options: ['Ask them to repeat it in their own words', 'Speak faster', 'Hand over a leaflet without explanation', 'Assume everything is clear'], explanation: 'Teach-back confirms that the patient understands dosing and key warnings.', situation: 'A pharmacist asks a patient to repeat the instructions' }],
  compounding: [
    { text: 'Before compounding, you notice inconsistent units. What do you do?', options: ['Continue and correct the result later', 'Stop, standardize the units and document verification', 'Round the value as you see fit', 'Ask the patient for the correct dose'], explanation: 'Inconsistent units can change a dose substantially. Stop, verify the source and calculations, then perform an independent check.', situation: 'A pharmacist stops compounding to verify units' },
    { text: 'Which information should be included in batch documentation?', options: ['Only the preparation name', 'Batch number, formula version, source, operator and checker', 'Only raw-material prices', 'Only the release date'], explanation: 'An audit trail makes decisions and independent checks traceable.', situation: 'A second person verifies the batch record' },
  ],
}

const uiText = {
  pl: { home: 'Menu Główne', game: 'Gra', library: 'Biblioteka', lab: 'Laboratorium', pharmacy: 'Pracownia farmaceuty', wiki: 'Poradniki', results: 'Wyniki i odznaki', favorites: 'Ulubione', admin: 'Panel treści', chooseScenario: 'Wybierz scenariusz', gameMode: 'Tryb gry', chooseRhythm: 'Wybierz swój rytm nauki', modeHint: 'Każdy tryb zmienia sposób naliczania punktów.', classic: 'Klasyczny', speed: 'Turbo', streak: 'Seria', points: 'Punkty', progress: 'Postęp', streakLabel: 'Seria', previous: 'Poprzednie pytanie', submit: 'Zatwierdź odpowiedź', completed: 'Ukończony', notCompleted: 'Nieukończony', learn: 'Rozpocznij naukę', workbench: 'Otwórz pracownię', practice: 'Praktyka', compounding: 'Receptura', quality: 'Jakość', dashboard: 'Twój pulpit nauki', dashboardDescription: 'Wybierz ścieżkę i pracuj we własnym tempie. Aplikacja wspiera naukę, ale nie zastępuje aktualnych źródeł ani decyzji uprawnionego farmaceuty.', firstStep: 'Zacznij pierwszy', noResult: 'Brak wyniku', chooseModule: 'Wybierz moduł', completedScenarios: 'Ukończone scenariusze', learningProgress: 'Postęp nauki', knowledgeScore: 'Wynik wiedzy', nextStep: 'Następny krok', practiceDescription: 'Ćwicz wywiad, czerwone flagi i bezpieczne postępowanie.', compoundingDescription: 'Rozwijaj receptury i kalkulacje z kontrolą jednostek.', qualityDescription: 'Dokumentuj źródła, SOP, BUD i drugą kontrolę.', limitations: 'Transparentne ograniczenia', limitationsDescription: 'Aplikacja nie diagnozuje, nie dobiera samodzielnie terapii i nie zatwierdza preparatów do wydania. Każdy wynik wymaga oceny profesjonalisty i aktualnego źródła.', startGame: 'Rozpocznij grę', resultsLabel: 'Wyniki i odznaki', favoritesLabel: 'Ulubione' },
  en: { home: 'Home', game: 'Game', library: 'Library', lab: 'Laboratory', pharmacy: 'Pharmacy workbench', wiki: 'Guides', results: 'Results & badges', favorites: 'Favorites', admin: 'Content studio', chooseScenario: 'Choose a scenario', gameMode: 'Game mode', chooseRhythm: 'Choose your learning rhythm', modeHint: 'Each mode changes how points are awarded.', classic: 'Classic', speed: 'Turbo', streak: 'Streak', points: 'Points', progress: 'Progress', streakLabel: 'Streak', previous: 'Previous question', submit: 'Submit answer', completed: 'Completed', notCompleted: 'Not completed', learn: 'Start learning', workbench: 'Open workbench', practice: 'Practice', compounding: 'Compounding', quality: 'Quality', dashboard: 'Your learning dashboard', dashboardDescription: 'Choose a path and learn at your own pace. This app supports learning but does not replace current sources or a qualified pharmacist’s judgement.', firstStep: 'Start your first', noResult: 'No result yet', chooseModule: 'Choose a module', completedScenarios: 'Completed scenarios', learningProgress: 'Learning progress', knowledgeScore: 'Knowledge score', nextStep: 'Next step', practiceDescription: 'Practice interviews, red flags and safe decision-making.', compoundingDescription: 'Develop formulas and calculations with unit control.', qualityDescription: 'Document sources, SOPs, BUD and independent checks.', limitations: 'Transparent limitations', limitationsDescription: 'The app does not diagnose, independently select therapy or approve preparations for release. Every result requires professional review and a current source.', startGame: 'Start game', resultsLabel: 'Results & badges', favoritesLabel: 'Favorites' },
} as const

const Logo: React.FC<{ language?: 'pl' | 'en' }> = ({ language = 'pl' }) => (
  <div className="group flex items-center gap-3" aria-label={language === 'pl' ? 'Apteka na Czasie' : 'Pharmacy in Time'}>
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-700/20 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
      <FlaskConical className="h-6 w-6" strokeWidth={1.8} />
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-amber-300" aria-hidden="true" />
    </div>
    <div><span className="block text-lg font-bold tracking-tight text-teal-800 sm:text-xl">{language === 'pl' ? 'Apteka na Czasie' : 'Pharmacy in Time'}</span><span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600/80">{language === 'pl' ? 'nauka · praktyka · jakość' : 'learning · practice · quality'}</span></div>
  </div>
)

export default function EnhancedGame() {
  const [activeTab, setActiveTab] = useState('menu')
  const [language, setLanguage] = useState<'pl' | 'en'>('pl')
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const [isHydrated, setIsHydrated] = useState(false)
  const t = uiText[language]
  const trackModule = (module: string, action = 'open') => { void fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ module, action }) }) }
  const openModule = (module: string, tab: string) => { trackModule(module); setActiveTab(tab) }
  const submitMessage = async (kind: 'contact' | 'feedback' | 'test') => {
    setFormStatus({ type: 'sending', message: language === 'pl' ? 'Wysyłanie…' : 'Sending…' })
    const payload = kind === 'contact' ? { kind, ...contactForm } : kind === 'test' ? { kind, name: contactForm.name, email: contactForm.email } : { kind, ...feedbackForm }
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'send_failed')
      setFormStatus({ type: 'success', message: kind === 'test' ? (language === 'pl' ? 'Email testowy został wysłany. Sprawdź skrzynkę odbiorczą i spam.' : 'Test email sent. Check your inbox and spam.') : (language === 'pl' ? 'Wiadomość została wysłana.' : 'Message sent successfully.') })
      if (kind === 'contact') setContactForm({ name: '', email: '', subject: '', message: '' })
      else if (kind === 'feedback') setFeedbackForm({ rating: '5', improvement: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setFormStatus({ type: 'error', message: message || (language === 'pl' ? 'Nie udało się wysłać. Spróbuj ponownie.' : 'Could not send. Please try again.') })
    }
  }
  const localizeQuestion = (scenario: Scenario, index: number) => language === 'en' ? (scenarioTranslationsEn[scenario.id]?.[index] ?? scenario.questions[index]) : scenario.questions[index]
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([])
  const animatedScore = useCountUp(score)
  const animatedScenarios = useCountUp(completedScenarios.length)
  const animatedBadges = useCountUp(completedScenarios.length)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSimulation, setShowSimulation] = useState(false)
  const [gameMode, setGameMode] = useState<'classic' | 'speed' | 'streak'>('classic')
  const [streak, setStreak] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [legalSection, setLegalSection] = useState<'privacy' | 'cookies' | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [sessionUser, setSessionUser] = useState<{ name?: string; email?: string } | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [feedbackForm, setFeedbackForm] = useState({ rating: '5', improvement: '' })
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const [toastMessage, setToastMessage] = useState('')
  const showToast = (message: string) => { setToastMessage(message); window.setTimeout(() => setToastMessage(''), 2600) }
  
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
      setCompletedScenarios((items) => items.includes(currentScenario.id) ? items : [...items, currentScenario.id])
      showToast(language === 'pl' ? 'Postęp został zapisany.' : 'Progress saved.')
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
      showToast(language === 'pl' ? 'Receptura została zapisana.' : 'Recipe saved.')
      setLabRecipe({ name: '', ingredients: [], instructions: '' })
    }
  }

  const handleExperimentChange = (experimentName: string) => {
    const selectedExperiment = experiments.find(exp => exp.name === experimentName)
    setCurrentExperiment(selectedExperiment || null)
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSessionUser(data?.user ?? null)
      if (data?.user) fetch('/api/activity').then((response) => response.ok ? response.json() : null).then((payload) => setRecommendations(payload?.recommendations ?? []))
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229 && selectedAnswer !== null) {
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
      y: 12
    }
  }

  if (!isHydrated) {
    return <main className="min-h-screen bg-background px-6 py-8" aria-busy="true"><div className="mx-auto max-w-6xl space-y-5"><div className="h-16 w-full animate-pulse rounded-2xl bg-muted" /><div className="h-64 w-full animate-pulse rounded-[2rem] bg-muted" /><div className="grid gap-4 sm:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-muted" />)}</div><p className="text-center text-sm text-muted-foreground">{language === 'en' ? 'Loading learning workspace…' : 'Ładowanie przestrzeni nauki…'}</p></div></main>
  }

  return (
    <TooltipProvider>
<div className={`game-shell section-${activeTab} game-card-shine relative min-h-screen container mx-auto overflow-hidden px-4 py-5 text-foreground sm:px-6 lg:px-8 ${openSans.className}`} style={{ zoom: fontScale === 'xlarge' ? 1.2 : fontScale === 'large' ? 1.1 : 1 }}>
  <div className="sr-only" aria-live="polite">{language === 'pl' ? `Rozmiar tekstu: ${fontScale === 'normal' ? 'standardowy' : fontScale === 'large' ? 'duży' : 'bardzo duży'}` : `Text size: ${fontScale}`}</div>
  <AnimatePresence>{toastMessage && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status" className="fixed bottom-5 right-5 z-50 rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-900 shadow-xl">{toastMessage}</motion.div>}</AnimatePresence>
  <div className="pharmacy-atmosphere" aria-hidden="true"><span className="molecule molecule-one" /><span className="molecule molecule-two" /><span className="molecule molecule-three" /><span className="molecule molecule-four" /><span className="molecule molecule-five" /><span className="molecule molecule-six" /><span className="ambient-orb orb-one" /><span className="ambient-orb orb-two" /><span className="ambient-orb orb-three" /></div>
  <motion.header
          className="glass-panel mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:mb-8 sm:rounded-3xl sm:px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo language={language} />
          <h1 className="sr-only">{language === 'pl' ? 'Apteka na Czasie' : 'Pharmacy in Time'}</h1>
          <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')} aria-label="Change language" className="rounded-full font-semibold">{language === 'pl' ? 'EN' : 'PL'}</Button><div className="flex items-center gap-1 rounded-full border border-teal-200 bg-white/70 p-1" role="group" aria-label={language === 'pl' ? 'Rozmiar tekstu' : 'Text size'}><Button type="button" variant={fontScale === 'normal' ? 'default' : 'ghost'} size="sm" className="h-8 min-w-8 rounded-full px-2 text-xs" onClick={() => setFontScale('normal')} aria-pressed={fontScale === 'normal'} aria-label={language === 'pl' ? 'Standardowa czcionka' : 'Standard text'}>A</Button><Button type="button" variant={fontScale === 'large' ? 'default' : 'ghost'} size="sm" className="h-8 min-w-8 rounded-full px-2 text-sm" onClick={() => setFontScale('large')} aria-pressed={fontScale === 'large'} aria-label={language === 'pl' ? 'Duża czcionka' : 'Large text'}>A</Button><Button type="button" variant={fontScale === 'xlarge' ? 'default' : 'ghost'} size="sm" className="h-8 min-w-8 rounded-full px-2 text-base" onClick={() => setFontScale('xlarge')} aria-pressed={fontScale === 'xlarge'} aria-label={language === 'pl' ? 'Bardzo duża czcionka' : 'Extra large text'}>A</Button></div><Button variant="outline" size="sm" onClick={() => setAuthOpen(true)} className="rounded-full font-semibold">{sessionUser?.name ?? (language === 'pl' ? 'Konto' : 'Account')}</Button>
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
              {language === 'pl' ? 'Menu Główne' : 'Home'}
            </Button>
          </div>
        </motion.header>

        <Dialog open={authOpen} onOpenChange={setAuthOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>{language === 'pl' ? 'Twoje konto' : 'Your account'}</DialogTitle><DialogDescription>{language === 'pl' ? 'Zapisuj postęp, ulubione i personalizowane rekomendacje.' : 'Save progress, favorites and personalized recommendations.'}</DialogDescription></DialogHeader>{sessionUser ? <div className="space-y-4"><p className="text-sm text-muted-foreground">{sessionUser.email}</p><Button variant="outline" onClick={async () => { await authClient.signOut(); setSessionUser(null); setAuthOpen(false) }} className="w-full">{language === 'pl' ? 'Wyloguj się' : 'Sign out'}</Button></div> : <AuthPanel onSuccess={async () => { const { data } = await authClient.getSession(); setSessionUser(data?.user ?? null); setAuthOpen(false) }} />}</DialogContent></Dialog>

        {activeTab !== 'menu' && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50 via-white to-cyan-50 px-4 py-3 text-sm shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-teal-600 p-2 text-white"><ShieldCheck className="h-4 w-4" /></div><div><p className="font-semibold text-teal-900">{language === 'pl' ? 'Przestrzeń nauki i bezpiecznej praktyki' : 'Learning and safe-practice space'}</p><p className="text-xs text-slate-600">{language === 'pl' ? 'Każdy wynik wymaga aktualnego źródła, SOP i oceny farmaceuty.' : 'Every result requires a current source, SOP and pharmacist review.'}</p></div></div></motion.div>}

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
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative overflow-visible rounded-[2rem] bg-gradient-to-br from-teal-950 via-teal-800 to-cyan-700 px-6 py-10 text-white shadow-2xl shadow-teal-950/20 sm:px-10 sm:py-14">
                  <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" /><div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
                  <div className="relative max-w-3xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-50"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> {language === 'en' ? 'Learning, practice, responsibility' : 'Nauka, praktyka, odpowiedzialność'}</div><h2 className={`text-balance text-4xl font-bold tracking-tight sm:text-6xl ${roboto.className}`}>{language === 'en' ? 'Interactive Pharmacist Training Workspace' : 'Interaktywna pracownia szkoleniowa farmaceuty'}</h2><p className="mt-4 max-w-3xl whitespace-normal break-words text-base leading-relaxed text-teal-50 sm:text-lg">{language === 'en' ? 'A professional workspace for triage, compounding, calculations, quality controls and source-based decisions. Scenarios are an optional practice layer.' : 'Profesjonalne środowisko do triage, receptury, obliczeń, kontroli jakości i decyzji opartych na źródłach. Scenariusze są dodatkiem do praktyki.'}</p><div className="mt-8 flex flex-wrap items-center gap-3"><Button onClick={() => openModule('Pracownia farmaceuty', 'pharmacy')} className="hero-cta group h-12 rounded-full bg-amber-300 px-6 font-bold text-amber-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-1 hover:scale-105 hover:bg-amber-200"><ClipboardCheck className="mr-2 h-5 w-5 transition group-hover:scale-110" />{language === 'en' ? 'Open workspace' : 'Otwórz pracownię'}</Button><Button variant="outline" onClick={() => openModule('Gra', 'game')} className="h-12 rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white/20">{language === 'en' ? 'Practice scenarios' : 'Ćwicz scenariusze'}</Button></div></div>
                </motion.div>
                <CardHeader className="px-0 pb-3 pt-7"><CardTitle className="text-2xl text-teal-800">{t.dashboard}</CardTitle><CardDescription className="max-w-3xl text-base leading-relaxed">{t.dashboardDescription}</CardDescription></CardHeader>
                {sessionUser && recommendations.length > 0 && <div className="mb-5 rounded-2xl border border-teal-100 bg-teal-50/80 p-4"><p className="text-sm font-semibold text-teal-900">{language === 'en' ? 'Suggested from your activity' : 'Polecane na podstawie Twojej aktywności'}</p><div className="mt-3 flex flex-wrap gap-2">{recommendations.map((module) => <span key={module} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-teal-800 shadow-sm">{module}</span>)}</div></div>}
                <CardContent className="px-0">
                  <div className="mb-6 grid gap-3 sm:grid-cols-4">{[{label:t.learningProgress, value:animatedScenarios ? `${animatedScenarios} ${language === 'pl' ? 'ukończone' : 'completed'}` : t.firstStep, Icon:Target, tone:'text-teal-600'}, {label:t.completedScenarios, value:animatedScenarios || '0', Icon:ClipboardCheck, tone:'text-blue-600'}, {label:t.knowledgeScore, value:animatedScore ? `${animatedScore} ${language === 'pl' ? 'pkt' : 'pts'}` : t.noResult, Icon:Award, tone:'text-violet-600'}, {label:t.nextStep, value:t.chooseModule, Icon:Flame, tone:'text-orange-600'}].map(({label,value,Icon,tone}, index) => <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }} className="group rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition-shadow hover:shadow-lg"><div className="flex items-center justify-between"><Icon className={`h-5 w-5 ${tone} transition-transform group-hover:scale-110`} /><span className="text-xs font-medium text-slate-500">{label}</span></div><motion.p key={value} initial={{ scale: 0.8, color: '#0f766e' }} animate={{ scale: 1, color: '#0f172a' }} className="mt-3 text-2xl font-bold">{value}</motion.p></motion.div>)}</div>
                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    {[[t.practice, t.practiceDescription], [t.compounding, t.compoundingDescription], [t.quality, t.qualityDescription]].map(([title, description], index) => <motion.div key={title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4 shadow-sm transition-shadow hover:shadow-lg"><p className="font-semibold text-teal-800">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p></motion.div>)}
                  </div>
                  <Alert className="mb-5 border-amber-300 bg-amber-50 text-amber-950"><ShieldCheck className="size-4" /><AlertTitle>{t.limitations}</AlertTitle><AlertDescription>{t.limitationsDescription}</AlertDescription></Alert>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button onClick={() => setActiveTab('game')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <Building2 className="mr-2 h-6 w-6" />
                      {t.startGame}
                    </Button>
                    <Button onClick={() => setActiveTab('lab')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <Beaker className="mr-2 h-6 w-6" />
                      Laboratorium
                    </Button>
                    <Button onClick={() => setActiveTab('pharmacy')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <ClipboardCheck className="mr-2 h-6 w-6" />
                      Pracownia farmaceuty
                    </Button>
                    <Button onClick={() => setActiveTab('library')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <Book className="mr-2 h-6 w-6" />
                      Biblioteka
                    </Button>
                    <Button onClick={() => setActiveTab('howto')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <BookOpen className="mr-2 h-6 w-6" />
                      {t.wiki}
                    </Button>
                    <Button onClick={() => setActiveTab('results')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <Award className="mr-2 h-6 w-6" />
{t.resultsLabel}
                    </Button>
                    <Button onClick={() => { setLibraryQuery(''); setFavoritesOnly(true); setActiveTab('library') }} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
                      <Heart className="mr-2 h-6 w-6" />
                      {t.favoritesLabel} ({favorites.length})
                    </Button>
                    <Button onClick={() => setActiveTab('admin')} className="min-h-20 h-auto bg-white text-left text-teal-900 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-950 sm:h-24">
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
                    {currentScenario ? currentScenario.name : t.chooseScenario}
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
                            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">{t.gameMode}</p><h3 className="mt-1 text-xl font-bold">{t.chooseRhythm}</h3><p className="mt-1 text-sm text-teal-100">{t.modeHint}</p></div>
                            <div className="grid grid-cols-3 gap-2">
                              {[{id:'classic', label:t.classic, icon:<BookOpen className="h-4 w-4" />}, {id:'speed', label:t.speed, icon:<Zap className="h-4 w-4" />}, {id:'streak', label:t.streak, icon:<Flame className="h-4 w-4" />}].map((mode) => <button key={mode.id} type="button" onClick={() => setGameMode(mode.id as typeof gameMode)} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${gameMode === mode.id ? 'bg-white text-teal-800 shadow-lg' : 'bg-teal-950/30 text-teal-50 hover:bg-white/20'}`}>{mode.icon}<span>{mode.label}</span></button>)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{language === 'en' ? 'Choose a scenario to start. Each scenario develops skills for a different part of pharmacy practice.' : 'Wybierz scenariusz, aby rozpocząć grę. Każdy scenariusz pomoże Ci rozwinąć umiejętności w różnych aspektach pracy w aptece.'}</p>
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
                                    <span className="mt-2 text-xs text-center">{language === 'en' ? (scenarioNamesEn[scenario.name] ?? scenario.name) : scenario.name}</span>
                                    {completedScenarios.includes(scenario.id) && (
                                      <CheckCircle className="absolute top-1 right-1 w-4 h-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{completedScenarios.includes(scenario.id) ? 'Ukończony' : 'Nieuko��czony'}</p>
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
                          <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-300" /><span className="text-xs text-slate-300">{t.points}</span><strong>{score}</strong></div>
                          <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-300" /><span className="text-xs text-slate-300">{t.streakLabel}</span><strong>x{streak}</strong></div>
                          <div className="flex items-center gap-2"><Timer className="h-4 w-4 text-cyan-300" /><span className="text-xs text-slate-300">{t.progress}</span><strong>{currentQuestionIndex + 1}/{currentScenario.questions.length}</strong></div>
                        </div>
                        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div className="progress-animated h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / currentScenario.questions.length) * 100}%` }} transition={{ duration: 0.5 }} /></div>
                        <p className="text-lg font-semibold mb-4">{localizeQuestion(currentScenario, currentQuestionIndex).text}</p>
                        <RadioGroup onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                          {localizeQuestion(currentScenario, currentQuestionIndex).options.map((option, index) => (
                            <motion.div 
                              key={index} 
                              className={`answer-option flex items-center space-x-2 mb-2 rounded-xl border px-3 py-2 transition-all duration-200 ${selectedAnswer === index ? (showExplanation ? (index === currentScenario.questions[currentQuestionIndex].correctAnswer ? 'border-emerald-400 bg-emerald-50/70' : 'border-rose-400 bg-rose-50/70') : 'border-teal-400 bg-teal-50/70') : 'border-transparent'}`}
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
                            {t.previous}
                          </Button>
                          <Button 
                            onClick={handleAnswerSubmit} 
                            className="bg-teal-700 hover:bg-teal-800 text-white transition-colors duration-200"
                            disabled={selectedAnswer === null}
                          >
                            {t.submit}
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
                              <AlertDescription>{localizeQuestion(currentScenario, currentQuestionIndex).explanation}</AlertDescription>
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
                                    <DialogTitle>{language === 'en' ? 'Simulation' : 'Symulacja'}</DialogTitle>
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
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>{language === 'en' ? 'Laboratory' : 'Laboratorium'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recipe" className="w-full">
                    <TabsList>
                      <TabsTrigger value="recipe">{language === 'en' ? 'Formula' : 'Receptura'}</TabsTrigger>
                      <TabsTrigger value="experiment">{language === 'en' ? 'Experiments' : 'Eksperymenty'}</TabsTrigger>
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
                          <Label htmlFor="experiment-select">{language === 'en' ? 'Choose an experiment' : 'Wybierz eksperyment'}</Label>
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
              <PharmacyWorkbench language={language} />
            ) : activeTab === 'howto' ? (
              <HowToLibrary />
            ) : activeTab === 'library' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>{language === 'en' ? 'Knowledge library' : 'Biblioteka'}</CardTitle>
                </CardHeader>
  <CardContent>
  <HerbsMedicinesDatabase />
  <div className="mb-5 mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input aria-label="Szukaj w bibliotece" placeholder={language === 'en' ? 'Search by name or use...' : 'Szukaj po nazwie lub zastosowaniu...'} className="pl-9" value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} /></div>
                    <div className="flex flex-wrap gap-2"><Button variant={libraryType === 'all' ? 'default' : 'outline'} onClick={() => setLibraryType('all')}>{language === 'en' ? 'All' : 'Wszystko'}</Button><Button variant={libraryType === 'herb' ? 'default' : 'outline'} onClick={() => setLibraryType('herb')}>{language === 'en' ? 'Herbs' : 'Zioła'}</Button><Button variant={libraryType === 'medicine' ? 'default' : 'outline'} onClick={() => setLibraryType('medicine')}>{language === 'en' ? 'Medicines' : 'Leki'}</Button><Button variant={favoritesOnly ? 'default' : 'outline'} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart className="mr-1 h-4 w-4" />{language === 'en' ? 'Favorites' : 'Ulubione'}</Button></div>
                  </div>
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-500"><span><SlidersHorizontal className="mr-1 inline h-4 w-4" />{filteredLibrary.length} wyników z {herbsMedicines.length}</span><span><Heart className="mr-1 inline h-4 w-4" />{favorites.length} ulubionych</span></div>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredLibrary.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={item.name}>
                        <div className="flex items-center"><AccordionTrigger className="flex-1 text-left" onClick={() => setSelectedLibraryItem(item)}>{item.name}<span className="ml-2 text-xs text-gray-500">{item.type === 'herb' ? 'zioło' : 'lek'}</span></AccordionTrigger><Button aria-label={`Dodaj ${item.name} do ulubionych`} variant="ghost" size="icon" onClick={() => toggleFavorite(item.name)}><Heart className={`h-4 w-4 ${favorites.includes(item.name) ? 'fill-red-500 text-red-500' : ''}`} /></Button></div>
                        <AccordionContent><div className="space-y-2 text-sm leading-6"><p><strong>{language === 'en' ? 'Composition:' : 'Skład:'}</strong> {item.composition}</p><p><strong>{language === 'en' ? 'Uses:' : 'Zastosowanie:'}</strong> {item.usage}</p>{item.occurrence && <p><strong>{language === 'en' ? 'Occurrence:' : 'Występowanie:'}</strong> {item.occurrence}</p>}<p><strong>{language === 'en' ? 'Adverse effects:' : 'Działania niepożądane:'}</strong> {item.sideEffects}</p><p><strong>{language === 'en' ? 'Interactions:' : 'Interakcje:'}</strong> {item.interactions}</p><p className="mt-3 rounded-md bg-amber-50 p-3 text-amber-900"><ShieldCheck className="mr-1 inline h-4 w-4" />Informacje edukacyjne. Przed użyciem sprawdź ulotkę i skonsultuj się z farmaceutą.</p><p className="text-xs text-gray-500"><CalendarDays className="mr-1 inline h-3 w-3" />Zaktualizowano: sierpień 2026 · Źródła: ulotki leków, EMA, WHO</p></div></AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredLibrary.length === 0 && <p className="py-8 text-center text-gray-500">Nie znaleziono wpisów. Spróbuj innej nazwy.</p>}
                  {selectedLibraryItem && <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm"><strong>Wybrany wpis:</strong> {selectedLibraryItem.name}. Zapisz go w ulubionych, aby wrócić do niego później.</div>}
                </CardContent>
              </Card>
            ) : activeTab === 'admin' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader className="border-b border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50"><div className="mb-3 flex items-center gap-3"><div className="rounded-2xl bg-teal-700 p-3 text-white shadow-lg shadow-teal-700/20"><Settings className="h-6 w-6" /></div><div><CardTitle className={`text-2xl text-teal-800 ${roboto.className}`}>Panel treści</CardTitle><CardDescription>Centrum rozwoju scenariuszy, wiki, biblioteki i materiałów jakościowych.</CardDescription></div></div></CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <Alert className="border-teal-200 bg-teal-50"><ShieldCheck className="h-4 w-4" /><AlertTitle>Tryb demonstracyjny — gotowy do redakcji</AlertTitle><AlertDescription>Panel pokazuje zakres treści i prowadzi do modułów. Wersja produkcyjna powinna dodać role redaktora, recenzenta, publikację wersji i histori�� zmian.</AlertDescription></Alert>
                  <div className="grid gap-3 sm:grid-cols-4">{[{ Icon: Book, value: herbsMedicines.length, label: 'wpisów biblioteki' }, { Icon: Beaker, value: experiments.length, label: 'protokółów laboratorium' }, { Icon: Trophy, value: scenarios.length, label: 'scenariuszy' }, { Icon: FileText, value: scenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0), label: 'pytań quizowych' }].map(({ Icon: MetricIcon, value, label }) => <motion.div key={label} whileHover={{ y: -3 }} className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm"><MetricIcon className="mb-3 h-5 w-5 text-teal-600" /><strong className="text-2xl text-slate-900">{value}</strong><p className="text-xs text-slate-500">{label}</p></motion.div>)}</div>
                  <div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl border p-4"><p className="font-semibold text-slate-800">Scenariusze</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Triage, recepty, bezpieczeństwo, komunikacja oraz receptura i kontrola jakości.</p><Button size="sm" className="mt-4" onClick={() => setActiveTab('game')}>Otwórz ćwiczenia</Button></div><div className="rounded-2xl border p-4"><p className="font-semibold text-slate-800">Biblioteka</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Substancje, zioła, interakcje i ostrzeżenia do dalszej weryfikacji ze źródłem.</p><Button size="sm" variant="outline" className="mt-4" onClick={() => setActiveTab('library')}>Otwórz bibliotekę</Button></div><div className="rounded-2xl border p-4"><p className="font-semibold text-slate-800">Pracownia</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Kalkulacje, receptury, BUD, audyt i kontrola drugiej osoby.</p><Button size="sm" variant="outline" className="mt-4" onClick={() => setActiveTab('pharmacy')}>Otwórz pracownię</Button></div></div>
                  <a href="https://buymeacoffee.com/r0cs" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"><span><strong className="text-amber-950">Pomóż rozwijać bezpieczną edukację farmaceutyczną</strong><span className="mt-1 block text-xs text-amber-800">Każde wsparcie pomaga tworzyć kolejne scenariusze i materiały.</span><span className="mt-2 block text-xs font-semibold text-orange-700">buymeacoffee.com/r0cs</span></span><img src="/qr-code.png" alt="Kod QR do strony wsparcia" className="h-16 w-16 rounded-lg border-2 border-white bg-white p-1 shadow-sm transition group-hover:rotate-2" /></a>
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

        <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Kontakt i opinie">
          <Card className="border-teal-100 bg-white shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl text-teal-800"><Mail className="h-5 w-5" />Kontakt</CardTitle><CardDescription>Napisz do zespołu — odpowiemy na adres rocybersolutions@gmail.com.</CardDescription></CardHeader>
            <CardContent><form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void submitMessage('contact') }}>
              <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="contact-name">Imię</Label><Input id="contact-name" required value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} /></div><div><Label htmlFor="contact-email">Email</Label><Input id="contact-email" type="email" required value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} /></div></div>
              <div><Label htmlFor="contact-subject">Temat</Label><Input id="contact-subject" required value={contactForm.subject} onChange={(event) => setContactForm({ ...contactForm, subject: event.target.value })} /></div>
              <div><Label htmlFor="contact-message">Wiadomość</Label><textarea id="contact-message" required minLength={10} rows={4} className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} /></div>
              <div className="flex flex-wrap gap-2"><Button type="submit" disabled={formStatus.type === 'sending'}>{formStatus.type === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}</Button><Button type="button" variant="outline" disabled={formStatus.type === 'sending' || !contactForm.email} onClick={() => void submitMessage('test')}>Wyślij email testowy</Button></div>
            </form></CardContent>
          </Card>
          <Card className="border-amber-100 bg-amber-50/50 shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl text-amber-900"><MessageSquare className="h-5 w-5" />Twoja opinia</CardTitle><CardDescription>Oceń aplikację i napisz konkretnie, co możemy ulepszyć.</CardDescription></CardHeader>
            <CardContent><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void submitMessage('feedback') }}><fieldset><legend className="mb-2 text-sm font-medium">Jak oceniasz aplikację?</legend><RadioGroup value={feedbackForm.rating} onValueChange={(rating) => setFeedbackForm({ ...feedbackForm, rating })} className="flex flex-wrap gap-2">{['1','2','3','4','5'].map((rating) => <Label key={rating} htmlFor={`rating-${rating}`} className="flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm"><RadioGroupItem id={`rating-${rating}`} value={rating} />{rating}/5</Label>)}</RadioGroup></fieldset><div><Label htmlFor="feedback-improvement">Co możemy ulepszyć?</Label><textarea id="feedback-improvement" required minLength={10} rows={6} className="mt-1 flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" placeholder="Np. więcej scenariuszy, prostsza nawigacja…" value={feedbackForm.improvement} onChange={(event) => setFeedbackForm({ ...feedbackForm, improvement: event.target.value })} /></div><Button type="submit" disabled={formStatus.type === 'sending'} variant="outline" className="w-full border-amber-300 sm:w-auto">Wyślij opinię</Button></form></CardContent>
          </Card>
          {formStatus.message && <p role="status" className={`lg:col-span-2 rounded-lg p-3 text-sm ${formStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-800'}`}>{formStatus.message}</p>}
        </section>

        <footer className="mt-8 flex flex-col items-center gap-3 border-t border-teal-100 pt-6 text-center text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setLegalSection('privacy')}>Polityka prywatności</button><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setLegalSection('cookies')}>Polityka cookies</button><button type="button" className="text-teal-700 underline underline-offset-2" onClick={() => setActiveTab('pharmacy')}>Pracownia farmaceuty</button></div>
          <p>Aplikację stworzył <strong>Roman Orłowski</strong> · <a className="text-teal-700 underline" href="mailto:rocybersolutions@gmail.com">rocybersolutions@gmail.com</a></p>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500">Aplikacja korzysta z niezbędnych mechanizmów technicznych do działania interfejsu. Nie sprzedajemy danych użytkowników ani nie wykorzystujemy formularzy do identyfikacji pacjentów.</p>
        </footer>

        <Dialog open={legalSection !== null} onOpenChange={(open) => !open && setLegalSection(null)}>
          <DialogContent className="max-h-[82vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{legalSection === 'privacy' ? 'Polityka prywatności' : 'Polityka cookies'}</DialogTitle><DialogDescription>Informacje dla użytkowników aplikacji Apteka na Czasie. Ostatnia aktualizacja: 18 września 2026 r.</DialogDescription></DialogHeader>
            {legalSection === 'privacy' ? <div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><section><h3 className="font-semibold text-foreground">1. Administrator i kontakt</h3><p>Administratorem aplikacji jest Roman Orłowski. Kontakt: rocybersolutions@gmail.com. W sprawach prywatności użytkownik może skontaktować się pod tym adresem.</p></section><section><h3 className="font-semibold text-foreground">2. Jakie dane przetwarzamy</h3><p>Aplikacja jest zaprojektowana tak, aby nie wymagać danych identyfikuj��cych pacjentów. Nie wpisuj imienia, nazwiska, PESEL, adresu ani innych danych pozwalających zidentyfikować osobę. Dane wpisywane do lokalnych formularzy mogą pozostać w pamięci bieżącej sesji przeglądarki.</p></section><section><h3 className="font-semibold text-foreground">3. Cel i bezpieczeństwo</h3><p>Dane służą do działania kalkulatorów, ćwiczeń, receptur i dokumentacji kontroli. Dane przesyłane do funkcji audytu powinny zawierać wyłącznie informacje zawodowe, takie jak numer serii, SOP, wersja receptury i identyfikatory operatorów zgodne z procedurą apteki.</p></section><section><h3 className="font-semibold text-foreground">4. Prawa i ograniczenia</h3><p>Użytkownik może skontaktować się w sprawie dostępu, poprawienia lub usunięcia danych technicznych. Aplikacja nie jest systemem EDM ani dokumentacją medyczną. Przed użyciem zawodowym należy przeprowadzić własną ocenę prawną, organizacyjną i bezpieczeństwa.</p></section><section><h3 className="font-semibold text-foreground">5. Zmiany</h3><p>Polityka może być aktualizowana wraz ze zmianami aplikacji, integracji i przepisów. Data aktualizacji jest widoczna w tym dokumencie.</p></section></div> : <div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><section><h3 className="font-semibold text-foreground">1. Czym są cookies</h3><p>Cookies to małe pliki lub podobne mechanizmy zapisywane przez przeglądarkę. Mogą być niezbędne do zapamiętania ustawień interfejsu i prawidłowego działania sesji.</p></section><section><h3 className="font-semibold text-foreground">2. Jakich mechanizmów używamy</h3><p>Używamy niezbędnych mechanizmów aplikacji, ustawień motywu oraz narzędzi analitycznych dostawcy hostingu, jeżeli są aktywne w danym środowisku. Zewnętrzny przycisk wsparcia może korzystać z własnych mechanizmów cookies zgodnie z polityką swojego dostawcy.</p></section><section><h3 className="font-semibold text-foreground">3. Zarządzanie</h3><p>Możesz usunąć lub zablokować cookies w ustawieniach przeglądarki. Zablokowanie niektórych mechanizmów może ograniczyć działanie aplikacji. Nie używamy cookies do przechowywania danych pacjenta.</p></section><section><h3 className="font-semibold text-foreground">4. Kontakt</h3><p>Jeśli masz pytania dotyczące cookies lub prywatności, napisz na rocybersolutions@gmail.com.</p></section></div>}
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
