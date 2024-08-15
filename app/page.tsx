'use client'

import EmailFormModal from "@/components/EmailFormModal"
import InstructionModal from "@/components/InstructionModal"
import Camera from "@/components/Camera"
import { useState } from "react"

export default function Home() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);

  const onEmailFormModalClose = () => {
    setIsInstructionModalOpen(true);
  }

  const onInstructionModalClose = () => {
    setIsInstructionModalOpen(false);
    setIsCameraOpen(true);
  }

  return(
    <div className="h-[100svh]">
    <EmailFormModal onModalClose={onEmailFormModalClose}/>
    {isInstructionModalOpen && <InstructionModal onModalClose={onInstructionModalClose}/>}
    {isCameraOpen && <Camera/>}
    </div>
  )
}
