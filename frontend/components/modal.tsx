import React from "react";

type ModalProps = {
    message: string;
    onClose: () => void;
};

export default function Modal({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                <div className="text-center">
                    <p className="text-lg font-medium mb-4">{message}</p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
