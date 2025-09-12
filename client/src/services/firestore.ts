import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resume, ResumeContent, AtsAnalysis, InsertResume } from "@shared/schema";

export class FirestoreService {
  // Resume operations
  static async createResume(resumeData: InsertResume): Promise<string> {
    const docRef = await addDoc(collection(db, "resumes"), {
      ...resumeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  static async getResume(id: string): Promise<Resume | null> {
    const docRef = doc(db, "resumes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resume;
    }
    return null;
  }

  static async getUserResumes(userId: string): Promise<Resume[]> {
    const q = query(
      collection(db, "resumes"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resume));
  }

  static async updateResume(id: string, data: Partial<Resume>): Promise<void> {
    const docRef = doc(db, "resumes", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  }

  static async deleteResume(id: string): Promise<void> {
    await deleteDoc(doc(db, "resumes", id));
  }

  // Real-time resume listening for collaborative editing
  static subscribeToResume(
    id: string,
    callback: (resume: Resume | null) => void
  ): () => void {
    const docRef = doc(db, "resumes", id);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Resume);
      } else {
        callback(null);
      }
    });
  }

  // ATS Analysis operations
  static async saveAtsAnalysis(analysis: Omit<AtsAnalysis, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, "atsAnalyses"), {
      ...analysis,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  static async getResumeAtsHistory(resumeId: string): Promise<AtsAnalysis[]> {
    const q = query(
      collection(db, "atsAnalyses"),
      where("resumeId", "==", resumeId),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AtsAnalysis));
  }

  // Batch operations for better performance
  static async batchUpdateResumes(updates: Array<{ id: string; data: Partial<Resume> }>): Promise<void> {
    const promises = updates.map(({ id, data }) => this.updateResume(id, data));
    await Promise.all(promises);
  }

  // Search and filtering
  static async searchResumes(userId: string, searchTerm: string): Promise<Resume[]> {
    const userResumes = await this.getUserResumes(userId);
    return userResumes.filter(resume =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.templateId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  static async getResumesByTemplate(userId: string, templateId: string): Promise<Resume[]> {
    const q = query(
      collection(db, "resumes"),
      where("userId", "==", userId),
      where("templateId", "==", templateId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resume));
  }

  // Analytics and insights
  static async getUserAnalytics(userId: string) {
    const resumes = await this.getUserResumes(userId);
    const totalResumes = resumes.length;
    const avgAtsScore = resumes.reduce((sum, resume) => 
      sum + (resume.atsScore || 0), 0) / totalResumes || 0;
    
    const templateUsage = resumes.reduce((acc, resume) => {
      acc[resume.templateId] = (acc[resume.templateId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalResumes,
      avgAtsScore: Math.round(avgAtsScore),
      templateUsage,
      mostRecentUpdate: resumes[0]?.updatedAt || null,
    };
  }
}
