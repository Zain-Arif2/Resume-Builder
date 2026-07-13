import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is ResumeAI free to use?',
    a: 'Yes, you can create an account and build a full resume for free, including AI-generated summaries and ATS match scoring.',
  },
  {
    q: 'What is an ATS match score?',
    a: 'Applicant Tracking Systems (ATS) scan resumes for keywords before a human ever sees them. Our ATS match score compares your resume against a job description and tells you which keywords are missing, so you can pass the initial screen.',
  },
  {
    q: 'Can I download my resume as a PDF?',
    a: 'Yes, every resume can be exported as a print-ready PDF in any of our available templates, formatted for both ATS software and human readers.',
  },
  {
    q: 'Does ResumeAI write my resume for me?',
    a: 'ResumeAI drafts professional summaries, rewrites your bullet points to be more achievement-focused, and suggests relevant skills, but you stay in full control of your content.',
  },
  {
    q: 'Can I use ResumeAI to write a cover letter too?',
    a: 'Yes, the built-in Cover Letter Generator creates a tailored cover letter based on your resume and the specific role and company you are applying to.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-paper py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <span className="font-mono text-xs tracking-wide text-emerald bg-emerald-dim px-3 py-1 rounded-full mb-4 inline-block">
            FAQ
          </span>
          <h2 className="font-display text-3xl font-semibold text-ink">Common questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border border-slate/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink text-sm">{faq.q}</span>
                  <ChevronDown
                    size={17}
                    className={`text-slate shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-slate text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
