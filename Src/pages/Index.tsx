import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Sparkles, Target, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Job Matching
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Find Your Perfect Match in the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Job Market
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Connect talented candidates with dream opportunities using AI-powered semantic matching,
              intelligent resume parsing, and automated cover letter generation.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <NavLink to="/auth?mode=signup&role=candidate">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  I'm Looking for a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
              <NavLink to="/auth?mode=signup&role=recruiter">
                <Button size="lg" variant="outline">
                  I'm Hiring Talent
                  <Briefcase className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the future of recruitment and job searching
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Semantic Matching</h3>
                <p className="text-muted-foreground">
                  Our AI understands context, not just keywords. Get matched based on skills, experience, and cultural fit.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Cover Letters</h3>
                <p className="text-muted-foreground">
                  Generate personalized, compelling cover letters in seconds that highlight your unique qualifications.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure & GDPR Compliant</h3>
                <p className="text-muted-foreground">
                  Your data is protected with enterprise-grade security and full GDPR compliance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">For Candidates</h2>
              <ul className="space-y-4">
                {[
                  "Upload your resume and let AI parse your skills automatically",
                  "Get matched with jobs that truly fit your profile",
                  "Generate tailored cover letters instantly",
                  "Chat with AI assistant for career guidance",
                  "Track your applications in one place"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">For Recruiters</h2>
              <ul className="space-y-4">
                {[
                  "Post jobs and reach qualified candidates instantly",
                  "AI-powered candidate ranking and filtering",
                  "Automated applicant tracking system",
                  "Real-time analytics and insights",
                  "Streamlined communication tools"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-accent">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
                Ready to Transform Your Career or Hiring Process?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90">
                Join thousands of professionals already using TalentMatch AI
              </p>
              <NavLink to="/auth?mode=signup">
                <Button size="lg" variant="secondary" className="shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 TalentMatch AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
