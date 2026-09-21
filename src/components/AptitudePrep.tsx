import React, { useState } from "react";
import {
  Brain,
  Calculator,
  Compass,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Loader2,
  RotateCcw,
  Trophy,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AptitudeCategoryData, AptitudeQuestion } from "../types";
import { generateAptitudeApi } from "../services/api";
import { SAMPLE_APTITUDE } from "../data/sampleData";

interface AptitudePrepProps {
  onScoreUpdate?: (category: string, score: number) => void;
}

export const AptitudePrep: React.FC<AptitudePrepProps> = ({ onScoreUpdate }) => {
  const [activeCategory, setActiveCategory] = useState<"quantitative" | "logical" | "verbal">("quantitative");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [aptitudeData, setAptitudeData] = useState<Record<string, AptitudeCategoryData>>(SAMPLE_APTITUDE);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentCategoryData = aptitudeData[activeCategory] || {
    category: activeCategory,
    questions: [],
    categoryScore: 75,
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submittedAnswers[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleCheckAnswer = (question: AptitudeQuestion) => {
    setSubmittedAnswers((prev) => ({ ...prev, [question.id]: true }));
    const chosen = selectedAnswers[question.id];

    if (chosen === question.correctIndex) {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
      if (onScoreUpdate) {
        onScoreUpdate(activeCategory, 88);
      }
    }
  };

  const handleGenerateFresh = async () => {
    setIsLoadingMore(true);
    try {
      const freshData = await generateAptitudeApi({
        category: activeCategory,
        difficulty: selectedDifficulty,
        count: 4,
      });

      setAptitudeData((prev) => ({
        ...prev,
        [activeCategory]: {
          ...freshData,
          questions: [...freshData.questions],
        },
      }));
    } catch (err) {
      console.error("Failed to generate fresh aptitude:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Compute category accuracy
  const totalQuestions = currentCategoryData.questions.length;
  const answeredCount = Object.keys(submittedAnswers).filter((id) =>
    currentCategoryData.questions.some((q) => q.id === id)
  ).length;

  const correctCount = currentCategoryData.questions.filter(
    (q) => submittedAnswers[q.id] && selectedAnswers[q.id] === q.correctIndex
  ).length;

  const accuracyPercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header and Category Selector */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Campus Aptitude Preparation Suite
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Sharpen your Quantitative Mathematics, Logical Reasoning, and Verbal Ability with
              rigorous questions, speed tricks, and step-by-step derivations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
              Accuracy: <strong className="text-emerald-400 font-mono">{accuracyPercent}%</strong> (
              {correctCount}/{answeredCount} Solved)
            </div>
            <button
              onClick={handleGenerateFresh}
              disabled={isLoadingMore}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              {isLoadingMore ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Generate Fresh Questions
            </button>
          </div>
        </div>

        {/* 3 Categories Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            {
              id: "quantitative" as const,
              title: "1. Quantitative Ability",
              desc: "Time & Work, Probability, Permutations, Mixtures & Profit/Loss",
              icon: <Calculator className="w-4 h-4 text-emerald-400" />,
            },
            {
              id: "logical" as const,
              title: "2. Logical Reasoning",
              desc: "Coding-Decoding, Blood Relations, Syllogisms, Seating Arrangements",
              icon: <Compass className="w-4 h-4 text-amber-400" />,
            },
            {
              id: "verbal" as const,
              title: "3. Verbal Ability",
              desc: "Reading Comprehension, Sentence Correction, Para Jumbles & Vocab",
              icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
            },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-900/50 hover:bg-slate-900/80 border-slate-700/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {cat.icon}
                  <h4 className="text-xs font-bold text-white">{cat.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Difficulty Level Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Difficulty:</span>
          {(["easy", "medium", "hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer border ${
                selectedDifficulty === diff
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {currentCategoryData.questions.map((q, idx) => {
          const isSubmitted = submittedAnswers[q.id];
          const selectedOpt = selectedAnswers[q.id];
          const isCorrect = isSubmitted && selectedOpt === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-indigo-400">Topic: {q.topic}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {q.recommendedTimeSeconds}s
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      q.difficulty === "hard"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-white leading-relaxed">{q.question}</p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    "bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-900";
                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold";
                    } else if (selectedOpt === optIdx) {
                      optStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                    }
                  } else if (selectedOpt === optIdx) {
                    optStyle = "bg-indigo-600/30 border-indigo-500 text-white";
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-slate-300">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && selectedOpt === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Check Answer and Detailed Derivation */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {!isSubmitted ? (
                  <button
                    onClick={() => handleCheckAnswer(q)}
                    disabled={selectedOpt === undefined}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isCorrect ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isCorrect ? "Correct Solution!" : "Incorrect."}
                  </span>
                )}

                {isSubmitted && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 flex-1 space-y-1">
                    <div className="font-bold text-indigo-300 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Step-by-Step Explanation & Shortcut:
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{q.explanation}</p>
                    {q.formula && (
                      <div className="pt-1 text-[11px] font-mono text-emerald-400">
                        Formula / Trick: {q.formula}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
