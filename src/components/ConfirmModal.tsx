import { X } from 'lucide-react';

type ConfirmModalProps = {
    entity: string;
    entityItem: string;
    onClose: () => void;
    onTrigger: () => void;
};

export default function ConfirmModal({
    entity,
    entityItem,
    onClose,
    onTrigger,
}: ConfirmModalProps) {
    return (
        <>
            <div className="text-sm p-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-semibold">Eliminar {entityItem}</h3>
                <button type="button" onClick={onClose}>
                    <X className="h-7 w-7 p-1 hover:bg-neutral-200 rounded-full cursor-pointer" />
                </button>
            </div>
            <p className="text-sm p-4">
                Estas seguro de que desea eliminar {entity}{' '}
                <span className="font-bold text-xs">{entityItem}</span>? Esto no
                se puede deshacer.
            </p>
            <div className="p-4 border-t border-neutral-200 flex justify-end gap-4 text-sm">
                <button
                    type="button"
                    className="text-neutral-700 font-semibold shadow-md p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-100 cursor-pointer"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="shadow-md p-2 rounded-md bg-red-700 hover:bg-red-800 text-white font-semibold cursor-pointer"
                    onClick={onTrigger}
                >
                    Eliminar
                </button>
            </div>
        </>
    );
}
