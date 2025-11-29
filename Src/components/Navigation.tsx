import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Briefcase, User, UserPlus, LogIn, Building2 } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            TalentMatch AI
          </NavLink>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <NavLink to="/companies">
              <Button variant="ghost" size="sm" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Companies</span>
              </Button>
            </NavLink>
            <NavLink to="/auth">
              <Button variant="ghost" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </NavLink>
            <NavLink to="/auth?mode=signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <UserPlus className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
