import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Briefcase,
  Sparkles,
  Loader2,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { ResumeData } from "../types";
import { analyzeResumeApi } from "../services/api";
import { SAMPLE_RESUME } from "../data/sampleData";

interface ResumeAnalyzerProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onAnalysisComplete?: () => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  resumeData,
  setResumeData,
  onAnalysisComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "skills" | "projects" | "experience" | "critique">("overview");
  const [textPasteMode, setTextPasteMode] = useState(false);
  const [rawText, setRawText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload (PDF / DOCX / TXT)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileName = file.name;
      const fileType = file.type;

      // Read as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Content = result.split(",")[1];

          let mimeType = fileType || "application/pdf";
          if (fileName.endsWith(".docx")) {
            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          } else if (fileName.endsWith(".txt")) {
            mimeType = "text/plain";
          }

          // If text file, also extract raw text
          let textContent = "";
          if (fileType.includes("text") || fileName.endsWith(".txt")) {
            textContent = atob(base64Content);
          }

          const analyzed = await analyzeResumeApi({
            pdfBase64: base64Content,
            mimeType,
            fileName,
            resumeText: textContent || undefined,
          });

          setResumeData({
            ...analyzed,
            fileName,
          });

          setUploadSuccess(`Successfully analyzed "${fileName}" with AI extraction.`);
          if (onAnalysisComplete) onAnalysisComplete();
        } catch (err: any) {
          console.error("Analysis failed:", err);
          setUploadError(err.message || "Failed to process resume file. Please try pasting the text.");
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError("Could not read file from disk.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred.");
      setIsUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!rawText.trim()) {
      setUploadError("Please enter or paste your resume text.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const analyzed = await analyzeResumeApi({
        resumeText: rawText,
        fileName: "Pasted_Resume.txt",
      });
      setResumeData({
        ...analyzed,
        fileName: "Pasted_Resume.txt",
        rawText,
      });
      setUploadSuccess("Resume text successfully analyzed.");
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err: any) {
      setUploadError(err.message || "Analysis failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const loadSample = () => {
    setResumeData(SAMPLE_RESUME);
    setUploadSuccess("Loaded pre-configured engineering candidate resume.");
    setUploadError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload Section */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Resume Analyzer
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Upload your own PDF/DOCX resume or paste text. The AI extracts education, skills,
              projects, certs, detects weak/missing sections, and evaluates ATS compatibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTextPasteMode(!textPasteMode)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {textPasteMode ? "Switch to File Upload" : "Paste Text Instead"}
            </button>
            <button
              onClick={loadSample}
              className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Resume
            </button>
          </div>
        </div>

        {/* Drag & drop or text paste container */}
        <div className="mt-6">
          {!textPasteMode ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-600 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/70 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-input"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  ) : (
                    <Upload className="w-6 h-6 text-indigo-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {isUploading
                      ? "AI is extracting sections & analyzing keywords..."
                      : "Drag & drop your resume here, or click to browse"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PDF, DOCX, and TXT (Max 15MB) • No fixed template required
                  </p>
                </div>
                {resumeData.fileName && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-mono">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Currently Loaded: {resumeData.fileName}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the full text of your resume here (Education, Skills, Experience, Projects)..."
                rows={6}
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleTextSubmit}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Analyze Resume Text
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Profile Summary & Scores Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white">{resumeData.candidateName}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{resumeData.email}</span>
                {resumeData.phone && <span>• {resumeData.phone}</span>}
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {resumeData.summary || "No executive summary provided in resume."}
            </p>
          </div>

          {resumeData.links && resumeData.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-700/60">
              {resumeData.links.map((link, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900 text-[11px] font-mono text-indigo-400 border border-slate-700"
                >
                  {link}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ATS Score Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ATS Compatibility Score
          </span>
          <div className="relative my-3 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-emerald-400 border-r-emerald-400 flex items-center justify-center">
              <span className="text-2xl font-black text-emerald-400">
                {resumeData.sectionAnalysis?.atsScore || 80}%
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400">
            Readability:{" "}
            <strong className="text-slate-200">
              {resumeData.sectionAnalysis?.readabilityScore || 85}/100
            </strong>
          </span>
        </div>
      </div>

      {/* Extracted Sections Subtabs */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden">
        {/* Navigation */}
        <div className="flex border-b border-slate-700/80 overflow-x-auto bg-slate-900/50 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === "overview"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Education & Overview
          </button>
          <button
            onClick={() => setActiveSubTab("skills")}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === "skills"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="w-4 h-4" />
            Extracted Skills
          </button>
          <button
            onClick={() => setActiveSubTab("projects")}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === "projects"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projects ({resumeData.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab("experience")}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === "experience"
                ? "border-indigo-500 text-indigo-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Experience & Internships
          </button>
          <button
            onClick={() => setActiveSubTab("critique")}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === "critique"
                ? "border-amber-500 text-amber-400 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Missing & Weak Sections
          </button>
        </div>

        {/* Subtab Contents */}
        <div className="p-6">
          {/* 1. Education & Certs */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  Education History
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.education?.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-indigo-400">{edu.year}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                          {edu.score}
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-white">{edu.degree}</h5>
                      <p className="text-xs text-slate-300">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-[11px] text-slate-400">Major: {edu.fieldOfStudy}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="pt-4 border-t border-slate-700/60">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-amber-400" />
                    Certifications & Accreditations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {resumeData.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/60 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{cert.name}</p>
                          <p className="text-[11px] text-slate-400">{cert.issuer}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{cert.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Categorized Skills */}
          {activeSubTab === "skills" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Languages */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Programming Languages
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills?.languages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Frameworks & Libraries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills?.frameworksAndLibraries?.map((fw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Databases */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Databases & Storage
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills?.databases?.map((db, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                      >
                        {db}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools & Platforms */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Tools, Cloud & DevOps
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills?.toolsAndPlatforms?.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Soft Skills & Collaboration
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills?.softSkills?.map((soft, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-medium"
                    >
                      {soft}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Projects */}
          {activeSubTab === "projects" && (
            <div className="space-y-4">
              {resumeData.projects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-white">{proj.title}</h5>
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack?.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-400 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  {proj.keyAchievements && proj.keyAchievements.length > 0 && (
                    <ul className="space-y-1 pl-4 list-disc text-xs text-slate-400">
                      {proj.keyAchievements.map((ach, aidx) => (
                        <li key={aidx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4. Experience & Internships */}
          {activeSubTab === "experience" && (
            <div className="space-y-4">
              {resumeData.internshipsAndExperience && resumeData.internshipsAndExperience.length > 0 ? (
                resumeData.internshipsAndExperience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-white">{exp.role}</h5>
                        <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-800">
                        {exp.duration}
                      </span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300 mt-2">
                        {exp.responsibilities.map((resp, ridx) => (
                          <li key={ridx}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No professional internships detected. Consider adding academic projects or freelance work.
                </div>
              )}
            </div>
          )}

          {/* 5. Section Analysis: Missing & Weak */}
          {activeSubTab === "critique" && (
            <div className="space-y-5">
              {/* Missing Sections */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  Identified Missing Sections
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resumeData.sectionAnalysis?.missingSections?.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Sections with Suggestions */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Weak Sections & Actionable Suggestions
                </h5>
                <div className="space-y-3">
                  {resumeData.sectionAnalysis?.weakSections?.map((weak, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">{weak.section}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-semibold">
                          Needs Polish
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{weak.issue}</p>
                      <p className="text-xs text-emerald-400 font-medium pt-1">
                        💡 Fix: {weak.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths and Overall Recruiter Critique */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Candidate Strengths
                </span>
                <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300">
                  {resumeData.sectionAnalysis?.strengths?.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>

                <div className="mt-3 pt-3 border-t border-slate-700/60">
                  <span className="text-xs font-bold text-slate-300">Recruiter Critique:</span>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {resumeData.sectionAnalysis?.overallCritique}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
