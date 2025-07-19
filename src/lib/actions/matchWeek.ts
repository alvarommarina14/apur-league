export async function createMatchWeekAction() {
    return await fetch('/api/match-week', {
        method: 'POST',
    });
}
