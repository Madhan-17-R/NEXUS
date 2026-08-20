import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import RoleCards from '@/components/home/RoleCards';
import HowItWorks from '@/components/home/HowItWorks';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <RoleCards />
      <HowItWorks />
      <Footer />
    </main>
  );
}
