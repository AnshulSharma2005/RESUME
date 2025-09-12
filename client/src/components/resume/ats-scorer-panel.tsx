import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeContent, AtsFeedback } from "@shared/schema";
import { AtsScorer } from "@/services/ats-scorer";
import {
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText,
  Clock,
  Lightbulb,
  Zap,
  RefreshCw
} from "lucide-react";

interface AtsScorerPanelProps {
  content: ResumeContent;
  attemptsUsed: number;
  maxAttempts: number;
  onAnalyze: (feedback: AtsFeedback) => void;
  className?: string;
}

export function AtsScorerPanel({ 
  content, 
  attemptsUsed, 
  maxAttempts,
  onAnalyze,
  className = "" 
}: AtsScorerPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AtsFeedback | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const remainingAttempts = maxAttempts - attemptsUsed;
  const canAnalyze = remainingAttempts > 0 && !isAnalyzing;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    try {
      // Simulate API delay for analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = AtsScorer.analyzeResume(content);
      setFeedback(analysis);
      setShowDetails(true);
      onAnalyze(analysis);
    } catch (error) {
      console.error('ATS Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-primary" />
            ATS Scorer
          </h2>
          
          <Badge 
            variant={remainingAttempts > 0 ? "default" : "destructive"}
            className="text-sm"
          >
            {remainingAttempts}/{maxAttempts} attempts remaining
          </Badge>
        </div>

        {/* Analysis Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          size="lg"
          data-testid="button-analyze-ats"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analyze ATS Score
            </>
          )}
        </Button>

        {remainingAttempts === 0 && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've used all your ATS analysis attempts for this resume. 
              Consider upgrading for unlimited analyses.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Analysis Results */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {!feedback && !isAnalyzing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to Analyze
              </h3>
              <p className="text-muted-foreground">
                Click "Analyze ATS Score" to get detailed feedback on your resume's 
                compatibility with Applicant Tracking Systems.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Analyzing Your Resume
              </h3>
              <p className="text-muted-foreground mb-4">
                Our AI is evaluating your resume against ATS standards...
              </p>
              <Progress value={75} className="w-48 mx-auto" />
            </div>
          )}

          {feedback && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall ATS Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(feedback.overall.score)}`}>
                      {feedback.overall.score}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={feedback.overall.score} 
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-semibold ${getScoreColor(feedback.overall.score)}`}>
                      {getScoreLabel(feedback.overall.score)}
                    </span>
                    <Badge className={getScoreColor(feedback.overall.score).replace('text-', 'bg-').replace(' dark:text-', ' dark:bg-').replace(/-(400|600)/, '-100 $&')}>
                      {feedback.overall.score >= 80 ? 'Excellent' : 
                       feedback.overall.score >= 60 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {feedback.overall.message}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown" className="space-y-4">
                  {/* Keywords Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          <Target className="w-4 h-4 mr-2 text-primary" />
                          Keywords
                        </h4>
                        <span className={`font-bold ${getScoreColor(feedback.sections.keywords.score)}`}>
                          {feedback.sections.keywords.score}%
                        </span>
                      </div>
                      <Progress value={feedback.sections.keywords.score} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Found {feedback.sections.keywords.found.length} relevant keywords
                      </p>
                    </CardContent>
                  </Card>

                  {/* Format Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-primary" />
                          Format
                        </h4>
                        <span className={`font-bold ${getScoreColor(feedback.sections.format.score)}`}>
                          {feedback.sections.format.score}%
                        </span>
                      </div>
                      <Progress value={feedback.sections.format.score} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {feedback.sections.format.issues.length === 0 
                          ? "Format looks good!" 
                          : `${feedback.sections.format.issues.length} formatting issues detected`
                        }
                      </p>
                    </CardContent>
                  </Card>

                  {/* Content Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                          Content
                        </h4>
                        <span className={`font-bold ${getScoreColor(feedback.sections.content.score)}`}>
                          {feedback.sections.content.score}%
                        </span>
                      </div>
                      <Progress value={feedback.sections.content.score} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Content quality and structure assessment
                      </p>
                    </CardContent>
                  </Card>

                  {/* Length Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          Length
                        </h4>
                        <span className={`font-bold ${getScoreColor(feedback.sections.length.score)}`}>
                          {feedback.sections.length.score}%
                        </span>
                      </div>
                      <Progress value={feedback.sections.length.score} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {feedback.sections.length.wordCount} words • {feedback.sections.length.ideal}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  {/* Found Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Found Keywords ({feedback.sections.keywords.found.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {feedback.sections.keywords.found.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Missing Keywords */}
                  {feedback.sections.keywords.missing.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Missing Keywords ({feedback.sections.keywords.missing.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {feedback.sections.keywords.missing.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                  {/* All Suggestions */}
                  <div className="space-y-4">
                    {feedback.sections.keywords.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                            Keyword Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {feedback.sections.keywords.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {feedback.sections.format.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            Format Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {feedback.sections.format.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {feedback.sections.content.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-secondary" />
                            Content Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {feedback.sections.content.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {feedback.sections.length.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-accent" />
                            Length Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {feedback.sections.length.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
