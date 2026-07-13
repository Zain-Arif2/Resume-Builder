import SEO from '@/components/common/SEO';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import TemplatesShowcase from '@/components/home/TemplatesShowcase';
import HowItWorks from '@/components/home/HowItWorks';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <SEO
        title="ResumeAI — AI Resume Builder & ATS Match Checker"
        description="Build an ATS-optimized resume with AI. Generate summaries, rewrite bullet points, check your job match score, and export a polished PDF in minutes."
        path="/"
      />
      <Navbar />
      <Hero />
      <FeatureGrid />
      <TemplatesShowcase />
      <HowItWorks />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
