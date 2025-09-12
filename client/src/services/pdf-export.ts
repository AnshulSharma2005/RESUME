import jsPDF from "jspdf";
import { ResumeContent } from "@shared/schema";

export class PdfExportService {
  private static readonly PAGE_WIDTH = 210; // A4 width in mm
  private static readonly PAGE_HEIGHT = 297; // A4 height in mm
  private static readonly MARGIN = 20;
  private static readonly LINE_HEIGHT = 6;

  static async exportResume(
    content: ResumeContent,
    templateId: string,
    title: string
  ): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Set up fonts and colors
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(33, 37, 41); // Dark gray

    let yPosition = this.MARGIN;

    // Header with personal information
    yPosition = this.renderHeader(pdf, content.personalInfo, yPosition);
    
    // Professional Summary
    if (content.summary) {
      yPosition = this.renderSection(pdf, "Professional Summary", content.summary, yPosition);
    }

    // Work Experience
    if (content.experience.length > 0) {
      yPosition = this.renderExperience(pdf, content.experience, yPosition);
    }

    // Education
    if (content.education.length > 0) {
      yPosition = this.renderEducation(pdf, content.education, yPosition);
    }

    // Skills
    if (content.skills.length > 0) {
      yPosition = this.renderSkills(pdf, content.skills, yPosition);
    }

    // Projects (if any)
    if (content.projects && content.projects.length > 0) {
      yPosition = this.renderProjects(pdf, content.projects, yPosition);
    }

    // Certifications (if any)
    if (content.certifications && content.certifications.length > 0) {
      yPosition = this.renderCertifications(pdf, content.certifications, yPosition);
    }

    return pdf.output("blob");
  }

  private static renderHeader(pdf: jsPDF, personalInfo: ResumeContent["personalInfo"], yPosition: number): number {
    const { firstName, lastName, email, phone, location, website, linkedin } = personalInfo;
    
    // Name
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    const fullName = `${firstName} ${lastName}`;
    pdf.text(fullName, this.MARGIN, yPosition);
    yPosition += 10;

    // Contact information
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100); // Gray
    
    const contactInfo = [email, phone, location, website, linkedin].filter(Boolean).join(" • ");
    pdf.text(contactInfo, this.MARGIN, yPosition);
    yPosition += 15;

    // Reset color
    pdf.setTextColor(33, 37, 41);
    
    return yPosition;
  }

  private static renderSection(pdf: jsPDF, title: string, content: string, yPosition: number): number {
    // Check if we need a new page
    if (yPosition > this.PAGE_HEIGHT - 50) {
      pdf.addPage();
      yPosition = this.MARGIN;
    }

    // Section title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, this.MARGIN, yPosition);
    yPosition += 8;

    // Section content
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(content, this.PAGE_WIDTH - 2 * this.MARGIN);
    pdf.text(lines, this.MARGIN, yPosition);
    yPosition += lines.length * this.LINE_HEIGHT + 10;

    return yPosition;
  }

  private static renderExperience(pdf: jsPDF, experience: ResumeContent["experience"], yPosition: number): number {
    yPosition = this.renderSectionHeader(pdf, "Work Experience", yPosition);

    for (const exp of experience) {
      // Check if we need a new page
      if (yPosition > this.PAGE_HEIGHT - 80) {
        pdf.addPage();
        yPosition = this.MARGIN;
      }

      // Job title and company
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${exp.position} • ${exp.company}`, this.MARGIN, yPosition);
      yPosition += 6;

      // Dates and location
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
      pdf.text(`${dateRange} • ${exp.location}`, this.MARGIN, yPosition);
      yPosition += 8;

      // Description
      pdf.setFontSize(10);
      pdf.setTextColor(33, 37, 41);
      if (exp.description) {
        const descLines = pdf.splitTextToSize(exp.description, this.PAGE_WIDTH - 2 * this.MARGIN - 10);
        pdf.text(descLines, this.MARGIN + 5, yPosition);
        yPosition += descLines.length * this.LINE_HEIGHT + 2;
      }

      // Achievements
      if (exp.achievements.length > 0) {
        for (const achievement of exp.achievements) {
          const achLines = pdf.splitTextToSize(`• ${achievement}`, this.PAGE_WIDTH - 2 * this.MARGIN - 10);
          pdf.text(achLines, this.MARGIN + 5, yPosition);
          yPosition += achLines.length * this.LINE_HEIGHT;
        }
      }
      
      yPosition += 8;
    }

    return yPosition;
  }

  private static renderEducation(pdf: jsPDF, education: ResumeContent["education"], yPosition: number): number {
    yPosition = this.renderSectionHeader(pdf, "Education", yPosition);

    for (const edu of education) {
      if (yPosition > this.PAGE_HEIGHT - 60) {
        pdf.addPage();
        yPosition = this.MARGIN;
      }

      // Degree and school
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${edu.degree} • ${edu.school}`, this.MARGIN, yPosition);
      yPosition += 6;

      // Date and location
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${edu.graduationDate} • ${edu.location}`, this.MARGIN, yPosition);
      yPosition += 6;

      // GPA if present
      if (edu.gpa) {
        pdf.setTextColor(33, 37, 41);
        pdf.text(`GPA: ${edu.gpa}`, this.MARGIN, yPosition);
        yPosition += 6;
      }

      yPosition += 6;
    }

    return yPosition;
  }

  private static renderSkills(pdf: jsPDF, skills: ResumeContent["skills"], yPosition: number): number {
    yPosition = this.renderSectionHeader(pdf, "Skills", yPosition);

    for (const skillGroup of skills) {
      if (yPosition > this.PAGE_HEIGHT - 40) {
        pdf.addPage();
        yPosition = this.MARGIN;
      }

      // Skill category
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${skillGroup.category}:`, this.MARGIN, yPosition);
      
      // Skills list
      pdf.setFont("helvetica", "normal");
      const skillsText = skillGroup.items.join(", ");
      const skillsLines = pdf.splitTextToSize(skillsText, this.PAGE_WIDTH - 2 * this.MARGIN - 60);
      pdf.text(skillsLines, this.MARGIN + 60, yPosition);
      yPosition += Math.max(6, skillsLines.length * this.LINE_HEIGHT) + 4;
    }

    return yPosition + 6;
  }

  private static renderProjects(pdf: jsPDF, projects: ResumeContent["projects"], yPosition: number): number {
    yPosition = this.renderSectionHeader(pdf, "Projects", yPosition);

    if (!projects) return yPosition;

    for (const project of projects) {
      if (yPosition > this.PAGE_HEIGHT - 60) {
        pdf.addPage();
        yPosition = this.MARGIN;
      }

      // Project name
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(project.name, this.MARGIN, yPosition);
      yPosition += 6;

      // Description
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(project.description, this.PAGE_WIDTH - 2 * this.MARGIN);
      pdf.text(descLines, this.MARGIN, yPosition);
      yPosition += descLines.length * this.LINE_HEIGHT + 2;

      // Technologies
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Technologies: ${project.technologies.join(", ")}`, this.MARGIN, yPosition);
      yPosition += 10;
      
      pdf.setTextColor(33, 37, 41);
    }

    return yPosition;
  }

  private static renderCertifications(pdf: jsPDF, certifications: ResumeContent["certifications"], yPosition: number): number {
    yPosition = this.renderSectionHeader(pdf, "Certifications", yPosition);

    if (!certifications) return yPosition;

    for (const cert of certifications) {
      if (yPosition > this.PAGE_HEIGHT - 30) {
        pdf.addPage();
        yPosition = this.MARGIN;
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${cert.name} • ${cert.issuer}`, this.MARGIN, yPosition);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(cert.date, this.PAGE_WIDTH - this.MARGIN - 30, yPosition);
      
      yPosition += 8;
      pdf.setTextColor(33, 37, 41);
    }

    return yPosition;
  }

  private static renderSectionHeader(pdf: jsPDF, title: string, yPosition: number): number {
    if (yPosition > this.PAGE_HEIGHT - 40) {
      pdf.addPage();
      yPosition = this.MARGIN;
    }

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(33, 37, 41);
    pdf.text(title, this.MARGIN, yPosition);
    
    // Add underline
    pdf.setDrawColor(33, 37, 41);
    pdf.line(this.MARGIN, yPosition + 2, this.PAGE_WIDTH - this.MARGIN, yPosition + 2);
    
    return yPosition + 12;
  }
}
