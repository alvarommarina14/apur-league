export async function createMatchDayAction(data: {
    matchWeekId: number;
    date: string;
}) {
    return await fetch(`/api/match-day`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function deleteMatchDayAction(id: string) {
    return await fetch(`/api/match-day/${id}`, {
        method: 'DELETE',
    });
}
