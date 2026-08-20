import { DirectPitchesProvider } from "@/context/funding/DirectPitchesContext";
import { PitchDetailLayout } from "@/components/funding/directpitches/PitchDetailLayout";

export default function PitchDetailPage({ params }: { params: { pitchId: string } }) {
  return (
    <DirectPitchesProvider>
      <PitchDetailLayout pitchId={params.pitchId} />
    </DirectPitchesProvider>
  );
}
