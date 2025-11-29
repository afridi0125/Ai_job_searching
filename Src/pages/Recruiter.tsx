import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Briefcase, TrendingUp, Eye, Download, Award, Zap } from "lucide-react";
import { Navigation } from "@/components/Navigation";
// Local in-memory handlers — keep UI interactive without external services
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getApplications, updateApplicationStatus, getApplicationStats, getUserProfile, getAllUserPerformance, addJob, getJobs, markApplicationAsHired } from "@/lib/applicationStore";
import { Input } from "@/components/ui/input";
import { toast } from "@/hook/use-toast";

const Recruiter = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [userPerformance, setUserPerformance] = useState<any[]>([]);
  const [postOpen, setPostOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", salary: "", type: "Full-time", skills: "", category: "job" });
  const [recruiterName, setRecruiterName] = useState("Recruiter Admin");

  useEffect(() => {
    // Load applications from shared store
    const loadData = () => {
      const apps = getApplications();
      setApplications(apps);

      const appStats = getApplicationStats();
      setStats(appStats);

      // Load user performance analytics
      const performance = getAllUserPerformance();
      setUserPerformance(performance);

      // Load jobs from localStorage (both default and posted)
      const storedJobs = getJobs();
      if (storedJobs.length === 0) {
        // Load default jobs only if none exist
        const defaultJobs = [
          { id: 1, title: 'Senior Frontend Developer', company: 'Google', location: 'Bangalore, INDIA', salary: '$120k - $180k', type: 'Full-time', posted: '2 days ago', match: 0, skills: ['React','TypeScript'], category: 'job' as const, logo: '🔵', description: 'Senior Frontend role at Google' },
          { id: 2, title: 'Full Stack Engineer', company: 'Microsoft', location: 'Mumbai, INDIA', salary: '$100k - $150k', type: 'Full-time', posted: '5 days ago', match: 0, skills: ['Node.js','React'], category: 'job' as const, logo: '⬛', description: 'Full Stack role at Microsoft' },
          { id: 4, title: 'React Developer Intern', company: 'TechStartup', location: 'Remote', salary: '$15k - $25k', type: 'Internship', posted: '3 days ago', match: 0, skills: ['React','JavaScript'], category: 'internship' as const, logo: '🚀', description: 'Internship at TechStartup' },
        ];
        setJobs(defaultJobs);
      } else {
        setJobs(storedJobs);
      }
    };

    loadData();
    // Refresh every 2 seconds for live updates
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkSelected = (appId: number) => {
    markApplicationAsHired(appId, recruiterName);
    const updated = getApplications();
    setApplications(updated);
    const updatedStats = getApplicationStats();
    setStats(updatedStats);
    toast({ title: "Success", description: "Candidate marked as hired" });
  };

  const handleViewProfile = (application: any) => {
    setSelectedApp(application);
    setProfileOpen(true);
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.salary) {
      toast({ title: "Error", description: "Please fill all job fields", variant: "destructive" });
      return;
    }
    const job = {
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      salary: newJob.salary,
      type: newJob.type as "Full-time" | "Part-time" | "Internship",
      posted: "just now",
      match: 0,
      skills: newJob.skills.split(",").map((s) => s.trim()).filter(Boolean),
      category: newJob.category as "job" | "internship",
      logo: "💼", // Default icon
      description: `${newJob.title} at ${newJob.company}`,
    };
    addJob(job);
    setJobs(getJobs()); // Reload from localStorage
    setPostOpen(false);
    setNewJob({ title: "", company: "", location: "", salary: "", type: "Full-time", skills: "", category: "job" });
    toast({ title: "Job Posted!", description: `${job.title} is now live` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">
              Manage job postings and track applications
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent" onClick={() => setPostOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Jobs</p>
                  <p className="text-3xl font-bold text-blue-900">{jobs.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-200">
                  <Briefcase className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Applicants</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalApplications || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-200">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Selected</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.statusCounts?.selected || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-200">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Avg Match</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.avgMatchScore || 0}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-200">
                  <TrendingUp className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "New", count: stats.statusCounts?.new || 0, color: "bg-blue-500" },
                  { label: "Reviewing", count: stats.statusCounts?.reviewing || 0, color: "bg-yellow-500" },
                  { label: "Shortlisted", count: stats.statusCounts?.shortlisted || 0, color: "bg-purple-500" },
                  { label: "Selected", count: stats.statusCounts?.selected || 0, color: "bg-green-500" },
                  { label: "Rejected", count: stats.statusCounts?.rejected || 0, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`}
                          style={{width: `${(item.count / (stats.totalApplications || 1)) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Applications by Job */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Jobs by Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.jobApplicationCounts || {}).slice(0, 5).map(([job, count]: [string, any]) => (
                  <div key={job} className="flex items-center justify-between">
                    <div className="flex-1 text-sm font-medium truncate">{job}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{width: `${(count / (stats.totalApplications || 1)) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Performance Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Candidate Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userPerformance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No candidate performance data yet. Data will appear as candidates complete quizzes and earn certificates.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Candidate</th>
                      <th className="text-center py-3 px-4 font-semibold">Quizzes Completed</th>
                      <th className="text-center py-3 px-4 font-semibold">Avg Quiz Score</th>
                      <th className="text-center py-3 px-4 font-semibold">Certificates</th>
                      <th className="text-center py-3 px-4 font-semibold">Applications</th>
                      <th className="text-center py-3 px-4 font-semibold">Selected</th>
                      <th className="text-center py-3 px-4 font-semibold">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPerformance.map((perf) => (
                      <tr key={perf.candidateId} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium text-foreground">{perf.candidateName}</td>
                        <td className="text-center py-3 px-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">{perf.completedQuizzes}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          {perf.completedQuizzes > 0 ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-6 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                  style={{width: `${perf.averageQuizScore}%`}}
                                ></div>
                              </div>
                              <span className="font-semibold">{perf.averageQuizScore}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300">{perf.certificatesCount}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge variant="secondary">{perf.applicationCount}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={perf.selectedCount > 0 ? "bg-green-100 text-green-800 border-green-300" : "bg-gray-100 text-gray-800"}>{perf.selectedCount}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          {perf.applicationCount > 0 ? (
                            <span className="font-semibold text-green-700">{Math.round((perf.selectedCount / perf.applicationCount) * 100)}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications - Live */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No applications yet. Users will appear here when they apply for jobs.</p>
                </div>
              ) : (
                applications.map((application) => (
                  <Card key={application.id} className="transition-all hover:shadow-md border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-lg">
                              {application.candidateName?.[0] || 'U'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{application.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">{application.candidateTitle}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3 space-y-1 text-sm">
                            <p className="text-muted-foreground">📧 {application.candidateEmail}</p>
                            <p className="text-muted-foreground">📍 {application.candidateLocation}</p>
                            <p className="text-muted-foreground font-medium">Applied for: <span className="font-semibold text-foreground">{application.jobTitle}</span> @ <span className="font-semibold text-foreground">{application.company}</span></p>
                          </div>
                          
                          <div className="mb-2 flex flex-wrap gap-1">
                            {application.candidateSkills?.map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Applied: {application.appliedDate}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 md:w-64">
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Match Score:</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                              <span className="text-sm font-bold text-white">{application.matchScore}%</span>
                            </div>
                          </div>
                          
                          <Badge variant={
                            application.status === "Selected" ? "default" : 
                            application.status === "New" ? "secondary" : 
                            application.status === "Shortlisted" ? "outline" : "destructive"
                          } className="w-full text-center">
                            {application.status}
                          </Badge>

                          {application.resumeFilename && (
                            <Button size="sm" variant="outline" className="w-full text-xs">
                              <Download className="mr-2 h-3 w-3" />
                              {application.resumeFilename}
                            </Button>
                          )}

                          <div className="w-full flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewProfile(application)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Button>
                            {application.status !== "Selected" && (
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleMarkSelected(application.id)}>
                                Mark Selected
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Modal */}
        <Dialog open={profileOpen} onOpenChange={(open) => setProfileOpen(open)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Candidate Profile</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-2xl">
                    {selectedApp.candidateName?.[0] || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedApp.candidateName}</h2>
                    <p className="text-muted-foreground">{selectedApp.candidateTitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedApp.candidateEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedApp.candidateLocation}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.candidateSkills?.map((skill: string) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applied For</p>
                    <p className="font-medium">{selectedApp.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Match Score</p>
                    <p className="font-medium text-lg text-blue-600">{selectedApp.matchScore}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Application Details</p>
                  <div className="space-y-2 p-3 bg-gray-50 rounded">
                    <p>Status: <Badge>{selectedApp.status}</Badge></p>
                    <p className="text-sm">Applied: {selectedApp.appliedDate}</p>
                    {selectedApp.resumeUrl && (
                      <a href={selectedApp.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm block">
                        📄 View Resume: {selectedApp.resumeFilename}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Post Job Dialog */}
        <Dialog open={postOpen} onOpenChange={(o) => setPostOpen(o)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
              <DialogDescription>Enter job details to publish a new job.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <input className="border rounded p-2" placeholder="Title" value={newJob.title} onChange={(e) => setNewJob((s) => ({ ...s, title: e.target.value }))} />
              <input className="border rounded p-2" placeholder="Company" value={newJob.company} onChange={(e) => setNewJob((s) => ({ ...s, company: e.target.value }))} />
              <input className="border rounded p-2" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob((s) => ({ ...s, location: e.target.value }))} />
              <input className="border rounded p-2" placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob((s) => ({ ...s, salary: e.target.value }))} />
              <input className="border rounded p-2" placeholder="Skills (comma-separated)" value={newJob.skills} onChange={(e) => setNewJob((s) => ({ ...s, skills: e.target.value }))} />
              <div className="flex gap-2">
                <select className="border rounded p-2" value={newJob.type} onChange={(e) => setNewJob((s) => ({ ...s, type: e.target.value }))}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                </select>
                <select className="border rounded p-2" value={newJob.category} onChange={(e) => setNewJob((s) => ({ ...s, category: e.target.value }))}>
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPostOpen(false)}>Cancel</Button>
                <Button onClick={handlePostJob}>Post Job</Button>
              </div>
            </div>
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Recruiter;
