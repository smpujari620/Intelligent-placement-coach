import {
  ResumeData,
  JobDescriptionData,
  MatchAnalysisResult,
  UserAssessmentStats,
  CareerRoleRecommendation,
  TechnicalAssessmentData,
  AptitudeCategoryData,
} from "../types";

export const SAMPLE_RESUME: ResumeData = {
  candidateName: "Alex Rivera",
  email: "alex.rivera@campus.edu",
  phone: "+1 (555) 234-8901",
  links: ["github.com/alexrivera", "linkedin.com/in/alex-rivera-tech"],
  summary: "Final year Computer Science student with practical experience building scalable web backends, RESTful microservices, and distributed caching systems. Experienced in software engineering internships with a focus on API performance and clean code.",
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "National Institute of Technology",
      year: "2021 - 2025",
      score: "8.72 / 10 CGPA",
      fieldOfStudy: "Computer Science",
    },
    {
      degree: "Higher Secondary Certificate (XII) - Science",
      institution: "Delhi Public School",
      year: "2021",
      score: "94.2%",
      fieldOfStudy: "PCM with Computer Science",
    },
  ],
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
    frameworksAndLibraries: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "Next.js"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
    toolsAndPlatforms: ["Git", "GitHub", "Docker", "AWS (EC2, S3)", "Postman", "Linux/Bash"],
    softSkills: ["Technical Communication", "Agile/Scrum", "Analytical Problem Solving", "Peer Code Reviews"],
  },
  projects: [
    {
      title: "Campus Placement Portal & Mock Evaluation Suite",
      techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
      description: "Architected a comprehensive university recruitment hub serving 600+ students, supporting company eligibility filtering, slot booking, and online assessment tracking.",
      keyAchievements: [
        "Reduced manual placement cell notification broadcast time by 85%",
        "Implemented JWT authentication, role-based access control, and transactional email triggers",
      ],
    },
    {
      title: "Distributed Real-Time Collaboration Canvas",
      techStack: ["Node.js", "Socket.io", "Redis", "MongoDB"],
      description: "Engineered an ultra-low latency real-time collaborative workspace with operational transformation, persistent board state, and user presence detection.",
      keyAchievements: [
        "Benchmarked 1,200 concurrent socket connections with sub-35ms broadcast latency",
        "Used Redis Pub/Sub channels to scale horizontally across multiple Node worker instances",
      ],
    },
  ],
  certifications: [
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2024" },
    { name: "Meta Front-End Developer Professional Certificate", issuer: "Meta / Coursera", year: "2023" },
  ],
  internshipsAndExperience: [
    {
      role: "Software Engineering Intern",
      company: "InnovateX Solutions",
      duration: "May 2024 - Aug 2024",
      responsibilities: [
        "Redesigned the customer checkout API endpoints, trimming p95 server response latency by 34%",
        "Wrote 30+ automated integration tests in Jest and Supertest achieving 92% code coverage",
        "Participated in daily standups, sprint estimation, and production deployment canary releases",
      ],
    },
  ],
  sectionAnalysis: {
    missingSections: [
      "Quantifiable user acquisition metrics in project descriptions",
      "Competitive programming rating badge (LeetCode / Codeforces)",
      "High-Level System Design project highlight",
    ],
    weakSections: [
      {
        section: "Projects",
        issue: "Descriptions highlight implementation details well, but could better quantify business impact and production loads.",
        suggestion: "Adopt the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.",
      },
      {
        section: "Certifications",
        issue: "Lacks advanced algorithm certification or low-level systems proof of competence.",
        suggestion: "Complete a recognized Distributed Systems or Advanced Algorithms specialization.",
      },
    ],
    atsScore: 84,
    readabilityScore: 92,
    strengths: [
      "Strong core computer science stack with JavaScript/TypeScript, SQL, and Git",
      "Proven summer internship with tangible performance optimization achievements",
      "Clean, highly readable structure compliant with ATS parsing algorithms",
    ],
    overallCritique: "A very strong candidate profile for entry-level tech placement. Enhancing project bullet points with explicit scale metrics and practicing high-level architecture trade-offs will place this candidate firmly in Tier-1 hiring tiers.",
  },
  fileName: "Alex_Rivera_Software_Engineer_Resume.pdf",
};

export const SAMPLE_JOB_DESCRIPTIONS: JobDescriptionData[] = [
  {
    roleTitle: "Software Development Engineer (SDE-1)",
    company: "Amazon / Microsoft Tier",
    experienceLevel: "Entry-Level / Fresher (0-2 Years)",
    requiredSkills: [
      "Data Structures & Algorithms (Trees, Graphs, DP)",
      "Object-Oriented Programming (Java, C++, or Python)",
      "RESTful API Development & HTTP Protocols",
      "Relational Databases & SQL Query Optimization",
      "Git & Collaborative Software Development",
      "Problem Solving & Clean Code Standards",
    ],
    preferredSkills: [
      "Distributed Caching (Redis/Memcached)",
      "Docker & Containerization",
      "Basic System Design & Concurrency",
      "Cloud Infrastructure (AWS EC2, S3, SQS)",
      "CI/CD Pipeline Integration",
    ],
    technologies: ["Java", "Python", "Node.js", "PostgreSQL", "Docker", "AWS", "Git"],
    qualifications: [
      "B.Tech / B.E. / M.C.A. in Computer Science, Information Technology, or allied branches",
      "Minimum 7.0 CGPA or 70% in graduation",
      "Sound conceptual grasp of OS, DBMS, Computer Networks, and OOPS",
    ],
    responsibilities: [
      "Design, develop, and maintain resilient backend services and high-volume data pipelines",
      "Collaborate with senior technical leads and product managers to clarify product specifications",
      "Write clean, modular, and thoroughly tested code with robust unit and integration suites",
      "Troubleshoot production incidents, participate in post-mortems, and identify root causes",
    ],
    keyDomains: ["Distributed Systems", "Cloud Computing", "Backend Platforms"],
    hiringPriorities: [
      "DSA coding round mastery with optimal time/space complexity",
      "Clarity during behavioral rounds using the STAR method",
      "Deep foundational understanding of database indexes and OS memory management",
    ],
    rawText: `Job Title: Software Development Engineer (SDE-1)
Company: Global Tech Systems
Location: Hybrid

About the Role:
We are seeking an ambitious, problem-solving SDE-1 to join our core engineering organization. You will build highly scalable distributed microservices processing millions of daily transactions.

Key Responsibilities:
- Design, implement, and maintain high-throughput backend services and customer-facing APIs.
- Collaborate with cross-functional teams to translate business needs into robust technical systems.
- Maintain top-tier code quality via peer reviews, automated testing, and CI/CD pipelines.

Requirements:
- Bachelor's or Master's degree in Computer Science or related STEM field.
- Proficiency in at least one modern language: Java, Python, C++, or TypeScript.
- Strong problem-solving skills with deep knowledge of Data Structures & Algorithms.
- Working knowledge of SQL, database design, and Git version control.`,
  },
  {
    roleTitle: "Full Stack Engineer",
    company: "ScaleUp FinTech",
    experienceLevel: "Fresher / Junior (0-2 Years)",
    requiredSkills: [
      "React.js / Next.js & Modern Frontend Architecture",
      "Node.js / Express or Python / FastAPI Backends",
      "State Management & REST / GraphQL APIs",
      "PostgreSQL / MongoDB Database Design",
      "HTML5, CSS3, Tailwind CSS & Responsive Layouts",
    ],
    preferredSkills: [
      "TypeScript Strict Typing",
      "Redis Caching & WebSockets",
      "Payment Gateway Integration (Stripe, Razorpay)",
      "Jest / Playwright Automated Testing",
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Redis"],
    qualifications: [
      "Degree in Computer Science or demonstrated equivalent project portfolio",
      "Proven full-stack project building and deployment experience",
    ],
    responsibilities: [
      "Build seamless user interfaces paired with robust, high-performance API backends",
      "Optimize frontend bundle sizes, Core Web Vitals, and server response times",
      "Collaborate with UI/UX designers to implement pixel-perfect user journeys",
    ],
    keyDomains: ["Financial Technology", "Web Applications", "Client-Server Architecture"],
    hiringPriorities: ["Full-stack architecture defense", "Frontend responsiveness", "API security"],
  },
  {
    roleTitle: "Data Analyst & Business Intelligence",
    company: "Insight Analytics Corp",
    experienceLevel: "Entry-Level (0-2 Years)",
    requiredSkills: [
      "Advanced SQL (Joins, Window Functions, CTEs)",
      "Python for Data Analysis (Pandas, NumPy)",
      "Data Visualization (Tableau, PowerBI, or Matplotlib)",
      "Descriptive & Inferential Statistics",
      "Data Cleaning & ETL Pipelines",
    ],
    preferredSkills: [
      "Machine Learning Basics (Scikit-Learn)",
      "Cloud Data Warehousing (BigQuery, Snowflake)",
      "Business Acumen & Stakeholder Presentation",
    ],
    technologies: ["SQL", "Python", "Pandas", "Tableau", "PowerBI", "PostgreSQL"],
    qualifications: [
      "Bachelor's in Engineering, Mathematics, Statistics, or Computer Science",
      "Proficiency in extracting insights from complex multi-table relational datasets",
    ],
    responsibilities: [
      "Write optimized SQL queries to extract, transform, and aggregate operational metrics",
      "Build automated KPI executive dashboards providing real-time visibility",
      "Conduct cohort retention and funnel drop-off analyses to advise product teams",
    ],
    keyDomains: ["Business Intelligence", "Product Analytics", "Data Warehousing"],
    hiringPriorities: ["Complex SQL live test", "Analytical problem solving", "Data storytelling"],
  },
  {
    roleTitle: "QA Automation Engineer (SDET)",
    company: "CloudCore Software",
    experienceLevel: "Entry-Level (0-2 Years)",
    requiredSkills: [
      "Test Automation Frameworks (Selenium, Cypress, or Playwright)",
      "API Testing (Postman, REST Assured, Supertest)",
      "Programming Proficiency in JavaScript/Python/Java",
      "Test Case Design & Bug Lifecycle Management",
      "CI/CD Integration (GitHub Actions / Jenkins)",
    ],
    preferredSkills: [
      "Performance Testing (JMeter, k6)",
      "Docker for Test Environments",
      "Security & Penetration Testing Basics",
    ],
    technologies: ["Playwright", "Cypress", "JavaScript", "Postman", "Jest", "Git"],
    qualifications: [
      "B.Tech in CS/IT or relevant software engineering background",
      "Keen eye for software edge cases, race conditions, and automated regression suites",
    ],
    responsibilities: [
      "Architect and maintain automated regression suites across web and API layers",
      "Collaborate with development teams in sprint planning to define acceptance test criteria",
      "Perform exploratory manual tests on new features prior to major releases",
    ],
    keyDomains: ["Quality Assurance", "Test Automation", "Release Reliability"],
    hiringPriorities: ["Automated script writing", "API test coverage", "Defect root-cause analysis"],
  },
];

export const INITIAL_MATCH_RESULT: MatchAnalysisResult = {
  matchPercentage: 81,
  matchingSkills: [
    { skill: "JavaScript & TypeScript", evidenceInResume: "Listed in primary skills and implemented across 2 full-stack projects", relevance: "Critical" },
    { skill: "Node.js & REST APIs", evidenceInResume: "Refactored checkout API in summer internship, improving p95 latency by 34%", relevance: "Critical" },
    { skill: "SQL & Relational Databases", evidenceInResume: "PostgreSQL & MySQL proficiency with schema design in placement portal", relevance: "High" },
    { skill: "Git & Version Control", evidenceInResume: "Active GitHub profile and collaborative git branching workflow", relevance: "High" },
    { skill: "Cloud Fundamentals (AWS)", evidenceInResume: "Holds AWS Certified Cloud Practitioner credential", relevance: "Medium" },
    { skill: "Unit & Integration Testing", evidenceInResume: "30+ Jest and Supertest integration tests with 92% coverage", relevance: "High" },
  ],
  missingSkills: [
    { skill: "Advanced System Design & Scalability", importance: "critical", category: "Technical Skills" },
    { skill: "Low-Level Concurrency & Multithreading", importance: "critical", category: "Programming" },
    { skill: "Complex Dynamic Programming Mastery", importance: "critical", category: "Programming" },
    { skill: "Container Orchestration (Kubernetes)", importance: "preferred", category: "Domain Knowledge" },
    { skill: "Executive STAR Behavioral Delivery", importance: "preferred", category: "Communication" },
  ],
  relevantExperience: {
    score: 84,
    verdict: "Strong technical alignment for an entry-level SDE candidate. Demonstrated production API experience during internship. Preparing algorithmic DSA and concurrency will guarantee interview success.",
    relevantProjects: ["Campus Placement Portal", "Distributed Real-Time Collaboration Canvas"],
    gaps: ["Production Kubernetes deployment", "Large-scale distributed message queues (Kafka)"],
  },
  skillGapsCategorized: {
    technicalSkills: [
      { name: "System Design & Architecture", severity: "High", description: "Caching strategies, Load balancers, CAP theorem, and Database Sharding.", learningPath: "Study Designing Data-Intensive Applications chapters 1-5 and practice mock URL shortener architecture." },
      { name: "Operating Systems & Concurrency", severity: "Medium", description: "Deadlocks, Mutex/Semaphores, Virtual Memory paging, and Linux system calls.", learningPath: "Review Silberschatz OS concepts and practice thread synchronization problems." },
    ],
    programming: [
      { name: "Advanced DSA (Trees & Dynamic Programming)", severity: "High", description: "Graph traversals (Dijkstra, BFS/DFS), Binary Search variations, and 2D DP.", learningPath: "Complete NeetCode 150 Blind Graph & DP sections with 2 problems per day." },
      { name: "OOP Design Patterns", severity: "Medium", description: "Factory, Singleton, Observer, and Strategy patterns with SOLID principles.", learningPath: "Implement 5 design patterns in Java/Python with clean UML diagrams." },
    ],
    aptitude: [
      { name: "Quantitative Aptitude (Speed & Distance, Work)", severity: "Medium", description: "Timed calculations for campus screening online assessment (OA).", learningPath: "Practice 20 questions daily from RS Aggarwal Quantitative Aptitude." },
      { name: "Logical Reasoning (Puzzles & Blood Relations)", severity: "Low", description: "Complex matrix seating arrangements and syllogisms.", learningPath: "Solve 10 puzzle problems daily on IndiaBIX." },
    ],
    communication: [
      { name: "STAR Method Narrative Articulation", severity: "Medium", description: "Structuring behavioral answers with Situation, Task, Action, and Result.", learningPath: "Draft 5 written STAR stories for conflict, leadership, failure, and initiative." },
    ],
    softSkills: [
      { name: "Negotiation & Cross-Team Empathy", severity: "Low", description: "Demonstrating adaptability and handling ambiguous requirements.", learningPath: "Practice situational questions on handling conflicting engineer viewpoints." },
    ],
    domainKnowledge: [
      { name: "SQL Indexing & Query Optimization", severity: "High", description: "B-Tree vs Hash indexes, EXPLAIN ANALYZE, and ACID transaction isolation levels.", learningPath: "Perform benchmark queries in PostgreSQL with index analysis." },
    ],
  },
  personalizedRoadmap: [
    {
      week: 1,
      title: "Week 1: Algorithmic Foundations & Core CS",
      focus: "Master Arrays, Hashing, Two Pointers, and Operating System memory fundamentals",
      days: [
        {
          day: 1,
          title: "Arrays & String Manipulation",
          category: "Programming",
          tasks: [
            { id: "w1d1t1", task: "Solve 3 LeetCode Mediums on Two Pointers & Sliding Window", duration: "2 hours", completed: true },
            { id: "w1d1t2", task: "Review OS Process Lifecycle & Thread Synchronization", duration: "1 hour", completed: true },
          ],
        },
        {
          day: 2,
          title: "Linked Lists & Fast/Slow Pointers",
          category: "Programming",
          tasks: [
            { id: "w1d2t1", task: "Implement LRU Cache using Doubly Linked List + HashMap", duration: "1.5 hours", completed: true },
            { id: "w1d2t2", task: "Aptitude Drill: 15 Quantitative Problems on Time & Work", duration: "45 mins", completed: false },
          ],
        },
        {
          day: 3,
          title: "Binary Trees & BST Traversals",
          category: "Programming",
          tasks: [
            { id: "w1d3t1", task: "Master Inorder, Preorder, Postorder, and Level Order traversals", duration: "2 hours", completed: false },
            { id: "w1d3t2", task: "Review DBMS ACID properties and Normalization (1NF to BCNF)", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 4,
          title: "Mock Interview Round 1 (Technical Fundamentals)",
          category: "Mock Interview",
          tasks: [
            { id: "w1d4t1", task: "Conduct AI Technical Mock Interview focusing on Data Structures", duration: "45 mins", completed: false },
            { id: "w1d4t2", task: "Analyze answer evaluation scores and revise weak concepts", duration: "30 mins", completed: false },
          ],
        },
      ],
    },
    {
      week: 2,
      title: "Week 2: Advanced Data Structures & SQL Mastery",
      focus: "Graphs, Dynamic Programming basics, and High-Performance SQL",
      days: [
        {
          day: 5,
          title: "Graph Algorithms (BFS / DFS & Topo Sort)",
          category: "Programming",
          tasks: [
            { id: "w2d1t1", task: "Solve Number of Islands, Course Schedule, and Clone Graph", duration: "2 hours", completed: false },
            { id: "w2d1t2", task: "Logical Reasoning: Syllogisms and Seating Arrangement Drill", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 6,
          title: "SQL Deep-Dive & Indexing",
          category: "Technical Skills",
          tasks: [
            { id: "w2d2t1", task: "Practice 10 complex SQL queries with Window Functions & CTEs", duration: "1.5 hours", completed: false },
            { id: "w2d2t2", task: "Complete LeetCode Database Medium challenge set", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 7,
          title: "Resume Project Technical Defense",
          category: "Domain Knowledge",
          tasks: [
            { id: "w2d3t1", task: "Prepare 5 deep-dive technical questions for your featured resume project", duration: "1.5 hours", completed: false },
            { id: "w2d3t2", task: "Draft architecture diagram and trade-off justifications", duration: "45 mins", completed: false },
          ],
        },
        {
          day: 8,
          title: "Coding Assessment Simulation",
          category: "Programming",
          tasks: [
            { id: "w2d4t1", task: "Take 60-minute timed Online Assessment (2 Coding + 10 MCQs)", duration: "1 hour", completed: false },
          ],
        },
      ],
    },
    {
      week: 3,
      title: "Week 3: System Design & Behavioral Interview Readiness",
      focus: "High-level architecture, scalability principles, and STAR method mastery",
      days: [
        {
          day: 9,
          title: "High-Level System Design Fundamentals",
          category: "Technical Skills",
          tasks: [
            { id: "w3d1t1", task: "Design a URL Shortener (Bitly) with database schema and API contracts", duration: "2 hours", completed: false },
            { id: "w3d1t2", task: "Study caching strategies: Redis Cache-Aside vs Write-Through", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 10,
          title: "STAR Behavioral Storytelling",
          category: "Communication",
          tasks: [
            { id: "w3d2t1", task: "Draft 4 STAR responses for Leadership, Conflict, Technical Failure, and Deadline", duration: "1.5 hours", completed: false },
            { id: "w3d2t2", task: "Practice mock HR round answering 'Tell me about yourself' in under 90 seconds", duration: "45 mins", completed: false },
          ],
        },
        {
          day: 11,
          title: "Verbal Ability & Aptitude Speed Drill",
          category: "Aptitude",
          tasks: [
            { id: "w3d3t1", task: "Complete 20 Verbal Ability questions (Reading Comprehension & Para Jumbles)", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 12,
          title: "Full Mock Interview: Behavioral & HR",
          category: "Mock Interview",
          tasks: [
            { id: "w3d4t1", task: "Complete AI Mock Interview: HR & Culture Fit Round", duration: "45 mins", completed: false },
          ],
        },
      ],
    },
    {
      week: 4,
      title: "Week 4: Final Placement Sprints & Company Simulations",
      focus: "Comprehensive mock rounds, rapid debugging, and final readiness verification",
      days: [
        {
          day: 13,
          title: "Code Debugging & Edge Cases",
          category: "Programming",
          tasks: [
            { id: "w4d1t1", task: "Solve 5 technical debugging challenges against tight time constraints", duration: "1.5 hours", completed: false },
            { id: "w4d1t2", task: "Revise Computer Networking: TCP 3-way handshake, DNS, HTTP/HTTPS", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 14,
          title: "Comprehensive Role-Specific Mock Round",
          category: "Mock Interview",
          tasks: [
            { id: "w4d2t1", task: "Take Full-length Role-Specific AI Interview with comprehensive score analysis", duration: "1 hour", completed: false },
          ],
        },
        {
          day: 15,
          title: "Final Placement Readiness Audit",
          category: "Revision",
          tasks: [
            { id: "w4d3t1", task: "Review Dashboard placement readiness index and polish last-mile gaps", duration: "1 hour", completed: false },
            { id: "w4d3t2", task: "Final resume polish and verification against ATS parser", duration: "30 mins", completed: false },
          ],
        },
      ],
    },
  ],
  careerRecommendations: [
    {
      role: "Software Development Engineer (Backend / SDE-1)",
      matchScore: 88,
      reasons: [
        "Strong foundation in Node.js, REST APIs, and relational databases demonstrated in projects",
        "Experience optimizing API response times during software engineering internship",
      ],
      pros: ["High hiring volume across tech startups and Fortune 500 tech firms", "Clear promotion ladder to Senior SDE"],
      growthAreas: ["Practice more multi-threaded concurrency and distributed caching"],
    },
    {
      role: "Full Stack Web Developer",
      matchScore: 84,
      reasons: [
        "Proficiency in both modern React frontends and Node.js/PostgreSQL backends",
        "End-to-end deployment experience with auth and state management",
      ],
      pros: ["High flexibility in product teams", "Direct visibility into end-user business value"],
      growthAreas: ["Strengthen CSS responsive grid fundamentals and SSR optimization"],
    },
    {
      role: "Data Analyst / Data Engineer",
      matchScore: 76,
      reasons: [
        "Solid SQL querying skills and Python scripting foundation",
        "Understanding of relational schemas and database normalization",
      ],
      pros: ["Rapidly expanding field with strong enterprise demand", "Direct involvement in strategic decision making"],
      growthAreas: ["Add Pandas/NumPy data wrangling and PowerBI/Tableau dashboarding"],
    },
    {
      role: "QA Automation Engineer (SDET)",
      matchScore: 80,
      reasons: [
        "Hands-on experience writing Jest and Supertest unit/integration suites with 92% coverage",
        "Solid knowledge of API contracts, test automation, and edge cases",
      ],
      pros: ["Crucial role in release quality", "Seamless crossover to core backend engineering"],
      growthAreas: ["Learn Playwright/Cypress for end-to-end browser testing and CI/CD pipelines"],
    },
    {
      role: "Cloud & DevOps Associate",
      matchScore: 72,
      reasons: [
        "Possesses AWS Certified Cloud Practitioner credential",
        "Familiarity with Docker containerization and Linux terminal environments",
      ],
      pros: ["Premium compensation and mission-critical infrastructure responsibility"],
      growthAreas: ["Master Kubernetes, Terraform infrastructure-as-code, and GitHub Actions"],
    },
  ],
};

export const INITIAL_USER_STATS: UserAssessmentStats = {
  codingScore: 85,
  mcqScore: 78,
  sqlScore: 90,
  debuggingScore: 82,
  aptitudeScore: 80,
  interviewScores: {
    hr: [84, 88],
    technical: [80, 85],
    behavioral: [82],
    roleSpecific: [86],
  },
  completedTaskIds: ["w1d1t1", "w1d1t2", "w1d2t1"],
  lastUpdated: new Date().toISOString(),
};

export const SAMPLE_MATCH_RESULT = INITIAL_MATCH_RESULT;
export const SAMPLE_SKILL_GAPS = INITIAL_MATCH_RESULT.skillGapsCategorized;
export const SAMPLE_ROADMAP = INITIAL_MATCH_RESULT.personalizedRoadmap;

export const SAMPLE_CAREER_RECOMMENDATIONS: CareerRoleRecommendation[] = [
  {
    id: "role_1",
    roleTitle: "Software Development Engineer (Backend / SDE-1)",
    matchPercentage: 88,
    rationale:
      "Strong foundation in Node.js, REST APIs, and PostgreSQL demonstrated in resume projects, coupled with internship experience optimizing API throughput.",
    salaryRange: "$95,000 - $135,000 / ₹14 - 24 LPA",
    marketDemand: "Very High",
    matchingSkills: ["JavaScript", "TypeScript", "Node.js", "Express", "PostgreSQL", "Git"],
    missingSkillsToBridge: ["Distributed Caching with Redis", "Docker containerization", "System design basics"],
    typicalCompanies: ["Amazon", "Uber", "Razorpay", "Atlassian", "Microsoft"],
  },
  {
    id: "role_2",
    roleTitle: "Full Stack Web Developer",
    matchPercentage: 84,
    rationale:
      "Proficient in both modern React frontends with Tailwind and backend API architectures with state management.",
    salaryRange: "$90,000 - $125,000 / ₹12 - 20 LPA",
    marketDemand: "High",
    matchingSkills: ["React.js", "Tailwind CSS", "REST APIs", "SQL", "JWT Auth"],
    missingSkillsToBridge: ["Next.js App Router SSR", "Advanced Webpack/Vite bundler tuning", "GraphQL basics"],
    typicalCompanies: ["Stripe", "Airbnb", "Swiggy", "Zomato", "Intuit"],
  },
  {
    id: "role_3",
    roleTitle: "Data Analyst / Analytics Engineer",
    matchPercentage: 76,
    rationale:
      "Demonstrated proficiency in writing complex multi-table SQL queries, database normalization, and analytical reasoning.",
    salaryRange: "$80,000 - $115,000 / ₹10 - 18 LPA",
    marketDemand: "High",
    matchingSkills: ["SQL (PostgreSQL / MySQL)", "Python", "Data Modeling", "Schema Design"],
    missingSkillsToBridge: ["Pandas & NumPy data wrangling", "Tableau / PowerBI dashboards", "Snowflake / BigQuery"],
    typicalCompanies: ["Deloitte", "Mu Sigma", "Fractal", "Target", "Walmart Global Tech"],
  },
  {
    id: "role_4",
    roleTitle: "QA Automation Engineer (SDET)",
    matchPercentage: 80,
    rationale:
      "Hands-on experience writing unit test suites (Jest/Supertest) with 92% coverage and strong grasp of API edge conditions.",
    salaryRange: "$85,000 - $120,000 / ₹11 - 19 LPA",
    marketDemand: "Steady",
    matchingSkills: ["JavaScript", "Jest & Supertest", "API Testing", "Postman", "Git"],
    missingSkillsToBridge: ["Playwright / Cypress browser automation", "CI/CD automated regression", "k6 load testing"],
    typicalCompanies: ["Adobe", "Salesforce", "Cisco", "Oracle", "SAP Labs"],
  },
  {
    id: "role_5",
    roleTitle: "Cloud & DevOps Associate",
    matchPercentage: 72,
    rationale:
      "Earned AWS Certified Cloud Practitioner credential and displays comfortable familiarity with Linux command-line workflows.",
    salaryRange: "$90,000 - $130,000 / ₹12 - 22 LPA",
    marketDemand: "Very High",
    matchingSkills: ["AWS Fundamentals", "Linux / Bash", "Git", "Networking basics"],
    missingSkillsToBridge: ["Kubernetes pod management", "Terraform IAC", "Prometheus & Grafana monitoring"],
    typicalCompanies: ["Red Hat", "Morgan Stanley", "JPMorgan Chase", "Accenture", "Infosys"],
  },
];

export const SAMPLE_TECHNICAL_ASSESSMENT: TechnicalAssessmentData = {
  codingProblems: [
    {
      id: "code_1",
      title: "Group Anagrams by Frequency",
      difficulty: "Medium",
      description: "Given an array of strings strs, group the anagrams together. Return the answer in any order.",
      starterCode: `function groupAnagrams(strs) {\n  // Write your O(N * K) solution here\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}`,
      language: "javascript",
      testCases: [
        {
          input: '["eat","tea","tan","ate","nat","bat"]',
          expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        },
        {
          input: '["a"]',
          expectedOutput: '[["a"]]',
        },
      ],
    },
    {
      id: "code_2",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      description: "Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.",
      starterCode: `function subarraySum(nums, k) {\n  // Use prefix-sum hash map in O(N) time\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n  for (const num of nums) {\n    sum += num;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}`,
      language: "javascript",
      testCases: [
        { input: "[1,1,1], k = 2", expectedOutput: "2" },
        { input: "[1,2,3], k = 3", expectedOutput: "2" },
      ],
    },
  ],
  mcqs: [
    {
      id: "mcq_1",
      question: "Which of the following database indexing structures guarantees O(log N) lookup and sequential range scan efficiency for B-Tree indices?",
      options: [
        "Self-balancing Binary Search Tree (AVL)",
        "B+ Tree with leaf-node linked lists",
        "Hash Index using Murmur3",
        "Skip List with probabilistic levels",
      ],
      correctIndex: 1,
      category: "DBMS & Indexing",
      difficulty: "Medium",
      explanation:
        "B+ Trees store records only in leaf nodes connected by pointers, providing both efficient O(log N) search and fast sequential range scans for disk block I/O.",
    },
    {
      id: "mcq_2",
      question: "In the JavaScript V8 Event Loop, which queue is checked and cleared immediately after the currently running call stack frame completes?",
      options: [
        "Macrotask queue (setTimeout, setInterval)",
        "I/O polling queue",
        "Microtask queue (Promise callbacks, queueMicrotask)",
        "setImmediate callback queue",
      ],
      correctIndex: 2,
      category: "JavaScript Concurrency",
      difficulty: "Medium",
      explanation:
        "The microtask queue has absolute priority over macrotasks and is drained completely before the event loop advances to the next task.",
    },
    {
      id: "mcq_3",
      question: "What is the primary motivation for implementing the Cache-Aside (Lazy Loading) pattern instead of Write-Through caching?",
      options: [
        "Guarantees absolute real-time ACID consistency across cluster replicas",
        "Avoids polluting cache with data that is written once but never read",
        "Eliminates cache misses entirely",
        "Simplifies database sharding keys",
      ],
      correctIndex: 1,
      category: "System Design",
      difficulty: "Hard",
      explanation:
        "In Cache-Aside, only requested data is cached. Write-Through caches everything on write, which can waste precious cache RAM if wrote-and-never-read keys accumulate.",
    },
  ],
  sqlProblems: [
    {
      id: "sql_1",
      title: "Find Top 2 Highest Paid Employees Per Department",
      difficulty: "Medium",
      description: "Write a SQL query using Window Functions to find the top 2 highest earning employees in each department.",
      schemaDescription: "Employees (id INT, name VARCHAR, salary INT, department_id INT)\nDepartments (id INT, name VARCHAR)",
      starterQuery: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM (\n  SELECT *,\n    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk\n  FROM Employees\n) e\nJOIN Departments d ON e.department_id = d.id\nWHERE e.rnk <= 2;`,
      expectedOutput: "Department | Employee | Salary",
    },
  ],
  debuggingProblems: [
    {
      id: "debug_1",
      title: "Off-by-One in Binary Search Range",
      difficulty: "Easy",
      language: "javascript",
      buggyCode: `function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length; // BUG: Should be arr.length - 1\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid; // BUG: Should be mid - 1\n  }\n  return -1;\n}`,
      bugDescription: "Causes infinite loop or out-of-bounds indexing on target larger than array values.",
      expectedFixExplanation: "Set right = arr.length - 1 and right = mid - 1 inside the else condition.",
    },
  ],
};

export const SAMPLE_APTITUDE: Record<string, AptitudeCategoryData> = {
  quantitative: {
    category: "quantitative",
    difficulty: "medium",
    questions: [
      {
        id: "quant_1",
        topic: "Time & Work",
        question:
          "Pipe A can fill a tank in 12 hours, while Pipe B can empty it in 18 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?",
        options: ["24 hours", "30 hours", "36 hours", "42 hours"],
        correctIndex: 2,
        difficulty: "medium",
        recommendedTimeSeconds: 60,
        formula: "Net Rate = 1/A - 1/B = 1/12 - 1/18 = 1/36 => 36 hours",
        explanation:
          "In 1 hour, Pipe A fills 1/12 and Pipe B empties 1/18. Net fill rate per hour = (3 - 2)/36 = 1/36. Thus, total time required is 36 hours.",
      },
      {
        id: "quant_2",
        topic: "Profit & Loss",
        question:
          "A retailer marks an item 40% above cost price and allows a 20% discount to customers. What is the net profit percentage earned by the retailer?",
        options: ["12%", "16%", "18%", "20%"],
        correctIndex: 0,
        difficulty: "easy",
        recommendedTimeSeconds: 45,
        formula: "Net % = x + y + (xy/100) = 40 - 20 - (40*20/100) = 12%",
        explanation:
          "Let CP = 100. Marked Price = 140. Selling price after 20% discount = 140 * 0.80 = 112. Net profit = (112 - 100) = 12%.",
      },
    ],
  },
  logical: {
    category: "logical",
    difficulty: "medium",
    questions: [
      {
        id: "logic_1",
        topic: "Coding & Decoding",
        question:
          "In a certain code, 'DEVELOP' is written as 'EFWFMPQ'. How will 'ENGINEER' be coded in the same scheme?",
        options: ["FOHJOFFS", "FOHJPFFS", "FNHOJFFS", "FOHIOEER"],
        correctIndex: 0,
        difficulty: "medium",
        recommendedTimeSeconds: 50,
        formula: "Each character is shifted by +1 in alphabetical order.",
        explanation:
          "E(+1)->F, N(+1)->O, G(+1)->H, I(+1)->J, N(+1)->O, E(+1)->F, E(+1)->F, R(+1)->S. The resulting code is FOHJOFFS.",
      },
      {
        id: "logic_2",
        topic: "Blood Relations",
        question:
          "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
        options: ["Brother", "Uncle", "Father", "Grandfather"],
        correctIndex: 2,
        difficulty: "easy",
        recommendedTimeSeconds: 40,
        formula: "Only son of Suresh's mother = Suresh himself. Son of Suresh = his son.",
        explanation:
          "The 'only son of Suresh's mother' is Suresh himself. Therefore, the boy is the son of Suresh, making Suresh his father.",
      },
    ],
  },
  verbal: {
    category: "verbal",
    difficulty: "medium",
    questions: [
      {
        id: "verb_1",
        topic: "Sentence Correction",
        question:
          "Identify the grammatically correct sentence regarding subject-verb agreement:",
        options: [
          "Neither the manager nor the software developers was present at the sprint review.",
          "Neither the manager nor the software developers were present at the sprint review.",
          "Neither the manager or the software developers were present at the sprint review.",
          "Neither the manager nor the software developers are being present at the sprint review.",
        ],
        correctIndex: 1,
        difficulty: "medium",
        recommendedTimeSeconds: 45,
        formula: "With 'Neither... nor', the verb agrees in number with the closer subject ('software developers' -> were).",
        explanation:
          "When two subjects are joined by 'neither... nor', the verb must agree with the subject closest to it. 'Software developers' is plural, so 'were' is correct.",
      },
    ],
  },
};
