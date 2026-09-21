import React from "react";
import {
  LayoutDashboard,
  Target,
  Calendar,
  Code2,
  Brain,
  MessageSquareCode,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ResumeData,
  JobDescriptionData,
  MatchAnalysisResult,
  RoadmapWeek,
  ProgressDashboardStats,
} from "../types";
import { ActiveTab } from "./Navbar";

interface DashboardProps {
  resumeData: ResumeData;
  jobData: JobDescriptionData;
  matchResult: MatchAnalysisResult;
  roadmap: RoadmapWeek[];
  completedTaskIds: string[];
  stats: ProgressDashboardStats;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  resumeData,
  jobData,
  matchResult,
  roadmap,
  completedTaskIds,
  stats,
  setActiveTab,
}) => {
  // Compute roadmap stats
  const allTasks: any[] = [];
  roadmap.forEach((w) => w.days?.forEach((d) => d.tasks?.forEach((t) => allTasks.push(t))));
  const totalTasks = allTasks.length;
  const completedTasksCount = completedTaskIds.length;
  const roadmapPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Composite readiness score calculation
  const compositeReadiness = Math.round(
    matchResult.matchPercentage * 0.35 +
      stats.mockInterviewAverage * 0.25 +
      stats.technicalAssessmentScore * 0.2 +
      stats.aptitudeAccuracy * 0.1 +
      roadmapPercent * 0.1
  );

  const getVerdict = (score: number) => {
    if (score >= 80) {
      return {
        text: "Tier-1 Placement Ready",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        description: "Your profile exhibits strong technical depth, aptitude, and role alignment.",
      };
    }
    if (score >= 65) {
      return {
        text: "Competitive / Moderate Fit",
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
        description: "Close to offer benchmark. Focus on critical skill gaps and mock interview STAR pacing.",
      };
    }
    return {
      text: "Foundation Building Required",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      description: "Requires consistent roadmap execution across DSA and core domain technologies.",
    };
  };

  const verdict = getVerdict(compositeReadiness);

  return (
    <div className="space-y-6">
      {/* Hero Placement Readiness Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Live Campus Placement Index
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Placement Readiness: {resumeData.candidateName}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Synthesizing ATS resume strength, target role alignment for{" "}
              <strong className="text-indigo-300">{jobData.roleTitle}</strong> at{" "}
              <strong className="text-white">{jobData.company}</strong>, mock interview performance,
              and live coding assessment results.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${verdict.color}`}
              >
                {verdict.text}
              </span>
              <span className="text-xs text-slate-400">{verdict.description}</span>
            </div>
          </div>

          {/* Big Readiness Dial */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 border border-slate-700/90 min-w-[200px] text-center shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Readiness Score
            </span>
            <div className="relative my-3 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-slate-800 border-t-indigo-500 border-r-emerald-400 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{compositeReadiness}</span>
                <span className="text-[10px] uppercase font-bold text-indigo-400">out of 100</span>
              </div>
            </div>
            <span className="text-xs text-slate-400">
              Target: <strong className="text-slate-200">85+ for Day-1 Offers</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Match Score */}
        <div
          onClick={() => setActiveTab("match")}
          className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">1. Resume–JD Fit</span>
            <Target className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{matchResult.matchPercentage}%</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span>{matchResult.matchingSkills?.length || 0} Matched Skills</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Metric 2: Preparation Roadmap */}
        <div
          onClick={() => setActiveTab("roadmap")}
          className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">2. Prep Roadmap</span>
            <Calendar className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{roadmapPercent}%</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span>{completedTasksCount}/{totalTasks} Tasks Done</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Metric 3: Technical Assessment */}
        <div
          onClick={() => setActiveTab("assessment")}
          className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">3. Technical Test</span>
            <Code2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{stats.technicalAssessmentScore}%</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span>DSA & SQL Solved</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Metric 4: Interview Simulator */}
        <div
          onClick={() => setActiveTab("interview")}
          className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">4. Mock Interviews</span>
            <MessageSquareCode className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{stats.mockInterviewAverage}/100</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span>6-Matrix Evaluated</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Metric 5: Aptitude Accuracy */}
        <div
          onClick={() => setActiveTab("aptitude")}
          className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">5. Aptitude Score</span>
            <Brain className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{stats.aptitudeAccuracy}%</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span>Quant/Logical/Verbal</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* 2-Column Detailed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Improvement Across 6 Pillars (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Skill Mastery Across 6 Campus Pillars
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("gaps")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View Gap Breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              {
                name: "1. Technical Skills (CS Fundamentals, OS, DBMS)",
                current: 78,
                target: 90,
                color: "bg-indigo-400",
              },
              {
                name: "2. Programming & Algorithms (DSA, LeetCode style)",
                current: 82,
                target: 95,
                color: "bg-emerald-400",
              },
              {
                name: "3. Aptitude (Quantitative, Logical, Verbal)",
                current: 85,
                target: 90,
                color: "bg-amber-400",
              },
              {
                name: "4. Communication & STAR Articulation",
                current: 80,
                target: 90,
                color: "bg-purple-400",
              },
              {
                name: "5. Soft Skills & Behavioral Fit",
                current: 88,
                target: 90,
                color: "bg-sky-400",
              },
              {
                name: "6. Domain Knowledge (System Design, Cloud, SQL)",
                current: 74,
                target: 85,
                color: "bg-rose-400",
              },
            ].map((pillar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{pillar.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{pillar.current}%</span>
                    <span className="text-slate-500">/ Target: {pillar.target}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${pillar.color}`}
                    style={{ width: `${pillar.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommended Actions & Quick Tasks (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Next High-Impact Actions
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Today's Focus</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: "Conduct Role-Specific Mock Interview",
                  module: "interview" as ActiveTab,
                  desc: "Practice answering deep-dive questions for SDE-1.",
                  urgency: "High",
                },
                {
                  title: "Solve SQL Window Function Challenge",
                  module: "assessment" as ActiveTab,
                  desc: "Resolve critical domain gap identified in assessment.",
                  urgency: "High",
                },
                {
                  title: "Complete 15 Quantitative Aptitude Questions",
                  module: "aptitude" as ActiveTab,
                  desc: "Master Time & Work shortcuts before first-round test.",
                  urgency: "Medium",
                },
                {
                  title: "Address Weak Project Section in Resume",
                  module: "resume" as ActiveTab,
                  desc: "Add quantitative latency & user scale metrics.",
                  urgency: "Medium",
                },
              ].map((action, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(action.module)}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {action.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          action.urgency === "High"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {action.urgency}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
