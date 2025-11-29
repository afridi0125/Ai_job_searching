import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { MessageCircle, MapPin, Briefcase, Users, Globe, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hook/use-toast";

interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  location: string;
  employees: string;
  website: string;
  description: string;
  recruiters: {
    id: number;
    name: string;
    title: string;
    email: string;
    phone: string;
    avatar: string;
  }[];
  openPositions: number;
}

const COMPANIES: Company[] = [
  {
    id: 1,
    name: "Google",
    logo: "🔵",
    industry: "Technology",
    location: "Bangalore, Delhi, Hyderabad",
    employees: "190,000+",
    website: "www.google.com",
    description: "Google is a multinational technology company specializing in search engines, cloud computing, and AI.",
    openPositions: 142,
    recruiters: [
      {
        id: 1,
        name: "Priya Sharma",
        title: "Senior Technical Recruiter",
        email: "priya.sharma@google.com",
        phone: "+91 9876543210",
        avatar: "👩‍💼",
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        title: "Hiring Manager - Engineering",
        email: "rajesh.kumar@google.com",
        phone: "+91 9876543211",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "⬛",
    industry: "Technology",
    location: "Bangalore, Hyderabad, Pune",
    employees: "235,000+",
    website: "www.microsoft.com",
    description: "Microsoft develops, manufactures, licenses, and supports software, computers, and related services.",
    openPositions: 98,
    recruiters: [
      {
        id: 3,
        name: "Ananya Patel",
        title: "Talent Acquisition Specialist",
        email: "ananya.patel@microsoft.com",
        phone: "+91 9876543212",
        avatar: "👩‍💼",
      },
      {
        id: 4,
        name: "Vikas Singh",
        title: "Engineering Lead Recruiter",
        email: "vikas.singh@microsoft.com",
        phone: "+91 9876543213",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 3,
    name: "IBM",
    logo: "🔶",
    industry: "Technology & Consulting",
    location: "Bangalore, Delhi, Pune",
    employees: "345,000+",
    website: "www.ibm.com",
    description: "IBM is a multinational technology and consulting corporation providing IT infrastructure and software solutions.",
    openPositions: 156,
    recruiters: [
      {
        id: 5,
        name: "Meera Desai",
        title: "Campus Recruitment Lead",
        email: "meera.desai@ibm.com",
        phone: "+91 9876543214",
        avatar: "👩‍💼",
      },
      {
        id: 6,
        name: "Arun Gupta",
        title: "Experienced Hire Recruiter",
        email: "arun.gupta@ibm.com",
        phone: "+91 9876543215",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 4,
    name: "Puma",
    logo: "🐆",
    industry: "Sports & Fashion",
    location: "Mumbai, Bangalore, Delhi",
    employees: "20,000+",
    website: "www.puma.com",
    description: "PUMA is a German multinational company specializing in athletic and casual footwear, apparel, and accessories.",
    openPositions: 45,
    recruiters: [
      {
        id: 7,
        name: "Neha Verma",
        title: "HR Manager - Recruitment",
        email: "neha.verma@puma.com",
        phone: "+91 9876543216",
        avatar: "👩‍💼",
      },
      {
        id: 8,
        name: "Sameer Malik",
        title: "Operations Recruiter",
        email: "sameer.malik@puma.com",
        phone: "+91 9876543217",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 5,
    name: "Amazon",
    logo: "🟠",
    industry: "E-commerce & Cloud",
    location: "Bangalore, Hyderabad, Delhi",
    employees: "1,540,000+",
    website: "www.amazon.com",
    description: "Amazon is an American technology multinational focusing on e-commerce, cloud computing, and digital streaming.",
    openPositions: 237,
    recruiters: [
      {
        id: 9,
        name: "Divya Nair",
        title: "Senior Recruiter",
        email: "divya.nair@amazon.com",
        phone: "+91 9876543218",
        avatar: "👩‍💼",
      },
      {
        id: 10,
        name: "Karan Bhat",
        title: "Technical Program Manager Recruiter",
        email: "karan.bhat@amazon.com",
        phone: "+91 9876543219",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 6,
    name: "Netflix",
    logo: "🎬",
    industry: "Entertainment & Technology",
    location: "Bangalore, Mumbai",
    employees: "12,800+",
    website: "www.netflix.com",
    description: "Netflix is a streaming entertainment service offering a wide variety of award-winning TV shows and films.",
    openPositions: 67,
    recruiters: [
      {
        id: 11,
        name: "Zara Khan",
        title: "Talent Partner",
        email: "zara.khan@netflix.com",
        phone: "+91 9876543220",
        avatar: "👩‍💼",
      },
      {
        id: 12,
        name: "Rohan Chopra",
        title: "Product Engineering Recruiter",
        email: "rohan.chopra@netflix.com",
        phone: "+91 9876543221",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 7,
    name: "Flipkart",
    logo: "📱",
    industry: "E-commerce",
    location: "Bangalore, Delhi, Pune",
    employees: "35,000+",
    website: "www.flipkart.com",
    description: "Flipkart is an Indian e-commerce company and one of the largest online retailers in India.",
    openPositions: 89,
    recruiters: [
      {
        id: 13,
        name: "Sneha Gupta",
        title: "Campus Recruiting Manager",
        email: "sneha.gupta@flipkart.com",
        phone: "+91 9876543222",
        avatar: "👩‍💼",
      },
      {
        id: 14,
        name: "Abhishek Mehta",
        title: "Engineering Talent Acquisition",
        email: "abhishek.mehta@flipkart.com",
        phone: "+91 9876543223",
        avatar: "👨‍💼",
      },
    ],
  },
  {
    id: 8,
    name: "Adobe",
    logo: "🔴",
    industry: "Software & Design",
    location: "Bangalore, Noida",
    employees: "26,000+",
    website: "www.adobe.com",
    description: "Adobe is an American multinational computer software company specializing in multimedia and creative software.",
    openPositions: 73,
    recruiters: [
      {
        id: 15,
        name: "Jessica Lee",
        title: "Global Talent Acquisition",
        email: "jessica.lee@adobe.com",
        phone: "+91 9876543224",
        avatar: "👩‍💼",
      },
      {
        id: 16,
        name: "Nitin Das",
        title: "Engineering Recruiter",
        email: "nitin.das@adobe.com",
        phone: "+91 9876543225",
        avatar: "👨‍💼",
      },
    ],
  },
];

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Company["recruiters"][0] | null>(null);
  const [recruiterDetailsOpen, setRecruiterDetailsOpen] = useState(false);

  const filteredCompanies = COMPANIES.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      company.location.toLowerCase().includes(query)
    );
  });

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setCompanyDetailsOpen(true);
  };

  const handleContactRecruiter = (recruiter: Company["recruiters"][0]) => {
    setSelectedRecruiter(recruiter);
    setRecruiterDetailsOpen(true);
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${selectedRecruiter?.name}. They will contact you soon.`,
    });
    setRecruiterDetailsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-sky-900">Top Companies</h1>
          <p className="text-sky-700">
            Explore leading companies and connect with their recruiters
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-sky-300 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="border-sky-200 bg-white hover:shadow-xl transition-all transform hover:-translate-y-1">
              <CardHeader className="pb-4 border-b border-sky-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-5xl mb-2">{company.logo}</div>
                    <CardTitle className="text-2xl text-sky-900">{company.name}</CardTitle>
                    <p className="text-sm text-sky-600 mt-1">{company.industry}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {company.openPositions} Open
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-sky-700">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-sky-700">
                    <Users className="h-4 w-4" />
                    {company.employees}
                  </div>
                  <div className="flex items-center gap-2 text-sky-700">
                    <Globe className="h-4 w-4" />
                    {company.website}
                  </div>
                </div>

                <p className="text-sm text-sky-700 line-clamp-2">{company.description}</p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-900">Recruiters:</p>
                  <div className="flex gap-2">
                    {company.recruiters.map((recruiter) => (
                      <button
                        key={recruiter.id}
                        onClick={() => handleContactRecruiter(recruiter)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 transition text-xs text-sky-900"
                        title={recruiter.name}
                      >
                        <span>{recruiter.avatar}</span>
                        <span className="truncate hidden sm:inline">{recruiter.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleViewCompany(company)}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                >
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="border-sky-200 bg-white text-center py-16">
            <CardContent>
              <Briefcase className="h-16 w-16 mx-auto text-sky-300 mb-4" />
              <h3 className="text-xl font-semibold text-sky-900 mb-2">No companies found</h3>
              <p className="text-sky-700">Try a different search term</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Company Details Modal */}
      <Dialog open={companyDetailsOpen} onOpenChange={setCompanyDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{selectedCompany?.logo}</span>
              {selectedCompany?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <p className="text-sky-700">{selectedCompany.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-sm text-sky-600 mb-1">Industry</p>
                  <p className="font-semibold text-sky-900">{selectedCompany.industry}</p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-sm text-sky-600 mb-1">Employees</p>
                  <p className="font-semibold text-sky-900">{selectedCompany.employees}</p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-sm text-sky-600 mb-1">Open Positions</p>
                  <p className="font-semibold text-sky-900">{selectedCompany.openPositions}</p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-sm text-sky-600 mb-1">Website</p>
                  <p className="font-semibold text-sky-900">{selectedCompany.website}</p>
                </div>
              </div>

              <div className="bg-sky-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-sky-900 mb-4">Meet Our Recruiters</p>
                <div className="space-y-3">
                  {selectedCompany.recruiters.map((recruiter) => (
                    <div key={recruiter.id} className="bg-white p-3 rounded-lg border border-sky-200 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{recruiter.avatar}</span>
                        <div>
                          <h4 className="font-semibold text-sky-900">{recruiter.name}</h4>
                          <p className="text-sm text-sky-600">{recruiter.title}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-sky-700">
                            <Mail className="h-3 w-3" />
                            {recruiter.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-sky-700">
                            <Phone className="h-3 w-3" />
                            {recruiter.phone}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleContactRecruiter(recruiter)}
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => setCompanyDetailsOpen(false)} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recruiter Contact Modal */}
      <Dialog open={recruiterDetailsOpen} onOpenChange={setRecruiterDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Recruiter</DialogTitle>
          </DialogHeader>
          {selectedRecruiter && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-lg">
                <span className="text-5xl">{selectedRecruiter.avatar}</span>
                <div>
                  <h3 className="font-semibold text-sky-900">{selectedRecruiter.name}</h3>
                  <p className="text-sm text-sky-600">{selectedRecruiter.title}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-sky-600">Email</p>
                    <p className="font-semibold text-sky-900">{selectedRecruiter.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-sky-600">Phone</p>
                    <p className="font-semibold text-sky-900">{selectedRecruiter.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-sky-900 mb-3">Send Message</p>
                <textarea
                  placeholder="Tell us about yourself and your interest in this company..."
                  className="w-full p-2 rounded border border-sky-300 text-sm focus:outline-none focus:border-sky-500"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSendMessage} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Send Message
                </Button>
                <Button onClick={() => setRecruiterDetailsOpen(false)} variant="outline" className="flex-1 border-sky-300 text-sky-700">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
