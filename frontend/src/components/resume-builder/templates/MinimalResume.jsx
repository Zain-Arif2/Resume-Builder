import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { formatUrl } from "@/utils/formatUrl";

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
        <div className="text-center pb-6">
          <h1 className="text-3xl font-light tracking-widest uppercase text-gray-900">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="text-xs tracking-[4px] uppercase text-amber-700 mt-2 font-medium">
            {personal.jobTitle || "Professional Title"}
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 text-xs text-gray-500">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-gray-800">
                <Mail size={12} /> {personal.email}
              </a>
            )}
            {personal.phone && (
              <a href={`tel:${personal.phone}`} className="flex items-center gap-1 hover:text-gray-800">
                <Phone size={12} /> {personal.phone}
              </a>
            )}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-1">
                <MapPin size={12} /> {personal.city}{personal.city && personal.country && ", "}{personal.country}
              </div>
            )}
            {personal.linkedin && (
              <a href={formatUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-800">
                <FaLinkedin size={12} /> LinkedIn
              </a>
            )}
            {personal.github && (
              <a href={formatUrl(personal.github)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-800">
                <FaGithub size={12} /> GitHub
              </a>
            )}
            {personal.website && (
              <a href={formatUrl(personal.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-800">
                <Globe size={12} /> Website
              </a>
            )}
          </div>
        </div>

        {data?.professionalSummary && (
          <>
            <SectionTitle>Summary</SectionTitle>
            <p className="text-[14px] leading-6 text-gray-600 text-justify font-light">
              {data.professionalSummary}
            </p>
          </>
        )}

        {data?.experience?.length > 0 && (
          <>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-start">
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
          </>
        )}

        {data?.education?.length > 0 && (
          <>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-start">
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
          </>
        )}

        {data?.skills?.length > 0 && (
          <div>
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-gray-600 font-light">
              {data.skills.map((skill, index) => (
                <span key={index}>{skill.name || skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
