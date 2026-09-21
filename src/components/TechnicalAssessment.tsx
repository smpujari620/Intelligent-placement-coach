import React, { useState } from "react";
import {
  Code2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  Bug,
  HelpCircle,
  Loader2,
  Terminal,
  Trophy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TechnicalAssessmentData,
  CodingProblem,
  MCQQuestion,
  SQLProblem,
  DebuggingProblem,
} from "../types";
import { evaluateCodeApi, generateAssessmentApi } from "../services/api";

interface TechnicalAssessmentProps {
  assessmentData: TechnicalAssessmentData;
  setAssessmentData: (data: TechnicalAssessmentData) => void;
  targetRole: string;
  onScoreUpdate?: (score: number) => void;
}

export const TechnicalAssessment: React.FC<TechnicalAssessmentProps> = ({
  assessmentData,
  setAssessmentData,
  targetRole,
  onScoreUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"mcq" | "coding" | "sql" | "debugging">("mcq");

  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<Record<number, boolean>>({});

  // Coding state
  const [selectedCodeProblemIndex, setSelectedCodeProblemIndex] = useState(0);
  const [userCode, setUserCode] = useState(
    assessmentData.codingProblems[0]?.starterCode || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    assessmentData.codingProblems[0]?.language || "javascript"
  );
  const [codeEvalResult, setCodeEvalResult] = useState<any>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // SQL state
  const [selectedSqlIndex, setSelectedSqlIndex] = useState(0);
  const [userSqlQuery, setUserSqlQuery] = useState(
    assessmentData.sqlProblems[0]?.starterQuery || "SELECT \nFROM "
  );
  const [sqlEvalResult, setSqlEvalResult] = useState<any>(null);
  const [isRunningSql, setIsRunningSql] = useState(false);

  // Debugging state
  const [selectedDebugIndex, setSelectedDebugIndex] = useState(0);
  const [userFixedCode, setUserFixedCode] = useState(
    assessmentData.debuggingProblems[0]?.buggyCode || ""
  );
  const [debugResult, setDebugResult] = useState<any>(null);
  const [isRunningDebug, setIsRunningDebug] = useState(false);

  // Switch coding problem
  const handleSelectCodeProblem = (idx: number) => {
    setSelectedCodeProblemIndex(idx);
    const p = assessmentData.codingProblems[idx];
    if (p) {
      setUserCode(p.starterCode);
      setSelectedLanguage(p.language);
      setCodeEvalResult(null);
    }
  };

  // Evaluate MCQ
  const handleSelectMcq = (qIndex: number, optionIndex: number) => {
    if (mcqSubmitted[qIndex]) return;
    setMcqAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitMcq = (qIndex: number) => {
    setMcqSubmitted((prev) => ({ ...prev, [qIndex]: true }));
    const question = assessmentData.mcqs[qIndex];
    if (question && mcqAnswers[qIndex] === question.correctIndex) {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
    }
  };

  // Evaluate Coding in Browser via Backend
  const handleRunCode = async () => {
    const p = assessmentData.codingProblems[selectedCodeProblemIndex];
    if (!p) return;

    setIsRunningCode(true);
    setCodeEvalResult(null);

    try {
      const res = await evaluateCodeApi({
        problemTitle: p.title,
        problemDescription: p.description,
        userCode,
        language: selectedLanguage,
        testCases: p.testCases,
      });
      setCodeEvalResult(res);

      if (res.passed) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }
      if (onScoreUpdate) {
        onScoreUpdate(res.score || 85);
      }
    } catch (err: any) {
      setCodeEvalResult({
        passed: false,
        score: 0,
        feedback: err.message || "Failed to evaluate code.",
        timeComplexity: "N/A",
        spaceComplexity: "N/A",
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  // Run SQL query evaluation
  const handleRunSql = async () => {
    const p = assessmentData.sqlProblems[selectedSqlIndex];
    if (!p) return;

    setIsRunningSql(true);
    setSqlEvalResult(null);

    try {
      const res = await evaluateCodeApi({
        problemTitle: `SQL Problem: ${p.title}`,
        problemDescription: `${p.description}\nSchema:\n${p.schemaDescription}`,
        userCode: userSqlQuery,
        language: "sql",
        testCases: [{ input: "Database Tables", expectedOutput: p.expectedOutput }],
      });
      setSqlEvalResult(res);

      if (res.passed) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setSqlEvalResult({
        passed: false,
        score: 0,
        feedback: err.message || "Failed to evaluate SQL.",
      });
    } finally {
      setIsRunningSql(false);
    }
  };

  // Run Debug fix evaluation
  const handleRunDebug = async () => {
    const p = assessmentData.debuggingProblems[selectedDebugIndex];
    if (!p) return;

    setIsRunningDebug(true);
    setDebugResult(null);

    try {
      const res = await evaluateCodeApi({
        problemTitle: `Debugging: ${p.title}`,
        problemDescription: `${p.description}\nBug Description: ${p.bugDescription}`,
        userCode: userFixedCode,
        language: p.language,
        testCases: [{ input: "Edge case inputs", expectedOutput: p.expectedFixExplanation }],
      });
      setDebugResult(res);

      if (res.passed) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setDebugResult({
        passed: false,
        score: 0,
        feedback: err.message || "Failed to test debugged code.",
      });
    } finally {
      setIsRunningDebug(false);
    }
  };

  // Compute MCQ overall score
  const totalMcqs = assessmentData.mcqs.length;
  const answeredMcqs = Object.keys(mcqSubmitted).length;
  const correctMcqs = Object.keys(mcqSubmitted).filter(
    (key) => mcqAnswers[Number(key)] === assessmentData.mcqs[Number(key)]?.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Header and Assessment Mode Navigation */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Code2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Coding & Technical Assessment Lab
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Solve coding challenges, SQL queries, debugging bugs, and multiple choice technical
              questions in real time with automatic test-runner scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">MCQ Accuracy:</span>
            <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono font-bold text-indigo-300">
              {correctMcqs} / {totalMcqs} Correct
            </span>
          </div>
        </div>

        {/* 4 Assessment Subtabs */}
        <div className="flex border-b border-slate-700/80 mt-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("mcq")}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "mcq"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            1. Technical MCQs ({assessmentData.mcqs.length})
          </button>
          <button
            onClick={() => setActiveTab("coding")}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "coding"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            2. Coding Problems ({assessmentData.codingProblems.length})
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "sql"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-4 h-4" />
            3. SQL Query Problems ({assessmentData.sqlProblems.length})
          </button>
          <button
            onClick={() => setActiveTab("debugging")}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "debugging"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bug className="w-4 h-4" />
            4. Debugging Challenges ({assessmentData.debuggingProblems.length})
          </button>
        </div>
      </div>

      {/* 1. Technical MCQs View */}
      {activeTab === "mcq" && (
        <div className="space-y-4">
          {assessmentData.mcqs.map((q, qIdx) => {
            const isSubmitted = mcqSubmitted[qIdx];
            const selectedOpt = mcqAnswers[qIdx];
            const isCorrect = isSubmitted && selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                      Q{qIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-indigo-400">
                      Category: {q.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      q.difficulty === "Hard"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-sm font-medium text-white">{q.question}</p>

                {/* Options list */}
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
                        onClick={() => handleSelectMcq(qIdx, optIdx)}
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

                {/* Action button & Explanation */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {!isSubmitted ? (
                    <button
                      onClick={() => handleSubmitMcq(qIdx)}
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
                      {isCorrect ? "Correct Choice!" : "Incorrect."}
                    </span>
                  )}

                  {isSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 flex-1">
                      <strong className="text-indigo-300">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Coding Problem View */}
      {activeTab === "coding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Problem Selector & Spec (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Coding Challenge:
              </span>
              <div className="space-y-2">
                {assessmentData.codingProblems.map((prob, idx) => (
                  <div
                    key={prob.id}
                    onClick={() => handleSelectCodeProblem(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedCodeProblemIndex === idx
                        ? "bg-indigo-600/15 border-indigo-500 text-white"
                        : "bg-slate-900/50 hover:bg-slate-900/80 border-slate-700/60 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{prob.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300">
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {prob.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Problem Details */}
              {assessmentData.codingProblems[selectedCodeProblemIndex] && (
                <div className="pt-4 border-t border-slate-700/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Test Cases & Constraints
                  </h4>
                  <div className="space-y-2">
                    {assessmentData.codingProblems[selectedCodeProblemIndex].testCases.map(
                      (tc, tcIdx) => (
                        <div
                          key={tcIdx}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1"
                        >
                          <div className="text-slate-400">
                            Input: <span className="text-indigo-300">{tc.input}</span>
                          </div>
                          <div className="text-slate-400">
                            Expected: <span className="text-emerald-300">{tc.expectedOutput}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Code Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">In-Browser Code Editor</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-mono focus:outline-none"
                  >
                    <option value="javascript">JavaScript (ES6)</option>
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ (GCC)</option>
                    <option value="java">Java 17</option>
                  </select>

                  <button
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    {isRunningCode ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Run & Evaluate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code input */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
              />

              {/* Output & AI Complexity Diagnostics */}
              {codeEvalResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    codeEvalResult.passed
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {codeEvalResult.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      Score: {codeEvalResult.score}/100 -{" "}
                      {codeEvalResult.passed ? "All Test Cases Passed" : "Tests Incomplete"}
                    </span>
                    <div className="flex gap-2 font-mono text-[11px]">
                      <span>Time: {codeEvalResult.timeComplexity}</span>
                      <span>• Space: {codeEvalResult.spaceComplexity}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {codeEvalResult.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SQL Query Problem View */}
      {activeTab === "sql" && (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {assessmentData.sqlProblems[selectedSqlIndex]?.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {assessmentData.sqlProblems[selectedSqlIndex]?.description}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300">
                {assessmentData.sqlProblems[selectedSqlIndex]?.difficulty}
              </span>
            </div>

            {/* Schema */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Table Schema:
              </span>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                {assessmentData.sqlProblems[selectedSqlIndex]?.schemaDescription}
              </pre>
            </div>

            {/* SQL Query Editor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Write Your SQL Query:
              </label>
              <textarea
                value={userSqlQuery}
                onChange={(e) => setUserSqlQuery(e.target.value)}
                rows={5}
                spellCheck={false}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Expected: {assessmentData.sqlProblems[selectedSqlIndex]?.expectedOutput}
              </span>
              <button
                onClick={handleRunSql}
                disabled={isRunningSql}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                {isRunningSql ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Execute SQL
              </button>
            </div>

            {sqlEvalResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  sqlEvalResult.passed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {sqlEvalResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  Query Score: {sqlEvalResult.score}/100
                </div>
                <p className="text-slate-300 text-xs">{sqlEvalResult.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Debugging Challenge View */}
      {activeTab === "debugging" && (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {assessmentData.debuggingProblems[selectedDebugIndex]?.title}
                </h3>
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  Bug Symptom: {assessmentData.debuggingProblems[selectedDebugIndex]?.bugDescription}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300">
                {assessmentData.debuggingProblems[selectedDebugIndex]?.difficulty}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Fix the Bug in the Editor Below:
              </label>
              <textarea
                value={userFixedCode}
                onChange={(e) => setUserFixedCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Language: {assessmentData.debuggingProblems[selectedDebugIndex]?.language}
              </span>
              <button
                onClick={handleRunDebug}
                disabled={isRunningDebug}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                {isRunningDebug ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bug className="w-4 h-4" />
                )}
                Test Bug Fix
              </button>
            </div>

            {debugResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  debugResult.passed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {debugResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  Debugging Score: {debugResult.score}/100
                </div>
                <p className="text-slate-300 text-xs">{debugResult.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
