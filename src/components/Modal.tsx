type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-20"
                onClick={onClose}
            />
            <div
                className="m-4 relative bg-white rounded-xl shadow-lg max-w-lg w-full z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
