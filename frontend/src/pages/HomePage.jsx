import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <CTASection />
      <Footer />
    </div>
  );
}
