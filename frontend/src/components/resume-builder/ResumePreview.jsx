import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { formatUrl } from '@/utils/formatUrl';

export default function ResumePreview({ data }) {
  const { personalInfo = {}, professionalSummary, experience = [], education = [], skills = [] } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const contactLine1 = [
    personalInfo.email && { icon: Mail, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
    personalInfo.phone && { icon: Phone, label: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    (personalInfo.city || personalInfo.country) && {
      icon: MapPin,
      label: [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
    },
  ].filter(Boolean);

  const contactLine2 = [
    personalInfo.linkedin && { icon: Linkedin, label: 'LinkedIn', href: formatUrl(personalInfo.linkedin) },
    personalInfo.github && { icon: Github, label: 'GitHub', href: formatUrl(personalInfo.github) },
    personalInfo.website && { icon: Globe, label: 'Website', href: formatUrl(personalInfo.website) },
  ].filter(Boolean);

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 aspect-[8.5/11] overflow-y-auto text-[13px] leading-snug">
      <div className="border-b border-gray-300 pb-4 mb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>

        {contactLine1.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            {contactLine1.map((item, i) =>
              item.href ? (
                <a key={i} href={item.href} className="flex items-center gap-1 hover:text-gray-800">
                  <item.icon size={11} /> {item.label}
                </a>
              ) : (
                <span key={i} className="flex items-center gap-1">
                  <item.icon size={11} /> {item.label}
                </span>
              )
            )}
          </div>
        )}

        {contactLine2.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
            {contactLine2.map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-800">
                <item.icon size={11} /> {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {professionalSummary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1.5">Summary</h2>
          <p className="text-gray-700">{professionalSummary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Experience</h2>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold">{exp.position}</p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mb-1">{exp.company}</p>
                {exp.description && (
                  <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Education</h2>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <p className="font-semibold">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</p>
                  <p className="text-gray-600 text-xs">{edu.institution}</p>
                </div>
                <p className="text-gray-500 text-xs">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Skills</h2>
          <p className="text-gray-700">{skills.map((s) => s.name).join(' · ')}</p>
        </section>
      )}
    </div>
  );
}
