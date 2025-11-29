// Shared application store using localStorage
// This allows applications submitted from Candidate page to appear live in Recruiter dashboard

export interface ApplicationData {
  id: number;
  jobId: number;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateTitle: string;
  candidateLocation: string;
  candidateSkills: string[];
  candidateAvatar?: string;
  status: "New" | "Reviewing" | "Shortlisted" | "Selected" | "Rejected";
  appliedDate: string;
  matchScore: number;
  resumeFilename?: string;
  resumeUrl?: string;
  jobTitle?: string;
  company?: string;
  hiredBy?: string; // recruiter name or email who hired
}

export interface ATSResume {
  id: number;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Array<{ title: string; company: string; duration: string; description: string }>;
  education: Array<{ degree: string; school: string; year: string }>;
  certifications: string[];
  generatedDate: string;
}

export interface JobData {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Internship";
  posted: string;
  match?: number;
  skills: string[];
  category: "job" | "internship";
  logo?: string;
  description?: string;
  requirements?: string;
  postedBy?: string;
}

export interface QuestionData {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

export interface CompetitionData {
  id: number;
  title: string;
  description: string;
  type: "quiz" | "coding" | "assessment";
  difficulty: "Easy" | "Medium" | "Hard";
  reward: string;
  duration: string;
  questions?: number;
  questionList?: QuestionData[];
}

export interface CertificateData {
  id: number;
  candidateId: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  certificateImage?: string; // base64 encoded image
  verified: boolean;
}

export interface EventData {
  id: number;
  title: string;
  type: "workshop" | "hackathon" | "conference" | "scholarship";
  description: string;
  date: string;
  location: string;
  link?: string;
  reward?: string;
  imageUrl?: string;
}

export interface EventRegistrationData {
  id: number;
  candidateId: string;
  eventId: number;
  registeredDate: string;
  status: "registered" | "completed" | "cancelled";
}

export interface UserPerformanceData {
  candidateId: string;
  candidateName: string;
  completedQuizzes: number;
  totalScore: number;
  certificatesCount: number;
  eventsAttended: number;
  averageQuizScore: number;
  lastActive: string;
  applicationCount: number;
  selectedCount: number;
}

const STORAGE_KEY = "talent_match_applications";
const PROFILES_KEY = "talent_match_profiles";
const USERS_KEY = "talent_match_users";
const CURRENT_USER_KEY = "talent_match_current_user";
const JOBS_KEY = "talent_match_jobs";
const COMPETITIONS_KEY = "talent_match_competitions";
const CERTIFICATES_KEY = "talent_match_certificates";
const EVENTS_KEY = "talent_match_events";
const QUIZ_RESULTS_KEY = "talent_match_quiz_results";
const EVENT_REGISTRATIONS_KEY = "talent_match_event_registrations";
const CHAT_HISTORY_KEY = "talent_match_chat_history";

// Get all applications
export const getApplications = (): ApplicationData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Add new application
export const addApplication = (application: Omit<ApplicationData, "id">): ApplicationData => {
  const applications = getApplications();
  const id = Date.now();
  const newApp = { ...application, id };
  applications.push(newApp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  return newApp;
};

// Update application status
export const updateApplicationStatus = (
  applicationId: number,
  status: ApplicationData["status"]
): ApplicationData | null => {
  const applications = getApplications();
  const app = applications.find((a) => a.id === applicationId);
  if (app) {
    app.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }
  return app || null;
};

// Mark application as selected and set hiredBy
export const markApplicationAsHired = (
  applicationId: number,
  recruiterName: string
): ApplicationData | null => {
  const applications = getApplications();
  const app = applications.find((a) => a.id === applicationId);
  if (app) {
    app.status = "Selected";
    app.hiredBy = recruiterName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }
  return app || null;
};

// Get applications for a specific job
export const getApplicationsByJob = (jobId: number): ApplicationData[] => {
  return getApplications().filter((a) => a.jobId === jobId);
};

// Store user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  location: string;
  skills: string[];
  avatarUrl?: string;
}

export const setUserProfile = (profile: UserProfile) => {
  const profiles = getUserProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// ===== USER ACCOUNTS & AUTH (simple localStorage-backed) =====
export interface UserAccount {
  id: string;
  email: string;
  password: string; // NOTE: Stored in plaintext for demo purposes only
  role?: "candidate" | "recruiter";
  name?: string;
  createdAt?: string;
}

export const getUsers = (): UserAccount[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getUserByEmail = (email: string): UserAccount | null => {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const registerUser = (email: string, password: string, role: "candidate" | "recruiter" = "candidate", name?: string): UserAccount => {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error("Email already registered");
  const user: UserAccount = {
    id: `user-${Date.now()}`,
    email,
    password,
    role,
    name: name || email.split("@")[0],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};

export const authenticateUser = (email: string, password: string): UserAccount | null => {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  // set current session
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUserId = (): string | null => {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
};

export const getCurrentUser = (): UserAccount | null => {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
};

export const getUserProfile = (userId: string): UserProfile | null => {
  const profiles = getUserProfiles();
  return profiles.find((p) => p.id === userId) || null;
};

export const getUserProfiles = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Get analytics data
export const getApplicationStats = () => {
  const applications = getApplications();
  const statusCounts = {
    new: applications.filter((a) => a.status === "New").length,
    reviewing: applications.filter((a) => a.status === "Reviewing").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    selected: applications.filter((a) => a.status === "Selected").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  // Count by job
  const jobApplicationCounts: Record<string, number> = {};
  applications.forEach((app) => {
    const key = app.jobTitle || `Job ${app.jobId}`;
    jobApplicationCounts[key] = (jobApplicationCounts[key] || 0) + 1;
  });

  // Count by date
  const dailyCounts: Record<string, number> = {};
  applications.forEach((app) => {
    const date = new Date(app.appliedDate).toLocaleDateString("en-US");
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });

  const avgMatchScore =
    applications.length > 0
      ? Math.round(
          applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length
        )
      : 0;

  return {
    totalApplications: applications.length,
    statusCounts,
    jobApplicationCounts,
    dailyCounts,
    avgMatchScore,
    applications,
  };
};

// ===== JOB MANAGEMENT =====
export const getJobs = (): JobData[] => {
  try {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addJob = (job: Omit<JobData, "id">): JobData => {
  const jobs = getJobs();
  const id = Date.now();
  const newJob = { ...job, id };
  jobs.push(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
};

// ===== COMPETITIONS/QUIZZES =====
export const getCompetitions = (): CompetitionData[] => {
  try {
    const data = localStorage.getItem(COMPETITIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addCompetition = (competition: Omit<CompetitionData, "id">): CompetitionData => {
  const competitions = getCompetitions();
  const id = Date.now();
  const newComp = { ...competition, id };
  competitions.push(newComp);
  localStorage.setItem(COMPETITIONS_KEY, JSON.stringify(competitions));
  return newComp;
};

export const submitQuizResult = (candidateId: string, competitionId: number, score: number) => {
  try {
    const results = JSON.parse(localStorage.getItem(QUIZ_RESULTS_KEY) || "[]");
    results.push({
      id: Date.now(),
      candidateId,
      competitionId,
      score,
      completedDate: new Date().toLocaleString(),
    });
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
  } catch {
    // ignore
  }
};

export const getQuizResults = (candidateId: string) => {
  try {
    const results = JSON.parse(localStorage.getItem(QUIZ_RESULTS_KEY) || "[]");
    return results.filter((r: any) => r.candidateId === candidateId);
  } catch {
    return [];
  }
};

// ===== CERTIFICATES =====
export const getCertificates = (candidateId: string): CertificateData[] => {
  try {
    const data = localStorage.getItem(CERTIFICATES_KEY);
    const all = data ? JSON.parse(data) : [];
    return all.filter((c: CertificateData) => c.candidateId === candidateId);
  } catch {
    return [];
  }
};

export const addCertificate = (cert: Omit<CertificateData, "id">): CertificateData => {
  const all = (() => {
    try {
      const data = localStorage.getItem(CERTIFICATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  })();
  const id = Date.now();
  const newCert = { ...cert, id };
  all.push(newCert);
  localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(all));
  return newCert;
};

// ===== EVENTS/OPPORTUNITIES =====
export const getEvents = (): EventData[] => {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addEvent = (event: Omit<EventData, "id">): EventData => {
  const events = getEvents();
  const id = Date.now();
  const newEvent = { ...event, id };
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return newEvent;
};

// ===== USER PERFORMANCE ANALYTICS =====
export const getUserPerformance = (candidateId: string): UserPerformanceData => {
  const applications = getApplications();
  const quizResults = getQuizResults(candidateId);
  const certificates = getCertificates(candidateId);

  const userApps = applications.filter((a) => a.candidateId === candidateId);
  const selectedCount = userApps.filter((a) => a.status === "Selected").length;

  const avgQuizScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum: number, r: any) => sum + r.score, 0) / quizResults.length)
      : 0;

  return {
    candidateId,
    candidateName: userApps[0]?.candidateName || "Unknown",
    completedQuizzes: quizResults.length,
    totalScore: quizResults.reduce((sum: number, r: any) => sum + r.score, 0),
    certificatesCount: certificates.length,
    eventsAttended: 0, // Can be tracked separately
    averageQuizScore: avgQuizScore,
    lastActive: new Date().toLocaleString(),
    applicationCount: userApps.length,
    selectedCount,
  };
};

export const getAllUserPerformance = (): UserPerformanceData[] => {
  const applications = getApplications();
  const userIds = new Set(applications.map((a) => a.candidateId));
  return Array.from(userIds).map((id) => getUserPerformance(id as string));
};

// ===== SEED DATA INITIALIZATION =====

// Quiz questions data
const QUIZ_QUESTIONS: Record<number, QuestionData[]> = {
  1: [ // JavaScript Fundamentals
    { id: 1, questionText: "What is the output of typeof undefined?", options: ["undefined", "null", "object", "unknown"], correctAnswer: 0, explanation: "typeof undefined returns 'undefined'" },
    { id: 2, questionText: "Which method removes the last element from an array?", options: ["pop()", "shift()", "slice()", "splice()"], correctAnswer: 0, explanation: "pop() removes and returns the last element" },
    { id: 3, questionText: "What does JSON.stringify() do?", options: ["Parses JSON", "Converts object to JSON string", "Validates JSON", "Minifies JSON"], correctAnswer: 1, explanation: "JSON.stringify() converts JavaScript objects to JSON strings" },
    { id: 4, questionText: "What is closure in JavaScript?", options: ["A function that closes the script", "A function with access to outer scope variables", "A way to end code execution", "An error handling mechanism"], correctAnswer: 1, explanation: "A closure is a function that has access to variables from its outer scope" },
    { id: 5, questionText: "What keyword is used to declare variables with block scope?", options: ["var", "let", "const", "both let and const"], correctAnswer: 3, explanation: "Both 'let' and 'const' provide block-level scope" },
  ],
  2: [ // React Advanced Patterns
    { id: 1, questionText: "What is a custom hook in React?", options: ["A built-in React hook", "A reusable function that uses hooks", "A hook that customizes HTML", "A CSS-in-JS solution"], correctAnswer: 1, explanation: "Custom hooks are reusable functions that use React hooks internally" },
    { id: 2, questionText: "What does useMemo do?", options: ["Stores previous values", "Memoizes computed values", "Manages side effects", "Handles form state"], correctAnswer: 1, explanation: "useMemo memoizes expensive computations and returns cached results" },
    { id: 3, questionText: "What is the purpose of useCallback?", options: ["Callbacks on state change", "Memoizes function references", "Handles async callbacks", "Cancels pending updates"], correctAnswer: 1, explanation: "useCallback memoizes function definitions to prevent unnecessary re-renders" },
    { id: 4, questionText: "What is the Context API used for?", options: ["Managing component styles", "Passing data without prop drilling", "Handling HTTP requests", "Creating animations"], correctAnswer: 1, explanation: "Context API provides a way to pass data through component tree without props" },
    { id: 5, questionText: "What does useRef return?", options: ["A reactive reference", "A mutable object that persists", "A function reference", "A component instance"], correctAnswer: 1, explanation: "useRef returns a mutable object whose value persists across renders" },
  ],
  3: [ // DSA
    { id: 1, questionText: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], correctAnswer: 1, explanation: "Binary search has O(log n) time complexity" },
    { id: 2, questionText: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Deque", "Heap"], correctAnswer: 1, explanation: "Stack uses Last In First Out (LIFO) principle" },
    { id: 3, questionText: "What is the best case time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"], correctAnswer: 1, explanation: "Best case quicksort is O(n log n) when pivot divides array equally" },
    { id: 4, questionText: "What does BFS stand for?", options: ["Binary First Search", "Breadth First Search", "Binary Fast Search", "Breadth Fast Search"], correctAnswer: 1, explanation: "BFS stands for Breadth First Search" },
    { id: 5, questionText: "What is a hash collision?", options: ["Two different keys hashing to same index", "A hash function error", "Invalid hash table", "Memory overflow"], correctAnswer: 0, explanation: "Hash collision occurs when two different keys hash to the same index" },
  ],
};

export const getQuizQuestions = (competitionId: number): QuestionData[] => {
  return QUIZ_QUESTIONS[competitionId] || [];
};

export const initializeSeedData = () => {
  // Initialize competitions if empty
  if (getCompetitions().length === 0) {
    const seedCompetitions: Omit<CompetitionData, "id">[] = [
      {
        title: "JavaScript Fundamentals Quiz",
        description: "Test your JavaScript knowledge with 5 questions",
        type: "quiz",
        difficulty: "Easy",
        reward: "50 points",
        duration: "30",
        questions: 5,
        questionList: QUIZ_QUESTIONS[1],
      },
      {
        title: "React Advanced Patterns",
        description: "Advanced React patterns and hooks with 5 questions",
        type: "quiz",
        difficulty: "Medium",
        reward: "100 points",
        duration: "45",
        questions: 5,
        questionList: QUIZ_QUESTIONS[2],
      },
      {
        title: "Data Structures & Algorithms",
        description: "DSA coding challenge with 5 questions",
        type: "coding",
        difficulty: "Hard",
        reward: "200 points",
        duration: "120",
        questions: 5,
        questionList: QUIZ_QUESTIONS[3],
      },
      {
        title: "System Design Interview",
        description: "Design scalable systems",
        type: "assessment",
        difficulty: "Hard",
        reward: "150 points",
        duration: "90",
        questions: 3,
      },
      {
        title: "Frontend Performance Optimization",
        description: "Optimize web performance",
        type: "quiz",
        difficulty: "Medium",
        reward: "75 points",
        duration: "40",
        questions: 15,
      },
    ];

    seedCompetitions.forEach((comp) => addCompetition(comp));
  }

  // Initialize events if empty
  if (getEvents().length === 0) {
    const seedEvents: Omit<EventData, "id">[] = [
      {
        title: "Web Development Workshop",
        description: "Learn modern web development practices with React, Node.js, and Tailwind",
        type: "workshop",
        date: "2024-02-15",
        location: "Bangalore Tech Hub",
        reward: "Certificate + 50 points",
      },
      {
        title: "HackathonIndia 2024",
        description: "48-hour hackathon with prizes and networking opportunities",
        type: "hackathon",
        date: "2024-03-10",
        location: "Delhi Convention Center",
        reward: "Prize Pool: ₹5,00,000",
      },
      {
        title: "Tech Leaders Conference",
        description: "Annual conference featuring keynotes from tech industry leaders",
        type: "conference",
        date: "2024-03-25",
        location: "Mumbai International Center",
        reward: "Certificate + Networking Pass",
      },
      {
        title: "Google Cloud Scholarship",
        description: "Full scholarship for cloud certification courses",
        type: "scholarship",
        date: "2024-02-28",
        location: "Online",
        reward: "$1000 Scholarship",
      },
      {
        title: "AI/ML Bootcamp",
        description: "Intensive 4-week bootcamp on AI and Machine Learning",
        type: "workshop",
        date: "2024-03-01",
        location: "Bangalore Tech Hub",
        reward: "Certificate + 100 points",
      },
      {
        title: "AWS Certification Scholarship",
        description: "Free AWS certification exam and training materials",
        type: "scholarship",
        date: "2024-03-10",
        location: "Online",
        reward: "$300 Scholarship",
      },
    ];

    seedEvents.forEach((event) => addEvent(event));
  }
};

// ===== EVENT REGISTRATION =====
export const registerForEvent = (candidateId: string, eventId: number): EventRegistrationData => {
  const registrations = getEventRegistrations();
  // Prevent duplicate registration for the same candidate & event
  const existing = registrations.find((r) => r.candidateId === candidateId && r.eventId === eventId);
  if (existing) {
    return existing;
  }

  const id = Date.now();
  const newReg: EventRegistrationData = {
    id,
    candidateId,
    eventId,
    registeredDate: new Date().toLocaleDateString(),
    status: "registered",
  };
  registrations.push(newReg);
  localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(registrations));
  return newReg;
};

export const getEventRegistrations = (): EventRegistrationData[] => {
  try {
    const data = localStorage.getItem(EVENT_REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const unregisterFromEvent = (candidateId: string, eventId: number) => {
  const registrations = getEventRegistrations();
  const filtered = registrations.filter((r) => !(r.candidateId === candidateId && r.eventId === eventId));
  localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(filtered));
};

export const isRegisteredForEvent = (candidateId: string, eventId: number): boolean => {
  const registrations = getEventRegistrations();
  return registrations.some((r) => r.candidateId === candidateId && r.eventId === eventId);
};

export const getRegisteredEvents = (candidateId: string): number[] => {
  const registrations = getEventRegistrations();
  return registrations
    .filter((r) => r.candidateId === candidateId)
    .map((r) => r.eventId);
};

// ===== CHAT HISTORY =====
export interface ChatMessage {
  id: number;
  candidateId: string;
  message: string;
  response: string;
  timestamp: string;
  category?: string; // "job", "skills", "interview", "general"
}

export const addChatMessage = (candidateId: string, message: string, response: string, category?: string): ChatMessage => {
  const messages = getChatHistory(candidateId);
  const id = Date.now();
  const newMsg = {
    id,
    candidateId,
    message,
    response,
    timestamp: new Date().toLocaleString(),
    category,
  };
  messages.push(newMsg);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  return newMsg;
};

export const getChatHistory = (candidateId: string): ChatMessage[] => {
  try {
    const allMessages = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "[]");
    return allMessages.filter((m: ChatMessage) => m.candidateId === candidateId);
  } catch {
    return [];
  }
};

// ===== PORTFOLIO PROJECTS =====
export interface PortfolioProject {
  id: number;
  candidateId: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  github?: string;
  image?: string;
  createdDate: string;
}

const PORTFOLIO_KEY = "portfolioProjects";

export const addPortfolioProject = (project: Omit<PortfolioProject, "id" | "createdDate">): PortfolioProject => {
  const projects = getPortfolioProjects(project.candidateId);
  const newProject: PortfolioProject = {
    ...project,
    id: Date.now(),
    createdDate: new Date().toLocaleString(),
  };
  projects.push(newProject);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(projects));
  return newProject;
};

export const getPortfolioProjects = (candidateId: string): PortfolioProject[] => {
  try {
    const projects = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "[]");
    return projects.filter((p: PortfolioProject) => p.candidateId === candidateId);
  } catch {
    return [];
  }
};

export const deletePortfolioProject = (projectId: number) => {
  const projects = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "[]");
  const filtered = projects.filter((p: PortfolioProject) => p.id !== projectId);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(filtered));
};

// ===== INTERVIEW SCHEDULING =====
export interface InterviewSchedule {
  id: number;
  candidateId: string;
  recruiterId: string;
  jobId: number;
  jobTitle: string;
  company: string;
  interviewDate: string;
  interviewTime: string;
  duration: number; // in minutes
  type: "phone" | "video" | "in-person";
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  createdDate: string;
}

const INTERVIEWS_KEY = "interviews";

export const scheduleInterview = (interview: Omit<InterviewSchedule, "id" | "createdDate">): InterviewSchedule => {
  const interviews = getInterviews();
  const newInterview: InterviewSchedule = {
    ...interview,
    id: Date.now(),
    createdDate: new Date().toLocaleString(),
  };
  interviews.push(newInterview);
  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(interviews));
  return newInterview;
};

export const getInterviews = (): InterviewSchedule[] => {
  try {
    return JSON.parse(localStorage.getItem(INTERVIEWS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const getInterviewsByCandidateId = (candidateId: string): InterviewSchedule[] => {
  const interviews = getInterviews();
  return interviews.filter((i) => i.candidateId === candidateId);
};

export const updateInterviewStatus = (interviewId: number, status: InterviewSchedule["status"]) => {
  const interviews = getInterviews();
  const interview = interviews.find((i) => i.id === interviewId);
  if (interview) {
    interview.status = status;
    localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(interviews));
  }
};

// ===== RESUME PARSING & JOB MATCHING =====
export interface ParsedResume {
  id: number;
  candidateId: string;
  skills: string[];
  experience: string;
  education: string;
  uploadedDate: string;
}

const PARSED_RESUMES_KEY = "parsedResumes";

export const parseResumeText = (text: string): string[] => {
  // Simple skill extraction - looks for common tech skills
  const skillKeywords = [
    "react", "angular", "vue", "javascript", "typescript", "python", "java", "csharp",
    "nodejs", "express", "django", "flask", "fastapi", "spring", "springboot",
    "mongodb", "postgresql", "mysql", "redis", "aws", "azure", "gcp", "docker",
    "kubernetes", "git", "html", "css", "tailwind", "bootstrap", "rest", "graphql",
    "sql", "nosql", "orm", "api", "microservices", "linux", "devops", "ci/cd",
    "jest", "pytest", "selenium", "cypress", "webpack", "vite", "next.js", "nextjs",
    "html5", "es6", "es2020", "async", "promise", "callback", "webpack", "parcel",
    "sass", "scss", "less", "styled-components", "material-ui", "ant-design",
    "redux", "mobx", "zustand", "context-api", "firebase", "supabase", "graphql-apollo",
    "testing-library", "vitest", "mocha", "jasmine", "chai", "sinon",
    "agile", "scrum", "kanban", "jira", "confluence", "slack", "teams",
    "figma", "sketch", "adobe", "photoshop", "illustrator", "xd",
    "communication", "leadership", "problem-solving", "teamwork", "collaboration"
  ];

  const textLower = text.toLowerCase();
  const foundSkills: Set<string> = new Set();

  skillKeywords.forEach((skill) => {
    if (textLower.includes(skill)) {
      foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  return Array.from(foundSkills);
};

export const saveParsedResume = (candidateId: string, skills: string[]): ParsedResume => {
  const resumes = getParsedResumes(candidateId);
  const newResume: ParsedResume = {
    id: Date.now(),
    candidateId,
    skills,
    experience: "Not parsed",
    education: "Not parsed",
    uploadedDate: new Date().toLocaleString(),
  };
  resumes.push(newResume);
  localStorage.setItem(PARSED_RESUMES_KEY, JSON.stringify(resumes));
  return newResume;
};

export const getParsedResumes = (candidateId: string): ParsedResume[] => {
  try {
    const resumes = JSON.parse(localStorage.getItem(PARSED_RESUMES_KEY) || "[]");
    return resumes.filter((r: ParsedResume) => r.candidateId === candidateId);
  } catch {
    return [];
  }
};

export const calculateJobMatch = (candidateSkills: string[], jobSkills: string[]): number => {
  if (jobSkills.length === 0) return 0;
  
  const matchedSkills = candidateSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                 skill.toLowerCase().includes(jobSkill.toLowerCase()))
  );
  
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
};

// ===== ATS-FRIENDLY RESUME GENERATION =====
const ATS_RESUMES_KEY = "talent_match_ats_resumes";

export const generateATSResume = (candidateId: string, resumeData: Omit<ATSResume, "id" | "generatedDate" | "candidateId">): ATSResume => {
  const resumes = getATSResumes(candidateId);
  const newResume: ATSResume = {
    id: Date.now(),
    candidateId,
    ...resumeData,
    generatedDate: new Date().toLocaleString(),
  };
  resumes.push(newResume);
  localStorage.setItem(ATS_RESUMES_KEY, JSON.stringify(resumes));
  return newResume;
};

export const getATSResumes = (candidateId: string): ATSResume[] => {
  try {
    const resumes = JSON.parse(localStorage.getItem(ATS_RESUMES_KEY) || "[]");
    return resumes.filter((r: ATSResume) => r.candidateId === candidateId);
  } catch {
    return [];
  }
};

export const formatATSResume = (resume: ATSResume): string => {
  const lines: string[] = [];
  lines.push(`${resume.fullName.toUpperCase()}`);
  lines.push(`${resume.email} | ${resume.phone} | ${resume.location}`);
  lines.push("");
  
  if (resume.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push(resume.summary);
    lines.push("");
  }
  
  if (resume.skills && resume.skills.length > 0) {
    lines.push("SKILLS");
    lines.push(resume.skills.join(" • "));
    lines.push("");
  }
  
  if (resume.experience && resume.experience.length > 0) {
    lines.push("EXPERIENCE");
    resume.experience.forEach((exp) => {
      lines.push(`${exp.title.toUpperCase()} - ${exp.company}`);
      lines.push(`${exp.duration}`);
      lines.push(exp.description);
      lines.push("");
    });
  }
  
  if (resume.education && resume.education.length > 0) {
    lines.push("EDUCATION");
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.school}`);
      lines.push(`Graduated: ${edu.year}`);
      lines.push("");
    });
  }
  
  if (resume.certifications && resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    lines.push(resume.certifications.join(" | "));
  }
  
  return lines.join("\n");
};

// ===== EMAIL NOTIFICATIONS =====
export interface EmailNotification {
  id: number;
  recipientEmail: string;
  subject: string;
  body: string;
  type: "application" | "interview" | "event" | "general";
  sentDate: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = "emailNotifications";

export const sendEmailNotification = (email: EmailNotification["recipientEmail"], subject: string, body: string, type: EmailNotification["type"] = "general"): EmailNotification => {
  const notifications = getEmailNotifications();
  const newNotification: EmailNotification = {
    id: Date.now(),
    recipientEmail: email,
    subject,
    body,
    type,
    sentDate: new Date().toLocaleString(),
    read: false,
  };
  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return newNotification;
};

export const getEmailNotifications = (): EmailNotification[] => {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
  } catch {
    return [];
  }
};

// ===== CHATGPT INTEGRATION =====
export const callChatGPT = async (message: string): Promise<string> => {
  try {
    // Check for API key in environment
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback to mock if no API key
      return getMockAIResponse(message);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful career advisor and job search expert. Provide concise, actionable advice for job seekers and professionals.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return getMockAIResponse(message);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getMockAIResponse(message);
  } catch (error) {
    console.error("ChatGPT API error:", error);
    return getMockAIResponse(message);
  }
};

const getMockAIResponse = (msg: string): string => {
  const lowerMsg = msg.toLowerCase();
  const responses: Record<string, string> = {
    interview: "Great question! For technical interviews, I recommend: 1) Practice coding problems daily, 2) Review system design concepts, 3) Conduct mock interviews, 4) Research the company thoroughly. Good luck!",
    resume: "For an effective resume: 1) Keep it to 1-2 pages, 2) Use action verbs, 3) Quantify achievements, 4) Tailor it to the job, 5) Include relevant skills. Would you like help with a specific section?",
    skill: "To improve your skills: 1) Practice regularly, 2) Build real projects, 3) Take online courses, 4) Read documentation, 5) Contribute to open source. Which skill would you like to focus on?",
    job: "Job search tips: 1) Customize your applications, 2) Network actively, 3) Follow up after applying, 4) Prepare thoroughly for interviews, 5) Consider freelance/contract roles. What type of role interests you?",
    salary: "Regarding salary negotiations: 1) Research market rates, 2) Know your worth, 3) Don't disclose previous salary, 4) Negotiate benefits too, 5) Get it in writing. Would you like tips on a specific role?",
  };

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) return value;
  }

  return "That's a great question! To provide better guidance, I need more context. Try asking about: interviews, resume tips, skill development, job search strategies, or salary negotiations.";
};

// Initialize on load
if (typeof window !== "undefined") {
  initializeSeedData();
}

