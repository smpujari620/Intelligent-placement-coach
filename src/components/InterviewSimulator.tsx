import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquareCode,
  Sparkles,
  Send,
  Loader2,
  Mic,
  MicOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Trophy,
  BarChart3,
  ThumbsUp,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  InterviewRound,
  InterviewQuestion,
  AnswerEvaluation,
  InterviewQAItem,
  ResumeData,
  JobDescriptionData,
} from "../types";
import {
  generateInterviewQuestionApi,
  evaluateInterviewAnswerApi,
} from "../services/api";

interface InterviewSimulatorProps {
  resumeData: ResumeData;
  jobData: JobDescriptionData;
  onSessionComplete?: (round: InterviewRound, averageScore: number) => void;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  resumeData,
  jobData,
  onSessionComplete,
}) => {
  const [selectedRound, setSelectedRound] = useState<InterviewRound>("technical");
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [qaHistory, setQaHistory] = useState<InterviewQAItem[]>([]);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Timer state (seconds)
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);

  // Speech to text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Setup Web Speech API for voice answer dictation
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Start or reset session
  const startSession = async (round: InterviewRound) => {
    setSelectedRound(round);
    setSessionActive(true);
    setQaHistory([]);
    setCandidateAnswer("");
    setCurrentEvaluation(null);
    setShowHint(false);
    await fetchNextQuestion(round, []);
  };

  const fetchNextQuestion = async (
    round: InterviewRound,
    previousItems: InterviewQAItem[]
  ) => {
    setIsGeneratingQuestion(true);
    setCurrentEvaluation(null);
    setCandidateAnswer("");
    setShowHint(false);
    setTimerSeconds(120);
    setTimerRunning(true);

    try {
      const q = await generateInterviewQuestionApi({
        round,
        resumeData,
        jobData,
        previousQuestions: previousItems.map((item) => item.question.question),
        targetRole: jobData.roleTitle,
      });
      setCurrentQuestion(q);
    } catch (err) {
      console.error("Failed to generate question:", err);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !candidateAnswer.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setTimerRunning(false);
    setIsEvaluating(true);

    try {
      const evaluation = await evaluateInterviewAnswerApi({
        question: currentQuestion.question,
        candidateAnswer,
        round: selectedRound,
        targetRole: jobData.roleTitle,
        expectedKeyPoints: currentQuestion.expectedKeyPoints,
      });

      setCurrentEvaluation(evaluation);

      const newQaItem: InterviewQAItem = {
        question: currentQuestion,
        candidateAnswer,
        evaluation,
        answeredAt: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [...qaHistory, newQaItem];
      setQaHistory(updatedHistory);

      if (evaluation.overallScore >= 80) {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      }

      // Check if session finished (e.g. after 3 questions)
      if (updatedHistory.length >= 3 && onSessionComplete) {
        const avg = Math.round(
          updatedHistory.reduce((acc, item) => acc + (item.evaluation?.overallScore || 75), 0) /
            updatedHistory.length
        );
        onSessionComplete(selectedRound, avg);
      }
    } catch (err) {
      console.error("Failed to evaluate answer:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const roundsList: Array<{ id: InterviewRound; name: string; desc: string }> = [
    {
      id: "hr",
      name: "1. HR Round",
      desc: "Background, culture fit, career vision, strengths & stress handling",
    },
    {
      id: "technical",
      name: "2. Technical Round",
      desc: "Data Structures, Algorithms, OS, DBMS, Networks & Code Architecture",
    },
    {
      id: "behavioral",
      name: "3. Behavioral Round",
      desc: "STAR method situational judgment, leadership, conflict & resilience",
    },
    {
      id: "role-specific",
      name: "4. Role-Specific Round",
      desc: `Deep dive tailored to ${jobData.roleTitle || "Target Role"} & resume tech stack`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Round Selector */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MessageSquareCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Interview Simulator & Live Evaluator
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Conduct realistic mock interview rounds with real-time AI evaluation across 6 criteria:
              Correctness, Relevance, Confidence, Communication, Technical depth, and Completeness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Session Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                sessionActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {sessionActive ? "Round In Progress" : "Ready To Begin"}
            </span>
          </div>
        </div>

        {/* 4 Interactive Rounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {roundsList.map((round) => {
            const isSelected = selectedRound === round.id;
            return (
              <div
                key={round.id}
                onClick={() => startSession(round.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-600/10"
                    : "bg-slate-900/50 hover:bg-slate-900/80 border-slate-700/60 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{round.name}</h4>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-indigo-400 animate-pulse" : "bg-slate-600"
                    }`}
                  ></span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{round.desc}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-indigo-400">
                  <span>{isSelected && sessionActive ? "Active Session" : "Start Round"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interview Stage */}
      {sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question & Answer Box (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Question Card */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    Question {currentQuestion?.questionNumber || qaHistory.length + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Category: <strong className="text-slate-200">{currentQuestion?.category}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      currentQuestion?.difficulty === "Hard"
                        ? "bg-rose-500/20 text-rose-300"
                        : currentQuestion?.difficulty === "Medium"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {currentQuestion?.difficulty || "Medium"}
                  </span>

                  {/* Timer */}
                  <div
                    className={`flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded bg-slate-900 border ${
                      timerSeconds <= 20
                        ? "border-rose-500/50 text-rose-400 animate-pulse"
                        : "border-slate-700 text-slate-300"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {Math.floor(timerSeconds / 60)}:
                      {timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              {isGeneratingQuestion ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                  <p className="text-xs">AI Interviewer is formulating the next question...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-base font-medium text-white leading-relaxed">
                    {currentQuestion?.question}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showHint ? "Hide Context Hint" : "Need a Hint / Structure Guide?"}
                    </button>

                    <span className="text-[11px] text-slate-500 italic">
                      Interviewer tone: {currentQuestion?.interviewerTone || "Thoughtful & rigorous"}
                    </span>
                  </div>

                  {showHint && currentQuestion?.contextHint && (
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                      💡 <strong>Guidance:</strong> {currentQuestion.contextHint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Box */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Your Response:
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        Listening (Speak Now)...
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        Voice Input
                      </>
                    )}
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    {candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </div>

              <textarea
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                rows={6}
                disabled={isEvaluating}
                placeholder="Type or dictate your structured response here. Include principles, examples, technical reasoning, and outcomes..."
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => fetchNextQuestion(selectedRound, qaHistory)}
                  disabled={isGeneratingQuestion || isEvaluating}
                  className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Skip Question
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswer.trim() || isEvaluating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating Across 6 Criteria...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit & Evaluate Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Evaluation Report Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-400">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Evaluation Matrix (6 Criteria)
                  </h3>
                </div>

                {currentEvaluation && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      currentEvaluation.overallScore >= 80
                        ? "bg-emerald-500/20 text-emerald-300"
                        : currentEvaluation.overallScore >= 65
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {currentEvaluation.verdict} ({currentEvaluation.overallScore}/100)
                  </span>
                )}
              </div>

              {currentEvaluation ? (
                <div className="space-y-4">
                  {/* 6 Metric Bars */}
                  <div className="space-y-2.5">
                    {[
                      { label: "1. Correctness", val: currentEvaluation.correctness },
                      { label: "2. Relevance", val: currentEvaluation.relevance },
                      { label: "3. Confidence", val: currentEvaluation.confidence },
                      { label: "4. Communication", val: currentEvaluation.communication },
                      { label: "5. Technical Depth", val: currentEvaluation.technicalDepth },
                      { label: "6. Completeness", val: currentEvaluation.completeness },
                    ].map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{metric.label}</span>
                          <span className="font-mono font-bold text-indigo-400">{metric.val}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              metric.val >= 80
                                ? "bg-emerald-400"
                                : metric.val >= 60
                                ? "bg-indigo-400"
                                : "bg-amber-400"
                            }`}
                            style={{ width: `${metric.val}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="space-y-2 pt-2 border-t border-slate-700/60">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> What You Did Well:
                      </span>
                      <ul className="space-y-1 list-disc pl-4 text-xs text-slate-300">
                        {currentEvaluation.strengths?.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Areas to Sharpen:
                      </span>
                      <ul className="space-y-1 list-disc pl-4 text-xs text-slate-300">
                        {currentEvaluation.areasForImprovement?.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Model Exemplary Answer */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-400" /> Exemplary 100/100
                      Response:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{currentEvaluation.modelAnswer}"
                    </p>
                  </div>

                  {/* Next Question Button */}
                  <button
                    onClick={() => fetchNextQuestion(selectedRound, qaHistory)}
                    disabled={isGeneratingQuestion}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                  >
                    <span>Proceed to Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 text-slate-500">
                  <Award className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs max-w-xs mx-auto">
                    Submit your answer to view the AI recruiter's real-time breakdown across
                    Correctness, Relevance, Confidence, Communication, Technical Depth, and
                    Completeness.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
