import { AppLayout } from "@/components/organization/layout/AppLayout";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
