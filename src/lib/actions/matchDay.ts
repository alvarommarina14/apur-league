export async function deleteMatchDayAction(id: string) {
    return await fetch(`/api/match-day/${id}`, {
        method: 'DELETE',
    });
}
