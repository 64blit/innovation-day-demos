'use client'

import EmailFormModal from "@/components/EmailFormModal"
import InstructionModal from "@/components/InstructionModal"
import RapidMedicalCamera from "@/components/RapidMedicalCamera"
import { useState } from "react"
import ThankYouPage from "@/components/ThankYouPage"
import CargoShotCamera from "./CargoShotCamera"

interface StepDescription {
    headline: string;
    description: string;
}

interface DemoProps {
    title: string;
    description: string;
    stepDescriptions: StepDescription[];
    desiredObject: string;
    desiredObjectTitle: string;
}

export default function Demo({title, description, stepDescriptions, desiredObject, desiredObjectTitle}: DemoProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [isThankYouPageOpen, setIsThankYouPageOpen] = useState(false);

  const onEmailFormModalClose = () => {
    setIsInstructionModalOpen(true);
  }

  const onInstructionModalClose = () => {
    setIsInstructionModalOpen(false);
    setIsCameraOpen(true);
  }

  const goBackToInstructions = () => {
    setIsCameraOpen(false);
    setIsInstructionModalOpen(true);
  }

  const goToThankYouPage = () => {
    setIsCameraOpen(false);
    setIsThankYouPageOpen(true);
  }

  const goBackToCamera = () => {
    setIsThankYouPageOpen(false);
    setIsCameraOpen(true);
  }

  return(
    <div className="h-[100svh]">
    
      <EmailFormModal onModalClose={onEmailFormModalClose} title={title} description={description}/>
      {isInstructionModalOpen && <InstructionModal onModalClose={onInstructionModalClose} stepDescriptions={stepDescriptions}/>}
      
      {title ===  "Rapid Medical" && isCameraOpen &&
      <RapidMedicalCamera goBackToInstructions={goBackToInstructions} goToThankYouPage={goToThankYouPage}
      />}

      {title === "CargoShot" && isCameraOpen &&
      <CargoShotCamera goBackToInstructions={goBackToInstructions} goToThankYouPage={goToThankYouPage} />}
      
      {isThankYouPageOpen && <ThankYouPage goBackToCamera={goBackToCamera} title={title}/>}
    
    </div>
  )
}
