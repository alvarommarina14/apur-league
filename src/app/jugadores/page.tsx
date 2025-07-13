import players from '@/seed/players.json';

export default function Jugadores() {
    return (
        <div className="px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">
                    Listado de Jugadores
                </h1>
                <p className="text-center text-neutral-500 text-sm mt-2">
                    Todas las inscripciones activas de la liga
                </p>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm mt-8">
                    <table className="min-w-full text-sm text-neutral-800 table-fixed">
                        <thead>
                            <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide">
                                <th className="w-1/3 px-6 py-4 text-left rounded-tl-2xl">
                                    Apellido
                                </th>
                                <th className="w-1/3 px-6 py-4 text-left">
                                    Nombre
                                </th>
                                <th className="w-1/3 px-6 py-4 text-left rounded-tr-2xl">
                                    Categoría
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.flatMap((player: any) =>
                                player.playerCategories.map(
                                    (cat: any, i: number) => (
                                        <tr
                                            key={`${player.id}-${i}`}
                                            className="transition-colors duration-200 hover:bg-apur-lightGreen border-b border-neutral-100 last:border-b-0"
                                        >
                                            <td className="px-6 py-4 font-medium text-neutral-900 truncate">
                                                {player.lastName}
                                            </td>
                                            <td className="px-6 py-4 truncate">
                                                {player.firstName}
                                            </td>
                                            <td className="px-6 py-4 truncate">
                                                {cat.category.name}
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
