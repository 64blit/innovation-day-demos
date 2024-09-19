'use client'

import
{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import Dots from "./ui/Dots";

interface StepDescription
{
    headline: string;
    description: string;
}

interface InstructionModalProps
{
    onModalClose: () => void;
    stepDescriptions: StepDescription[];
}

const InstructionModal = ({ onModalClose, stepDescriptions }: InstructionModalProps) =>
{
    const [ isModalOpen, setIsModalOpen ] = useState(true);
    const [ step, setStep ] = useState(0);

    const handleClose = () =>
    {
        setIsModalOpen(false);
        if (onModalClose)
        {
            onModalClose();
        }
    };

    const handleNextStep = () =>
    {
        setStep(prevStep => prevStep + 1);
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="w-full h-full bg-white items-center flex h-full flex-col justify-center">
                <DialogHeader>
                    <DialogDescription className="text-black flex flex-col h-full gap-6">
                        <h1 className="text-4xl font-semibold mt-16">
                            {stepDescriptions[ step ].headline}
                        </h1>
                        <p className="text-lg my-3">
                            {stepDescriptions[ step ].description}
                        </p>

                        <Dots step={step} />

                        {step < stepDescriptions.length - 1 && (
                            <Button
                                className="bg-eyepop w-full font-bold text-md h-12"
                                onClick={handleNextStep}
                            >
                                Next
                            </Button>
                        )}

                        {step === stepDescriptions.length - 1 && (
                            <DialogClose asChild className="w-full h-12 mt-4">
                                <Button type="button" className="bg-eyepop w-full font-bold text-md h-12">
                                    Go To My Camera
                                </Button>
                            </DialogClose>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default InstructionModal;
