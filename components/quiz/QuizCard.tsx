import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Button from "../ui/button";
import { CheckCircle2, XCircle, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

type Quiz = {
  question: string;
  options: string[];
  correct_answer: string;
  xp_reward?: number;
  explanation?: string;
};

type Props = {
  quiz: Quiz;
  onAnswer?: (correct: boolean, answer: string | null) => void;
};

export default function QuizCard({ quiz, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === quiz.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) triggerConfetti();
    setTimeout(() => onAnswer?.(correct, selectedAnswer), 1500);
  };

  const triggerConfetti = () => {
    const colors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const element = document.createElement("div");
        element.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          top: -10px;
          border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
          animation: confetti-fall 2.8s linear forwards;
          z-index: 9999;
        `;
        document.body.appendChild(element);
        setTimeout(() => element.remove(), 2800);
      }, i * 30);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-slate-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          <CardTitle className="text-xl">Quiz Time!</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">{quiz.question}</h3>

        <div className="space-y-3">
          {quiz.options?.map((option, index) => (
            <button
              key={option}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all duration-200 border-2",
                selectedAnswer === option && !showResult && "border-purple-500 bg-purple-50",
                showResult && option === quiz.correct_answer && "border-green-500 bg-green-50",
                showResult && selectedAnswer === option && option !== quiz.correct_answer && "border-red-500 bg-red-50",
                !showResult && selectedAnswer !== option && "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    selectedAnswer === option ? "bg-purple-500 text-white" : "bg-slate-200 text-slate-600"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
                {showResult && option === quiz.correct_answer && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                {showResult && selectedAnswer === option && option !== quiz.correct_answer && (
                  <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={cn("p-4 rounded-xl", isCorrect ? "bg-green-100" : "bg-amber-100")}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-700">Awesome! +{quiz.xp_reward || 10} XP</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-700">Not quite, but keep trying!</span>
                </>
              )}
            </div>
            {quiz.explanation && <p className="text-sm text-slate-600">{quiz.explanation}</p>}
          </div>
        )}

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            Check Answer
          </Button>
        )}
      </CardContent>

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  );
}
