export default function ErrorMessage({ title, text }: { title: string; text: string }) {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 bg-gray-50">
            <h1 className="text-3xl font-semibold text-gray-700 mb-4">{title}</h1>
            <p className="text-gray-500 max-w-md text-center">{text}</p>
        </div>
    );
}
