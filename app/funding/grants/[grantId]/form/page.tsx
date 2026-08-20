import { FormsProvider } from "@/context/funding/FormsContext";
import { FormBuilderLayout } from "@/components/funding/formbuilder/FormBuilderLayout";

export default function GrantFormBuilderPage({ params }: { params: { grantId: string } }) {
  // Pass the grantId as the ownerId
  return (
    <FormsProvider>
      <FormBuilderLayout 
        ownerType="grant" 
        ownerId={params.grantId} 
        grantTitle="Grant" 
      />
    </FormsProvider>
  );
}
