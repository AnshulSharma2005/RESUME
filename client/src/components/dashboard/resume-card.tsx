import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Resume } from "@shared/schema";
import { getTemplate } from "@/data/resume-templates";
import { 
  MoreVertical, 
  Edit, 
  Copy, 
  Download, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  FileText
} from "lucide-react";

interface ResumeCardProps {
  resume: Resume;
  viewMode: "grid" | "list";
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ResumeCard({ resume, viewMode, onEdit, onDelete, onDuplicate }: ResumeCardProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const template = getTemplate(resume.templateId);

  const getAtsScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAtsScoreLabel = (score?: number) => {
    if (!score) return "Not scored";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  const handleExport = async () => {
    // Implementation would export the resume as PDF
    console.log("Export resume:", resume.id);
    setIsActionsOpen(false);
  };

  const handlePreview = () => {
    // Implementation would open preview modal
    console.log("Preview resume:", resume.id);
    setIsActionsOpen(false);
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200" data-testid={`card-resume-${resume.id}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Resume Icon */}
              <div className="w-12 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>

              {/* Resume Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {resume.title}
                  </h3>
                  {template && (
                    <Badge variant="outline" className="text-xs">
                      {template.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated {formatDate(resume.updatedAt || new Date())}
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className={getAtsScoreColor(resume.atsScore || undefined)}>
                      {resume.atsScore || 0}% ATS
                    </span>
                  </span>
                  <span>
                    {resume.atsAttempts || 0}/5 attempts
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                data-testid={`button-edit-${resume.id}`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid={`button-actions-${resume.id}`}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
      data-testid={`card-resume-${resume.id}`}
    >
      {/* Template Preview */}
      <div 
        className={`aspect-[3/4] ${template?.preview || 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 rounded-t-lg relative`}
        onClick={onEdit}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
                data-testid={`button-actions-${resume.id}`}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ATS Score Badge */}
        {resume.atsScore && (
          <div className="absolute top-2 left-2">
            <Badge 
              className={`${getAtsScoreColor(resume.atsScore)} bg-white/90 border`}
            >
              {resume.atsScore}% ATS
            </Badge>
          </div>
        )}

        {/* Mini Resume Preview */}
        <div className="bg-white dark:bg-white rounded-lg p-3 shadow-sm h-full flex flex-col justify-between" style={{ color: '#000' }}>
          <div className="space-y-2">
            <div 
              className="h-2 rounded w-full"
              style={{ backgroundColor: template?.colors.primary || '#6366f1' }}
            />
            <div className="h-1 bg-gray-300 rounded w-3/4" />
            <div className="h-1 bg-gray-300 rounded w-1/2" />
          </div>
          <div className="space-y-1 flex-1 mt-3">
            <div className="h-1 bg-gray-300 rounded" />
            <div className="h-1 bg-gray-300 rounded w-4/5" />
            <div className="h-1 bg-gray-300 rounded w-3/5" />
          </div>
          <div 
            className="h-1 rounded w-full"
            style={{ backgroundColor: template?.colors.secondary || '#10b981' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground truncate flex-1 pr-2">
            {resume.title}
          </h3>
          <div className={`text-xs font-medium ${getAtsScoreColor(resume.atsScore)}`}>
            {getAtsScoreLabel(resume.atsScore)}
          </div>
        </div>

        {template && (
          <p className="text-sm text-muted-foreground mb-3 truncate">
            {template.name} • {template.category}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {formatDate(resume.updatedAt)}</span>
          <span>{resume.atsAttempts || 0}/5 attempts</span>
        </div>

        <div className="mt-3 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
            data-testid={`button-edit-${resume.id}`}
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            data-testid={`button-export-${resume.id}`}
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
