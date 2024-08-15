import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface InstructionModalProps {
    onModalClose?: () => void;
}

export default function InstructionModal({ onModalClose }: InstructionModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleClose = () => {
        setIsModalOpen(false);
        if (onModalClose) {
            onModalClose();
        }
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[90vw] bg-white">
                <DialogHeader>
                    <DialogTitle>Instructions</DialogTitle>
                    <DialogDescription>
                        <p className="text-lg">
                            You are a gig worker.<br/>Arrange bags on the table and snap a photo.
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
