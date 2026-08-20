import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillForge — The Innovation Platform',
  description:
    'An integrated digital platform connecting innovators, talented individuals, organizations and funding bodies to transform ideas into meaningful opportunities and real-world impact.',
  keywords: ['innovation', 'collaboration', 'funding', 'grants', 'talent', 'startups', 'technology'],
  openGraph: {
    title: 'SkillForge — The Innovation Platform',
    description: 'Connecting Ideas, Talent, Organizations and Funding.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A]">{children}</body>
    </html>
  );
}
