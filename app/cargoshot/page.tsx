import ClientOnlyProps from "@/components/ClientOnlyProps";
import Demo from "@/components/Demo";
import { Suspense } from "react";

export default function CargoShotDemo() {
  const stepDescriptions = [
    {
      headline: "You are a warehouse employee",
      description:
        "You have been tasked with documenting cargo coming through your warehouse.",
    },
    {
      headline: "Measure the cargo",
      description: "Use your phone to measure the cargo.",
    },
    {
      headline: "Snap a photo",
      description:
        "When you have lined up the outline with the cargo, take a picture and EyePop.ai will measure the palette and identify the cargo.",
    },
  ];

  return (
    <ClientOnlyProps>
      <Suspense fallback={<div>Loading...</div>}>
        <Demo
          title="CargoShot"
          description="Use your phone's camera to measure cargo in real-time."
          desiredObject="laptop"
          desiredObjectTitle="box"
          stepDescriptions={stepDescriptions}
        />
      </Suspense>
    </ClientOnlyProps>
  );
}
