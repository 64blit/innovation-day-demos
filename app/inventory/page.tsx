import ClientOnlyProps from "@/components/ClientOnlyProps";
import Demo from "@/components/Demo";
import { Suspense } from "react";

const InventoryDemo = () =>
{
  const stepDescriptions = [
    {
      headline: "You are an inventory tracker",
      description:
        "You have been tasked with tracking inventory.",
    },
    {
      headline: "Track Inventory",
      description: "All inventory.",
    },
    {
      headline: "Snap a photo",
      description:
        "When you are ready, take a photo and EyePop.ai will count and identify inventory.",
    },
  ];

  return (
    <ClientOnlyProps>
      <Suspense fallback={<div>Loading...</div>}>
        <Demo
          title="Inventory"
          description="Use your phone's camera to track inventory."
          desiredObject="cans"
          desiredObjectTitle="inventory management"
          stepDescriptions={stepDescriptions}
        />
      </Suspense>
    </ClientOnlyProps>
  );
};

export default InventoryDemo;
