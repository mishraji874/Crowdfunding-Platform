'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./dialog"
import { Button } from "./button"

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const AlertModal = ({ isOpen, onClose, title, message }: AlertModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-primary">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="py-4 text-base leading-6 text-gray-600 dark:text-gray-300">
                    {message}
                </DialogDescription>

                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-600 text-white transition-all duration-200"
                    >
                        Got it
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AlertModal
