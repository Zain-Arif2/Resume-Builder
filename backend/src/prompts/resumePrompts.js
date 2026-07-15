export const resumePrompts = {
  professionalSummary({ role, experienceSummary, tone = 'professional' }) {
    return `Write a concise, ${tone} professional summary (3-4 sentences) for a resume, for someone targeting a "${role}" role. Base it on this background: ${experienceSummary}. Do not use generic filler phrases. Return only the summary text, no heading.`;
  },

  improveExperience({ position, company, bullets }) {
    return `Rewrite the following resume bullet points for a "${position}" role at "${company}" so they are achievement-oriented, use strong action verbs, and quantify impact where reasonable. Keep each bullet under 20 words. Return only the rewritten bullet points, one per line, no numbering.

Original bullets:
${bullets.join('\n')}`;
  },

  improveProjects({ title, description }) {
    return `Rewrite this project description for a resume so it highlights impact and technical depth in 2-3 concise bullet points. Return only the bullet points, one per line.

Project: ${title}
Description: ${description}`;
  },

  improveSkills({ role, currentSkills }) {
    return `Given a target role of "${role}" and this current skills list: ${currentSkills.join(', ')}, suggest an improved, well-organized list of 10-15 relevant skills (mix of technical and soft skills where appropriate). Return only a comma-separated list.`;
  },

  coverLetter({ role, company, resumeSummary }) {
    return `Write a concise, professional cover letter (3 short paragraphs) for a "${role}" position at "${company}". Base it on this candidate background: ${resumeSummary}. Do not include a header or signature block, just the body text.`;
  },

  atsAnalysis({ resumeText, jobDescription }) {
    return `Compare this resume against the job description and return a JSON object only (no markdown, no explanation) with this exact shape: {"matchScore": number (0-100), "matchedKeywords": string[], "missingKeywords": string[], "suggestions": string[]}.

Resume:
${resumeText}

Job Description:
${jobDescription}`;
  },

  generalAtsScore({ resumeText }) {
    return `You are an ATS (Applicant Tracking System) and resume-quality expert. Evaluate the resume below on general ATS-friendliness and overall quality, independent of any specific job posting. Consider: use of quantifiable achievements, strong action verbs, clarity and conciseness, presence of key sections (summary, experience, education, skills), absence of vague/generic language, and appropriate keyword density for the apparent target role.

Return a JSON object only (no markdown, no explanation) with this exact shape:
{"score": number (0-100), "strengths": string[] (2-4 short items), "issues": string[] (2-5 short items describing what is weak), "suggestions": string[] (3-6 specific, actionable improvements)}.

Resume:
${resumeText}`;
  },

  grammarImprovement({ text }) {
    return `Correct any grammar, spelling, and clarity issues in the following resume text. Keep the meaning and tone intact. Return only the corrected text.

Text:
${text}`;
  },

  interviewQuestions({ role, resumeSummary }) {
    return `Generate 8 likely interview questions for a candidate applying to a "${role}" role, based on this background: ${resumeSummary}. Return only a numbered list of questions.`;
  },

  careerSuggestions({ currentRole, skills }) {
    return `Given a current role of "${currentRole}" and these skills: ${skills.join(', ')}, suggest 5 realistic next-step career paths with a one-sentence rationale for each. Return only a numbered list.`;
  },
};
