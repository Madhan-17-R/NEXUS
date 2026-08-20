import type { Metadata } from 'next';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Zap, Users, Globe, Award, Target, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — SkillForge Platform',
  description: 'Learn about SkillForge, the integrated platform connecting innovators, talent, organizations and funding bodies.',
};

const values = [
  { icon: Zap, title: 'Innovation First', desc: 'We believe every idea deserves a platform to grow.', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Users, title: 'Collaboration', desc: 'Great things happen when the right people connect.', color: 'bg-blue-100 text-blue-700' },
  { icon: Globe, title: 'Inclusivity', desc: 'Open to innovators, students, organizations worldwide.', color: 'bg-violet-100 text-violet-700' },
  { icon: Award, title: 'Excellence', desc: 'We uphold quality in every interaction and feature.', color: 'bg-amber-100 text-amber-700' },
  { icon: Target, title: 'Impact', desc: 'Every connection should translate into real-world value.', color: 'bg-pink-100 text-pink-700' },
  { icon: Heart, title: 'Community', desc: 'We grow together as a thriving innovation ecosystem.', color: 'bg-teal-100 text-teal-700' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4 text-center">
        <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-black uppercase tracking-widest rounded-full mb-4">
          About SkillForge
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          One Platform.<br />Infinite Possibilities.
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-base leading-relaxed">
          SkillForge was built with a single vision: to create a seamless digital ecosystem where innovators,
          talent, organizations and funding bodies can discover each other and work together to create
          transformative impact.
        </p>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-6">Our Mission</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            To bridge the gap between raw innovation and real-world opportunity by providing a unified,
            role-based platform that empowers every participant in the innovation ecosystem — from the
            first-time student building their portfolio to the established funding organization seeking
            the next breakthrough.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">Our Values</h2>
            <p className="text-slate-500">The principles that guide everything we build.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className={`w-10 h-10 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-[#0F172A] mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
