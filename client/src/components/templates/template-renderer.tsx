import { ResumeContent } from "@shared/schema";
import { getTemplate } from "@/data/resume-templates";

interface TemplateRendererProps {
  content: ResumeContent;
  templateId: string;
  className?: string;
}

export function TemplateRenderer({ content, templateId, className = "" }: TemplateRendererProps) {
  const template = getTemplate(templateId);
  
  if (!template) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-gray-500">Template not found</p>
      </div>
    );
  }

  const { personalInfo, summary, experience, education, skills, projects } = content;

  // Helper function to format dates
  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = startDate || "Present";
    const end = current ? "Present" : (endDate || "Present");
    return `${start} - ${end}`;
  };

  // Different template layouts based on template category
  if (template.category === "modern") {
    return (
      <div className={`bg-white p-8 font-sans text-gray-900 ${className}`} style={{ minHeight: '11in', width: '8.5in' }}>
        {/* Modern Template Layout */}
        <div className="flex">
          {/* Left Column - 1/3 width */}
          <div className="w-1/3 pr-6" style={{ backgroundColor: template.colors.primary, color: 'white', padding: '2rem 1.5rem', margin: '-2rem 0 -2rem -2rem' }}>
            {/* Personal Info */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">{personalInfo.firstName} {personalInfo.lastName}</h1>
              <div className="text-sm opacity-90 space-y-1">
                <div>{personalInfo.email}</div>
                <div>{personalInfo.phone}</div>
                <div>{personalInfo.location}</div>
                {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
                {personalInfo.website && <div>{personalInfo.website}</div>}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                {skills.map((skillGroup) => (
                  <div key={skillGroup.id} className="mb-4">
                    <h3 className="font-medium mb-2">{skillGroup.category}</h3>
                    <div className="text-sm opacity-90">
                      {skillGroup.items.map((skill, index) => (
                        <div key={index} className="mb-1">• {skill}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - 2/3 width */}
          <div className="w-2/3 pl-6">
            {/* Professional Summary */}
            {summary && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>Professional Summary</h2>
                <p className="text-sm leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: template.colors.primary }}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{exp.position}</h3>
                        <p className="font-medium" style={{ color: template.colors.secondary }}>{exp.company}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{exp.location}</p>
                    {exp.description && (
                      <p className="text-sm leading-relaxed mb-2">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: template.colors.primary }}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="font-medium" style={{ color: template.colors.secondary }}>{edu.school}</p>
                        <p className="text-sm text-gray-700">{edu.location}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {edu.graduationDate}
                      </div>
                    </div>
                    {edu.gpa && (
                      <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: template.colors.primary }}>Projects</h2>
                {projects.map((project) => (
                  <div key={project.id} className="mb-4">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm leading-relaxed mb-2">{project.description}</p>
                    <p className="text-sm text-gray-700">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                    {project.url && (
                      <p className="text-sm text-gray-700">
                        <strong>URL:</strong> {project.url}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Professional/Classic Template (default)
  return (
    <div className={`bg-white p-8 font-sans text-gray-900 ${className}`} style={{ minHeight: '11in', width: '8.5in' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: template.colors.primary }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="text-sm text-gray-600 space-x-2">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b-2" style={{ borderColor: template.colors.primary }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderColor: template.colors.primary }}>
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <p className="font-medium" style={{ color: template.colors.secondary }}>{exp.company} • {exp.location}</p>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
              </div>
              {exp.description && (
                <p className="text-sm leading-relaxed mb-2">{exp.description}</p>
              )}
              {exp.achievements.length > 0 && (
                <ul className="text-sm space-y-1">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderColor: template.colors.primary }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="font-medium" style={{ color: template.colors.secondary }}>
                    {edu.school} • {edu.location}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {edu.graduationDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderColor: template.colors.primary }}>
            Skills
          </h2>
          {skills.map((skillGroup) => (
            <div key={skillGroup.id} className="mb-3">
              <div className="flex">
                <span className="font-semibold w-32 flex-shrink-0">{skillGroup.category}:</span>
                <span className="text-sm">{skillGroup.items.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderColor: template.colors.primary }}>
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm leading-relaxed mb-1">{project.description}</p>
              <p className="text-sm text-gray-700">
                <strong>Technologies:</strong> {project.technologies.join(", ")}
              </p>
              {project.url && (
                <p className="text-sm text-gray-700">
                  <strong>URL:</strong> {project.url}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
