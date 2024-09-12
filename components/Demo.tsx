'use client'

import EmailFormModal from "@/components/EmailFormModal"
import InstructionModal from "@/components/InstructionModal"
import RapidMedicalCamera from "@/components/RapidMedicalCamera"
import { Suspense, useEffect, useState } from "react"
import ThankYouPage from "@/components/ThankYouPage"
import CargoShotCamera from "./CargoShotCamera"
import ClientOnlyProps from "./ClientOnlyProps"
import FailPage from "./FailPage"
import { set } from "react-hook-form"

interface StepDescription
{
  headline: string;
  description: string;
}

interface DemoProps
{
  title: string;
  description: string;
  stepDescriptions: StepDescription[];
  desiredObject: string;
  desiredObjectTitle: string;
}

export default function Demo({ title, description, stepDescriptions, desiredObject, desiredObjectTitle }: DemoProps)
{
  const [ isCameraOpen, setIsCameraOpen ] = useState(false);
  const [ isInstructionModalOpen, setIsInstructionModalOpen ] = useState(false);
  const [ isThankYouPageOpen, setIsThankYouPageOpen ] = useState(false);
  const [ isFailPageOpen, setIsFailPageOpen ] = useState(false);

  const onEmailFormModalClose = () =>
  {
    setIsInstructionModalOpen(true);
  }

  const onInstructionModalClose = () =>
  {
    setIsInstructionModalOpen(false);
    setIsCameraOpen(true);
  }

  const goBackToInstructions = () =>
  {
    setIsCameraOpen(false);
    setIsInstructionModalOpen(true);
  }

  const goToThankYouPage = () =>
  {
    setIsCameraOpen(false);
    setIsThankYouPageOpen(true);
    setIsFailPageOpen(false);
  }

  const goBackToCamera = () =>
  {
    setIsThankYouPageOpen(false);
    setIsCameraOpen(true);
  }

  const gotToFailPage = () =>
  {
    setIsCameraOpen(true);
    setIsThankYouPageOpen(false);
    setIsFailPageOpen(true);
  }

  return (
    <ClientOnlyProps >
      <Suspense fallback={<div>Loading...</div>}>
        <div className="h-[100svh]">

          <EmailFormModal onModalClose={onEmailFormModalClose} title={title} description={description} />


          {isInstructionModalOpen &&
            <InstructionModal onModalClose={onInstructionModalClose} stepDescriptions={stepDescriptions} />}


          {title === "CargoShot" && isCameraOpen &&
            <CargoShotCamera goBackToInstructions={goBackToInstructions} goToThankYouPage={goToThankYouPage} />}

          {isFailPageOpen && <FailPage goToThankYouPage={goToThankYouPage} />}

          {title === "Rapid Medical" && isCameraOpen &&
            <RapidMedicalCamera goBackToInstructions={goBackToInstructions} goToThankYouPage={goToThankYouPage} gotToFailPage={gotToFailPage}
            />
          }
          {isThankYouPageOpen && <ThankYouPage goBackToCamera={goBackToCamera} title={title} />}



        </div>
      </Suspense>
    </ClientOnlyProps>
  )
}
