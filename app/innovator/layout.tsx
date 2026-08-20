import { AppProvider } from '@/context/innovator/AppContext';
import MainLayout from '@/components/innovator/layout/MainLayout';

export default function InnovatorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <MainLayout>{children}</MainLayout>
    </AppProvider>
  );
}

