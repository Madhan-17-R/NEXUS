import type { Metadata } from 'next';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact — SkillForge Platform',
  description: 'Get in touch with the SkillForge team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Contact Us</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-4">Get in touch</h2>
              <p className="text-slate-500 leading-relaxed">
                Whether you&apos;re an innovator looking for support, an organization interested in
                partnership, or a funding body wanting to connect — we&apos;re here to help.
              </p>
            </div>

            {[
              { icon: Mail, label: 'Email', value: 'hello@skillforge.io', href: 'mailto:hello@skillforge.io' },
              { icon: MessageSquare, label: 'Support', value: 'support@skillforge.io', href: 'mailto:support@skillforge.io' },
              { icon: MapPin, label: 'Location', value: 'Innovation Hub, India', href: '#' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">{item.label}</p>
                    <a href={item.href} className="text-sm font-semibold text-[#0F172A] hover:text-emerald-600 transition-colors">
                      {item.value}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#0F172A] mb-6">Send a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 text-slate-800 font-medium resize-none"
                />
              </div>
              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
