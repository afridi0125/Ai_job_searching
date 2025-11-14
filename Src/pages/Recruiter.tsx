import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Briefcase, TrendingUp, Eye } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const mockApplications = [
  {
    id: 1,
    candidateName: "Sarah Johnson",
    position: "Senior Frontend Developer",
    matchScore: 94,
    status: "Under Review",
    appliedDate: "2 days ago",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    candidateName: "Michael Chen",
    position: "Full Stack Engineer",
    matchScore: 89,
    status: "Shortlisted",
    appliedDate: "3 days ago",
    skills: ["Node.js", "Python", "AWS"],
  },
  {
    id: 3,
    candidateName: "Emily Rodriguez",
    position: "Senior Frontend Developer",
    matchScore: 87,
    status: "New",
    appliedDate: "1 day ago",
    skills: ["Vue.js", "React", "CSS"],
  },
];

const Recruiter = () => {
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
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                  <p className="text-2xl font-bold text-foreground">247</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Match Score</p>
                  <p className="text-2xl font-bold text-foreground">86%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockApplications.map((application) => (
                <Card key={application.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {application.candidateName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{application.candidateName}</h3>
                            <p className="text-sm text-muted-foreground">Applied for: {application.position}</p>
                          </div>
                        </div>
                        
                        <div className="mb-2 flex flex-wrap gap-2">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Applied {application.appliedDate}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 md:w-48">
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Match:</span>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                            <span className="text-sm font-bold text-white">{application.matchScore}%</span>
                          </div>
                        </div>
                        
                        <Badge variant={
                          application.status === "Shortlisted" ? "default" : 
                          application.status === "New" ? "secondary" : "outline"
                        }>
                          {application.status}
                        </Badge>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recruiter;
