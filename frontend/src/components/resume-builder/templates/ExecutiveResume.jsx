import React from 'react';
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function SectionTitle({ children }) {
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-[14px] font-bold uppercase tracking-[2px] text-slate-900 border-l-4 border-slate-800 pl-3">
        {children}
      </h2>
    </div>
  );
}

export default function ExecutiveResume({ data }) {
  const personal = data?.personalInfo || {};

  return (
    <div className="bg-white w-full min-h-[1123px] shadow-xl p-12 text-slate-800 font-serif">
      <div className="max-w-4xl mx-auto">
        
        {/* Executive Header Banner */}
        <div className="bg-slate-900 text-white p-8 rounded-sm flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-sans">
              {personal.fullName || "Your Name"}
            </h1>
            <p className="text-slate-400 text-sm tracking-widest uppercase mt-1 font-sans">
              {personal.jobTitle || "Professional Title"}
            </p>
          </div>
          <div className="text-right text-xs space-y-1 font-sans text-slate-300 border-l border-slate-700 pl-6 hidden sm:block">
            {personal.email && <div className="flex items-center justify-end gap-2"><Mail size={12} /> {personal.email}</div>}
            {personal.phone && <div className="flex items-center justify-end gap-2"><Phone size={12} /> {personal.phone}</div>}
            {personal.linkedin && <div className="flex items-center justify-end gap-2"><FaLinkedin size={12} /> LinkedIn</div>}
          </div>
        </div>

        {/* Mobile/Fallback Contact view if banner is packed */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs font-sans text-slate-500 sm:hidden">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
        </div>

        {/* Professional Summary */}
        {data?.professionalSummary && (
          <div className="avoid-break">
            <SectionTitle>Executive Profile</SectionTitle>
            <p className="text-[14.5px] leading-7 text-slate-700 text-justify font-sans">
              {data.professionalSummary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data?.experience?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Leadership & Professional History</SectionTitle>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-b border-slate-100 pb-4 last:border-0 avoid-break">
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-amber-800 font-medium font-sans mt-0.5">{exp.company}</p>
                  
                  {exp.description && (
                    <p className="mt-3 text-[14px] leading-6 text-slate-600 font-sans whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data?.education?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Education & Credentials</SectionTitle>
            <div className="space-y-4 font-sans">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start avoid-break">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{edu.degree}</h3>
                    <p className="text-xs text-slate-600">{edu.school || edu.institution}</p>
                  </div>
                  <span className="text-xs text-slate-500">{edu.startDate} — {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Strengths Grid */}
        {data?.strengths?.length > 0 && (
          <div className="avoid-break">
            <SectionTitle>Core Competencies</SectionTitle>
            <div className="grid grid-cols-3 gap-3 font-sans text-xs text-center">
              {data.strengths.map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 py-2 px-3 rounded-sm font-medium text-slate-700 avoid-break">
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