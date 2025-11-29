import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, MapPin, DollarSign, Clock, Upload, Sparkles, Award, BookOpen, Zap, Plus, MessageCircle, Send, X, Edit3 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hook/use-toast";
import { useEffect } from "react";
import { addApplication, setUserProfile, getJobs, getCompetitions, getEvents, addCertificate, getCertificates, submitQuizResult, getQuizQuestions, registerForEvent, getRegisteredEvents, isRegisteredForEvent, unregisterFromEvent, addChatMessage, getChatHistory, addPortfolioProject, getPortfolioProjects, deletePortfolioProject, scheduleInterview, getInterviewsByCandidateId, parseResumeText, saveParsedResume, calculateJobMatch, sendEmailNotification, callChatGPT, getCurrentUserId, getUserProfile, logoutUser, generateATSResume, getATSResumes, formatATSResume } from "@/lib/applicationStore";

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Bangalore, INDIA",
    salary: "$120k - $180k",
    type: "Full-time",
    posted: "2 days ago",
    match: 0,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    logo: "🔵",
    category: "job" as const,
    description: "Senior Frontend Developer at Google",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Microsoft",
    location: "Mumbai, INDIA",
    salary: "$100k - $150k",
    type: "Full-time",
    posted: "5 days ago",
    match: 0,
    skills: ["Node.js", "React", "PostgreSQL"],
    logo: "⬛",
    category: "job" as const,
    description: "Full Stack Engineer at Microsoft",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Adobe",
    location: "Hyderabad, INDIA",
    salary: "$90k - $130k",
    type: "Full-time",
    posted: "1 week ago",
    match: 0,
    skills: ["Figma", "UI Design", "Prototyping"],
    logo: "🔴",
    category: "job" as const,
    description: "UI/UX Designer at Adobe",
  },
  {
    id: 4,
    title: "React Developer Intern",
    company: "TechStartup",
    location: "Remote",
    salary: "$15k - $25k",
    type: "Internship",
    posted: "3 days ago",
    match: 0,
    skills: ["React", "JavaScript", "CSS"],
    logo: "🚀",
    category: "internship" as const,
    description: "React Developer Intern at TechStartup",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Amazon",
    location: "Bangalore, INDIA",
    salary: "$110k - $170k",
    type: "Full-time",
    posted: "1 day ago",
    match: 0,
    skills: ["Java", "Spring Boot", "AWS"],
    logo: "🟠",
    category: "job" as const,
    description: "Backend Developer at Amazon",
  },
  {
    id: 6,
    title: "Data Science Internship",
    company: "DataCorp",
    location: "Delhi, INDIA",
    salary: "$10k - $20k",
    type: "Internship",
    posted: "4 days ago",
    match: 0,
    skills: ["Python", "Machine Learning", "SQL"],
    logo: "📊",
    category: "internship" as const,
    description: "Data Science Internship at DataCorp",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Netflix",
    location: "Bangalore, INDIA",
    salary: "$130k - $190k",
    type: "Full-time",
    posted: "1 week ago",
    match: 0,
    skills: ["Kubernetes", "Docker", "AWS"],
    logo: "🎬",
    category: "job" as const,
    description: "DevOps Engineer at Netflix",
  },
  {
    id: 8,
    title: "Frontend Internship",
    company: "Flipkart",
    location: "Bangalore, INDIA",
    salary: "$12k - $22k",
    type: "Internship",
    posted: "2 days ago",
    match: 0,
    skills: ["React", "HTML", "CSS"],
    logo: "📱",
    category: "internship" as const,
    description: "Frontend Internship at Flipkart",
  },
];

const Candidate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"details" | "cover" | "resume">("details");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsedSkills, setParsedSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
    "UI Design",
    "Tailwind CSS",
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [applications, setApplications] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  
  // New feature states
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "competitions" | "events" | "profile" | "portfolio" | "interviews">("jobs");
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [certModal, setCertModal] = useState(false);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [newCert, setNewCert] = useState({ title: "", issuer: "", issueDate: "" });
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Portfolio states
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", skills: [], link: "", github: "" });
  
  // Interview states
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const currentUserId = getCurrentUserId() || 'user-1';
  const currentUserProfile = getUserProfile(currentUserId);

  const handleLogout = () => {
    logoutUser();
    // navigate to auth page
    window.location.href = "/auth";
  };
  const [interviews, setInterviews] = useState<any[]>([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [newInterview, setNewInterview] = useState({
    interviewDate: "",
    interviewTime: "",
    duration: 30,
    type: "video" as const,
    notes: "",
  });
  
  // Resume parsing
  const [resumeText, setResumeText] = useState("");
  const [resumeParsed, setResumeParsed] = useState(false);
  
  // ATS Resume Builder
  const [showATSBuilder, setShowATSBuilder] = useState(false);
  const [atsResumeForm, setATSResumeForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [] as string[],
    experience: [] as Array<{ title: string; company: string; duration: string; description: string }>,
    education: [] as Array<{ degree: string; school: string; year: string }>,
    certifications: [] as string[],
  });
  const [generatedATSResumes, setGeneratedATSResumes] = useState<any[]>([]);
  
  // Profile Edit
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState({ name: "", title: "", location: "" });
  const [greetingMessage, setGreetingMessage] = useState("");

  useEffect(() => {
    // Load jobs from localStorage (with admin posts) or use mock data
    let jobsToLoad = getJobs();
    
    // If no jobs in store, use mockJobs
    if (jobsToLoad.length === 0) {
      jobsToLoad = mockJobs as any;
    }
    
    // Ensure all match percentages are 0 initially
    jobsToLoad = jobsToLoad.map((j: any) => ({ ...j, match: 0 }));
    
    setJobs(jobsToLoad);
    setResults(jobsToLoad);
    setApplications([]);
    setResumes([]);
    // Try to load profile for current signed-in user
    const uid = getCurrentUserId() || 'user-1';
    const userProfile = getUserProfile(uid);
    if (userProfile) {
      setProfile(userProfile);
    } else {
      setProfile({ id: uid, name: 'You', title: 'Frontend Engineer', location: 'Bangalore, INDIA' });
    }

    // Load competitions and events from store
    setCompetitions(getCompetitions());
    setEvents(getEvents());
    setCertificates(getCertificates(uid));
    setRegisteredEvents(getRegisteredEvents(uid));

    // Load chat history
    const history = getChatHistory(uid);
    setChatMessages(history);

    // Load portfolio projects and interviews
    setPortfolioProjects(getPortfolioProjects(uid));
    setInterviews(getInterviewsByCandidateId(uid));

    // Load generated ATS resumes
    const atsResumes = getATSResumes(uid);
    setGeneratedATSResumes(atsResumes);
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setResults(jobs);
      toast({ title: "Showing all jobs", description: `${jobs.length} jobs available` });
      return;
    }

    const filtered = jobs.filter((j) => {
      const inText = `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q);
      const inSkills = j.skills.some((s: string) => s.toLowerCase().includes(q));
      return inText || inSkills;
    });

    setResults(filtered);
    toast({ title: `${filtered.length} results`, description: `Search for "${searchQuery}" returned ${filtered.length} job(s)` });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const handleOpenAvatar = () => avatarInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    // Local mock: pretend upload succeeds and set a blob URL
    const url = URL.createObjectURL(file);
    setProfile((p: any) => ({ ...(p ?? {}), avatarUrl: url }));
    toast({ title: "Avatar uploaded", description: "Profile avatar updated (mock)" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResumeFile(file);
    if (file) {
      // Parse resume text from file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        
        // Extract skills from resume
        const extractedSkills = parseResumeText(text);
        setParsedSkills(extractedSkills);
        setResumeParsed(true);
        
  // Save parsed resume for current signed-in user (fallback to 'user-1' demo)
  const currentUserId = getCurrentUserId() || 'user-1';
  saveParsedResume(currentUserId, extractedSkills);
        
        // Update job matches based on parsed skills
        const updatedJobs = jobs.map((job: any) => ({
          ...job,
          match: calculateJobMatch(extractedSkills, job.skills),
        }));
        setJobs(updatedJobs);
        setResults(updatedJobs);
        
        toast({ title: "Resume parsed!", description: `Found ${extractedSkills.length} skills` });
      };
      reader.readAsText(file);
      
      setDialogMode("resume");
      setDialogOpen(true);
    }
  };

  const handleUploadSubmit = async () => {
    if (!resumeFile) {
      toast({ title: "No file", description: "Please choose a resume to upload" });
      return;
    }
    // Local mock upload: create object URL and store metadata in state
    const url = URL.createObjectURL(resumeFile);
    const id = Date.now();
    const item = { id, filename: resumeFile.name, url, uploadedAt: new Date().toLocaleString() };
    setResumes((r) => [item, ...r]);
    toast({ title: "Resume uploaded", description: `${resumeFile.name} uploaded (mock)` });
    setDialogOpen(false);
  };

  const handleGenerateATSResume = () => {
    if (!atsResumeForm.fullName || !atsResumeForm.email) {
      toast({ title: "Missing fields", description: "Please fill in Full Name and Email" });
      return;
    }

    const resume = generateATSResume(currentUserId, atsResumeForm);
    const allResumes = getATSResumes(currentUserId);
    setGeneratedATSResumes(allResumes);
    toast({ title: "ATS Resume Generated", description: "Your ATS-friendly resume has been created" });
    
    // Reset form
    setATSResumeForm({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
    });
    setShowATSBuilder(false);
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setDialogMode("details");
    setDialogOpen(true);
  };

  const handleApply = async (job: any) => {
    const resume = resumes.find((r) => r.id === selectedResumeId);
    
    // Save to shared application store
    const application = addApplication({
      jobId: job.id,
      candidateId: currentUserId,
      candidateName: profile?.name ?? 'You',
      candidateEmail: 'candidate@example.com',
      candidateTitle: profile?.title ?? 'Frontend Engineer',
      candidateLocation: profile?.location ?? 'Bangalore, INDIA',
      candidateSkills: parsedSkills,
      candidateAvatar: profile?.avatarUrl,
      status: 'New',
      appliedDate: new Date().toLocaleString(),
      matchScore: job.match ?? 0,
      resumeFilename: resume?.filename,
      resumeUrl: resume?.url,
      jobTitle: job.title,
      company: job.company,
    });

    // Also save user profile to shared store
    setUserProfile({
      id: currentUserId,
      name: profile?.name ?? 'You',
      email: 'candidate@example.com',
      title: profile?.title ?? 'Frontend Engineer',
      location: profile?.location ?? 'Bangalore, INDIA',
      skills: parsedSkills,
      avatarUrl: profile?.avatarUrl,
    });

    setApplications((a) => [application, ...a]);
    setSelectedJob(job);
    setDialogMode("details");
    setDialogOpen(true);
    toast({ title: "Applied", description: `Application submitted for ${job.title}` });
  };

  // Remove cover letter generation - not needed
  // Cover letter was here but removed per requirements

  const handleGenerateMore = () => {
    const extras = [
      "GraphQL",
      "Next.js",
      "Docker",
      "Kubernetes",
      "Storybook",
    ];
    const next = extras.find((e) => !parsedSkills.includes(e)) ?? `Skill ${parsedSkills.length + 1}`;
    setParsedSkills((s) => [...s, next]);
    toast({ title: "Generated skill", description: next });
  };

  const handleTakeQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    // Prefer embedded questionList on the competition (seeded) otherwise map by id
    const questions = quiz?.questionList && quiz.questionList.length > 0 ? quiz.questionList : getQuizQuestions(quiz.id);
    console.log('[quiz] handleTakeQuiz quizId:', quiz?.id, 'questionsLoaded:', questions.length, 'usedQuestionList:', !!quiz?.questionList);
    setQuizQuestions(questions || []);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizOpen(true);
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 100 / quizQuestions.length;
      }
    });
    const finalScore = Math.round(score);
    setQuizScore(finalScore);
    setQuizCompleted(true);
  submitQuizResult(currentUserId, selectedQuiz.id, finalScore);
    toast({ title: "Quiz submitted!", description: `Your score: ${finalScore}%` });
  };

  const handleFinishQuiz = () => {
    setQuizOpen(false);
  };

  const handleAddCertificate = () => {
    if (!newCert.title || !newCert.issuer) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    const cert = addCertificate({
      candidateId: currentUserId,
      ...newCert,
      verified: false,
      certificateImage: certImageFile ? URL.createObjectURL(certImageFile) : undefined,
    });
    setCertificates((c) => [...c, cert]);
    setNewCert({ title: "", issuer: "", issueDate: "" });
    setCertImageFile(null);
    setCertModal(false);
    toast({ title: "Certificate added!", description: newCert.title });
  };

  const handleRegisterEvent = (eventId: number) => {
    console.log('[events] handleRegisterEvent called for eventId:', eventId);
    try {
      if (isRegisteredForEvent(currentUserId, eventId)) {
        console.log('[events] currently registered - unregistering', eventId);
        unregisterFromEvent(currentUserId, eventId);
        // Sync state from storage to avoid accidental duplicates
        setRegisteredEvents(getRegisteredEvents(currentUserId));
        toast({ title: "Unregistered", description: "You have been unregistered from the event" });
      } else {
        console.log('[events] not registered - registering', eventId);
        registerForEvent(currentUserId, eventId);
        // Sync state from storage to get canonical list
        setRegisteredEvents(getRegisteredEvents(currentUserId));
        toast({ title: "Registered!", description: "You are now registered for this event" });
      }
    } catch (err) {
      console.error('[events] error in handleRegisterEvent', err);
      toast({ title: 'Error', description: 'Could not update registration' });
    }
  };

  // Profile Edit Handler
  const handleEditProfile = () => {
    if (!editingProfile.name.trim()) {
      toast({ title: "Error", description: "Please enter your name", variant: "destructive" });
      return;
    }
    
    setProfile({
      ...profile,
      name: editingProfile.name,
      title: editingProfile.title || profile?.title,
      location: editingProfile.location || profile?.location,
    });
    
    setUserProfile({
      id: currentUserId,
      name: editingProfile.name,
      email: 'candidate@example.com',
      title: editingProfile.title || profile?.title,
      location: editingProfile.location || profile?.location,
      skills: parsedSkills,
      avatarUrl: profile?.avatarUrl,
    });
    
    // Show greeting message
    setGreetingMessage(`👋 Welcome ${editingProfile.name}! Your profile has been updated.`);
    setShowProfileModal(false);
    
    toast({ title: "Profile Updated!", description: `Welcome ${editingProfile.name}!` });
    
    // Clear greeting after 5 seconds
    setTimeout(() => setGreetingMessage(""), 5000);
  };

  // Portfolio handlers
  const handleAddPortfolioProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({ title: "Error", description: "Please fill title and description", variant: "destructive" });
      return;
    }
    const project = addPortfolioProject({
      candidateId: currentUserId,
      ...newProject,
      skills: newProject.skills.length > 0 ? newProject.skills : ["Project"],
    });
    setPortfolioProjects((p) => [project, ...p]);
    setNewProject({ title: "", description: "", skills: [], link: "", github: "" });
    setShowPortfolioModal(false);
    toast({ title: "Project added!", description: newProject.title });
  };

  const handleDeleteProject = (projectId: number) => {
    deletePortfolioProject(projectId);
    setPortfolioProjects((p) => p.filter((proj) => proj.id !== projectId));
    toast({ title: "Project deleted", description: "Portfolio project removed" });
  };

  // Interview handlers
  const handleScheduleInterview = () => {
    if (!newInterview.interviewDate || !newInterview.interviewTime) {
      toast({ title: "Error", description: "Please select date and time", variant: "destructive" });
      return;
    }
    const interview = scheduleInterview({
      candidateId: currentUserId,
      recruiterId: 'recruiter-1',
      jobId: selectedJob?.id ?? 1,
      jobTitle: selectedJob?.title ?? 'Job',
      company: selectedJob?.company ?? 'Company',
      ...newInterview,
      status: 'scheduled',
    });
    setInterviews((i) => [interview, ...i]);
    setNewInterview({
      interviewDate: "",
      interviewTime: "",
      duration: 30,
      type: "video",
      notes: "",
    });
    setShowInterviewModal(false);
    
    // Send email notification to recruiter
    sendEmailNotification(
      'recruiter@example.com',
      `Interview Scheduled: ${selectedJob?.title}`,
      `Candidate ${profile?.name} has scheduled an interview for ${newInterview.interviewDate} at ${newInterview.interviewTime}.`,
      'interview'
    );
    
    toast({ title: "Interview scheduled!", description: `Interview on ${newInterview.interviewDate}` });
  };

  const handleCancelInterview = (interviewId: number) => {
    setInterviews((i) => i.filter((interview) => interview.id !== interviewId));
    toast({ title: "Interview cancelled", description: "Interview removed from schedule" });
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setIsLoadingChat(true);

    try {
      // Use ChatGPT API with fallback to mock
      const response = await callChatGPT(userMsg);
      
  addChatMessage(currentUserId, userMsg, response);
  setChatMessages((m) => [...m, { message: userMsg, response, timestamp: new Date().toLocaleString() }]);
      setChatInput("");
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Greeting Message Display */}
        {greetingMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-300 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-sky-900">{greetingMessage}</p>
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-sky-900">Find Your Next Opportunity</h1>
          <p className="text-sky-700">
            AI-matched jobs based on your skills and experience
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 border-sky-200 bg-gradient-to-r from-sky-100 to-white shadow-lg">
          <CardHeader className="border-b border-sky-200">
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {profile?.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt="Avatar" 
                        className="h-16 w-16 rounded-full object-cover border-2 border-sky-300" 
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-2xl font-bold text-white">
                        {profile?.name?.[0] ?? "Y"}
                      </div>
                    )}
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <button onClick={handleOpenAvatar} className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 text-xs border border-sky-300 hover:bg-sky-100 font-bold text-sky-600">✎</button>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-sky-900">{profile?.name ?? "You"}</div>
                    <div className="text-sm text-sky-700">{profile?.title ?? "Frontend Engineer"} • {profile?.location ?? "Bangalore, INDIA"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <input ref={fileInputRef} type="file" accept="application/pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                  <Button variant="outline" size="sm" onClick={() => { setEditingProfile({ name: profile?.name ?? "", title: profile?.title ?? "", location: profile?.location ?? "" }); setShowProfileModal(true); }} className="border-sky-300 text-sky-700 hover:bg-sky-100">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleOpenFile} className="border-sky-300 text-sky-700 hover:bg-sky-100">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAccountMenu((s) => !s)} className="border-sky-200 text-sky-700 hover:bg-sky-50">
                    {currentUserProfile?.name ?? profile?.name ?? 'You'}
                  </Button>
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-10 w-48 bg-white border border-sky-200 rounded-md shadow-lg z-50">
                      <div className="p-3 border-b border-sky-100">
                        <div className="text-sm font-semibold text-sky-900">{currentUserProfile?.name ?? profile?.name ?? 'You'}</div>
                        <div className="text-xs text-sky-600">{currentUserProfile?.email ?? '—'}</div>
                      </div>
                      <div className="flex flex-col">
                        <button onClick={() => { setShowProfileModal(true); setShowAccountMenu(false); }} className="text-left px-4 py-2 hover:bg-sky-50">View / Edit Profile</button>
                        <button onClick={() => { handleLogout(); }} className="text-left px-4 py-2 text-red-600 hover:bg-sky-50">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Hired By Section */}
              {applications.filter(a => (a.candidateId === currentUserId || a.candidateName === 'You') && a.hiredBy).length > 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">✅ Hired By</h3>
                  <div className="flex flex-wrap gap-2">
                    {applications.filter(a => (a.candidateId === currentUserId || a.candidateName === 'You') && a.hiredBy).map((a) => (
                      <div key={a.id} className="px-3 py-2 bg-white border border-green-200 rounded-lg text-sm text-green-900 font-medium">
                        <div className="text-green-700">{a.company}</div>
                        <div className="text-xs text-green-600">Position: {a.jobTitle}</div>
                        <div className="text-xs text-green-600">By: {a.hiredBy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-white border border-sky-200">
                  <h3 className="font-semibold text-sky-900">Parsed Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {parsedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-sky-200 text-sky-900">
                        {skill}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-sky-700 hover:bg-sky-100" onClick={handleGenerateMore}>
                      <Sparkles className="mr-1 h-3 w-3" />
                      Generate More
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-sky-200">
                  <h3 className="font-semibold text-sky-900">Uploaded Resumes</h3>
                  <div className="mt-2 flex flex-col gap-2">
                    <Button size="sm" onClick={() => setShowATSBuilder(true)} className="bg-sky-600 hover:bg-sky-700 text-white w-full">
                      + Build ATS Resume
                    </Button>
                    {resumes.length === 0 && generatedATSResumes.length === 0 && <div className="text-sm text-sky-600">No resumes yet.</div>}
                    {resumes.map((r) => (
                      <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded border border-sky-200 p-2 text-sm hover:bg-sky-50">
                        <span className="text-sky-900 font-medium">{r.filename}</span>
                        <span className="text-xs text-sky-600">{r.uploadedAt ?? r.uploaded_at ?? 'just now'}</span>
                      </a>
                    ))}
                    {generatedATSResumes.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-2 text-sm hover:bg-green-100">
                        <span className="text-green-900 font-medium">📄 {r.fullName} - ATS Resume</span>
                        <span className="text-xs text-green-600">{r.generatedDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-sky-200">
                  <h3 className="font-semibold text-sky-900">Recent Activity</h3>
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    {applications.filter(a => a.candidateId === currentUserId || a.candidateName === 'You').length === 0 && (
                      <div className="text-sky-600">No recent activity</div>
                    )}
                    {applications.filter(a => a.candidateId === currentUserId || a.candidateName === 'You').map((a) => (
                      <div key={a.id} className="rounded border border-sky-200 p-2 hover:bg-sky-50">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sky-900">{jobs.find(j => j.id === a.jobId)?.title ?? 'Unknown'}</div>
                          <div className="text-xs text-sky-600">{a.appliedDate}</div>
                        </div>
                        <div className="text-xs text-sky-700">Status: <span className="font-bold text-sky-900">{a.status}</span></div>
                        {a.resumeFilename && <div className="text-xs text-sky-700">Resume: <span className="font-bold text-sky-900">{a.resumeFilename}</span></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 border-b border-sky-200">
          <Button
            variant={activeTab === "jobs" ? "default" : "ghost"}
            className={activeTab === "jobs" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("jobs")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Jobs
          </Button>
          <Button
            variant={activeTab === "competitions" ? "default" : "ghost"}
            className={activeTab === "competitions" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("competitions")}
          >
            <Zap className="mr-2 h-4 w-4" />
            Competitions & Quizzes
          </Button>
          <Button
            variant={activeTab === "events" ? "default" : "ghost"}
            className={activeTab === "events" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("events")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Opportunities
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className={activeTab === "profile" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("profile")}
          >
            <Award className="mr-2 h-4 w-4" />
            Certificates
          </Button>
          <Button
            variant={activeTab === "portfolio" ? "default" : "ghost"}
            className={activeTab === "portfolio" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("portfolio")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Portfolio
          </Button>
          <Button
            variant={activeTab === "interviews" ? "default" : "ghost"}
            className={activeTab === "interviews" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-100"}
            onClick={() => setActiveTab("interviews")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Interviews
          </Button>
        </div>

        {/* Search Bar - Jobs Tab Only */}
        {activeTab === "jobs" && (
          <div className="mb-8">
            <div className="flex gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
                <Input
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <Button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white" onClick={handleSearch}>Search</Button>
            </div>
          </div>
        )}

        {/* Job Listings */}
        {activeTab === "jobs" && (
        <div className="space-y-4">
          {results.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-lg border-sky-200 bg-white hover:border-sky-400">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-2xl">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-sky-900">{job.title}</h3>
                        <p className="text-sky-700 font-medium">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-sky-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-sky-300 text-sky-700 bg-sky-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                    <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-sky-700">Match:</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600">
                        <span className="text-sm font-bold text-white">{job.match}%</span>
                      </div>
                    </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                          <select className="rounded border border-sky-300 px-2 py-1 text-sm focus:ring-sky-400 focus:border-sky-500" onChange={(e) => { setSelectedResumeId(Number(e.target.value) || null); }} value={selectedResumeId ?? ""}>
                            <option value="">Attach resume (optional)</option>
                            {resumes.map((r) => (
                              <option key={r.id} value={r.id}>{r.filename}</option>
                            ))}
                          </select>
                        </div>
                        <Button onClick={() => handleViewDetails(job)} className="bg-sky-600 hover:bg-sky-700 text-white">View Details</Button>
                        <Button variant="secondary" onClick={() => handleApply(job)} className="bg-sky-100 hover:bg-sky-200 text-sky-900">Apply</Button>
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Competitions & Quizzes Tab */}
        {activeTab === "competitions" && (
          <div className="space-y-4">
            {competitions.length === 0 ? (
              <Card className="border-sky-200 bg-white text-center py-12">
                <CardContent>
                  <Zap className="mx-auto h-12 w-12 text-sky-300 mb-4" />
                  <h3 className="font-semibold text-sky-900">No competitions available</h3>
                  <p className="text-sm text-sky-700">Check back soon for new quizzes and coding challenges!</p>
                </CardContent>
              </Card>
            ) : (
              competitions.map((comp) => (
                <Card key={comp.id} className="border-sky-200 bg-white hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="h-5 w-5 text-sky-600" />
                          <h3 className="text-xl font-semibold text-sky-900">{comp.title}</h3>
                        </div>
                        <p className="text-sky-700 mb-3">{comp.type} • Difficulty: <Badge className="ml-2">{comp.difficulty}</Badge></p>
                        <div className="flex gap-4 text-sm text-sky-700">
                          <span>⏱️ {comp.duration} mins</span>
                          <span>🏆 {comp.reward} points</span>
                        </div>
                      </div>
                      <Button onClick={() => handleTakeQuiz(comp)} className="bg-sky-600 hover:bg-sky-700 text-white">
                        Take Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <Card className="border-sky-200 bg-white text-center py-12">
                <CardContent>
                  <BookOpen className="mx-auto h-12 w-12 text-sky-300 mb-4" />
                  <h3 className="font-semibold text-sky-900">No opportunities available</h3>
                  <p className="text-sm text-sky-700">Check back soon for workshops, hackathons, and scholarships!</p>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => {
                const isRegistered = registeredEvents.includes(event.id);
                return (
                  <Card key={event.id} className={`border-sky-200 bg-white hover:shadow-lg transition-all ${isRegistered ? 'border-green-400 border-2' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {event.type === 'workshop' && '🎓'}
                              {event.type === 'hackathon' && '🚀'}
                              {event.type === 'conference' && '🎤'}
                              {event.type === 'scholarship' && '💰'}
                            </span>
                            <h3 className="text-xl font-semibold text-sky-900">{event.title}</h3>
                            {isRegistered && <Badge className="bg-green-100 text-green-800">✓ Registered</Badge>}
                          </div>
                          <p className="text-sky-700 mb-2">{event.description}</p>
                          <div className="flex gap-4 text-sm text-sky-700 mb-3">
                            <span>📅 {event.date}</span>
                            {event.location && <span>📍 {event.location}</span>}
                            <span>⭐ {event.reward}</span>
                          </div>
                          <Badge variant="outline" className="border-sky-300 text-sky-700 bg-sky-50 capitalize">{event.type}</Badge>
                        </div>
                        <Button 
                          onClick={() => handleRegisterEvent(event.id)}
                          className={isRegistered ? "bg-red-600 hover:bg-red-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}
                        >
                          {isRegistered ? "Unregister" : "Register"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setCertModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Certificate
              </Button>
            </div>
            {certificates.length === 0 ? (
              <Card className="border-sky-200 bg-white text-center py-12">
                <CardContent>
                  <Award className="mx-auto h-12 w-12 text-sky-300 mb-4" />
                  <h3 className="font-semibold text-sky-900">No certificates yet</h3>
                  <p className="text-sm text-sky-700">Add your certificates, achievements, and credentials here!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="border-sky-200 bg-white hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Award className="h-8 w-8 text-sky-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sky-900">{cert.title}</h3>
                          <p className="text-sm text-sky-700">{cert.issuer}</p>
                          <p className="text-xs text-sky-600 mt-1">Issued: {cert.issueDate}</p>
                          {cert.verified && (
                            <Badge className="mt-2 bg-green-100 text-green-800">✓ Verified</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowPortfolioModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
            {portfolioProjects.length === 0 ? (
              <Card className="border-sky-200 bg-white text-center py-12">
                <CardContent>
                  <Briefcase className="mx-auto h-12 w-12 text-sky-300 mb-4" />
                  <h3 className="font-semibold text-sky-900">No projects yet</h3>
                  <p className="text-sm text-sky-700">Showcase your best work and projects here!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioProjects.map((project) => (
                  <Card key={project.id} className="border-sky-200 bg-white hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sky-900 text-lg">{project.title}</h3>
                          <p className="text-sm text-sky-700 mt-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.skills.map((skill) => (
                              <Badge key={skill} className="bg-sky-100 text-sky-700">{skill}</Badge>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4">
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                                🔗 View
                              </a>
                            )}
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                                💻 Code
                              </a>
                            )}
                            <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-700 text-sm font-medium ml-auto">
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === "interviews" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setShowInterviewModal(true); setSelectedJob(null); }} className="bg-sky-600 hover:bg-sky-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </div>
            {interviews.length === 0 ? (
              <Card className="border-sky-200 bg-white text-center py-12">
                <CardContent>
                  <Clock className="mx-auto h-12 w-12 text-sky-300 mb-4" />
                  <h3 className="font-semibold text-sky-900">No interviews scheduled</h3>
                  <p className="text-sm text-sky-700">Schedule interviews with recruiters for positions you've applied to!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviews.map((interview) => (
                  <Card key={interview.id} className="border-sky-200 bg-white hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-sky-900">{interview.jobTitle}</h3>
                          <p className="text-sm text-sky-700">{interview.company}</p>
                        </div>
                        <div className="bg-sky-50 p-3 rounded-lg space-y-2 text-sm">
                          <p><strong>📅 Date:</strong> {interview.interviewDate}</p>
                          <p><strong>🕐 Time:</strong> {interview.interviewTime}</p>
                          <p><strong>⏱️ Duration:</strong> {interview.duration} minutes</p>
                          <p><strong>📞 Type:</strong> {interview.type === "phone" ? "Phone" : interview.type === "video" ? "Video" : "In-Person"}</p>
                          <Badge className={`mt-2 ${interview.status === "scheduled" ? "bg-blue-100 text-blue-800" : interview.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </Badge>
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-sky-700 italic">📝 {interview.notes}</p>
                        )}
                        <Button onClick={() => handleCancelInterview(interview.id)} variant="destructive" className="w-full mt-2">
                          Cancel Interview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Modal */}
        <Dialog open={quizOpen} onOpenChange={(open) => setQuizOpen(open)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedQuiz?.title}</DialogTitle>
              <DialogDescription>
                Difficulty: {selectedQuiz?.difficulty} • {selectedQuiz?.duration} minutes • {quizQuestions.length} questions
              </DialogDescription>
            </DialogHeader>
            {selectedQuiz && !quizCompleted && quizQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="bg-sky-100 p-3 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-sky-900">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                  <div className="w-32 h-2 bg-sky-300 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-600" style={{width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`}}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-sky-200">
                  <h3 className="text-lg font-semibold text-sky-900 mb-4">{quizQuestions[currentQuestionIndex].questionText}</h3>
                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex].options.map((option: string, idx: number) => (
                      <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all"
                        style={{
                          borderColor: selectedAnswers[currentQuestionIndex] === idx ? '#0369a1' : '#e0f2fe',
                          backgroundColor: selectedAnswers[currentQuestionIndex] === idx ? '#e0f2fe' : 'white'
                        }}>
                        <input
                          type="radio"
                          name={`q-${currentQuestionIndex}`}
                          checked={selectedAnswers[currentQuestionIndex] === idx}
                          onChange={() => handleAnswerQuestion(idx)}
                          className="w-5 h-5"
                        />
                        <span className="text-sky-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-between">
                  <Button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="border-sky-300 text-sky-700"
                  >
                    ← Previous
                  </Button>
                  {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <Button onClick={handleNextQuestion} className="bg-sky-600 hover:bg-sky-700 text-white">
                      Next →
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700 text-white">
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            )}
            {quizCompleted && (
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Quiz Completed!</h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">{quizScore}%</p>
                  <p className="text-green-700">Great effort! Your score has been saved.</p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sky-900 mb-3">Results Breakdown:</h4>
                  <div className="space-y-2 text-sm text-sky-700">
                    <p>✓ Total Questions: {quizQuestions.length}</p>
                    <p>✓ Correct Answers: {Math.round((quizScore / 100) * quizQuestions.length)}</p>
                    <p>✓ Score: {quizScore}%</p>
                  </div>
                </div>
                <Button onClick={handleFinishQuiz} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                  Close Quiz
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Portfolio Modal */}
        <Dialog open={showPortfolioModal} onOpenChange={(open) => setShowPortfolioModal(open)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Portfolio Project</DialogTitle>
              <DialogDescription>
                Showcase your best projects
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sky-900">Project Title</label>
                <Input
                  placeholder="e.g., AI Job Search Platform"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Description</label>
                <Input
                  placeholder="Describe your project and your role..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Skills Used</label>
                <Input
                  placeholder="e.g., React, TypeScript, Tailwind (comma-separated)"
                  value={newProject.skills.join(", ")}
                  onChange={(e) => setNewProject({ ...newProject, skills: e.target.value.split(",").map(s => s.trim()) })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Project Link</label>
                <Input
                  placeholder="https://example.com"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">GitHub Link</label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPortfolioProject} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white">
                  Add Project
                </Button>
                <Button variant="outline" onClick={() => setShowPortfolioModal(false)} className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Interview Scheduling Modal */}
        <Dialog open={showInterviewModal} onOpenChange={(open) => setShowInterviewModal(open)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                {selectedJob ? `For ${selectedJob.title} at ${selectedJob.company}` : "Schedule an interview with recruiter"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sky-900">Interview Date</label>
                <Input
                  type="date"
                  value={newInterview.interviewDate}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewDate: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Interview Time</label>
                <Input
                  type="time"
                  value={newInterview.interviewTime}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewTime: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Duration (minutes)</label>
                <Input
                  type="number"
                  min="15"
                  max="120"
                  value={newInterview.duration}
                  onChange={(e) => setNewInterview({ ...newInterview, duration: parseInt(e.target.value) })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Interview Type</label>
                <select
                  value={newInterview.type}
                  onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as any })}
                  className="mt-1 w-full px-3 py-2 border border-sky-300 rounded-lg focus:border-sky-500 focus:ring-sky-400 focus:outline-none"
                >
                  <option value="phone">Phone Interview</option>
                  <option value="video">Video Interview</option>
                  <option value="in-person">In-Person Interview</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Notes (Optional)</label>
                <Input
                  placeholder="Add any notes or preferences..."
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleScheduleInterview} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white">
                  Schedule
                </Button>
                <Button variant="outline" onClick={() => setShowInterviewModal(false)} className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Certificate Upload Modal */}
        <Dialog open={certModal} onOpenChange={(open) => setCertModal(open)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Certificate</DialogTitle>
              <DialogDescription>
                Upload your certificates and achievements
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sky-900">Certificate Title</label>
                <Input
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Issuing Organization</label>
                <Input
                  placeholder="e.g., Amazon Web Services"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Issue Date</label>
                <Input
                  type="date"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Certificate Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCertImageFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm border border-sky-300 rounded-lg p-2 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600"
                />
                {certImageFile && <p className="text-xs text-sky-600 mt-1">✓ {certImageFile.name} selected</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCertificate} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white">
                  Add Certificate
                </Button>
                <Button variant="outline" onClick={() => { setCertModal(false); setCertImageFile(null); }} className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialogs for details / cover / resume preview */}
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "details" && selectedJob ? `${selectedJob.title} — ${selectedJob.company}` : dialogMode === "cover" ? "Generated Cover Letter" : "Resume Preview"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "details" && selectedJob && (
                  <span className="text-sm text-muted-foreground">{selectedJob.location} • {selectedJob.salary} • {selectedJob.posted}</span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              {dialogMode === "details" && selectedJob && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                  <p className="text-sm">{selectedJob.type} • Match: {selectedJob.match}%</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedJob.skills.map((s: string) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {dialogMode === "cover" && (
                <div>
                  <pre className="whitespace-pre-wrap rounded bg-muted p-4 text-sm">{coverLetter}</pre>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => { navigator.clipboard?.writeText(coverLetter); toast({ title: "Copied", description: "Cover letter copied to clipboard" }); }}>Copy</Button>
                    <Button variant="outline" onClick={() => toast({ title: "Saved", description: "Cover letter saved to drafts" })}>Save</Button>
                  </div>
                </div>
              )}

              {dialogMode === "resume" && (
                <div>
                  {resumeFile ? (
                    <div>
                      <p className="font-medium">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground">{Math.round(resumeFile.size / 1024)} KB</p>
                      <div className="mt-3 flex gap-2">
                        <Button onClick={handleUploadSubmit}>Upload</Button>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No file selected</p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter />
          </DialogContent>
        </Dialog>

        {/* AI Chat Assistant Button */}
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            title="AI Job Assistant"
          >
            <MessageCircle className="h-7 w-7" />
          </button>
        </div>

        {/* AI Chat Panel */}
        {chatOpen && (
          <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-2xl border border-sky-200 z-40 flex flex-col max-h-[600px]">
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="font-semibold text-lg">AI Job Assistant</h3>
              <button onClick={() => setChatOpen(false)} className="text-white hover:bg-sky-700 p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-sky-600 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ask me about jobs, interviews, skills, or career advice!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-sky-600 text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-sky-100 text-sky-900 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">{msg.response}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="bg-sky-100 text-sky-900 rounded-lg p-3">
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-sky-200 p-4 bg-sky-50 rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI assistant..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  className="border-sky-300 focus:border-sky-500"
                />
                <Button
                  onClick={handleSendChat}
                  disabled={isLoadingChat || !chatInput.trim()}
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-sky-600 mt-2">Tips: Ask about interviews, resume, skills, or jobs</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={showProfileModal} onOpenChange={(open) => setShowProfileModal(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and create your greeting message
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-sky-900">Full Name *</label>
              <Input
                placeholder="Enter your full name"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-sky-900">Professional Title</label>
              <Input
                placeholder="e.g., Full Stack Developer, Product Manager"
                value={editingProfile.title}
                onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-sky-900">Location</label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={editingProfile.location}
                onChange={(e) => setEditingProfile({ ...editingProfile, location: e.target.value })}
                className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
              />
            </div>
            {greetingMessage && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sm text-sky-700">{greetingMessage}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleEditProfile} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white">
                Save Profile
              </Button>
              <Button variant="outline" onClick={() => setShowProfileModal(false)} className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ATS Resume Builder Modal */}
      <Dialog open={showATSBuilder} onOpenChange={(open) => setShowATSBuilder(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create ATS-Friendly Resume</DialogTitle>
            <DialogDescription>
              Build an optimized resume format that passes through Applicant Tracking Systems
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-sky-900">Full Name *</label>
                <Input
                  placeholder="Enter your full name"
                  value={atsResumeForm.fullName}
                  onChange={(e) => setATSResumeForm({ ...atsResumeForm, fullName: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Email *</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={atsResumeForm.email}
                  onChange={(e) => setATSResumeForm({ ...atsResumeForm, email: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Phone</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={atsResumeForm.phone}
                  onChange={(e) => setATSResumeForm({ ...atsResumeForm, phone: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sky-900">Location</label>
                <Input
                  placeholder="City, State"
                  value={atsResumeForm.location}
                  onChange={(e) => setATSResumeForm({ ...atsResumeForm, location: e.target.value })}
                  className="mt-1 border-sky-300 focus:border-sky-500 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <label className="text-sm font-medium text-sky-900">Professional Summary</label>
              <textarea
                placeholder="Brief overview of your professional background and goals"
                value={atsResumeForm.summary}
                onChange={(e) => setATSResumeForm({ ...atsResumeForm, summary: e.target.value })}
                className="mt-1 w-full p-2 border border-sky-300 rounded-md focus:border-sky-500 focus:ring-sky-400 text-sm"
                rows={3}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm font-medium text-sky-900">Skills (comma-separated)</label>
              <textarea
                placeholder="e.g., React, TypeScript, Node.js, MongoDB"
                value={atsResumeForm.skills.join(", ")}
                onChange={(e) => setATSResumeForm({ ...atsResumeForm, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                className="mt-1 w-full p-2 border border-sky-300 rounded-md focus:border-sky-500 focus:ring-sky-400 text-sm"
                rows={2}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateATSResume} 
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
              >
                Generate ATS Resume
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowATSBuilder(false)} 
                className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Candidate;
