import { ExperienceLevel } from "@shared/schema";

export interface ExperienceLevelInfo {
  id: ExperienceLevel;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  templateCount: number;
  popular?: boolean;
}

export const experienceLevels: ExperienceLevelInfo[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Fresh graduates and entry-level professionals starting their career journey",
    features: [
      "5 beginner-friendly templates",
      "Step-by-step guidance",
      "Skills highlighting tips",
      "Entry-level formatting"
    ],
    icon: "🌱",
    color: "accent",
    templateCount: 5,
  },
  {
    id: "mid-career",
    title: "Mid-Career",
    description: "Experienced professionals looking to advance their career",
    features: [
      "6 professional templates",
      "Achievement optimization",
      "Leadership focus sections",
      "Career transition support"
    ],
    icon: "📈",
    color: "primary",
    templateCount: 6,
    popular: true,
  },
  {
    id: "professional",
    title: "Professional",
    description: "Senior executives and industry leaders showcasing expertise",
    features: [
      "4 executive templates",
      "Executive summary focus",
      "Strategic accomplishments",
      "Board-ready formatting"
    ],
    icon: "👑",
    color: "secondary",
    templateCount: 4,
  },
];

export const getExperienceLevelInfo = (level: ExperienceLevel): ExperienceLevelInfo | undefined => {
  return experienceLevels.find(el => el.id === level);
};
