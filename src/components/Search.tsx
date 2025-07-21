interface SearchPropsType {
    placeholder?: string;
    value: string;
    setValue: (newValue: string) => void;
}

export default function Search({
    placeholder = 'Buscar...',
    value,
    setValue,
}: SearchPropsType) {
    return (
        <>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-white px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-apur-green w-full xl:min-w-56"
            />
        </>
    );
}
