import { ResumeContent, AtsFeedback } from "@shared/schema";

export class AtsScorer {
  private static readonly COMMON_KEYWORDS = [
    "leadership", "management", "communication", "teamwork", "problem-solving",
    "analytical", "strategic", "innovative", "results-driven", "experienced",
    "proficient", "skilled", "expert", "advanced", "collaborative"
  ];

  private static readonly TECH_KEYWORDS = [
    "javascript", "python", "java", "react", "node.js", "sql", "aws", "docker",
    "kubernetes", "git", "agile", "scrum", "api", "database", "cloud", "devops"
  ];

  static analyzeResume(content: ResumeContent, jobDescription?: string): AtsFeedback {
    const keywordAnalysis = this.analyzeKeywords(content, jobDescription);
    const formatAnalysis = this.analyzeFormat(content);
    const contentAnalysis = this.analyzeContent(content);
    const lengthAnalysis = this.analyzeLength(content);

    const overallScore = Math.round(
      (keywordAnalysis.score * 0.3) +
      (formatAnalysis.score * 0.25) +
      (contentAnalysis.score * 0.25) +
      (lengthAnalysis.score * 0.2)
    );

    return {
      overall: {
        score: overallScore,
        message: this.getOverallMessage(overallScore)
      },
      sections: {
        keywords: keywordAnalysis,
        format: formatAnalysis,
        content: contentAnalysis,
        length: lengthAnalysis
      }
    };
  }

  private static analyzeKeywords(content: ResumeContent, jobDescription?: string) {
    const resumeText = this.extractResumeText(content).toLowerCase();
    const jobText = jobDescription?.toLowerCase() || "";

    // Extract keywords from job description or use common keywords
    const targetKeywords = jobDescription 
      ? this.extractKeywordsFromJob(jobText)
      : [...this.COMMON_KEYWORDS, ...this.TECH_KEYWORDS];

    const foundKeywords = targetKeywords.filter(keyword => 
      resumeText.includes(keyword.toLowerCase())
    );

    const missingKeywords = targetKeywords.filter(keyword => 
      !resumeText.includes(keyword.toLowerCase())
    ).slice(0, 10); // Limit to top 10

    const score = Math.min(100, Math.round((foundKeywords.length / targetKeywords.length) * 100));

    return {
      score,
      found: foundKeywords,
      missing: missingKeywords,
      suggestions: this.getKeywordSuggestions(missingKeywords, score)
    };
  }

  private static analyzeFormat(content: ResumeContent) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check essential sections
    if (!content.personalInfo.email) {
      issues.push("Missing email address");
      suggestions.push("Add a professional email address");
      score -= 15;
    }

    if (!content.personalInfo.phone) {
      issues.push("Missing phone number");
      suggestions.push("Include a phone number for contact");
      score -= 10;
    }

    if (!content.experience || content.experience.length === 0) {
      issues.push("No work experience listed");
      suggestions.push("Add your work experience");
      score -= 30;
    }

    if (!content.education || content.education.length === 0) {
      issues.push("No education listed");
      suggestions.push("Include your educational background");
      score -= 20;
    }

    if (!content.skills || content.skills.length === 0) {
      issues.push("No skills section");
      suggestions.push("Add a skills section with relevant abilities");
      score -= 15;
    }

    // Check for consistency in date formats
    const dates = content.experience.flatMap(exp => [exp.startDate, exp.endDate]);
    if (!this.isConsistentDateFormat(dates)) {
      issues.push("Inconsistent date formatting");
      suggestions.push("Use consistent date format (e.g., MM/YYYY) throughout");
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  private static analyzeContent(content: ResumeContent) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check summary quality
    if (!content.summary || content.summary.length < 50) {
      issues.push("Professional summary is too short or missing");
      suggestions.push("Add a compelling professional summary (2-3 sentences)");
      score -= 20;
    }

    // Check experience descriptions
    const shortDescriptions = content.experience.filter(exp => 
      !exp.description || exp.description.length < 100
    );

    if (shortDescriptions.length > 0) {
      issues.push(`${shortDescriptions.length} experience entries lack detailed descriptions`);
      suggestions.push("Expand job descriptions with specific achievements and responsibilities");
      score -= 15;
    }

    // Check for quantified achievements
    const resumeText = this.extractResumeText(content);
    const hasNumbers = /\d+(%|k|\+|million|thousand|hours|years|projects|teams)/.test(resumeText);
    
    if (!hasNumbers) {
      issues.push("No quantified achievements found");
      suggestions.push("Include specific numbers, percentages, or metrics to demonstrate impact");
      score -= 15;
    }

    // Check for action verbs
    const actionVerbs = [
      "achieved", "improved", "increased", "decreased", "managed", "led", "developed",
      "implemented", "created", "designed", "optimized", "streamlined", "delivered"
    ];
    
    const usedActionVerbs = actionVerbs.filter(verb => 
      resumeText.toLowerCase().includes(verb)
    );

    if (usedActionVerbs.length < 3) {
      issues.push("Limited use of strong action verbs");
      suggestions.push("Start bullet points with strong action verbs like 'achieved', 'improved', 'led'");
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  private static analyzeLength(content: ResumeContent) {
    const resumeText = this.extractResumeText(content);
    const wordCount = resumeText.split(/\s+/).length;
    let score = 100;
    let ideal = "Perfect length";
    const suggestions: string[] = [];

    if (wordCount < 200) {
      score = 40;
      ideal = "Too short";
      suggestions.push("Expand your resume with more detailed descriptions");
      suggestions.push("Add more relevant experience and achievements");
    } else if (wordCount < 400) {
      score = 70;
      ideal = "Could be longer";
      suggestions.push("Consider adding more details to strengthen your resume");
    } else if (wordCount > 800) {
      score = 75;
      ideal = "Consider shortening";
      suggestions.push("Try to keep resume concise while maintaining key information");
    } else if (wordCount > 600) {
      score = 90;
      ideal = "Good length";
    }

    return {
      score,
      wordCount,
      ideal,
      suggestions
    };
  }

  private static extractResumeText(content: ResumeContent): string {
    const parts: string[] = [];
    
    // Personal info
    parts.push(content.personalInfo.firstName, content.personalInfo.lastName);
    
    // Summary
    if (content.summary) parts.push(content.summary);
    
    // Experience
    content.experience.forEach(exp => {
      parts.push(exp.position, exp.company, exp.description);
      parts.push(...exp.achievements);
    });
    
    // Education
    content.education.forEach(edu => {
      parts.push(edu.degree, edu.school);
    });
    
    // Skills
    content.skills.forEach(skillGroup => {
      parts.push(skillGroup.category, ...skillGroup.items);
    });
    
    // Projects
    if (content.projects) {
      content.projects.forEach(project => {
        parts.push(project.name, project.description);
        parts.push(...project.technologies);
      });
    }

    return parts.filter(Boolean).join(" ");
  }

  private static extractKeywordsFromJob(jobText: string): string[] {
    // Simple keyword extraction - in a real app, this would be more sophisticated
    const words = jobText.match(/\b[a-zA-Z]{3,}\b/g) || [];
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      const lower = word.toLowerCase();
      frequency[lower] = (frequency[lower] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  private static isConsistentDateFormat(dates: string[]): boolean {
    const validDates = dates.filter(Boolean);
    if (validDates.length < 2) return true;
    
    const formats = validDates.map(date => {
      if (/^\d{1,2}\/\d{4}$/.test(date)) return "MM/YYYY";
      if (/^\w+ \d{4}$/.test(date)) return "Month YYYY";
      if (/^\d{4}$/.test(date)) return "YYYY";
      return "other";
    });
    
    return new Set(formats).size === 1;
  }

  private static getKeywordSuggestions(missingKeywords: string[], score: number): string[] {
    const suggestions: string[] = [];
    
    if (score < 50) {
      suggestions.push("Consider adding more industry-specific keywords");
      suggestions.push("Review the job description for important terms to include");
    }
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Try incorporating: ${missingKeywords.slice(0, 5).join(", ")}`);
    }
    
    return suggestions;
  }

  private static getOverallMessage(score: number): string {
    if (score >= 90) return "Excellent! Your resume is well-optimized for ATS systems.";
    if (score >= 80) return "Great job! Your resume performs well with minor areas for improvement.";
    if (score >= 70) return "Good foundation with several opportunities for optimization.";
    if (score >= 60) return "Your resume needs some improvements to pass ATS filters effectively.";
    return "Significant improvements needed to optimize for ATS systems.";
  }
}
