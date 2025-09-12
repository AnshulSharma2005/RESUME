import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  provider: text("provider").notNull(), // 'email' or 'google'
  experienceLevel: text("experience_level"), // 'beginner', 'mid-career', 'professional'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  templateId: text("template_id").notNull(),
  content: jsonb("content").notNull(), // Resume data as JSON
  atsScore: integer("ats_score"),
  atsAttempts: integer("ats_attempts").default(0),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const atsAnalyses = pgTable("ats_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  feedback: jsonb("feedback").notNull(), // Detailed feedback as JSON
  keywords: jsonb("keywords"), // Keyword analysis
  suggestions: jsonb("suggestions"), // Improvement suggestions
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  displayName: true,
  photoURL: true,
  provider: true,
  experienceLevel: true,
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  title: true,
  templateId: true,
  content: true,
  userId: true,
});

export const insertAtsAnalysisSchema = createInsertSchema(atsAnalyses).pick({
  resumeId: true,
  score: true,
  feedback: true,
  keywords: true,
  suggestions: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type AtsAnalysis = typeof atsAnalyses.$inferSelect;
export type InsertAtsAnalysis = z.infer<typeof insertAtsAnalysisSchema>;

// Resume content type
export interface ResumeContent {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
    achievements: string[];
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  languages?: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

// Experience levels
export type ExperienceLevel = 'beginner' | 'mid-career' | 'professional';

// Template categories
export type TemplateCategory = 'professional' | 'creative' | 'modern';

// ATS feedback structure
export interface AtsFeedback {
  overall: {
    score: number;
    message: string;
  };
  sections: {
    keywords: {
      score: number;
      found: string[];
      missing: string[];
      suggestions: string[];
    };
    format: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    content: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    length: {
      score: number;
      wordCount: number;
      ideal: string;
      suggestions: string[];
    };
  };
}
