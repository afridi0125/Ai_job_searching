import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, MapPin, DollarSign, Clock, Upload, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $180k",
    type: "Full-time",
    posted: "2 days ago",
    match: 95,
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$100k - $150k",
    type: "Full-time",
    posted: "5 days ago",
    match: 88,
    skills: ["Node.js", "React", "PostgreSQL"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    salary: "$90k - $130k",
    type: "Full-time",
    posted: "1 week ago",
    match: 82,
    skills: ["Figma", "UI Design", "Prototyping"],
  },
];

const Candidate = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">
            AI-matched jobs based on your skills and experience
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Profile</span>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">Parsed Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "UI Design", "Tailwind CSS"].map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Generate More
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent">Search</Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {mockJobs.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Match:</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                        <span className="text-sm font-bold text-white">{job.match}%</span>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Candidate;
