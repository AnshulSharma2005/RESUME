import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuth } from "@/contexts/auth-context";
import { experienceLevels } from "@/data/experience-levels";
import { getPopularTemplates } from "@/data/resume-templates";
import { 
  FileText, 
  Rocket, 
  Star, 
  Users, 
  Download, 
  BarChart3,
  Eye,
  ArrowUpDown,
  FileDown,
  Cloud,
  TrendingUp,
  Zap,
  Shield,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();

  const popularTemplates = getPopularTemplates();

  const handleGetStarted = () => {
    if (currentUser) {
      setLocation("/experience-selector");
    } else {
      setAuthMode("signup");
      setAuthOpen(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time ATS Scoring",
      description: "Get instant feedback on your resume's ATS compatibility with our AI-powered scoring system. 5 attempts per resume for optimization.",
      highlight: "5 optimization attempts included"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview Editing",
      description: "See your changes instantly with real-time preview. Switch between templates and see immediate results.",
      highlight: "Instant template switching"
    },
    {
      icon: <ArrowUpDown className="w-6 h-6" />,
      title: "Drag & Drop Sections",
      description: "Easily rearrange resume sections with intuitive drag-and-drop functionality. Customize your layout effortlessly.",
      highlight: "Flexible section ordering"
    },
    {
      icon: <FileDown className="w-6 h-6" />,
      title: "Professional PDF Export",
      description: "Export high-quality, ATS-friendly PDFs that maintain formatting across all devices and platforms.",
      highlight: "High-quality formatting"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Storage & Sync",
      description: "Access your resumes from anywhere with secure cloud storage powered by Firebase. Never lose your work.",
      highlight: "Automatic backup & sync"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track your resume performance, ATS scores, and editing history with comprehensive analytics.",
      highlight: "Performance insights"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">ResumeCraft</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              {currentUser ? (
                <Button
                  onClick={() => setLocation("/dashboard")}
                  variant="default"
                  data-testid="button-dashboard"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleSignIn}
                    data-testid="button-signin-nav"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleGetStarted}
                    data-testid="button-getstarted-nav"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              data-testid="button-mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Build Your Dream Resume with{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  ATS Scoring
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Create professional resumes with 15+ templates, real-time ATS scoring, and live editing. 
                  Stand out from the crowd with ResumeCraft's intelligent resume builder.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleGetStarted}
                  data-testid="button-start-building"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building for Free
                </Button>
                
                <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-secondary" />
                    <span>50,000+ users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-destructive" />
                    <span>100,000+ downloads</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white dark:bg-card rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground rounded-lg px-4 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">ATS Score: 95%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">JD</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-5/6" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Experience</h4>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-primary/20 rounded w-full" />
                      <div className="h-1.5 bg-primary/20 rounded w-4/5" />
                      <div className="h-1.5 bg-primary/20 rounded w-3/5" />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground rounded-lg px-4 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Download className="w-3 h-3" />
                    <span className="text-sm font-medium">Ready to Export</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Level Selection */}
      <section className="py-20 bg-muted/30" id="experience">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Experience Level</h2>
            <p className="text-xl text-muted-foreground">Get personalized templates and guidance based on your career stage</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {experienceLevels.map((level) => (
              <Card 
                key={level.id} 
                className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                  level.popular ? 'ring-2 ring-primary relative' : ''
                }`}
                data-testid={`card-experience-${level.id}`}
              >
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-${level.color}/10 rounded-xl flex items-center justify-center mb-6`}>
                    <span className="text-3xl">{level.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{level.title}</h3>
                  <p className="text-muted-foreground mb-6">{level.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full bg-${level.color} text-${level.color}-foreground hover:bg-${level.color}/90`}
                    onClick={() => setLocation(`/templates?level=${level.id}`)}
                    data-testid={`button-select-${level.id}`}
                  >
                    Select {level.title}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">15+ Professional Resume Templates</h2>
            <p className="text-xl text-muted-foreground mb-8">Choose from our curated collection of ATS-optimized templates</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularTemplates.slice(0, 4).map((template) => (
              <Card 
                key={template.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                data-testid={`card-template-${template.id}`}
              >
                <div className={`aspect-[3/4] ${template.preview} p-4 rounded-t-lg`}>
                  <div className="bg-white dark:bg-card rounded p-3 shadow-sm h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div 
                        className="h-2 rounded" 
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded" />
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-4/5" />
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/5" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="text-xs text-muted-foreground">{template.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setLocation("/templates")}
              data-testid="button-view-all-templates"
            >
              View All Templates
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Resume Success</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create, optimize, and track your resume performance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-secondary">
                    <Sparkles className="w-4 h-4" />
                    <span>{feature.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who've landed their dream jobs with ResumeCraft's AI-powered resume builder.
          </p>

          <div className="space-y-4">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleGetStarted}
              data-testid="button-start-building-cta"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Building for Free
            </Button>
            <p className="text-white/80 text-sm">
              No credit card required • 15+ templates included • ATS optimization
            </p>
          </div>

          <div className="mt-12 flex justify-center items-center space-x-8 text-white/70">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">50,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ResumeCraft</span>
              </div>
              <p className="text-background/70 text-sm">
                Build professional resumes with AI-powered ATS scoring and real-time optimization.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#templates" className="hover:text-background transition-colors">Templates</a></li>
                <li><a href="#features" className="hover:text-background transition-colors">ATS Checker</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Resume Builder</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Cover Letters</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-background/10 rounded flex items-center justify-center hover:bg-background/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-background/10 rounded flex items-center justify-center hover:bg-background/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-background/10 rounded flex items-center justify-center hover:bg-background/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/70">
            <p>&copy; 2024 ResumeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
