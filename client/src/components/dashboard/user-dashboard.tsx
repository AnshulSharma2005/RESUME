import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ResumeCard } from "./resume-card";
import { useAuth } from "@/contexts/auth-context";
import { Resume } from "@shared/schema";
import { 
  Plus, 
  Search, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Filter,
  Grid,
  List,
  Star,
  Download,
  ChevronDown,
  User,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

interface UserStats {
  totalResumes: number;
  avgAtsScore: number;
  templateUsage: Record<string, number>;
  mostRecentUpdate: string | null;
}

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "ats">("updated");
  const { currentUser, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's resumes
  const { data: resumes = [], isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes", currentUser?.uid],
    enabled: !!currentUser,
  });

  // Fetch user analytics
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/users", currentUser?.uid, "analytics"],
    enabled: !!currentUser,
  });

  const filteredResumes = resumes.filter((resume: Resume) =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResumes = [...filteredResumes].sort((a: Resume, b: Resume) => {
    switch (sortBy) {
      case "updated":
        return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
      case "created":
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case "ats":
        return (b.atsScore || 0) - (a.atsScore || 0);
      default:
        return 0;
    }
  });

  const getAtsScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleCreateResume = () => {
    setLocation("/experience-selector");
  };

  const handleEditResume = (resumeId: string) => {
    setLocation(`/resume-builder/${resumeId}`);
  };

  const handleDeleteResume = async (resumeId: string) => {
    // Implementation would make API call to delete resume
    console.log("Delete resume:", resumeId);
  };

  const handleDuplicateResume = async (resumeId: string) => {
    // Implementation would make API call to duplicate resume
    console.log("Duplicate resume:", resumeId);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (resumesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {currentUser?.displayName || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your resumes and track your job search progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleCreateResume}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-create-resume"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-profile-menu">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={currentUser?.photoURL || ""} />
                      <AvatarFallback>{currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    {currentUser?.displayName || "Profile"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="w-4 h-4 mr-2" />
                    {currentUser?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} data-testid="button-signout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Total Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalResumes || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {resumes.length === 0 ? "Create your first resume" : "Keep building!"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Avg ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAtsScoreColor(stats?.avgAtsScore)}`}>
                {stats?.avgAtsScore || 0}%
              </div>
              <Progress value={stats?.avgAtsScore || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(resumes || []).filter((r: Resume) => {
                  const created = new Date(r.createdAt!);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Resumes created
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">
                {stats?.mostRecentUpdate 
                  ? new Date(stats.mostRecentUpdate).toLocaleDateString()
                  : "Never"
                }
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Most recent edit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Resumes</h2>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  data-testid="input-search-resumes"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "updated" | "created" | "ats")}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                data-testid="select-sort-by"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="ats">ATS Score</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {sortedResumes.length === 0 && (
            <Card className="border-dashed border-2 border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? "No resumes found" : "No resumes yet"}
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {searchTerm 
                    ? "Try adjusting your search terms or create a new resume"
                    : "Create your first professional resume with our AI-powered builder and ATS optimization"
                  }
                </p>
                <Button 
                  onClick={handleCreateResume}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-create-first-resume"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Resume
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Resumes Grid/List */}
          {sortedResumes.length > 0 && (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {sortedResumes.map((resume: Resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  viewMode={viewMode}
                  onEdit={() => handleEditResume(resume.id)}
                  onDelete={() => handleDeleteResume(resume.id)}
                  onDuplicate={() => handleDuplicateResume(resume.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
