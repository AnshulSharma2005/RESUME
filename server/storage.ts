import { type User, type InsertUser, type Resume, type AtsAnalysis, type InsertResume, type InsertAtsAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { id: string }): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUserAnalytics(userId: string): Promise<{
    totalResumes: number;
    avgAtsScore: number;
    templateUsage: Record<string, number>;
    mostRecentUpdate: string | null;
  }>;

  // Resume operations
  getResume(id: string): Promise<Resume | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;
  searchResumes(userId: string, searchTerm: string): Promise<Resume[]>;
  getResumesByTemplate(userId: string, templateId: string): Promise<Resume[]>;

  // ATS Analysis operations
  createAtsAnalysis(analysis: InsertAtsAnalysis): Promise<AtsAnalysis>;
  getResumeAtsHistory(resumeId: string): Promise<AtsAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;
  private atsAnalyses: Map<string, AtsAnalysis>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.atsAnalyses = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser & { id: string }): Promise<User> {
    const user: User = {
      ...userData,
      displayName: userData.displayName ?? null,
      photoURL: userData.photoURL ?? null,
      experienceLevel: userData.experienceLevel ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserAnalytics(userId: string): Promise<{
    totalResumes: number;
    avgAtsScore: number;
    templateUsage: Record<string, number>;
    mostRecentUpdate: string | null;
  }> {
    const userResumes = await this.getUserResumes(userId);
    const totalResumes = userResumes.length;
    
    if (totalResumes === 0) {
      return {
        totalResumes: 0,
        avgAtsScore: 0,
        templateUsage: {},
        mostRecentUpdate: null,
      };
    }

    const atsScores = userResumes
      .map(resume => resume.atsScore)
      .filter((score): score is number => score !== null && score !== undefined);
    
    const avgAtsScore = atsScores.length > 0 
      ? Math.round(atsScores.reduce((sum, score) => sum + score, 0) / atsScores.length)
      : 0;

    const templateUsage = userResumes.reduce((acc, resume) => {
      acc[resume.templateId] = (acc[resume.templateId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostRecentUpdate = userResumes.length > 0 
      ? userResumes
          .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())[0]
          .updatedAt!.toISOString()
      : null;

    return {
      totalResumes,
      avgAtsScore,
      templateUsage,
      mostRecentUpdate,
    };
  }

  // Resume operations
  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values())
      .filter(resume => resume.userId === userId)
      .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
  }

  async createResume(resumeData: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      ...resumeData,
      atsScore: null,
      atsAttempts: 0,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, updates: Partial<InsertResume & { atsScore?: number | null; atsAttempts?: number }>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;

    const updatedResume: Resume = {
      ...resume,
      ...updates,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: string): Promise<boolean> {
    const existed = this.resumes.has(id);
    if (existed) {
      this.resumes.delete(id);
      // Also delete related ATS analyses
      const analysesToDelete = Array.from(this.atsAnalyses.entries())
        .filter(([, analysis]) => analysis.resumeId === id)
        .map(([analysisId]) => analysisId);
      
      analysesToDelete.forEach(analysisId => this.atsAnalyses.delete(analysisId));
    }
    return existed;
  }

  async searchResumes(userId: string, searchTerm: string): Promise<Resume[]> {
    const userResumes = await this.getUserResumes(userId);
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return userResumes.filter(resume =>
      resume.title.toLowerCase().includes(lowercaseSearch) ||
      resume.templateId.toLowerCase().includes(lowercaseSearch) ||
      (typeof resume.content === 'object' && 
       JSON.stringify(resume.content).toLowerCase().includes(lowercaseSearch))
    );
  }

  async getResumesByTemplate(userId: string, templateId: string): Promise<Resume[]> {
    const userResumes = await this.getUserResumes(userId);
    return userResumes.filter(resume => resume.templateId === templateId);
  }

  // ATS Analysis operations
  async createAtsAnalysis(analysisData: InsertAtsAnalysis): Promise<AtsAnalysis> {
    const id = randomUUID();
    const analysis: AtsAnalysis = {
      id,
      ...analysisData,
      keywords: analysisData.keywords ?? null,
      suggestions: analysisData.suggestions ?? null,
      createdAt: new Date(),
    };
    this.atsAnalyses.set(id, analysis);
    return analysis;
  }

  async getResumeAtsHistory(resumeId: string): Promise<AtsAnalysis[]> {
    return Array.from(this.atsAnalyses.values())
      .filter(analysis => analysis.resumeId === resumeId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 10); // Return last 10 analyses
  }
}

export const storage = new MemStorage();
