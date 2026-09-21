import React from "react";
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { CareerRoleRecommendation, ResumeData } from "../types";
import { SAMPLE_CAREER_RECOMMENDATIONS } from "../data/sampleData";

interface CareerRecommendationsProps {
  recommendations?: CareerRoleRecommendation[];
  resumeData: ResumeData;
  onSelectRole: (roleTitle: string) => void;
}

export const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({
  recommendations = SAMPLE_CAREER_RECOMMENDATIONS,
  resumeData,
  onSelectRole,
}) => {
  const getMatchBadge = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (percentage >= 65) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Career & Role Recommendation Engine
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Based on your resume's skills, coursework, and project profile ({resumeData.candidateName}),
              the AI engine recommends suitable placement paths like Software Developer, Data Analyst,
              QA Engineer, and Network Engineer.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
            Profile Evaluated: <strong className="text-indigo-400">{resumeData.candidateName}</strong>
          </div>
        </div>
      </div>

      {/* Role Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((role: CareerRoleRecommendation) => (
          <div
            key={role.id}
            className="bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{role.roleTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      {role.salaryRange}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      {role.marketDemand} Demand
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getMatchBadge(
                      role.matchPercentage
                    )}`}
                  >
                    {role.matchPercentage}% Fit
                  </span>
                </div>
              </div>

              {/* Rationale based on skills */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Why this role matches your profile:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {role.rationale}
                </p>
              </div>

              {/* Matching Skills */}
              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-1.5">
                  Overlapping Skills Detected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.matchingSkills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills to Bridge */}
              <div>
                <span className="text-xs font-semibold text-amber-400 block mb-1.5">
                  Skills to Acquire for 95%+ Readiness:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.missingSkillsToBridge?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Top Hiring Companies: {role.typicalCompanies?.slice(0, 3).join(", ")}
              </span>

              <button
                onClick={() => onSelectRole(role.roleTitle)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>Set as Target Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
