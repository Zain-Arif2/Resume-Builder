import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'ResumeAI — AI Resume Builder & ATS Match Checker',
  description = 'Build an ATS-optimized resume with AI. Generate summaries, rewrite bullet points, check your job match score, and export a polished PDF in minutes.',
  path = '/',
}) {
  const url = `https://resumeai.com${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
