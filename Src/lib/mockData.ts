// mockData removed — replaced by local in-component mock state.

export const __MOCK_DATA_REMOVED__ = true;
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  match: number;
  skills: string[];
  category?: "job" | "internship";
};

type Application = {
  id: number;
  jobId: number;
  candidateName: string;
  candidateId: string;
  status: "New" | "Under Review" | "Shortlisted" | "Selected" | "Rejected";
  resumeId?: number;
  resumeFilename?: string;
  appliedDate: string;
  matchScore: number;
};

let jobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Bangalore, INDIA",
    salary: "$120k - $180k",
    type: "Full-time",
    posted: "2 days ago",
    match: 95,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    category: "job",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Mumbai, INDIA",
    salary: "$100k - $150k",
    type: "Full-time",
    posted: "5 days ago",
    match: 88,
    skills: ["Node.js", "React", "PostgreSQL"],
    category: "job",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Hyderabad, INDIA",
    salary: "$90k - $130k",
    type: "Full-time",
    posted: "1 week ago",
    match: 82,
    skills: ["Figma", "UI Design", "Prototyping"],
    category: "job",
  },
  {
    id: 4,
    title: "Frontend Intern",
    company: "ScaleUp",
    location: "Remote",
    salary: "$0 - $1k",
    type: "Internship",
    posted: "3 days ago",
    match: 70,
    skills: ["React", "CSS"],
    category: "internship",
  },
];

let applications: Application[] = [
  {
    id: 1,
    jobId: 1,
    candidateName: "You",
    candidateId: "user-1",
    status: "New",
    appliedDate: "2 days ago",
    matchScore: 95,
  },
  {
    id: 2,
    jobId: 2,
    candidateName: "Sarah Johnson",
    candidateId: "cand-2",
    status: "Under Review",
    appliedDate: "3 days ago",
    matchScore: 89,
  },
];

let appListeners: Array<() => void> = [];

type Resume = {
  id: number;
  candidateId: string;
  filename: string;
  url: string;
  uploadedAt: string;
};

let resumes: Resume[] = [
  {
    id: 1,
    candidateId: "user-1",
    filename: "resume_sample.pdf",
    url: "mock:///resume_sample.pdf",
    uploadedAt: "3 days ago",
  },
];

type UserProfile = {
  candidateId: string;
  name: string;
  title?: string;
  location?: string;
  avatarUrl?: string;
};

let userProfiles: UserProfile[] = [
  { candidateId: "user-1", name: "You", title: "Frontend Engineer", location: "Bangalore, INDIA", avatarUrl: undefined },
];

function notify() {
  appListeners.forEach((l) => l());
}

export function getJobs() {
  return [...jobs];
}

export function addJob(job: Job) {
  jobs = [...jobs, job];
  notify();
}

export function getApplications() {
  return [...applications];
}

export function getResumes(candidateId?: string) {
  return (candidateId ? resumes.filter((r) => r.candidateId === candidateId) : resumes).slice();
}

export function addResume(candidateId: string, filename: string, url: string) {
  const id = Math.max(0, ...resumes.map((r) => r.id)) + 1;
  const r = { id, candidateId, filename, url, uploadedAt: "just now" };
  resumes = [r, ...resumes];
  notify();
  return r;
}

export function getUserProfile(candidateId: string) {
  return userProfiles.find((p) => p.candidateId === candidateId) ?? null;
}

export function updateUserProfile(candidateId: string, update: Partial<UserProfile>) {
  userProfiles = userProfiles.map((p) => (p.candidateId === candidateId ? { ...p, ...update } : p));
  notify();
  return userProfiles.find((p) => p.candidateId === candidateId) ?? null;
}


export function applyToJob(jobId: number, candidateName = "You", candidateId = "user-1", resumeId?: number, resumeFilename?: string) {
  const id = Math.max(0, ...applications.map((a) => a.id)) + 1;
  const app: Application = {
    id,
    jobId,
    candidateName,
    candidateId,
    status: "New",
    appliedDate: "just now",
    matchScore: Math.floor(Math.random() * 30) + 70,
    resumeId,
    resumeFilename,
  };
  applications = [app, ...applications];
  notify();
  return app;
}

export function updateApplicationStatus(applicationId: number, status: Application['status']) {
  applications = applications.map((a) => (a.id === applicationId ? { ...a, status } : a));
  notify();
}

export function getStats() {
  const total = applications.length;
  const selected = applications.filter((a) => a.status === "Selected").length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const pending = applications.filter((a) => a.status === "Under Review" || a.status === "New").length;
  return { total, selected, shortlisted, pending };
}

export function subscribeApplications(listener: () => void) {
  appListeners.push(listener);
  return () => {
    appListeners = appListeners.filter((l) => l !== listener);
  };
}

export type { Job, Application };
