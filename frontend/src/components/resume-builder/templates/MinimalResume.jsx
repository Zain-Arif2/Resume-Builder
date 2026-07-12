import React from 'react';
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function SectionTitle({ children }) {
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-[13px] font-bold tracking-[2px] uppercase text-gray-400">
        {children}
      </h2>
      <div className="mt-1 h-[1px] bg-gray-100" />
    </div>
  );
}

export default function MinimalResume({ data }) {
  const personal = data?.personalInfo || {};

  return (
    <div className="bg-white w-full min-h-[1123px] p-12 text-gray-800 font-sans tracking-wide">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center pb-6">
          <h1 className="text-3xl font-light tracking-widest uppercase text-gray-900">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="text-xs tracking-[4px] uppercase text-amber-700 mt-2 font-medium">
            {personal.jobTitle || "Professional Title"}
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 text-xs text-gray-500">
            {personal.email && <div className="flex items-center gap-1"><Mail size={12} /> {personal.email}</div>}
            {personal.phone && <div className="flex items-center gap-1"><Phone size={12} /> {personal.phone}</div>}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-1">
                <MapPin size={12} /> {personal.city}{personal.city && personal.country && ", "}{personal.country}
              </div>
            )}
            {personal.linkedin && <div className="flex items-center gap-1"><FaLinkedin size={12} /> Link</div>}
            {personal.github && <div className="flex items-center gap-1"><FaGithub size={12} /> GitHub</div>}
            {personal.website && <div className="flex items-center gap-1"><Globe size={12} /> Web</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {data?.professionalSummary && (
          <div className="avoid-break">
            <SectionTitle>Summary</SectionTitle>
            <p className="text-[14px] leading-6 text-gray-600 text-justify font-light">
              {data.professionalSummary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data?.experience?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-start avoid-break">
                  <div className="text-xs text-gray-400 font-medium pt-1">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-[15px] font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-xs text-amber-700 font-medium">{exp.company}</p>
                    {exp.description && (
                      <p className="mt-2 text-[13.5px] leading-6 text-gray-600 font-light whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data?.education?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-start avoid-break">
                  <div className="text-xs text-gray-400 font-medium pt-0.5">
                    {edu.startDate} — {edu.endDate}
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-[15px] font-medium text-gray-900">
                      {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-xs text-gray-500 font-light">{edu.school || edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Others Layout */}
        <div className="grid grid-cols-2 gap-8 mt-4">
          {data?.skills?.length > 0 && (
            <div className="avoid-break">
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-gray-600 font-light">
                {data.skills.map((skill, index) => (
                  <span key={index}>{skill.name || skill}</span>
                ))}
              </div>
            </div>
          )}

          {data?.languages?.length > 0 && (
            <div className="avoid-break">
              <SectionTitle>Languages</SectionTitle>
              <div className="space-y-1 text-[13.5px] text-gray-600 font-light">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between avoid-break">
                    <span>{lang.name}</span>
                    <span className="text-gray-400 text-xs">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}