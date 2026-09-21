import React from "react";
import {
  FileText,
  Briefcase,
  Target,
  AlertTriangle,
  Calendar,
  MessageSquareCode,
  Code2,
  Brain,
  Compass,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export type ActiveTab =
  | "dashboard"
  | "resume"
  | "job"
  | "match"
  | "gaps"
  | "roadmap"
  | "interview"
  | "assessment"
  | "aptitude"
  | "careers";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  targetRole: string;
  readinessScore: number;
  matchScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  targetRole,
  readinessScore,
  matchScore,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "resume", label: "1. Resume Analyzer", icon: <FileText className="w-4 h-4" /> },
    { id: "job", label: "2. Job Analyzer", icon: <Briefcase className="w-4 h-4" /> },
    { id: "match", label: "3. Match Engine", icon: <Target className="w-4 h-4" /> },
    { id: "gaps", label: "4. Skill Gaps", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "roadmap", label: "5. Roadmap", icon: <Calendar className="w-4 h-4" /> },
    { id: "interview", label: "6. AI Mock Interview", icon: <MessageSquareCode className="w-4 h-4" /> },
    { id: "assessment", label: "7. Technical Assessment", icon: <Code2 className="w-4 h-4" /> },
    { id: "aptitude", label: "8. Aptitude Prep", icon: <Brain className="w-4 h-4" /> },
    { id: "careers", label: "9. Role Matches", icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top branding bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Intelligent Placement Coach
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Campus & Lateral Engineering Recruitment Readiness Suite
            </p>
          </div>
        </div>

        {/* Live readiness indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400">Target Role:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[140px] md:max-w-[180px]">
              {targetRole}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium">Match:</span>
            <span className="font-bold text-emerald-300">{matchScore}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
            <span className="font-medium">Readiness:</span>
            <span className="font-bold text-indigo-200">{readinessScore}/100</span>
          </div>
        </div>
      </div>

      {/* Nav pill tabs with horizontal overflow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent text-xs font-medium"
          aria-label="Modules"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
