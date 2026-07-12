import React from 'react';
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function SectionTitle({ children }) {
  return (
    <div className="mt-10 mb-5">
      <h2
        className="
        text-[15px]
        font-bold
        tracking-[3px]
        uppercase
        text-gray-900
        "
      >
        {children}
      </h2>
      <div
        className="
        mt-2
        h-[2px]
        bg-gray-200
        "
      />
    </div>
  );
}

export default function ModernATS({ data }) {
  const personal = data?.personalInfo || {};

  return (
    <div className="bg-white w-full min-h-[1123px] shadow-xl rounded-lg p-10 text-[#111827]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h1 className="text-4xl text-center font-bold tracking-tight">
            {personal.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail size={15} />
                {personal.email}
              </div>
            )}

            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone size={15} />
                {personal.phone}
              </div>
            )}

            {(personal.city || personal.country) && (
              <div className="flex items-center gap-2">
                <MapPin size={15} />
                {personal.city}
                {personal.city && personal.country && ", "}
                {personal.country}
              </div>
            )}

            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <FaLinkedin size={15} />
                {personal.linkedin}
              </div>
            )}

            {personal.github && (
              <div className="flex items-center gap-2">
                <FaGithub size={15} />
                {personal.github}
              </div>
            )}

            {personal.website && (
              <div className="flex items-center gap-2">
                <Globe size={15} />
                {personal.website}
              </div>
            )}
          </div>
        </div>

        {/* ===========================
            PROFESSIONAL SUMMARY
        ============================ */}
        {data?.professionalSummary && (
          <div className="avoid-break">
            <SectionTitle>Professional Summary</SectionTitle>
            <p
              className="
              text-[15px]
              leading-8
              text-gray-700
              text-justify
              "
            >
              {data.professionalSummary}
            </p>
          </div>
        )}

        {/* ===========================
               EXPERIENCE
        ============================ */}
        {data?.experience?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Professional Experience</SectionTitle>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="avoid-break">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="
                        text-[19px]
                        font-bold
                        text-gray-900
                        "
                      >
                        {exp.position}
                      </h3>
                      <p
                        className="
                        mt-1
                        text-[15px]
                        font-semibold
                        text-amber-700
                        "
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div
                      className="
                      text-sm
                      text-gray-500
                      whitespace-nowrap
                      "
                    >
                      {exp.startDate}
                      {" — "}
                      {exp.endDate || "Present"}
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <div className="mt-5 space-y-2">
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => (
                          <div key={i} className="flex gap-3">
                            <span
                              className="
                              mt-[10px]
                              w-2
                              h-2
                              rounded-full
                              bg-amber-600
                              shrink-0
                              "
                            />
                            <p
                              className="
                              text-[15px]
                              leading-7
                              text-gray-700
                              "
                            >
                              {line}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
                EDUCATION
        ============================ */}
        {data?.education?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-7">
              {data.education.map((edu, index) => (
                <div key={index} className="avoid-break">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="
                        text-[18px]
                        font-bold
                        text-gray-900
                        "
                      >
                        {edu.degree}
                        {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                      </h3>
                      <p
                        className="
                        mt-1
                        text-[15px]
                        font-semibold
                        text-amber-700
                        "
                      >
                        {edu.school || edu.institution}
                      </p>
                    </div>
                    <div
                      className="
                      text-sm
                      text-gray-500
                      whitespace-nowrap
                      "
                    >
                      {edu.startDate}
                      {" — "}
                      {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
            TECHNICAL SKILLS
        ============================ */}
        {data?.skills?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Technical Skills</SectionTitle>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="
                  px-4
                  py-2
                  rounded-md
                  border
                  border-gray-300
                  bg-gray-50
                  text-[14px]
                  font-medium
                  text-gray-800
                  hover:bg-gray-100
                  transition
                  "
                >
                  {skill.name || skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
            CERTIFICATIONS
        ============================ */}
        {data?.certifications?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Certifications</SectionTitle>
            <div className="space-y-5">
              {data.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="
                  flex
                  justify-between
                  items-center
                  pb-4
                  border-b
                  border-gray-200
                  avoid-break
                  "
                >
                  <div>
                    <h3 className="text-[16px] font-semibold">
                      {cert.title}
                    </h3>
                    <p
                      className="
                      mt-1
                      text-sm
                      text-gray-500
                      "
                    >
                      {cert.organization}
                    </p>
                  </div>
                  {cert.issueDate && (
                    <span
                      className="
                      text-sm
                      text-gray-500
                      "
                    >
                      {cert.issueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
            PROJECTS
        ============================ */}
        {data?.projects?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-8">
              {data.projects.map((project, index) => (
                <div key={index} className="avoid-break">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-[15px] text-amber-700">
                        {project.techStack}
                      </p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Live
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-700 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-gray-700">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
                LANGUAGES
        ============================ */}
        {data?.languages?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Languages</SectionTitle>
            <div className="grid grid-cols-2 gap-5">
              {data.languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex justify-between border border-gray-200 rounded-md px-4 py-3 avoid-break"
                >
                  <span className="font-medium">
                    {lang.name}
                  </span>
                  <span className="text-gray-500">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
            ACHIEVEMENTS
        ============================ */}
        {data?.achievements?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Achievements</SectionTitle>
            <div className="space-y-3">
              {data.achievements.map((item, index) => (
                <div key={index} className="flex gap-3 avoid-break">
                  <div className="w-3 h-3 rounded-full bg-amber-600 mt-3"></div>
                  <p className="text-[15px] leading-7 text-gray-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================
            CORE COMPETENCIES
        ============================ */}
        {data?.strengths?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Core Competencies</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {data.strengths.map((item, index) => (
                <div
                  key={index}
                  className="
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-md
                  px-4
                  py-3
                  text-[15px]
                  avoid-break
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}