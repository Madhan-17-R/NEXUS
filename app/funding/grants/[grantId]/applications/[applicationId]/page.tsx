import { ApplicationsProvider } from "@/context/funding/ApplicationsContext";
import { ApplicationDetailLayout } from "@/components/funding/applications/ApplicationDetailLayout";

export default function ApplicationDetailPage({ params }: { params: { grantId: string; applicationId: string } }) {
  return (
    <ApplicationsProvider>
      <ApplicationDetailLayout appId={params.applicationId} />
    </ApplicationsProvider>
  );
}
