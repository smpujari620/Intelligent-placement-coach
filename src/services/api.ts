import {
  ResumeData,
  JobDescriptionData,
  MatchAnalysisResult,
  InterviewRound,
  InterviewQuestion,
  AnswerEvaluation,
  TechnicalAssessmentData,
  AptitudeCategoryData,
} from "../types";

export async function analyzeResumeApi(payload: {
  resumeText?: string;
  pdfBase64?: string;
  mimeType?: string;
  fileName?: string;
}): Promise<ResumeData> {
  const response = await fetch("/api/resume/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to analyze resume.");
  }
  return response.json();
}

export async function analyzeJobApi(payload: {
  jobDescription: string;
  roleTitle?: string;
  company?: string;
}): Promise<JobDescriptionData> {
  const response = await fetch("/api/job/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to analyze job description.");
  }
  return response.json();
}

export async function compareMatchApi(payload: {
  resumeData: ResumeData;
  jobData: JobDescriptionData;
}): Promise<MatchAnalysisResult> {
  const response = await fetch("/api/match/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to compare resume and job description.");
  }
  return response.json();
}

export async function generateInterviewQuestionApi(payload: {
  round: InterviewRound;
  resumeData?: ResumeData;
  jobData?: JobDescriptionData;
  previousQuestions?: any[];
  targetRole?: string;
}): Promise<InterviewQuestion> {
  const response = await fetch("/api/interview/generate-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate interview question.");
  }
  return response.json();
}

export async function evaluateInterviewAnswerApi(payload: {
  question: string;
  candidateAnswer: string;
  round: InterviewRound;
  targetRole?: string;
  expectedKeyPoints?: string[];
}): Promise<AnswerEvaluation> {
  const response = await fetch("/api/interview/evaluate-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to evaluate answer.");
  }
  return response.json();
}

export async function generateAssessmentApi(payload: {
  targetRole?: string;
  techStack?: string[];
  difficulty?: string;
}): Promise<TechnicalAssessmentData> {
  const response = await fetch("/api/assessment/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate technical assessment.");
  }
  return response.json();
}

export async function evaluateCodeApi(payload: {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language?: string;
  testCases?: any[];
}): Promise<any> {
  const response = await fetch("/api/assessment/evaluate-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to evaluate code.");
  }
  return response.json();
}

export async function generateAptitudeApi(payload: {
  category: "quantitative" | "logical" | "verbal";
  difficulty?: "easy" | "medium" | "hard";
  count?: number;
}): Promise<AptitudeCategoryData> {
  const response = await fetch("/api/aptitude/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate aptitude questions.");
  }
  return response.json();
}
