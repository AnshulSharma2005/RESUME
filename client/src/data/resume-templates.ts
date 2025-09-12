import { TemplateCategory, ExperienceLevel } from "@shared/schema";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  experienceLevel: ExperienceLevel[];
  rating: number;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  popular?: boolean;
}

export const resumeTemplates: ResumeTemplate[] = [
  // Professional Templates - Beginner
  {
    id: "professional-classic",
    name: "Classic Professional",
    description: "Clean and traditional design perfect for conservative industries",
    category: "professional",
    experienceLevel: ["beginner"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-blue-50 to-blue-100",
    colors: {
      primary: "hsl(210, 100%, 50%)",
      secondary: "hsl(210, 15%, 25%)",
      accent: "hsl(210, 100%, 95%)"
    },
    features: ["ATS-optimized", "Clean layout", "Easy to read"],
  },
  {
    id: "professional-minimal",
    name: "Minimal Professional",
    description: "Simple and elegant design focusing on content clarity",
    category: "professional",
    experienceLevel: ["beginner"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-gray-50 to-gray-100",
    colors: {
      primary: "hsl(0, 0%, 20%)",
      secondary: "hsl(0, 0%, 40%)",
      accent: "hsl(0, 0%, 95%)"
    },
    features: ["Minimalist design", "Great typography", "Space efficient"],
  },
  {
    id: "professional-modern",
    name: "Modern Professional",
    description: "Contemporary design with subtle modern touches",
    category: "professional",
    experienceLevel: ["beginner"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-slate-50 to-slate-100",
    colors: {
      primary: "hsl(215, 25%, 27%)",
      secondary: "hsl(215, 15%, 50%)",
      accent: "hsl(215, 100%, 96%)"
    },
    features: ["Modern styling", "Professional layout", "Balanced design"],
  },
  {
    id: "professional-corporate",
    name: "Corporate Professional",
    description: "Formal design ideal for corporate environments",
    category: "professional",
    experienceLevel: ["beginner"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-blue-50 to-indigo-50",
    colors: {
      primary: "hsl(225, 73%, 57%)",
      secondary: "hsl(225, 25%, 35%)",
      accent: "hsl(225, 100%, 97%)"
    },
    features: ["Corporate styling", "Professional hierarchy", "Trust-building"],
  },
  {
    id: "professional-executive-entry",
    name: "Executive Entry",
    description: "Entry-level executive style for ambitious professionals",
    category: "professional",
    experienceLevel: ["beginner"],
    rating: 4.6,
    preview: "bg-gradient-to-br from-emerald-50 to-teal-50",
    colors: {
      primary: "hsl(160, 84%, 39%)",
      secondary: "hsl(160, 25%, 35%)",
      accent: "hsl(160, 100%, 97%)"
    },
    features: ["Executive styling", "Growth-oriented", "Professional impact"],
  },

  // Professional Templates - Mid-Career
  {
    id: "professional-leadership",
    name: "Leadership Professional",
    description: "Designed to highlight management and leadership experience",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-violet-50 to-purple-100",
    colors: {
      primary: "hsl(262, 83%, 58%)",
      secondary: "hsl(262, 25%, 35%)",
      accent: "hsl(262, 100%, 97%)"
    },
    features: ["Leadership focus", "Achievement highlights", "Impact-driven"],
    popular: true,
  },
  {
    id: "professional-strategic",
    name: "Strategic Professional",
    description: "Perfect for strategic roles and senior positions",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-rose-50 to-pink-100",
    colors: {
      primary: "hsl(350, 89%, 60%)",
      secondary: "hsl(350, 25%, 35%)",
      accent: "hsl(350, 100%, 97%)"
    },
    features: ["Strategic thinking", "Results-oriented", "Executive presence"],
  },
  {
    id: "professional-growth",
    name: "Growth Professional",
    description: "Showcases career progression and growth achievements",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-orange-50 to-amber-100",
    colors: {
      primary: "hsl(43, 96%, 56%)",
      secondary: "hsl(43, 25%, 35%)",
      accent: "hsl(43, 100%, 97%)"
    },
    features: ["Growth trajectory", "Achievement metrics", "Career progression"],
  },
  {
    id: "professional-senior",
    name: "Senior Professional",
    description: "Mature design for experienced professionals",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-cyan-50 to-blue-100",
    colors: {
      primary: "hsl(200, 98%, 39%)",
      secondary: "hsl(200, 25%, 35%)",
      accent: "hsl(200, 100%, 97%)"
    },
    features: ["Senior positioning", "Experience-focused", "Industry authority"],
  },
  {
    id: "professional-director",
    name: "Director Professional",
    description: "Director-level template with strong visual hierarchy",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-teal-50 to-emerald-100",
    colors: {
      primary: "hsl(158, 64%, 52%)",
      secondary: "hsl(158, 25%, 35%)",
      accent: "hsl(158, 100%, 97%)"
    },
    features: ["Director presence", "Team leadership", "Strategic impact"],
  },
  {
    id: "professional-consultant",
    name: "Consultant Professional",
    description: "Consulting-focused template highlighting expertise",
    category: "professional",
    experienceLevel: ["mid-career"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-indigo-50 to-blue-100",
    colors: {
      primary: "hsl(220, 91%, 62%)",
      secondary: "hsl(220, 25%, 35%)",
      accent: "hsl(220, 100%, 97%)"
    },
    features: ["Consulting expertise", "Problem-solving", "Client results"],
  },

  // Professional Templates - Professional/Executive
  {
    id: "professional-ceo",
    name: "CEO Executive",
    description: "Executive-level template for C-suite professionals",
    category: "professional",
    experienceLevel: ["professional"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-stone-100 to-neutral-200",
    colors: {
      primary: "hsl(24, 6%, 10%)",
      secondary: "hsl(24, 5%, 40%)",
      accent: "hsl(24, 10%, 95%)"
    },
    features: ["C-suite presence", "Board-ready", "Executive summary"],
  },
  {
    id: "professional-vp",
    name: "VP Executive",
    description: "Vice President level template with strong authority",
    category: "professional",
    experienceLevel: ["professional"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-zinc-50 to-gray-100",
    colors: {
      primary: "hsl(210, 11%, 15%)",
      secondary: "hsl(210, 6%, 45%)",
      accent: "hsl(210, 17%, 95%)"
    },
    features: ["VP authority", "Strategic vision", "Organizational impact"],
  },
  {
    id: "professional-cfo",
    name: "CFO Executive",
    description: "Financial executive template emphasizing fiscal leadership",
    category: "professional",
    experienceLevel: ["professional"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-green-50 to-emerald-100",
    colors: {
      primary: "hsl(142, 71%, 45%)",
      secondary: "hsl(142, 25%, 35%)",
      accent: "hsl(142, 76%, 96%)"
    },
    features: ["Financial leadership", "P&L responsibility", "Fiscal strategy"],
  },
  {
    id: "professional-cto",
    name: "CTO Executive",
    description: "Technology executive template for tech leaders",
    category: "professional",
    experienceLevel: ["professional"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-blue-50 to-cyan-100",
    colors: {
      primary: "hsl(193, 95%, 46%)",
      secondary: "hsl(193, 25%, 35%)",
      accent: "hsl(193, 100%, 97%)"
    },
    features: ["Tech leadership", "Innovation focus", "Digital transformation"],
  },

  // Creative Templates
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Perfect for designers and creative professionals",
    category: "creative",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-purple-50 to-pink-100",
    colors: {
      primary: "hsl(291, 64%, 42%)",
      secondary: "hsl(291, 25%, 35%)",
      accent: "hsl(291, 75%, 96%)"
    },
    features: ["Creative layout", "Portfolio focus", "Visual appeal"],
  },
  {
    id: "creative-artist",
    name: "Creative Artist",
    description: "Artistic template for creative professionals",
    category: "creative",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-pink-50 to-rose-100",
    colors: {
      primary: "hsl(330, 81%, 60%)",
      secondary: "hsl(330, 25%, 35%)",
      accent: "hsl(330, 100%, 97%)"
    },
    features: ["Artistic expression", "Creative freedom", "Personal branding"],
  },

  // Modern Templates
  {
    id: "modern-tech",
    name: "Modern Tech",
    description: "Contemporary design optimized for tech industry",
    category: "modern",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-orange-50 to-red-100",
    colors: {
      primary: "hsl(16, 100%, 60%)",
      secondary: "hsl(16, 25%, 35%)",
      accent: "hsl(16, 100%, 97%)"
    },
    features: ["Tech-optimized", "Modern styling", "Innovation focus"],
    popular: true,
  },
  {
    id: "modern-startup",
    name: "Modern Startup",
    description: "Dynamic template for startup professionals",
    category: "modern",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-lime-50 to-green-100",
    colors: {
      primary: "hsl(84, 81%, 44%)",
      secondary: "hsl(84, 25%, 35%)",
      accent: "hsl(84, 90%, 97%)"
    },
    features: ["Startup energy", "Growth mindset", "Innovation ready"],
  },
  {
    id: "creative-photographer",
    name: "Creative Photographer",
    description: "Visual-focused template for photographers and visual artists",
    category: "creative",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-amber-50 to-yellow-100",
    colors: {
      primary: "hsl(45, 93%, 47%)",
      secondary: "hsl(45, 25%, 35%)",
      accent: "hsl(45, 100%, 97%)"
    },
    features: ["Portfolio showcase", "Visual hierarchy", "Creative layout"],
  },
  {
    id: "creative-marketer",
    name: "Creative Marketing",
    description: "Marketing-focused template with creative flair",
    category: "creative",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-violet-50 to-indigo-100",
    colors: {
      primary: "hsl(243, 75%, 59%)",
      secondary: "hsl(243, 25%, 35%)",
      accent: "hsl(243, 100%, 97%)"
    },
    features: ["Campaign highlights", "Metrics focus", "Brand storytelling"],
  },
  {
    id: "creative-content",
    name: "Content Creator",
    description: "Perfect for content creators and social media professionals",
    category: "creative",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.6,
    preview: "bg-gradient-to-br from-emerald-50 to-teal-100",
    colors: {
      primary: "hsl(158, 64%, 52%)",
      secondary: "hsl(158, 25%, 35%)",
      accent: "hsl(158, 100%, 97%)"
    },
    features: ["Content portfolio", "Engagement metrics", "Multi-platform"],
  },
  {
    id: "modern-data",
    name: "Modern Data Science",
    description: "Data-driven template for data scientists and analysts",
    category: "modern",
    experienceLevel: ["mid-career", "professional"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-blue-50 to-cyan-100",
    colors: {
      primary: "hsl(195, 100%, 42%)",
      secondary: "hsl(195, 25%, 35%)",
      accent: "hsl(195, 100%, 97%)"
    },
    features: ["Data visualization", "Analytics focus", "Technical skills"],
    popular: true,
  },
  {
    id: "modern-product",
    name: "Modern Product Manager",
    description: "Product management template highlighting user impact",
    category: "modern",
    experienceLevel: ["mid-career", "professional"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-purple-50 to-pink-100",
    colors: {
      primary: "hsl(320, 65%, 52%)",
      secondary: "hsl(320, 25%, 35%)",
      accent: "hsl(320, 100%, 97%)"
    },
    features: ["Product metrics", "User experience", "Growth results"],
  },
  {
    id: "modern-freelancer",
    name: "Modern Freelancer",
    description: "Flexible template for freelancers and consultants",
    category: "modern",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.7,
    preview: "bg-gradient-to-br from-red-50 to-orange-100",
    colors: {
      primary: "hsl(14, 100%, 57%)",
      secondary: "hsl(14, 25%, 35%)",
      accent: "hsl(14, 100%, 97%)"
    },
    features: ["Client results", "Flexible sections", "Project showcase"],
  },
  {
    id: "professional-healthcare",
    name: "Healthcare Professional",
    description: "Medical and healthcare professional template",
    category: "professional",
    experienceLevel: ["mid-career", "professional"],
    rating: 4.9,
    preview: "bg-gradient-to-br from-green-50 to-emerald-100",
    colors: {
      primary: "hsl(142, 71%, 45%)",
      secondary: "hsl(142, 25%, 35%)",
      accent: "hsl(142, 76%, 96%)"
    },
    features: ["Medical credentials", "Patient focus", "Healthcare excellence"],
  },
  {
    id: "professional-education",
    name: "Education Professional",
    description: "Template for educators and academic professionals",
    category: "professional",
    experienceLevel: ["beginner", "mid-career"],
    rating: 4.8,
    preview: "bg-gradient-to-br from-indigo-50 to-blue-100",
    colors: {
      primary: "hsl(220, 91%, 62%)",
      secondary: "hsl(220, 25%, 35%)",
      accent: "hsl(220, 100%, 97%)"
    },
    features: ["Teaching excellence", "Student outcomes", "Academic achievements"],
  },
];

export const getTemplatesByExperienceLevel = (level: ExperienceLevel): ResumeTemplate[] => {
  return resumeTemplates.filter(template => 
    template.experienceLevel.includes(level)
  );
};

export const getTemplatesByCategory = (category: TemplateCategory): ResumeTemplate[] => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getTemplate = (id: string): ResumeTemplate | undefined => {
  return resumeTemplates.find(template => template.id === id);
};

export const getPopularTemplates = (): ResumeTemplate[] => {
  return resumeTemplates.filter(template => template.popular);
};
