import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeContent } from "@shared/schema";
import { getTemplate } from "@/data/resume-templates";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { PdfExportService } from "@/services/pdf-export";
import { Download, Eye, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ResumePreviewProps {
  content: ResumeContent;
  templateId: string;
  title: string;
  atsScore?: number;
  isExporting?: boolean;
  onExport?: () => void;
}

export function ResumePreview({ 
  content, 
  templateId, 
  title, 
  atsScore,
  isExporting = false,
  onExport 
}: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const template = getTemplate(templateId);

  const handleExportPDF = async () => {
    if (onExport) {
      onExport();
    } else {
      try {
        const blob = await PdfExportService.exportResume(content, templateId, title);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getAtsScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
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

  return (
    <div className={`h-full flex flex-col bg-muted/20 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
          {template && (
            <Badge variant="outline" className="text-xs">
              {template.name}
            </Badge>
          )}
          {atsScore !== undefined && (
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className={`text-sm font-medium ${getAtsScoreColor(atsScore)}`}>
                ATS: {atsScore}% ({getAtsScoreLabel(atsScore)})
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            data-testid="button-export-pdf"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 flex justify-center">
          <div
            ref={previewRef}
            className="transition-transform duration-200 shadow-2xl"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top center'
            }}
          >
            <div className="w-[8.5in] bg-white dark:bg-white text-black min-h-[11in] shadow-lg">
              <TemplateRenderer
                content={content}
                templateId={templateId}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Preview Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Template: {template?.name || 'Unknown'}</span>
            <span>•</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Ready for export</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
