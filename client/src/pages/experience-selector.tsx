import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { experienceLevels } from "@/data/experience-levels";
import { getTemplatesByExperienceLevel } from "@/data/resume-templates";
import { ExperienceLevel } from "@shared/schema";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Briefcase, 
  GraduationCap,
  Crown,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";

export default function ExperienceSelector() {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  const handleLevelSelect = (level: ExperienceLevel) => {
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    if (!selectedLevel) return;

    if (!currentUser) {
      setAuthOpen(true);
      return;
    }

    // Navigate to template selection or resume builder
    setLocation(`/resume-builder?level=${selectedLevel}`);
  };

  const handleBack = () => {
    setLocation("/");
  };

  const getSelectedTemplates = () => {
    if (!selectedLevel) return [];
    return getTemplatesByExperienceLevel(selectedLevel);
  };

  const getLevelIcon = (levelId: ExperienceLevel) => {
    switch (levelId) {
      case "beginner":
        return <GraduationCap className="w-8 h-8" />;
      case "mid-career":
        return <Briefcase className="w-8 h-8" />;
      case "professional":
        return <Crown className="w-8 h-8" />;
      default:
        return <FileText className="w-8 h-8" />;
    }
  };

  const getLevelColor = (levelId: ExperienceLevel) => {
    switch (levelId) {
      case "beginner":
        return "from-accent/20 to-accent/5 border-accent/30";
      case "mid-career":
        return "from-primary/20 to-primary/5 border-primary/30";
      case "professional":
        return "from-secondary/20 to-secondary/5 border-secondary/30";
      default:
        return "from-muted/20 to-muted/5 border-muted/30";
    }
  };

  const getStats = () => {
    const templates = getSelectedTemplates();
    const categories = [...new Set(templates.map(t => t.category))];
    const avgRating = templates.reduce((sum, t) => sum + t.rating, 0) / templates.length || 0;

    return {
      templates: templates.length,
      categories: categories.length,
      avgRating: avgRating.toFixed(1)
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center space-x-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            
            {currentUser && (
              <div className="text-sm text-muted-foreground">
                Signed in as {currentUser.displayName || currentUser.email}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Experience Level
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your career stage to get personalized templates and guidance tailored to your professional level
          </p>
        </div>

        {/* Experience Level Cards */}
        <div className="grid gap-8 mb-12">
          {experienceLevels.map((level) => (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                selectedLevel === level.id
                  ? `ring-2 ring-primary shadow-lg bg-gradient-to-br ${getLevelColor(level.id)}`
                  : 'hover:ring-1 hover:ring-border'
              } ${level.popular ? 'relative' : ''}`}
              onClick={() => handleLevelSelect(level.id)}
              data-testid={`card-level-${level.id}`}
            >
              {level.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-md">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${getLevelColor(level.id)} rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedLevel === level.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {getLevelIcon(level.id)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-2xl font-bold text-foreground">
                        {level.title}
                      </h3>
                      {selectedLevel === level.id && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    <p className="text-muted-foreground text-lg mb-6">
                      {level.description}
                    </p>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {level.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{level.templateCount} templates</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Proven effective</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Level Preview */}
        {selectedLevel && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>What You'll Get with {experienceLevels.find(l => l.id === selectedLevel)?.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {getStats().templates}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Professional Templates
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {getStats().categories}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Design Categories
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {getStats().avgRating}★
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedLevel}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            data-testid="button-continue"
          >
            {currentUser ? (
              <>
                Continue to Templates
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Sign Up to Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {!selectedLevel && (
            <p className="text-sm text-muted-foreground mt-3">
              Please select your experience level to continue
            </p>
          )}

          {!currentUser && (
            <p className="text-sm text-muted-foreground mt-3">
              You'll need to create an account to save your progress
            </p>
          )}
        </div>
      </div>

      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}
