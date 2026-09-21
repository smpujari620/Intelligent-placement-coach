import React, { useState, useEffect } from "react";
import { Navbar, ActiveTab } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ResumeAnalyzer } from "./components/ResumeAnalyzer";
import { JobAnalyzer } from "./components/JobAnalyzer";
import { MatchEngine } from "./components/MatchEngine";
import { SkillGapAnalysis } from "./components/SkillGapAnalysis";
import { RoadmapPlanner } from "./components/RoadmapPlanner";
import { InterviewSimulator } from "./components/InterviewSimulator";
import { TechnicalAssessment } from "./components/TechnicalAssessment";
import { AptitudePrep } from "./components/AptitudePrep";
import { CareerRecommendations } from "./components/CareerRecommendations";

import {
  ResumeData,
  JobDescriptionData,
  MatchAnalysisResult,
  CategorizedSkillGaps,
  RoadmapWeek,
  TechnicalAssessmentData,
  ProgressDashboardStats,
  InterviewRound,
} from "./types";

import {
  SAMPLE_RESUME,
  SAMPLE_JOB_DESCRIPTIONS,
  SAMPLE_MATCH_RESULT,
  SAMPLE_SKILL_GAPS,
  SAMPLE_ROADMAP,
  SAMPLE_TECHNICAL_ASSESSMENT,
  SAMPLE_CAREER_RECOMMENDATIONS,
} from "./data/sampleData";

import { compareMatchApi } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  // Core application states
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("ipc_resume");
    return saved ? JSON.parse(saved) : SAMPLE_RESUME;
  });

  const [jobData, setJobData] = useState<JobDescriptionData>(() => {
    const saved = localStorage.getItem("ipc_job");
    return saved ? JSON.parse(saved) : SAMPLE_JOB_DESCRIPTIONS[0];
  });

  const [matchResult, setMatchResult] = useState<MatchAnalysisResult>(() => {
    const saved = localStorage.getItem("ipc_match");
    return saved ? JSON.parse(saved) : SAMPLE_MATCH_RESULT;
  });

  const [skillGaps, setSkillGaps] = useState<CategorizedSkillGaps>(SAMPLE_SKILL_GAPS);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>(SAMPLE_ROADMAP);

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("ipc_completed_tasks");
    return saved ? JSON.parse(saved) : ["w1_d1_t1", "w1_d1_t2", "w1_d2_t1"];
  });

  const [assessmentData, setAssessmentData] = useState<TechnicalAssessmentData>(
    SAMPLE_TECHNICAL_ASSESSMENT
  );

  const [stats, setStats] = useState<ProgressDashboardStats>({
    preparationProgress: 35,
    testScoresAverage: 82,
    mockInterviewAverage: 84,
    technicalAssessmentScore: 85,
    aptitudeAccuracy: 88,
    resumeJobMatchPercentage: 82,
    completedTasksCount: 3,
    totalTasksCount: 20,
    readinessScore: 84,
  });

  // Persist key state
  useEffect(() => {
    localStorage.setItem("ipc_resume", JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem("ipc_job", JSON.stringify(jobData));
  }, [jobData]);

  useEffect(() => {
    localStorage.setItem("ipc_match", JSON.stringify(matchResult));
  }, [matchResult]);

  useEffect(() => {
    localStorage.setItem("ipc_completed_tasks", JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  // Handle task toggling in roadmap
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Re-run matching automatically when user updates resume or JD
  const handleResumeOrJobUpdated = async () => {
    try {
      const match = await compareMatchApi({ resumeData, jobData });
      setMatchResult(match);
    } catch (e) {
      console.error("Auto match sync error:", e);
    }
  };

  const handleInterviewSessionComplete = (round: InterviewRound, avgScore: number) => {
    setStats((prev: ProgressDashboardStats) => ({
      ...prev,
      mockInterviewAverage: Math.round((prev.mockInterviewAverage + avgScore) / 2),
    }));
  };

  const handleScoreUpdate = (score: number) => {
    setStats((prev: ProgressDashboardStats) => ({
      ...prev,
      technicalAssessmentScore: Math.round((prev.technicalAssessmentScore + score) / 2),
    }));
  };

  const handleAptitudeScoreUpdate = (category: string, score: number) => {
    setStats((prev: ProgressDashboardStats) => ({
      ...prev,
      aptitudeAccuracy: Math.min(100, Math.round((prev.aptitudeAccuracy + score) / 2)),
    }));
  };

  const handleSelectRoleFromCareers = (roleTitle: string) => {
    const matchedSample = SAMPLE_JOB_DESCRIPTIONS.find((s) => s.roleTitle.includes(roleTitle));
    if (matchedSample) {
      setJobData(matchedSample);
    } else {
      setJobData((prev) => ({ ...prev, roleTitle }));
    }
    setActiveTab("match");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top sticky navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetRole={jobData.roleTitle}
        readinessScore={stats.readinessScore}
        matchScore={matchResult.matchPercentage}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            resumeData={resumeData}
            jobData={jobData}
            matchResult={matchResult}
            roadmap={roadmap}
            completedTaskIds={completedTaskIds}
            stats={stats}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "resume" && (
          <ResumeAnalyzer
            resumeData={resumeData}
            setResumeData={setResumeData}
            onAnalysisComplete={handleResumeOrJobUpdated}
          />
        )}

        {activeTab === "job" && (
          <JobAnalyzer
            jobData={jobData}
            setJobData={setJobData}
            onAnalysisComplete={handleResumeOrJobUpdated}
          />
        )}

        {activeTab === "match" && (
          <MatchEngine
            resumeData={resumeData}
            jobData={jobData}
            matchResult={matchResult}
            setMatchResult={setMatchResult}
            onNavigateToRoadmap={() => setActiveTab("roadmap")}
            onNavigateToInterview={() => setActiveTab("interview")}
          />
        )}

        {activeTab === "gaps" && (
          <SkillGapAnalysis
            skillGaps={skillGaps}
            onNavigateToRoadmap={() => setActiveTab("roadmap")}
          />
        )}

        {activeTab === "roadmap" && (
          <RoadmapPlanner
            roadmap={roadmap}
            completedTaskIds={completedTaskIds}
            onToggleTask={handleToggleTask}
            targetRole={jobData.roleTitle}
          />
        )}

        {activeTab === "interview" && (
          <InterviewSimulator
            resumeData={resumeData}
            jobData={jobData}
            onSessionComplete={handleInterviewSessionComplete}
          />
        )}

        {activeTab === "assessment" && (
          <TechnicalAssessment
            assessmentData={assessmentData}
            setAssessmentData={setAssessmentData}
            targetRole={jobData.roleTitle}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {activeTab === "aptitude" && (
          <AptitudePrep onScoreUpdate={handleAptitudeScoreUpdate} />
        )}

        {activeTab === "careers" && (
          <CareerRecommendations
            recommendations={SAMPLE_CAREER_RECOMMENDATIONS}
            resumeData={resumeData}
            onSelectRole={handleSelectRoleFromCareers}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Intelligent Placement Coach &copy; {new Date().getFullYear()} • Powered by Gemini AI
            Engine
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ATS Resume Scorer</span>
            <span>•</span>
            <span>Role Matcher</span>
            <span>•</span>
            <span>Mock AI Interview</span>
            <span>•</span>
            <span>Prep Roadmap</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
