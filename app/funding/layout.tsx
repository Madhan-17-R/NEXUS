import type { Metadata } from "next";
import { FundingOrgProvider } from "@/context/funding/FundingOrgContext";
import { ReviewsProvider } from "@/context/funding/ReviewsContext";

import { MessagesProvider } from "@/context/funding/MessagesContext";
import { NotificationsProvider } from "@/context/funding/NotificationsContext";
import { AlertProvider } from "@/context/funding/AlertContext";
import { GlobalErrorBoundary } from "@/components/funding/ui/GlobalErrorBoundary";

export const metadata: Metadata = {
  title: "Funding Organization Dashboard | SkillForge Platform",
  description:
    "Enterprise dashboard for funding organizations to create grants, evaluate applications, and monitor direct pitches.",
};

export default function FundingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-50 text-surface-900 min-h-screen">
      <GlobalErrorBoundary>
        <AlertProvider>
          <FundingOrgProvider>
            <ReviewsProvider>
              <NotificationsProvider>
                <MessagesProvider>
                    {children}
                </MessagesProvider>
              </NotificationsProvider>
            </ReviewsProvider>
          </FundingOrgProvider>
        </AlertProvider>
      </GlobalErrorBoundary>
    </div>
  );
}
