import type { Metadata } from 'next';
import Navbar from '@/components/home/Navbar';
import HowItWorks from '@/components/home/HowItWorks';
import Footer from '@/components/home/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works — SkillForge Platform',
  description: 'Learn how SkillForge connects innovators, talent, organizations and funding bodies.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">How SkillForge Works</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Four steps to connect, collaborate and create real-world impact on our unified platform.
        </p>
      </section>

      <HowItWorks />

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">Ready to get started?</h2>
        <p className="text-slate-500 mb-8">Join the SkillForge ecosystem today.</p>
        <Link
          href="/#roles"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold transition-all shadow-md"
        >
          Choose Your Role
        </Link>
      </section>

      <Footer />
    </div>
  );
}
