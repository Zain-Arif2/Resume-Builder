import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { formatUrl } from "@/utils/formatUrl";

function SectionTitle({ children }) {
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-[14px] font-extrabold tracking-wider uppercase text-indigo-900">
        {children}
      </h2>
      <div className="mt-1.5 h-[3px] w-12 bg-indigo-500 rounded-full" />
    </div>
  );
}

export default function CreativeResume({ data }) {
  const personal = data?.personalInfo || {};

  return (
    <div className="bg-white w-full min-h-[1123px] shadow-xl rounded-lg text-[#1e293b] flex font-sans">
      <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col justify-between">
        <div>
          <div className="space-y-4 text-xs text-slate-600 mt-6">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Contact</h4>
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-2 break-all hover:text-indigo-600">
                <Mail size={14} className="text-indigo-500 shrink-0" /> {personal.email}
              </a>
            )}
            {personal.phone && (
              <a href={`tel:${personal.phone}`} className="flex items-center gap-2 hover:text-indigo-600">
                <Phone size={14} className="text-indigo-500 shrink-0" /> {personal.phone}
              </a>
            )}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-500 shrink-0" /> {[personal.city, personal.country].filter(Boolean).join(', ')}
              </div>
            )}
            {personal.linkedin && (
              <a href={formatUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-600">
                <FaLinkedin size={14} className="text-indigo-500 shrink-0" /> LinkedIn
              </a>
            )}
            {personal.github && (
              <a href={formatUrl(personal.github)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-600">
                <FaGithub size={14} className="text-indigo-500 shrink-0" /> GitHub
              </a>
            )}
            {personal.website && (
              <a href={formatUrl(personal.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-600">
                <Globe size={14} className="text-indigo-500 shrink-0" /> Website
              </a>
            )}
          </div>

          {data?.skills?.length > 0 && (
            <div className="mt-10">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-md font-medium">
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.languages?.length > 0 && (
            <div className="mt-10">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Languages</h4>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-semibold text-slate-700">{lang.name}</p>
                    <p className="text-slate-400 text-[10px]">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-2/3 p-10">
        <div className="pb-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="text-lg font-medium text-indigo-600 mt-1">
            {personal.jobTitle || "Professional Title"}
          </p>
        </div>

        {data?.professionalSummary && (
          <>
            <SectionTitle>About Me</SectionTitle>
            <p className="text-[14px] leading-7 text-slate-600 text-justify">
              {data.professionalSummary}
            </p>
          </>
        )}

        {data?.experience?.length > 0 && (
          <>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-indigo-100">
                  <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full -left-[6px] top-1.5" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{exp.position}</h3>
                      <p className="text-xs font-semibold text-slate-500">{exp.company}</p>
                    </div>
                    <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-5 whitespace-pre-line">{exp.description}</p>
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
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{edu.degree}</h3>
                    <p className="text-xs text-slate-500">{edu.school || edu.institution}</p>
                  </div>
                  <span className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
