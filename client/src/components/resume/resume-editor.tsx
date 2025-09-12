import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award,
  Globe,
  Languages
} from "lucide-react";
import { ResumeContent } from "@shared/schema";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Location is required"),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

interface ResumeEditorProps {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ResumeEditor({ content, onChange, onSave, isSaving }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [sectionOrder, setSectionOrder] = useState([
    "personal",
    "summary", 
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages"
  ]);

  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: content.personalInfo,
  });

  useEffect(() => {
    personalForm.reset(content.personalInfo);
  }, [content.personalInfo, personalForm]);

  const handlePersonalInfoChange = (data: any) => {
    onChange({
      ...content,
      personalInfo: { ...content.personalInfo, ...data }
    });
  };

  const handleSummaryChange = (summary: string) => {
    onChange({ ...content, summary });
  };

  const addExperience = () => {
    const newExperience = {
      id: uuidv4(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: []
    };
    onChange({
      ...content,
      experience: [...content.experience, newExperience]
    });
  };

  const updateExperience = (id: string, updates: any) => {
    onChange({
      ...content,
      experience: content.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...content,
      experience: content.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: uuidv4(),
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
      achievements: []
    };
    onChange({
      ...content,
      education: [...content.education, newEducation]
    });
  };

  const updateEducation = (id: string, updates: any) => {
    onChange({
      ...content,
      education: content.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...content,
      education: content.education.filter(edu => edu.id !== id)
    });
  };

  const addSkillCategory = () => {
    const newCategory = {
      id: uuidv4(),
      category: "New Category",
      items: []
    };
    onChange({
      ...content,
      skills: [...content.skills, newCategory]
    });
  };

  const updateSkillCategory = (id: string, updates: any) => {
    onChange({
      ...content,
      skills: content.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      )
    });
  };

  const removeSkillCategory = (id: string) => {
    onChange({
      ...content,
      skills: content.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    if (!content.projects) {
      onChange({ ...content, projects: [] });
    }
    const newProject = {
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: ""
    };
    onChange({
      ...content,
      projects: [...(content.projects || []), newProject]
    });
  };

  const updateProject = (id: string, updates: any) => {
    if (!content.projects) return;
    onChange({
      ...content,
      projects: content.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    });
  };

  const removeProject = (id: string) => {
    if (!content.projects) return;
    onChange({
      ...content,
      projects: content.projects.filter(project => project.id !== id)
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground">Edit Resume Content</h2>
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-save-resume"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* Section Reordering */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          Section Order (Drag to reorder)
        </Label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-wrap gap-2"
              >
                {sectionOrder.map((section, index) => (
                  <Draggable key={section} draggableId={section} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center space-x-1 bg-card border border-border rounded-lg px-3 py-1 cursor-move hover:bg-accent/50 transition-colors"
                      >
                        <GripVertical className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm capitalize">{section}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Content Editor */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 m-4">
            <TabsTrigger value="personal" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certs</span>
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center space-x-1">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Languages</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...personalForm.register("firstName")}
                      onChange={(e) => handlePersonalInfoChange({ firstName: e.target.value })}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...personalForm.register("lastName")}
                      onChange={(e) => handlePersonalInfoChange({ lastName: e.target.value })}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...personalForm.register("email")}
                    onChange={(e) => handlePersonalInfoChange({ email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...personalForm.register("phone")}
                      onChange={(e) => handlePersonalInfoChange({ phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...personalForm.register("location")}
                      onChange={(e) => handlePersonalInfoChange({ location: e.target.value })}
                      data-testid="input-location"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      {...personalForm.register("website")}
                      onChange={(e) => handlePersonalInfoChange({ website: e.target.value })}
                      data-testid="input-website"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/..."
                      {...personalForm.register("linkedin")}
                      onChange={(e) => handlePersonalInfoChange({ linkedin: e.target.value })}
                      data-testid="input-linkedin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/..."
                      {...personalForm.register("github")}
                      onChange={(e) => handlePersonalInfoChange({ github: e.target.value })}
                      data-testid="input-github"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Summary */}
          <TabsContent value="summary" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write a compelling professional summary highlighting your key achievements and career objectives..."
                  value={content.summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  rows={6}
                  data-testid="textarea-summary"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Experience */}
          <TabsContent value="experience" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button onClick={addExperience} data-testid="button-add-experience">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {content.experience.map((exp, index) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      data-testid={`button-remove-experience-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        data-testid={`input-position-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        data-testid={`input-company-${index}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        data-testid={`input-exp-location-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        placeholder="MM/YYYY"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        data-testid={`input-start-date-${index}`}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        placeholder="MM/YYYY or Present"
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { 
                          endDate: e.target.value,
                          current: e.target.value.toLowerCase() === "present"
                        })}
                        data-testid={`input-end-date-${index}`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your role and responsibilities..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                      rows={3}
                      data-testid={`textarea-description-${index}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button onClick={addEducation} data-testid="button-add-education">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {content.education.map((edu, index) => (
              <Card key={edu.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      data-testid={`button-remove-education-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        data-testid={`input-degree-${index}`}
                      />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                        data-testid={`input-school-${index}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                        data-testid={`input-edu-location-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        placeholder="MM/YYYY"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                        data-testid={`input-graduation-date-${index}`}
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        placeholder="3.8/4.0"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        data-testid={`input-gpa-${index}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Skills</h3>
              <Button onClick={addSkillCategory} data-testid="button-add-skill-category">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            
            {content.skills.map((skillGroup, index) => (
              <Card key={skillGroup.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Input
                      value={skillGroup.category}
                      onChange={(e) => updateSkillCategory(skillGroup.id, { category: e.target.value })}
                      className="text-base font-semibold bg-transparent border-none p-0 h-auto"
                      data-testid={`input-skill-category-${index}`}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSkillCategory(skillGroup.id)}
                      data-testid={`button-remove-skill-category-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    value={skillGroup.items.join(", ")}
                    onChange={(e) => updateSkillCategory(skillGroup.id, { 
                      items: e.target.value.split(",").map(item => item.trim()).filter(Boolean)
                    })}
                    rows={2}
                    data-testid={`textarea-skills-${index}`}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Projects</h3>
              <Button onClick={addProject} data-testid="button-add-project">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            {(content.projects || []).map((project, index) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Project #{index + 1}</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      data-testid={`button-remove-project-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, { name: e.target.value })}
                      data-testid={`input-project-name-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the project and your contributions..."
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      rows={3}
                      data-testid={`textarea-project-description-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Technologies</Label>
                    <Textarea
                      placeholder="List technologies used (comma-separated)"
                      value={project.technologies.join(", ")}
                      onChange={(e) => updateProject(project.id, { 
                        technologies: e.target.value.split(",").map(tech => tech.trim()).filter(Boolean)
                      })}
                      rows={2}
                      data-testid={`textarea-project-technologies-${index}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Project URL</Label>
                      <Input
                        placeholder="https://..."
                        value={project.url}
                        onChange={(e) => updateProject(project.id, { url: e.target.value })}
                        data-testid={`input-project-url-${index}`}
                      />
                    </div>
                    <div>
                      <Label>GitHub Repository</Label>
                      <Input
                        placeholder="https://github.com/..."
                        value={project.github}
                        onChange={(e) => updateProject(project.id, { github: e.target.value })}
                        data-testid={`input-project-github-${index}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Other tabs would be similar patterns */}
          <TabsContent value="certifications" className="p-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Certifications section - Similar implementation pattern as above sections
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages" className="p-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Languages section - Similar implementation pattern as above sections
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
