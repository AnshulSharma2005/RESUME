import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumePreview } from "@/components/resume/resume-preview";
import { TemplateSelector } from "@/components/resume/template-selector";
import { AtsScorerPanel } from "@/components/resume/ats-scorer-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Resume, ResumeContent, AtsFeedback, InsertResume } from "@shared/schema";
import { PdfExportService } from "@/services/pdf-export";
import { 
  Save, 
  Download, 
  Eye, 
  Settings, 
  BarChart3, 
  Palette,
  ArrowLeft,
  Loader2
} from "lucide-react";

interface ResumeBuilderProps {
  resumeId?: string;
}

export default function ResumeBuilder({ resumeId }: ResumeBuilderProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState("editor");
  const [isExporting, setIsExporting] = useState(false);
  const [currentContent, setCurrentContent] = useState<ResumeContent>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState("professional-classic");
  const [resumeTitle, setResumeTitle] = useState("My Resume");

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  // Fetch existing resume if editing
  const { data: resume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId && !!currentUser,
  });

  // Initialize content when resume loads
 // Initialize content when resume loads
useEffect(() => {
  if (resume) {
    const safeContent: ResumeContent = (resume.content as ResumeContent) ?? {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
    };

    setCurrentContent(safeContent);
    if (resume.templateId) setSelectedTemplateId(resume.templateId);
    if (resume.title) setResumeTitle(resume.title);
  }
}, [resume]);


  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (data: { content: ResumeContent; templateId: string; title: string }) => {
      if (resumeId) {
        // Update existing resume
        const response = await apiRequest("PUT", `/api/resumes/${resumeId}`, data);
        return response.json();
      } else {
        // Create new resume
        const resumeData: InsertResume = {
          ...data,
          userId: currentUser!.uid,
        };
        const response = await apiRequest("POST", "/api/resumes", resumeData);
        return response.json();
      }
    },
    onSuccess: (savedResume) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      if (!resumeId) {
        // Navigate to the newly created resume
        setLocation(`/resume-builder/${savedResume.id}`);
      }
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
      console.error("Save error:", error);
    },
  });

  // ATS Analysis mutation
  const atsAnalysisMutation = useMutation({
    mutationFn: async (feedback: AtsFeedback) => {
      if (!resumeId) throw new Error("Resume must be saved before ATS analysis");
      
      const analysisData = {
        resumeId,
        score: feedback.overall.score,
        feedback: feedback,
        keywords: feedback.sections.keywords,
        suggestions: Object.values(feedback.sections).flatMap(section => 
          'suggestions' in section ? section.suggestions : []
        ),
      };

      const response = await apiRequest("POST", "/api/ats-analyses", analysisData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      toast({
        title: "ATS Analysis Complete",
        description: "Your resume has been analyzed for ATS compatibility.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: "Failed to save ATS analysis. Please try again.",
        variant: "destructive",
      });
      console.error("ATS analysis error:", error);
    },
  });

  const handleSaveResume = () => {
    saveResumeMutation.mutate({
      content: currentContent,
      templateId: selectedTemplateId,
      title: resumeTitle,
    });
  };

  const handleContentChange = (newContent: ResumeContent) => {
    setCurrentContent(newContent);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleAtsAnalysis = (feedback: AtsFeedback) => {
    atsAnalysisMutation.mutate(feedback);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await PdfExportService.exportResume(
        currentContent, 
        selectedTemplateId, 
        resumeTitle
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeTitle.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your resume has been exported as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (resumeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none outline-none text-foreground"
                placeholder="Resume Title"
                data-testid="input-resume-title"
              />
              <p className="text-sm text-muted-foreground">
                {resumeId ? 'Editing resume' : 'Creating new resume'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
              data-testid="button-export-pdf"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export PDF
            </Button>
            
            <Button
              onClick={handleSaveResume}
              disabled={saveResumeMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-resume"
            >
              {saveResumeMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Tabs */}
        <div className="w-1/2 border-r border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b border-border bg-muted/30">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="editor" className="flex items-center space-x-2" data-testid="tab-editor">
                  <Settings className="w-4 h-4" />
                  <span>Editor</span>
                </TabsTrigger>
                <TabsTrigger value="template" className="flex items-center space-x-2" data-testid="tab-template">
                  <Palette className="w-4 h-4" />
                  <span>Template</span>
                </TabsTrigger>
                <TabsTrigger value="ats" className="flex items-center space-x-2" data-testid="tab-ats">
                  <BarChart3 className="w-4 h-4" />
                  <span>ATS Score</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2 md:hidden" data-testid="tab-preview">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="h-[calc(100%-49px)] m-0">
              <ResumeEditor
                content={currentContent}
                onChange={handleContentChange}
                onSave={handleSaveResume}
                isSaving={saveResumeMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="template" className="h-[calc(100%-49px)] m-0">
              <TemplateSelector
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={handleTemplateChange}
              />
            </TabsContent>

            <TabsContent value="ats" className="h-[calc(100%-49px)] m-0">
              <AtsScorerPanel
                content={currentContent}
                attemptsUsed={resume?.atsAttempts || 0}
                maxAttempts={5}
                onAnalyze={handleAtsAnalysis}
              />
            </TabsContent>

            <TabsContent value="preview" className="h-[calc(100%-49px)] m-0 md:hidden">
              <ResumePreview
                content={currentContent}
                templateId={selectedTemplateId}
                title={resumeTitle}
                atsScore={resume?.atsScore??undefined}
                isExporting={isExporting}
                onExport={handleExportPDF}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview (hidden on mobile) */}
        <div className="hidden md:block w-1/2">
          <ResumePreview
            content={currentContent}
            templateId={selectedTemplateId}
            title={resumeTitle}
            atsScore={resume?.atsScore??undefined}
            isExporting={isExporting}
            onExport={handleExportPDF}
          />
        </div>
      </div>
    </div>
  );
}
