import { AuthProvider } from '@/context/talent/AuthContext';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans bg-[#F9FAFB] text-slate-900 min-h-screen">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
