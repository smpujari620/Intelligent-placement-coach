import React, { useState } from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
  AlertTriangle,
  Loader2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ResumeData, JobDescriptionData, MatchAnalysisResult } from "../types";
import { compareMatchApi } from "../services/api";

interface MatchEngineProps {
  resumeData: ResumeData;
  jobData: JobDescriptionData;
  matchResult: MatchAnalysisResult;
  setMatchResult: (result: MatchAnalysisResult) => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToInterview?: () => void;
}

export const MatchEngine: React.FC<MatchEngineProps> = ({
  resumeData,
  jobData,
  matchResult,
  setMatchResult,
  onNavigateToRoadmap,
  onNavigateToInterview,
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunComparison = async () => {
    setIsComparing(true);
    setErrorMsg(null);

    try {
      const result = await compareMatchApi({
        resumeData,
        jobData,
      });
      setMatchResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to compare resume and job description.");
    } finally {
      setIsComparing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  return (
    <div className="space-y-6">
      {/* Top Match Hero Card */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Resume–Job Matching Engine
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Cross-references candidate qualifications with target job requirements to calculate
              overall fit, skill overlap, missing competencies, and relevant project experience.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
                Candidate: <strong className="text-white">{resumeData.candidateName}</strong>
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
                Target Role: <strong className="text-indigo-300">{jobData.roleTitle}</strong>
              </span>
            </div>
          </div>

          {/* Match Score Display */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 min-w-[180px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Match
            </span>
            <div className="relative my-2 flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(
                  matchResult.matchPercentage
                )}`}
              >
                <span className="text-3xl font-black">{matchResult.matchPercentage}%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Fit Index</span>
              </div>
            </div>
            <button
              onClick={handleRunComparison}
              disabled={isComparing}
              className="mt-2 w-full px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              {isComparing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Re-evaluate Match
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Matching Skills vs Missing Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Matching Skills ({matchResult.matchingSkills?.length || 0})
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Verified in Resume
            </span>
          </div>

          <div className="space-y-3">
            {matchResult.matchingSkills?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {item.skill}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-medium">
                    {item.relevance} Relevance
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Evidence:</strong> {item.evidenceInResume}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2 text-rose-400">
              <XCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Missing / Weak Skills ({matchResult.missingSkills?.length || 0})
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
              Immediate Skill Gaps
            </span>
          </div>

          <div className="space-y-3">
            {matchResult.missingSkills?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    {item.skill}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      item.importance === "critical"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Category: <span className="text-slate-300">{item.category}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relevant Experience Assessment */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Relevant Experience & Project Alignment
            </h3>
          </div>
          <span className="text-xs font-mono text-indigo-300 px-3 py-1 rounded bg-slate-900 border border-slate-700">
            Experience Score: {matchResult.relevantExperience?.score || 80}/100
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {matchResult.relevantExperience?.verdict}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Key Projects Aligning With This Role:
            </span>
            <ul className="space-y-1 list-disc pl-4 text-xs text-slate-300">
              {matchResult.relevantExperience?.relevantProjects?.map((proj, idx) => (
                <li key={idx}>{proj}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Experience Gaps & Unaddressed Areas:
            </span>
            <ul className="space-y-1 list-disc pl-4 text-xs text-slate-300">
              {matchResult.relevantExperience?.gaps?.map((gap, idx) => (
                <li key={idx}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-700/60">
          {onNavigateToRoadmap && (
            <button
              onClick={onNavigateToRoadmap}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <span>View Personalized Preparation Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onNavigateToInterview && (
            <button
              onClick={onNavigateToInterview}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <span>Start Role Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
