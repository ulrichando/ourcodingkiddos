"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Gamepad2,
  ClipboardList,
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Target,
  Award,
  ChevronLeft,
  Code2,
  Rocket,
  Medal,
  XCircle,
  RotateCcw,
  Home,
  Flame,
  Timer,
  AlertCircle,
  Share2,
  Download,
  TrendingUp,
} from "lucide-react";

// Question types
type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  explanation?: string;
  codeSnippet?: string;
  timeLimit: number; // seconds per question
};

// Gamified challenge types
type Challenge = {
  id: number;
  type: "drag-drop" | "fill-blank" | "debug" | "sequence" | "match";
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  timeLimit: number;
  content: any;
};

// Multiple Choice Questions Database with time limits
const multipleChoiceQuestions: Question[] = [
  // Beginner Questions (1-10) - 30 seconds each
  {
    id: 1,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language"],
    correct: 0,
    difficulty: "beginner",
    category: "Web Basics",
    timeLimit: 30,
  },
  {
    id: 2,
    question: "Which symbol is used to start a comment in Python?",
    options: ["//", "#", "/*", "--"],
    correct: 1,
    difficulty: "beginner",
    category: "Python",
    timeLimit: 30,
  },
  {
    id: 3,
    question: "What is a variable in programming?",
    options: ["A type of computer", "A container that stores data", "A programming language", "A website"],
    correct: 1,
    difficulty: "beginner",
    category: "Fundamentals",
    timeLimit: 30,
  },
  {
    id: 4,
    question: "Which of these is NOT a programming language?",
    options: ["Python", "JavaScript", "HTML", "Microsoft Word"],
    correct: 3,
    difficulty: "beginner",
    category: "Fundamentals",
    timeLimit: 30,
  },
  {
    id: 5,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
    correct: 1,
    difficulty: "beginner",
    category: "Web Basics",
    timeLimit: 30,
  },
  {
    id: 6,
    question: "In Scratch, what block makes a sprite move?",
    options: ["say block", "move block", "wait block", "repeat block"],
    correct: 1,
    difficulty: "beginner",
    category: "Scratch",
    timeLimit: 30,
  },
  {
    id: 7,
    question: "What is the output of: print('Hello World')?",
    options: ["Hello World", "print Hello World", "Error", "'Hello World'"],
    correct: 0,
    difficulty: "beginner",
    category: "Python",
    timeLimit: 30,
  },
  {
    id: 8,
    question: "Which tag is used for the largest heading in HTML?",
    options: ["<h6>", "<heading>", "<h1>", "<head>"],
    correct: 2,
    difficulty: "beginner",
    category: "Web Basics",
    timeLimit: 30,
  },
  {
    id: 9,
    question: "What is a loop in programming?",
    options: ["A type of error", "Code that repeats multiple times", "A programming language", "A variable type"],
    correct: 1,
    difficulty: "beginner",
    category: "Fundamentals",
    timeLimit: 30,
  },
  {
    id: 10,
    question: "What color do you get mixing RGB(255, 0, 0)?",
    options: ["Blue", "Green", "Red", "Yellow"],
    correct: 2,
    difficulty: "beginner",
    category: "Web Basics",
    timeLimit: 30,
  },
  // Intermediate Questions (11-20) - 45 seconds each
  {
    id: 11,
    question: "What is the result of: 10 % 3 in most programming languages?",
    options: ["3", "1", "3.33", "0"],
    correct: 1,
    difficulty: "intermediate",
    category: "Fundamentals",
    explanation: "The % operator returns the remainder of division. 10 ÷ 3 = 3 remainder 1",
    timeLimit: 45,
  },
  {
    id: 12,
    question: "Which CSS property changes text color?",
    options: ["text-color", "font-color", "color", "text-style"],
    correct: 2,
    difficulty: "intermediate",
    category: "CSS",
    timeLimit: 45,
  },
  {
    id: 13,
    question: "What does the 'if' statement do?",
    options: ["Creates a loop", "Makes a decision based on a condition", "Defines a variable", "Prints output"],
    correct: 1,
    difficulty: "intermediate",
    category: "Fundamentals",
    timeLimit: 45,
  },
  {
    id: 14,
    question: "In JavaScript, which method adds an element to the end of an array?",
    options: ["add()", "push()", "append()", "insert()"],
    correct: 1,
    difficulty: "intermediate",
    category: "JavaScript",
    timeLimit: 45,
  },
  {
    id: 15,
    question: "What is a function in programming?",
    options: ["A type of variable", "Reusable block of code that performs a task", "A loop that never ends", "A type of error"],
    correct: 1,
    difficulty: "intermediate",
    category: "Fundamentals",
    timeLimit: 45,
  },
  {
    id: 16,
    question: "What will this Python code print? x = [1, 2, 3]; print(x[1])",
    options: ["1", "2", "3", "Error"],
    correct: 1,
    difficulty: "intermediate",
    category: "Python",
    codeSnippet: "x = [1, 2, 3]\nprint(x[1])",
    timeLimit: 45,
  },
  {
    id: 17,
    question: "Which HTML tag creates a clickable link?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correct: 1,
    difficulty: "intermediate",
    category: "Web Basics",
    timeLimit: 45,
  },
  {
    id: 18,
    question: "What is the purpose of a 'while' loop?",
    options: ["To run code once", "To run code while a condition is true", "To define a function", "To create a variable"],
    correct: 1,
    difficulty: "intermediate",
    category: "Fundamentals",
    timeLimit: 45,
  },
  {
    id: 19,
    question: "In CSS, what does 'margin: 0 auto' do?",
    options: ["Makes text bold", "Centers an element horizontally", "Adds a border", "Changes the font"],
    correct: 1,
    difficulty: "intermediate",
    category: "CSS",
    timeLimit: 45,
  },
  {
    id: 20,
    question: "What is a boolean value?",
    options: ["A decimal number", "True or False", "A text string", "A list of items"],
    correct: 1,
    difficulty: "intermediate",
    category: "Fundamentals",
    timeLimit: 45,
  },
  // Advanced Questions (21-30) - 60 seconds each
  {
    id: 21,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    difficulty: "advanced",
    category: "Algorithms",
    timeLimit: 60,
  },
  {
    id: 22,
    question: "What is recursion?",
    options: ["A loop that counts down", "A function that calls itself", "A type of variable", "An error in code"],
    correct: 1,
    difficulty: "advanced",
    category: "Fundamentals",
    timeLimit: 60,
  },
  {
    id: 23,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Automated Program Integration", "Application Process Integration", "Advanced Programming Interface"],
    correct: 0,
    difficulty: "advanced",
    category: "Concepts",
    timeLimit: 60,
  },
  {
    id: 24,
    question: "In JavaScript, what is a Promise?",
    options: ["A guarantee the code will work", "An object representing eventual completion of an async operation", "A type of loop", "A function declaration"],
    correct: 1,
    difficulty: "advanced",
    category: "JavaScript",
    timeLimit: 60,
  },
  {
    id: 25,
    question: "What is the output? console.log(typeof [])",
    options: ["array", "object", "list", "undefined"],
    correct: 1,
    difficulty: "advanced",
    category: "JavaScript",
    codeSnippet: "console.log(typeof [])",
    timeLimit: 60,
  },
  {
    id: 26,
    question: "What is a database index used for?",
    options: ["Storing images", "Speeding up data retrieval", "Creating backups", "Designing UI"],
    correct: 1,
    difficulty: "advanced",
    category: "Databases",
    timeLimit: 60,
  },
  {
    id: 27,
    question: "What does 'git merge' do?",
    options: ["Deletes a branch", "Combines changes from different branches", "Creates a new repository", "Uploads code to the internet"],
    correct: 1,
    difficulty: "advanced",
    category: "Git",
    timeLimit: 60,
  },
  {
    id: 28,
    question: "What is the difference between == and === in JavaScript?",
    options: ["No difference", "=== checks type and value, == only checks value", "== is faster", "=== is deprecated"],
    correct: 1,
    difficulty: "advanced",
    category: "JavaScript",
    timeLimit: 60,
  },
  {
    id: 29,
    question: "What is a closure in JavaScript?",
    options: ["A way to close a program", "A function with access to its outer scope", "A type of error", "A loop terminator"],
    correct: 1,
    difficulty: "advanced",
    category: "JavaScript",
    timeLimit: 60,
  },
  {
    id: 30,
    question: "What HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    correct: 2,
    difficulty: "advanced",
    category: "Web Concepts",
    timeLimit: 60,
  },
];

// Gamified Challenges Database
const gamifiedChallenges: Challenge[] = [
  {
    id: 1,
    type: "sequence",
    title: "Build a Website!",
    description: "Put the steps in the correct order to create a basic webpage",
    difficulty: "beginner",
    points: 100,
    timeLimit: 60,
    content: {
      items: ["Create an HTML file", "Add <html> tags", "Add <head> and <body>", "Write content in <body>", "Save and open in browser"],
      correctOrder: [0, 1, 2, 3, 4],
    },
  },
  {
    id: 2,
    type: "match",
    title: "Match the Code!",
    description: "Match each programming term with its meaning",
    difficulty: "beginner",
    points: 100,
    timeLimit: 45,
    content: {
      pairs: [
        { term: "Variable", definition: "Stores data" },
        { term: "Loop", definition: "Repeats code" },
        { term: "Function", definition: "Reusable code block" },
        { term: "String", definition: "Text data" },
      ],
    },
  },
  {
    id: 3,
    type: "fill-blank",
    title: "Complete the Code!",
    description: "Fill in the blank to make the code work",
    difficulty: "beginner",
    points: 100,
    timeLimit: 30,
    content: {
      code: "print('Hello ___!')",
      blank: "World",
      options: ["World", "Code", "Python", "Computer"],
      correctIndex: 0,
    },
  },
  {
    id: 4,
    type: "debug",
    title: "Bug Hunter!",
    description: "Find and fix the bug in this code",
    difficulty: "intermediate",
    points: 200,
    timeLimit: 90,
    content: {
      buggyCode: "for i in range(5)\n  print(i)",
      hint: "Something is missing at the end of line 1",
      correctFix: "for i in range(5):\n  print(i)",
      options: ["Add a colon (:) after range(5)", "Change range to Range", "Add parentheses around i", "Remove the indentation"],
      correctIndex: 0,
    },
  },
  {
    id: 5,
    type: "sequence",
    title: "Algorithm Builder!",
    description: "Put the steps in order to make a PB&J sandwich (like a computer would)",
    difficulty: "intermediate",
    points: 200,
    timeLimit: 75,
    content: {
      items: ["Get two slices of bread", "Open the peanut butter jar", "Spread peanut butter on one slice", "Open the jelly jar", "Spread jelly on the other slice", "Put the slices together"],
      correctOrder: [0, 1, 2, 3, 4, 5],
    },
  },
  {
    id: 6,
    type: "fill-blank",
    title: "Function Master!",
    description: "Complete the function to add two numbers",
    difficulty: "intermediate",
    points: 200,
    timeLimit: 45,
    content: {
      code: "def add(a, b):\n  ___ a + b",
      blank: "return",
      options: ["return", "print", "give", "output"],
      correctIndex: 0,
    },
  },
  {
    id: 7,
    type: "debug",
    title: "Advanced Bug Hunt!",
    description: "This recursive function has a bug. Find it!",
    difficulty: "advanced",
    points: 300,
    timeLimit: 120,
    content: {
      buggyCode: "def factorial(n):\n  if n == 0:\n    return 1\n  return n * factorial(n)",
      hint: "The recursive call should move towards the base case",
      correctFix: "def factorial(n):\n  if n == 0:\n    return 1\n  return n * factorial(n - 1)",
      options: ["Change factorial(n) to factorial(n - 1)", "Change return 1 to return 0", "Add another if statement", "Remove the base case"],
      correctIndex: 0,
    },
  },
  {
    id: 8,
    type: "match",
    title: "Big O Matching!",
    description: "Match each algorithm with its time complexity",
    difficulty: "advanced",
    points: 300,
    timeLimit: 60,
    content: {
      pairs: [
        { term: "Binary Search", definition: "O(log n)" },
        { term: "Linear Search", definition: "O(n)" },
        { term: "Bubble Sort", definition: "O(n²)" },
        { term: "Hash Table Lookup", definition: "O(1)" },
      ],
    },
  },
  {
    id: 9,
    type: "sequence",
    title: "API Request Flow!",
    description: "Order the steps of making an API request",
    difficulty: "advanced",
    points: 300,
    timeLimit: 90,
    content: {
      items: ["Client sends HTTP request", "DNS resolves domain to IP", "Server processes request", "Server sends response", "Client receives and parses data"],
      correctOrder: [0, 1, 2, 3, 4],
    },
  },
];

// Level determination
const determineLevel = (score: number, totalQuestions: number) => {
  const percentage = (score / totalQuestions) * 100;
  if (percentage >= 85) {
    return { level: "Advanced", color: "from-purple-500 to-pink-500", icon: Trophy, message: "Outstanding! You have strong programming skills!", recommendation: "You're ready for advanced topics like algorithms, data structures, and full-stack development." };
  } else if (percentage >= 65) {
    return { level: "Intermediate", color: "from-blue-500 to-cyan-500", icon: Star, message: "Great job! You have a solid foundation!", recommendation: "You're ready to dive deeper into programming concepts and build real projects." };
  } else if (percentage >= 40) {
    return { level: "Beginner+", color: "from-emerald-500 to-green-500", icon: Zap, message: "Good start! You know the basics!", recommendation: "Focus on strengthening fundamentals with our beginner courses." };
  } else {
    return { level: "Beginner", color: "from-amber-500 to-orange-500", icon: Rocket, message: "Welcome to coding! Everyone starts here!", recommendation: "Start with our fun introductory courses using Scratch or basic Python." };
  }
};

// Timer Hook
function useTimer(initialTime: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) {
        onTimeUp();
        setIsRunning(false);
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isRunning, onTimeUp]);

  const stopTimer = () => setIsRunning(false);
  const resetTimer = (newTime: number) => {
    setTimeLeft(newTime);
    setIsRunning(true);
  };

  return { timeLeft, stopTimer, resetTimer, isRunning };
}

// Timer Display Component
function TimerDisplay({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isCritical ? "bg-red-100 dark:bg-red-900/30 animate-pulse" : isLow ? "bg-amber-100 dark:bg-amber-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
      <Timer className={`w-5 h-5 ${isCritical ? "text-red-500" : isLow ? "text-amber-500" : "text-slate-500"}`} />
      <span className={`font-mono font-bold text-lg ${isCritical ? "text-red-600 dark:text-red-400" : isLow ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-200"}`}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </span>
      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// Streak Display Component
function StreakDisplay({ streak, maxStreak }: { streak: number; maxStreak: number }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${streak >= 3 ? "bg-orange-100 dark:bg-orange-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
      <Flame className={`w-5 h-5 ${streak >= 5 ? "text-red-500 animate-bounce" : streak >= 3 ? "text-orange-500" : "text-slate-400"}`} />
      <span className={`font-bold ${streak >= 3 ? "text-orange-600 dark:text-orange-400" : "text-slate-600 dark:text-slate-400"}`}>
        {streak} streak
      </span>
      {streak >= 3 && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">+{streak * 10} bonus!</span>}
    </div>
  );
}

// Test Type Selection Component
function TestTypeSelection({ onSelect }: { onSelect: (type: "multiple-choice" | "gamified") => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-6">
            <Brain className="w-4 h-4" />
            Placement Exam
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Discover Your <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Coding Level</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Take a quick assessment to find out which courses are perfect for you. Choose your preferred test style below!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button onClick={() => onSelect("multiple-choice")} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-1 hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-2 text-left">
            <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-8">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Multiple Choice</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Classic quiz format with 15 questions covering programming fundamentals, web development, and logic.</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Timer className="w-4 h-4" /><span>Timed questions (30-60s each)</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Flame className="w-4 h-4" /><span>Streak bonuses</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Target className="w-4 h-4" /><span>Instant results & certificate</span></div>
              </div>
              <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">Start Quiz <ArrowRight className="w-5 h-5" /></span>
            </div>
          </button>

          <button onClick={() => onSelect("gamified")} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-1 hover:shadow-2xl hover:shadow-violet-500/25 transition-all hover:-translate-y-2 text-left">
            <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-8">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Gamified Challenge</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Fun interactive challenges including puzzles, code debugging, and drag-and-drop activities!</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Timer className="w-4 h-4" /><span>Timed challenges</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Sparkles className="w-4 h-4" /><span>9 interactive challenges</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Trophy className="w-4 h-4" /><span>Earn points & badges</span></div>
              </div>
              <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold group-hover:gap-3 transition-all">Start Challenge <ArrowRight className="w-5 h-5" /></span>
            </div>
          </button>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Award className="w-5 h-5 text-violet-500" />Why take the placement exam?</h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" /><span>Get personalized course recommendations based on your skill level</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" /><span>Skip content you already know and jump into the right level</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" /><span>Earn a STEM-certified digital certificate to share</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Multiple Choice Exam Component with Timer and Streak
function MultipleChoiceExam({ onComplete }: { onComplete: (score: number, total: number, answers: any[], streak: number, bonusPoints: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; selected: number; correct: boolean; timeBonus: number }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  const selectedQuestions = [
    ...multipleChoiceQuestions.filter((q) => q.difficulty === "beginner").slice(0, 5),
    ...multipleChoiceQuestions.filter((q) => q.difficulty === "intermediate").slice(0, 5),
    ...multipleChoiceQuestions.filter((q) => q.difficulty === "advanced").slice(0, 5),
  ];

  const question = selectedQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;

  const handleTimeUp = useCallback(() => {
    if (showFeedback) return;
    // Auto-submit wrong answer when time runs out
    const newAnswers = [...answers, { questionId: question.id, selected: -1, correct: false, timeBonus: 0 }];
    setAnswers(newAnswers);
    setStreak(0);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < selectedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const score = newAnswers.filter((a) => a.correct).length;
        onComplete(score, selectedQuestions.length, newAnswers, maxStreak, bonusPoints);
      }
    }, 1500);
  }, [answers, bonusPoints, currentQuestion, maxStreak, onComplete, question?.id, selectedQuestions.length, showFeedback]);

  const { timeLeft, stopTimer, resetTimer } = useTimer(question?.timeLimit || 30, handleTimeUp);

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    stopTimer();

    const isCorrect = selectedAnswer === question.correct;
    const timeBonus = isCorrect ? Math.floor((timeLeft / question.timeLimit) * 20) : 0;
    const newStreak = isCorrect ? streak + 1 : 0;
    const streakBonus = isCorrect && newStreak >= 3 ? newStreak * 10 : 0;

    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);
    setBonusPoints(bonusPoints + timeBonus + streakBonus);

    const newAnswers = [...answers, { questionId: question.id, selected: selectedAnswer, correct: isCorrect, timeBonus }];
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < selectedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        resetTimer(selectedQuestions[currentQuestion + 1].timeLimit);
      } else {
        const score = newAnswers.filter((a) => a.correct).length;
        onComplete(score, selectedQuestions.length, newAnswers, maxStreak > newStreak ? maxStreak : newStreak, bonusPoints + timeBonus + streakBonus);
      }
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
      case "intermediate": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "advanced": return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Timer and Streak */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TimerDisplay timeLeft={timeLeft} maxTime={question.timeLimit} />
            <StreakDisplay streak={streak} maxStreak={maxStreak} />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">{bonusPoints} bonus pts</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Question {currentQuestion + 1} of {selectedQuestions.length}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>{question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="mb-4">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{question.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">{question.question}</h2>
          {question.codeSnippet && (
            <pre className="mb-6 p-4 bg-slate-900 text-slate-100 rounded-xl text-sm font-mono overflow-x-auto">{question.codeSnippet}</pre>
          )}

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => {
              let optionClass = "border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500";
              if (showFeedback) {
                if (index === question.correct) {
                  optionClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
                } else if (index === selectedAnswer && index !== question.correct) {
                  optionClass = "border-red-500 bg-red-50 dark:bg-red-900/30";
                }
              } else if (selectedAnswer === index) {
                optionClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/30";
              }

              return (
                <button key={index} onClick={() => handleSelectAnswer(index)} disabled={showFeedback} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${showFeedback && index === question.correct ? "bg-emerald-500 text-white" : showFeedback && index === selectedAnswer ? "bg-red-500 text-white" : selectedAnswer === index ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{option}</span>
                    {showFeedback && index === question.correct && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
                    {showFeedback && index === selectedAnswer && index !== question.correct && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && question.explanation && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300"><strong>Explanation:</strong> {question.explanation}</p>
            </div>
          )}

          <button onClick={handleSubmitAnswer} disabled={selectedAnswer === null || showFeedback} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedAnswer === null || showFeedback ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:-translate-y-0.5"}`}>
            {showFeedback ? "Loading next question..." : currentQuestion === selectedQuestions.length - 1 ? "Finish Exam" : "Submit Answer"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Current Score: <span className="font-bold text-slate-700 dark:text-slate-200">{answers.filter((a) => a.correct).length}</span> / {answers.length}</p>
        </div>
      </div>
    </div>
  );
}

// Gamified Exam Component with Timer
function GamifiedExam({ onComplete }: { onComplete: (score: number, total: number, results: any[]) => void }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [results, setResults] = useState<{ challengeId: number; points: number; maxPoints: number }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [challengeKey, setChallengeKey] = useState(0);

  const challenge = gamifiedChallenges[currentChallenge];
  const totalMaxPoints = gamifiedChallenges.reduce((sum, c) => sum + c.points, 0);

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    handleChallengeComplete(0);
  }, [showResult]);

  const { timeLeft, stopTimer, resetTimer } = useTimer(challenge?.timeLimit || 60, handleTimeUp);

  const handleChallengeComplete = (earnedPoints: number) => {
    stopTimer();
    const newResults = [...results, { challengeId: challenge.id, points: earnedPoints, maxPoints: challenge.points }];
    setResults(newResults);
    setTotalPoints(totalPoints + earnedPoints);
    setIsCorrect(earnedPoints > 0);
    setShowResult(true);

    setTimeout(() => {
      if (currentChallenge < gamifiedChallenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setShowResult(false);
        setChallengeKey((k) => k + 1);
        resetTimer(gamifiedChallenges[currentChallenge + 1].timeLimit);
      } else {
        const finalPoints = totalPoints + earnedPoints;
        onComplete(finalPoints, totalMaxPoints, newResults);
      }
    }, 2000);
  };

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < count ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />);
  };

  const renderChallenge = () => {
    switch (challenge.type) {
      case "fill-blank": return <FillBlankChallenge key={challengeKey} challenge={challenge} onComplete={handleChallengeComplete} disabled={showResult} />;
      case "match": return <MatchChallenge key={challengeKey} challenge={challenge} onComplete={handleChallengeComplete} disabled={showResult} />;
      case "sequence": return <SequenceChallenge key={challengeKey} challenge={challenge} onComplete={handleChallengeComplete} disabled={showResult} />;
      case "debug": return <DebugChallenge key={challengeKey} challenge={challenge} onComplete={handleChallengeComplete} disabled={showResult} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">Challenge {currentChallenge + 1} of {gamifiedChallenges.length}</span>
          <div className="flex items-center gap-3">
            <TimerDisplay timeLeft={timeLeft} maxTime={challenge.timeLimit} />
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{totalPoints}</span>
              <span className="text-xs">pts</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500" style={{ width: `${((currentChallenge + 1) / gamifiedChallenges.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">{getDifficultyStars(challenge.difficulty)}</div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">{challenge.points} pts</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{challenge.title}</h2>
            <p className="text-white/80">{challenge.description}</p>
          </div>
          <div className="p-6">{renderChallenge()}</div>
          {showResult && (
            <div className={`p-6 text-center ${isCorrect ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isCorrect ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"}`}>
                {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-bold">{isCorrect ? "Correct!" : "Time's up!"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fill in the Blank Challenge
function FillBlankChallenge({ challenge, onComplete, disabled }: { challenge: Challenge; onComplete: (points: number) => void; disabled: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const content = challenge.content;

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === content.correctIndex;
    onComplete(isCorrect ? challenge.points : 0);
  };

  return (
    <div className="space-y-6">
      <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-sm font-mono overflow-x-auto">{content.code}</pre>
      <div className="grid grid-cols-2 gap-3">
        {content.options.map((option: string, index: number) => (
          <button key={index} onClick={() => !disabled && setSelected(index)} disabled={disabled} className={`p-4 rounded-xl border-2 font-mono font-bold transition-all ${selected === index ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30" : "border-slate-200 dark:border-slate-600 hover:border-violet-300"}`}>
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={selected === null || disabled} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selected === null || disabled ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg"}`}>
        Submit Answer
      </button>
    </div>
  );
}

// Match Challenge
function MatchChallenge({ challenge, onComplete, disabled }: { challenge: Challenge; onComplete: (points: number) => void; disabled: boolean }) {
  const content = challenge.content;
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const handleTermClick = (term: string) => {
    if (disabled) return;
    setSelectedTerm(term);
  };

  const handleDefinitionClick = (definition: string) => {
    if (disabled || !selectedTerm) return;
    setMatches({ ...matches, [selectedTerm]: definition });
    setSelectedTerm(null);
  };

  const handleSubmit = () => {
    let correct = 0;
    content.pairs.forEach((pair: any) => {
      if (matches[pair.term] === pair.definition) correct++;
    });
    const points = Math.round((correct / content.pairs.length) * challenge.points);
    onComplete(points);
  };

  const usedDefinitions = Object.values(matches);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">Click a term, then click its matching definition</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase">Terms</p>
          {content.pairs.map((pair: any) => (
            <button key={pair.term} onClick={() => handleTermClick(pair.term)} disabled={disabled} className={`w-full p-3 rounded-lg text-left font-medium transition-all ${selectedTerm === pair.term ? "bg-violet-500 text-white" : matches[pair.term] ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
              {pair.term}
              {matches[pair.term] && <span className="ml-2 text-xs">→ {matches[pair.term]}</span>}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase">Definitions</p>
          {content.pairs.map((pair: any) => (
            <button key={pair.definition} onClick={() => handleDefinitionClick(pair.definition)} disabled={disabled || usedDefinitions.includes(pair.definition)} className={`w-full p-3 rounded-lg text-left text-sm transition-all ${usedDefinitions.includes(pair.definition) ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : selectedTerm ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
              {pair.definition}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit} disabled={Object.keys(matches).length !== content.pairs.length || disabled} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${Object.keys(matches).length !== content.pairs.length || disabled ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg"}`}>
        Check Matches
      </button>
    </div>
  );
}

// Sequence Challenge
function SequenceChallenge({ challenge, onComplete, disabled }: { challenge: Challenge; onComplete: (points: number) => void; disabled: boolean }) {
  const content = challenge.content;
  const [order, setOrder] = useState<number[]>([]);
  const [remaining, setRemaining] = useState<number[]>(content.items.map((_: any, i: number) => i));

  const handleItemClick = (index: number) => {
    if (disabled) return;
    setOrder([...order, index]);
    setRemaining(remaining.filter((i) => i !== index));
  };

  const handleReset = () => {
    setOrder([]);
    setRemaining(content.items.map((_: any, i: number) => i));
  };

  const handleSubmit = () => {
    let correct = 0;
    order.forEach((itemIndex, position) => {
      if (itemIndex === content.correctOrder[position]) correct++;
    });
    const points = Math.round((correct / content.items.length) * challenge.points);
    onComplete(points);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">Click the items in the correct order</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase">Your Order</p>
          {order.length > 0 && <button onClick={handleReset} className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>}
        </div>
        <div className="min-h-[60px] p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
          {order.length === 0 ? (
            <p className="text-sm text-slate-400 text-center">Click items below to add them</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {order.map((itemIndex, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm">
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">{i + 1}</span>
                  {content.items[itemIndex]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase">Available Items</p>
        <div className="flex flex-wrap gap-2">
          {remaining.map((itemIndex) => (
            <button key={itemIndex} onClick={() => handleItemClick(itemIndex)} disabled={disabled} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              {content.items[itemIndex]}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit} disabled={order.length !== content.items.length || disabled} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${order.length !== content.items.length || disabled ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg"}`}>
        Check Order
      </button>
    </div>
  );
}

// Debug Challenge
function DebugChallenge({ challenge, onComplete, disabled }: { challenge: Challenge; onComplete: (points: number) => void; disabled: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const content = challenge.content;

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === content.correctIndex;
    onComplete(isCorrect ? challenge.points : 0);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase mb-2">Buggy Code</p>
        <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-sm font-mono overflow-x-auto">{content.buggyCode}</pre>
      </div>
      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2"><Zap className="w-4 h-4" /><strong>Hint:</strong> {content.hint}</p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase">What&apos;s the fix?</p>
        {content.options.map((option: string, index: number) => (
          <button key={index} onClick={() => !disabled && setSelected(index)} disabled={disabled} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected === index ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30" : "border-slate-200 dark:border-slate-600 hover:border-violet-300"}`}>
            <span className="text-slate-700 dark:text-slate-200">{option}</span>
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={selected === null || disabled} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selected === null || disabled ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg"}`}>
        Submit Fix
      </button>
    </div>
  );
}

// Results Component with Certificate
function Results({ score, total, testType, bonusPoints, maxStreak, onRetry }: { score: number; total: number; testType: string; bonusPoints?: number; maxStreak?: number; onRetry: () => void }) {
  const levelInfo = determineLevel(score, total);
  const LevelIcon = levelInfo.icon;
  const percentage = Math.round((score / total) * 100);
  const totalScore = testType === "gamified" ? score : score + (bonusPoints || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${levelInfo.color} flex items-center justify-center shadow-2xl`}>
              <LevelIcon className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center animate-bounce">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`p-8 bg-gradient-to-r ${levelInfo.color} text-white text-center`}>
            <h1 className="text-3xl font-extrabold mb-2">Exam Complete!</h1>
            <p className="text-white/80">{levelInfo.message}</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your Level</p>
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${levelInfo.color} text-white font-bold text-xl`}>
                <Medal className="w-6 h-6" />
                {levelInfo.level}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{score}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{testType === "gamified" ? "Points" : "Correct"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{percentage}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
              </div>
              {bonusPoints !== undefined && (
                <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">+{bonusPoints}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bonus Points</p>
                </div>
              )}
              {maxStreak !== undefined && maxStreak > 0 && (
                <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{maxStreak}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Max Streak</p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Progress</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{score} / {total}</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 mb-8">
              <h3 className="font-semibold text-violet-800 dark:text-violet-200 mb-2 flex items-center gap-2"><Target className="w-5 h-5" />Our Recommendation</h3>
              <p className="text-violet-700 dark:text-violet-300 text-sm">{levelInfo.recommendation}</p>
            </div>

            {/* Certificate Preview */}
            <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20">
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto text-violet-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Certificate of Completion</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">You&apos;ve earned a {levelInfo.level} level certificate!</p>
                <div className="flex gap-3 justify-center">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-sm font-medium hover:bg-violet-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-sm font-medium hover:bg-violet-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <RotateCcw className="w-5 h-5" />
                Retake Exam
              </button>
              <Link href="/programs" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
                <Code2 className="w-5 h-5" />
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function PlacementExamPage() {
  const [testType, setTestType] = useState<"multiple-choice" | "gamified" | null>(null);
  const [examComplete, setExamComplete] = useState(false);
  const [results, setResults] = useState<{ score: number; total: number; answers: any[]; maxStreak?: number; bonusPoints?: number } | null>(null);

  const handleTestSelect = (type: "multiple-choice" | "gamified") => {
    setTestType(type);
  };

  const handleMultipleChoiceComplete = (score: number, total: number, answers: any[], maxStreak: number, bonusPoints: number) => {
    setResults({ score, total, answers, maxStreak, bonusPoints });
    setExamComplete(true);
  };

  const handleGamifiedComplete = (score: number, total: number, results: any[]) => {
    setResults({ score, total, answers: results });
    setExamComplete(true);
  };

  const handleRetry = () => {
    setTestType(null);
    setExamComplete(false);
    setResults(null);
  };

  if (examComplete && results) {
    return <Results score={results.score} total={results.total} testType={testType || "multiple-choice"} bonusPoints={results.bonusPoints} maxStreak={results.maxStreak} onRetry={handleRetry} />;
  }

  if (testType === "multiple-choice") {
    return <MultipleChoiceExam onComplete={handleMultipleChoiceComplete} />;
  }

  if (testType === "gamified") {
    return <GamifiedExam onComplete={handleGamifiedComplete} />;
  }

  return <TestTypeSelection onSelect={handleTestSelect} />;
}
