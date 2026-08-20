import { AppProvider } from '@/context/innovator/AppContext';
import { Toast } from '@/components/innovator/ui';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-800 flex items-center justify-center p-4">
        {children}
      </div>
    </AppProvider>
  );
}
