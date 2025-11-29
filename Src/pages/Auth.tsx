import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, ArrowLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hook/use-toast";
import { registerUser, authenticateUser, getUserByEmail, setUserProfile } from "@/lib/applicationStore";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const defaultMode = searchParams.get("mode") || "signin";
  const defaultRole = searchParams.get("role") || "candidate";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // For demo: existing default accounts
  const ensureDemoAccounts = () => {
    try {
      if (!getUserByEmail("candidate@example.com")) {
        const u = registerUser("candidate@example.com", "candidate123", "candidate", "Candidate Demo");
        setUserProfile({ id: u.id, name: "Candidate Demo", email: u.email, title: "Frontend Engineer", location: "Bangalore, INDIA", skills: [] });
      }
      if (!getUserByEmail("admin@example.com")) {
        const u = registerUser("admin@example.com", "admin123", "recruiter", "Admin Demo");
        setUserProfile({ id: u.id, name: "Admin Demo", email: u.email, title: "Recruiter", location: "Remote", skills: [] });
      }
    } catch (err) {
      // ignore
    }
  };

  const handleAuth = async (mode: "signin" | "signup") => {
    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
      // Ensure demo accounts exist for quick login
      ensureDemoAccounts();

      if (mode === "signin") {
        const user = authenticateUser(trimmedEmail, trimmedPassword);
        if (!user) {
          setTimeout(() => {
            setLoading(false);
            toast({
              title: "Login Failed",
              description: "Invalid email or password",
              variant: "destructive",
            });
          }, 500);
          return;
        }

        // Success - navigate immediately
        toast({
          title: "Success!",
          description: `Welcome back! Signed in as ${user.role}`,
        });
        setLoading(false);
        setTimeout(() => {
          navigate(user.role === "recruiter" ? "/recruiter" : "/candidate");
        }, 600);
      } else {
        // Sign up: try to register a new user
        try {
          const roleToUse = (defaultRole as "candidate" | "recruiter") || "candidate";
          const newUser = registerUser(trimmedEmail, trimmedPassword, roleToUse);
          // Create an empty profile for new user
          setUserProfile({ id: newUser.id, name: newUser.name || "", email: newUser.email, title: "", location: "", skills: [] });
          setTimeout(() => {
            setLoading(false);
            toast({
              title: "Success!",
              description: "Account created! Please sign in with your credentials",
            });
            setEmail("");
            setPassword("");
          }, 800);
        } catch (err: any) {
          setTimeout(() => {
            setLoading(false);
            toast({ title: "Account Error", description: err?.message || "Could not create account", variant: "destructive" });
          }, 300);
        }
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <Briefcase className="h-8 w-8" />
            TalentMatch AI
          </NavLink>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-800"><strong>Candidate:</strong> candidate@example.com / candidate123</p>
              <p className="text-xs text-blue-800"><strong>Admin:</strong> admin@example.com / admin123</p>
            </div>
            <Tabs defaultValue={defaultMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => handleAuth("signin")}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => handleAuth("signup")}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <NavLink to="/" className="mt-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default Auth;
