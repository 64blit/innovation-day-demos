import ClientOnlyProps from "@/components/ClientOnlyProps";
import Demo from "@/components/Demo";
import { Suspense } from "react";

const RapidMedicalDemo = () => {
  const stepDescriptions = [
    {
      headline: "You are a Rapid Medical gig worker",
      description:
        "You have been tasked with picking up medical sample bags from a local clinic's lockbox.",
    },
    {
      headline: "Arrange bags on the table",
      description: "Remove any overlapping of sample bags.",
    },
    {
      headline: "Snap a photo",
      description:
        "When you are ready, take a photo and EyePop.ai will count and identify samples.",
    },
  ];

  return (
    <ClientOnlyProps>
      <Suspense fallback={<div>Loading...</div>}>
        <Demo
          title="Rapid Medical"
          description="Use your phone's camera to find and count medical sample bags in real-time."
          desiredObject="laptop"
          desiredObjectTitle="medical sample"
          stepDescriptions={stepDescriptions}
        />
      </Suspense>
    </ClientOnlyProps>
  );
};

export default RapidMedicalDemo;
