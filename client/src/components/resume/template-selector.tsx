import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  resumeTemplates, 
  getTemplatesByCategory,
  getTemplatesByExperienceLevel,
  ResumeTemplate 
} from "@/data/resume-templates";
import { ExperienceLevel, TemplateCategory } from "@shared/schema";
import { Star, Search, Palette, Briefcase, Sparkles } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  experienceLevel?: ExperienceLevel;
  className?: string;
}

export function TemplateSelector({ 
  selectedTemplateId, 
  onSelectTemplate, 
  experienceLevel,
  className = ""
}: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");

  const getFilteredTemplates = (): ResumeTemplate[] => {
    let templates = resumeTemplates;

    // Filter by experience level if specified
    if (experienceLevel) {
      templates = getTemplatesByExperienceLevel(experienceLevel);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      templates = templates.filter(template => template.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return templates;
  };

  const filteredTemplates = getFilteredTemplates();

  const getCategoryIcon = (category: TemplateCategory) => {
    switch (category) {
      case "professional":
        return <Briefcase className="w-4 h-4" />;
      case "creative":
        return <Palette className="w-4 h-4" />;
      case "modern":
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: TemplateCategory) => {
    switch (category) {
      case "professional":
        return "bg-primary/10 text-primary border-primary/20";
      case "creative":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      case "modern":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <h2 className="text-2xl font-bold text-foreground mb-4">Choose Template</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-template-search"
          />
        </div>

        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TemplateCategory | "all")}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <span>All</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {filteredTemplates.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center space-x-2">
              {getCategoryIcon("professional")}
              <span className="hidden sm:inline">Professional</span>
            </TabsTrigger>
            <TabsTrigger value="creative" className="flex items-center space-x-2">
              {getCategoryIcon("creative")}
              <span className="hidden sm:inline">Creative</span>
            </TabsTrigger>
            <TabsTrigger value="modern" className="flex items-center space-x-2">
              {getCategoryIcon("modern")}
              <span className="hidden sm:inline">Modern</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {experienceLevel && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                Showing templates optimized for {experienceLevel} level professionals
              </p>
            </div>
          )}

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    selectedTemplateId === template.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:ring-1 hover:ring-border'
                  }`}
                  onClick={() => onSelectTemplate(template.id)}
                  data-testid={`card-template-${template.id}`}
                >
                  {/* Template Preview */}
                  <div className={`aspect-[3/4] ${template.preview} p-4 rounded-t-lg relative`}>
                    {template.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div 
                      className="bg-white dark:bg-white rounded-lg p-4 shadow-sm h-full flex flex-col justify-between"
                      style={{ color: '#000' }}
                    >
                      {/* Header */}
                      <div className="space-y-2">
                        <div 
                          className="h-3 rounded w-full"
                          style={{ backgroundColor: template.colors.primary }}
                        />
                        <div className="h-1.5 bg-gray-300 rounded w-3/4" />
                        <div className="h-1.5 bg-gray-300 rounded w-1/2" />
                      </div>
                      
                      {/* Content sections */}
                      <div className="space-y-3 flex-1 mt-4">
                        <div className="space-y-1">
                          <div className="h-1 bg-gray-400 rounded w-1/4" />
                          <div className="h-1 bg-gray-300 rounded" />
                          <div className="h-1 bg-gray-300 rounded w-4/5" />
                          <div className="h-1 bg-gray-300 rounded w-3/5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="h-1 bg-gray-400 rounded w-1/3" />
                          <div className="h-1 bg-gray-300 rounded w-5/6" />
                          <div className="h-1 bg-gray-300 rounded w-2/3" />
                        </div>
                      </div>
                      
                      {/* Footer accent */}
                      <div 
                        className="h-1 rounded w-full mt-4"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                    </div>
                  </div>

                  {/* Template Info */}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-xs text-muted-foreground">{template.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(template.category)}`}
                      >
                        {getCategoryIcon(template.category)}
                        <span className="ml-1 capitalize">{template.category}</span>
                      </Badge>
                      
                      {selectedTemplateId === template.id && (
                        <Badge className="bg-primary text-primary-foreground">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {selectedTemplateId && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Selected: {filteredTemplates.find(t => t.id === selectedTemplateId)?.name}
            </div>
            <Button
              onClick={() => onSelectTemplate(selectedTemplateId)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-use-template"
            >
              Use This Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
