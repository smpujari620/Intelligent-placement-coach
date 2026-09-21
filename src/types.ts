export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  score: string;
  fieldOfStudy?: string;
}

export interface ProjectItem {
  title: string;
  techStack: string[];
  description: string;
  keyAchievements: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

export interface WeakSectionItem {
  section: string;
  issue: string;
  suggestion: string;
}

export interface SectionAnalysis {
  missingSections: string[];
  weakSections: WeakSectionItem[];
  atsScore: number;
  readabilityScore: number;
  strengths: string[];
  overallCritique: string;
}

export interface ResumeData {
  candidateName: string;
  email: string;
  phone: string;
  links?: string[];
  summary: string;
  education: EducationItem[];
  skills: {
    languages: string[];
    frameworksAndLibraries: string[];
    databases: string[];
    toolsAndPlatforms: string[];
    softSkills: string[];
  };
  projects: ProjectItem[];
  certifications: CertificationItem[];
  internshipsAndExperience: ExperienceItem[];
  sectionAnalysis: SectionAnalysis;
  rawText?: string;
  fileName?: string;
}

export interface JobDescriptionData {
  roleTitle: string;
  company: string;
  experienceLevel: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  qualifications: string[];
  responsibilities: string[];
  keyDomains: string[];
  hiringPriorities?: string[];
  rawText?: string;
}

export interface SkillGapItem {
  name: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  learningPath: string;
}

export interface CategorizedSkillGaps {
  technicalSkills: SkillGapItem[];
  programming: SkillGapItem[];
  aptitude: SkillGapItem[];
  communication: SkillGapItem[];
  softSkills: SkillGapItem[];
  domainKnowledge: SkillGapItem[];
}

export interface RoadmapTask {
  id: string;
  task: string;
  duration: string;
  completed?: boolean;
}

export interface RoadmapDay {
  day: number;
  title: string;
  category: string;
  tasks: RoadmapTask[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  focus: string;
  days: RoadmapDay[];
}

export interface CareerRoleRecommendation {
  id: string;
  roleTitle: string;
  matchPercentage: number;
  rationale: string;
  salaryRange: string;
  marketDemand: string;
  matchingSkills: string[];
  missingSkillsToBridge: string[];
  typicalCompanies: string[];
}

export interface CareerRecommendation {
  role: string;
  matchScore: number;
  reasons: string[];
  pros: string[];
  growthAreas: string[];
}

export interface MatchAnalysisResult {
  matchPercentage: number;
  matchingSkills: Array<{
    skill: string;
    evidenceInResume: string;
    relevance: string;
  }>;
  missingSkills: Array<{
    skill: string;
    importance: "critical" | "preferred";
    category: string;
  }>;
  relevantExperience: {
    score: number;
    verdict: string;
    relevantProjects: string[];
    gaps: string[];
  };
  skillGapsCategorized: CategorizedSkillGaps;
  personalizedRoadmap: RoadmapWeek[];
  careerRecommendations: CareerRecommendation[];
}

export type InterviewRound = "hr" | "technical" | "behavioral" | "role-specific";

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  round: InterviewRound;
  question: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  interviewerTone: string;
  contextHint: string;
  expectedKeyPoints: string[];
}

export interface AnswerEvaluation {
  correctness: number;
  relevance: number;
  confidence: number;
  communication: number;
  technicalDepth: number;
  completeness: number;
  overallScore: number;
  verdict: "Strong Hire" | "Hire" | "Borderline" | "Needs Improvement";
  strengths: string[];
  areasForImprovement: string[];
  modelAnswer: string;
  quickTip: string;
}

export interface InterviewQAItem {
  question: InterviewQuestion;
  candidateAnswer: string;
  evaluation?: AnswerEvaluation;
  answeredAt: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  language: string;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    explanation?: string;
  }>;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface SQLProblem {
  id: string;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  description?: string;
  schemaDescription: string;
  sampleData?: string;
  starterQuery?: string;
  expectedOutput?: string;
  expectedQuery?: string;
  explanation?: string;
}

export interface DebuggingProblem {
  id: string;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  description?: string;
  language: string;
  buggyCode: string;
  bugDescription: string;
  expectedFixExplanation?: string;
}

export interface TechnicalAssessmentData {
  codingProblems: CodingProblem[];
  mcqs: MCQQuestion[];
  sqlProblems: SQLProblem[];
  debuggingProblems: DebuggingProblem[];
}

export interface AptitudeQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
  recommendedTimeSeconds?: number;
  formula?: string;
}

export interface AptitudeCategoryData {
  category: "quantitative" | "logical" | "verbal";
  difficulty?: "easy" | "medium" | "hard";
  questions: AptitudeQuestion[];
  categoryScore?: number;
}

export interface ProgressDashboardStats {
  preparationProgress: number;
  testScoresAverage: number;
  mockInterviewAverage: number;
  technicalAssessmentScore: number;
  aptitudeAccuracy: number;
  resumeJobMatchPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  readinessScore: number;
}

export interface UserAssessmentStats {
  codingScore: number;
  mcqScore: number;
  sqlScore: number;
  debuggingScore: number;
  aptitudeScore: number;
  interviewScores: {
    hr: number[];
    technical: number[];
    behavioral: number[];
    roleSpecific: number[];
  };
  completedTaskIds: string[];
  lastUpdated: string;
}
