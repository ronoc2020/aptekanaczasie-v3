import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Clock, Home, Building2, FileText, Flame, Activity, Stethoscope, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, Beaker, Pill, Thermometer, Scale, Book, Leaf } from 'lucide-react'
import confetti from 'canvas-confetti'

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
  // ... (add at least 95 more items to reach a total of 100 or more)
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
  // ... (add more experiments)
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
  // ... (add more recipes)
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
      // ... (add more questions)
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
      // ... (add more questions)
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
      // ... (add more questions)
    ]
  },
  // ... (add more scenarios)
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
  
  const [labRecipe, setLabRecipe] = useState<Recipe>({ name: '', ingredients: [], instructions: '' })
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({ name: '', weight: 0 })
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setFeedback('')
    setShowExplanation(false)
    setIsCorrect(null)
    setShowSimulation(false)
    setActiveTab('game')
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentScenario) return

    const currentQuestion = currentScenario.questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer

    setIsCorrect(correct)
    if (correct) {
      setScore(score + 10)
      setFeedback('Poprawna odpowiedź! +10 punktów')
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
      <div className={`container mx-auto p-4 ${openSans.className}`} style={{ backgroundColor: '#F0F4F8' }}>
        <motion.header 
          className="mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
          <h1 className={`text-4xl font-bold text-teal-700 ${roboto.className}`}>Apteka na Czasie</h1>
          <Button
            onClick={() => setActiveTab('menu')}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Menu Główne
          </Button>
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setActiveTab('game')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Building2 className="mr-2 h-6 w-6" />
                      Rozpocznij Grę
                    </Button>
                    <Button onClick={() => setActiveTab('lab')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Beaker className="mr-2 h-6 w-6" />
                      Laboratorium
                    </Button>
                    <Button onClick={() => setActiveTab('library')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Book className="mr-2 h-6 w-6" />
                      Biblioteka
                    </Button>
                    <Button onClick={() => setActiveTab('results')} className="h-24 bg-teal-500 hover:bg-teal-600 text-white">
                      <Award className="mr-2 h-6 w-6" />
                      Wyniki
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
                        <p className="text-gray-700 mb-4">
                          Wybierz scenariusz, aby rozpocząć grę. Każdy scenariusz pomoże Ci rozwinąć umiejętności w różnych aspektach pracy w aptece.
                        </p>
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
            ) : activeTab === 'library' ? (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl text-teal-700 ${roboto.className}`}>Biblioteka</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {herbsMedicines.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.name}</AccordionTrigger>
                        <AccordionContent>
                          <p><strong>Typ:</strong> {item.type === 'herb' ? 'Zioło' : 'Lek'}</p>
                          <p><strong>Skład:</strong> {item.composition}</p>
                          <p><strong>Zastosowanie:</strong> {item.usage}</p>
                          {item.occurrence && <p><strong>Występowanie:</strong> {item.occurrence}</p>}
                          <p><strong>Skutki uboczne:</strong> {item.sideEffects}</p>
                          <p><strong>Interakcje:</strong> {item.interactions}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
                    <Progress value={progress} className="h-2 bg-teal-200" indicatorClassName="bg-teal-500" />
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
