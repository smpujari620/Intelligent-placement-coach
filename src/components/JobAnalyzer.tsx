import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  ListFilter,
  Layers,
  GraduationCap,
  Loader2,
  FileCheck2,
} from "lucide-react";
import { JobDescriptionData } from "../types";
import { SAMPLE_JOB_DESCRIPTIONS } from "../data/sampleData";
import { analyzeJobApi } from "../services/api";

interface JobAnalyzerProps {
  jobData: JobDescriptionData;
  setJobData: (data: JobDescriptionData) => void;
  onAnalysisComplete?: () => void;
}

export const JobAnalyzer: React.FC<JobAnalyzerProps> = ({
  jobData,
  setJobData,
  onAnalysisComplete,
}) => {
  const [jobText, setJobText] = useState(jobData.rawText || "");
  const [roleTitle, setRoleTitle] = useState(jobData.roleTitle);
  const [company, setCompany] = useState(jobData.company);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobText.trim()) {
      setErrorMsg("Please paste or type a Job Description.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await analyzeJobApi({
        jobDescription: jobText,
        roleTitle: roleTitle || "Target Role",
        company: company || "Hiring Company",
      });

      setJobData({
        ...result,
        rawText: jobText,
      });

      setSuccessMsg("Job description successfully analyzed and requirements extracted.");
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze job description.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: JobDescriptionData) => {
    setJobData(sample);
    setRoleTitle(sample.roleTitle);
    setCompany(sample.company);
    setJobText(sample.rawText || "");
    setSuccessMsg(`Loaded template for "${sample.roleTitle}" (${sample.company}).`);
    setErrorMsg(null);
    if (onAnalysisComplete) onAnalysisComplete();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Role Templates */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Job Description Analyzer
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Paste or type your target job description. The AI engine extracts required skills,
              technologies, minimum eligibility criteria, and primary duties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Target Roles:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                  jobData.roleTitle === sample.roleTitle
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                }`}
              >
                {sample.roleTitle.split("(")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Software Development Engineer (SDE-1)"
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Tech Tier-1 / FinTech Startup"
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Job Description Content (Paste or write)
            </label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={6}
              placeholder="Paste the target job description including roles, responsibilities, required qualifications, and technologies..."
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {jobData.experienceLevel && (
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  Target Level: <strong>{jobData.experienceLevel}</strong>
                </span>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting Requirements...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Job Description
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Extracted Specifications Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required & Preferred Skills */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <ListFilter className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Required & Preferred Skills
            </h3>
          </div>

          <div>
            <span className="text-xs font-semibold text-rose-400 block mb-2">
              Mandatory Requirements:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {jobData.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {jobData.preferredSkills && jobData.preferredSkills.length > 0 && (
            <div className="pt-2 border-t border-slate-700/60">
              <span className="text-xs font-semibold text-emerald-400 block mb-2">
                Good-To-Have / Preferred:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {jobData.preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {jobData.technologies && jobData.technologies.length > 0 && (
            <div className="pt-2 border-t border-slate-700/60">
              <span className="text-xs font-semibold text-sky-400 block mb-2">
                Primary Technology Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {jobData.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Qualifications & Responsibilities */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <GraduationCap className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Qualifications & Eligibility
            </h3>
          </div>

          <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-300">
            {jobData.qualifications?.map((qual, idx) => (
              <li key={idx}>{qual}</li>
            ))}
          </ul>

          <div className="pt-3 border-t border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Layers className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Core Responsibilities
              </h4>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-300">
              {jobData.responsibilities?.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
