interface CategoryTagProp {
    category?: string;
}

export default function CategoryTag({
    category = 'Sin categoria',
}: CategoryTagProp) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium border w-fit ${category.includes('Dobles') ? 'bg-blue-100 text-blue-800 border border-blue-400' : category === 'Sin categoria' ? 'bg-red-100 text-red-800 border border-red-400' : 'bg-yellow-100 text-yellow-800 border-apur-yellow'}  truncate`}
        >
            {category}
        </span>
    );
}
