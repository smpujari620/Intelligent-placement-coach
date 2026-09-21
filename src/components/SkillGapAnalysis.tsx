import React, { useState } from "react";
import {
  AlertTriangle,
  Code2,
  Brain,
  MessageSquare,
  Users,
  Database,
  Cpu,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { CategorizedSkillGaps, SkillGapItem } from "../types";

interface SkillGapAnalysisProps {
  skillGaps: CategorizedSkillGaps;
  onNavigateToRoadmap?: () => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  skillGaps,
  onNavigateToRoadmap,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | "High" | "Medium" | "Low">("all");

  const categories = [
    {
      id: "technicalSkills",
      title: "1. Technical Skills",
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      items: skillGaps.technicalSkills || [],
      description: "Architecture, Operating Systems, Networking, and Low-Level CS",
    },
    {
      id: "programming",
      title: "2. Programming",
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      items: skillGaps.programming || [],
      description: "Data Structures, Algorithms, Syntax, and Object-Oriented Patterns",
    },
    {
      id: "aptitude",
      title: "3. Aptitude",
      icon: <Brain className="w-5 h-5 text-amber-400" />,
      items: skillGaps.aptitude || [],
      description: "Quantitative Mathematics, Logical Reasoning, and Pattern Matching",
    },
    {
      id: "communication",
      title: "4. Communication",
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      items: skillGaps.communication || [],
      description: "STAR method interview articulation, clarity, and technical storytelling",
    },
    {
      id: "softSkills",
      title: "5. Soft Skills",
      icon: <Users className="w-5 h-5 text-sky-400" />,
      items: skillGaps.softSkills || [],
      description: "Teamwork, Conflict resolution, Adaptability, and Leadership",
    },
    {
      id: "domainKnowledge",
      title: "6. Domain Knowledge",
      icon: <Database className="w-5 h-5 text-rose-400" />,
      items: skillGaps.domainKnowledge || [],
      description: "Database Indexing, Cloud Platforms, System Reliability, and APIs",
    },
  ];

  const getSeverityBadge = (severity: "High" | "Medium" | "Low") => {
    switch (severity) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Low":
        return "bg-slate-700/60 text-slate-300 border-slate-600";
    }
  };

  const totalGaps = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const highGaps = categories.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.severity === "High").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header and Summary Ribbon */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Skill Gap Analysis (6 Key Categories)
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Thorough diagnosis categorized across the 6 campus recruitment pillars. Focus on
              High-severity gaps first to maximize interview shortlist conversion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
              Total Identified Gaps: <strong className="text-white">{totalGaps}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              Critical / High Severity: <strong>{highGaps}</strong>
            </div>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter by Severity:</span>
          {(["all", "High", "Medium", "Low"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                selectedSeverity === sev
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {sev === "all" ? "All Severities" : `${sev} Severity`}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const filteredItems = category.items.filter(
            (item) => selectedSeverity === "all" || item.severity === selectedSeverity
          );

          return (
            <div
              key={category.id}
              className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-600 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {category.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {filteredItems.length}
                  </span>
                </div>

                {filteredItems.length > 0 ? (
                  <div className="space-y-3">
                    {filteredItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{item.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getSeverityBadge(
                              item.severity
                            )}`}
                          >
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{item.description}</p>
                        <div className="pt-1.5 border-t border-slate-800 flex items-start gap-1.5 text-indigo-300">
                          <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-400 mt-0.5" />
                          <span className="text-[11px] leading-tight">
                            <strong className="text-slate-300">Action:</strong> {item.learningPath}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    No gaps matching the current filter in this category.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {onNavigateToRoadmap && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-indigo-200">
            <strong className="text-white block text-sm mb-0.5">
              Ready to resolve these skill gaps?
            </strong>
            The AI has generated a day-wise, week-by-week preparation roadmap tailored specifically
            to these topics.
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors shadow-sm"
          >
            <span>Open Personalized Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
