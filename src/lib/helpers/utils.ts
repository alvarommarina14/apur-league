import { TeamType } from '@/types/team';

import { PlayersMatchStatsType } from '@/types/stats';
export function getPaginationPages(currentPage: number, totalPages: number, maxPagesToShow = 5): (number | 'dots')[] {
    const pages: (number | 'dots')[] = [];

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    const half = Math.floor(maxPagesToShow / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start <= 1) {
        start = 1;
        end = maxPagesToShow;
    }

    if (end >= totalPages) {
        start = totalPages - maxPagesToShow + 1;
        end = totalPages;
    }

    pages.push(1);
    if (start > 2) {
        pages.push('dots');
    }

    for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
            pages.push(i);
        }
    }

    if (end < totalPages - 1) {
        pages.push('dots');
    }
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}

export function mapOptions<T>(
    items: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    includeAllOption = false,
    allLabel = 'Todas'
) {
    const mapped = items.map((item) => ({
        value: getValue(item),
        label: getLabel(item),
    }));

    if (includeAllOption) {
        return [{ value: '', label: allLabel }, ...mapped];
    }

    return mapped;
}

export function getSelectedOption(options: { value: string; label: string }[], selectedValue: string | null) {
    return options.find((o) => o.value === selectedValue) ?? null;
}

export function buildQueryParams(params: Record<string, string | undefined>) {
    const query = new URLSearchParams();
    for (const key in params) {
        const value = params[key];
        if (value) query.set(key, value);
    }
    return query.toString();
}

export function parseResultToMatrix(result: string, winnerTeam?: string): string[][] {
    const sets = result?.split(' ') ?? [];
    const matrix = sets.map((s) => {
        const [raw1 = '', raw2 = ''] = s.split('/');
        const [s1, s2] = winnerTeam === 'EQUIPO_2' ? [raw2, raw1] : [raw1, raw2];
        return [s1, s2];
    });

    return matrix.length === 3 ? matrix : [...matrix, ...Array(3 - matrix.length).fill(['', ''])];
}

export function formatMatrixToResult(matrix: string[][], winnerTeam?: string): string {
    return matrix.map(([t1, t2]) => (winnerTeam === 'EQUIPO_2' ? `${t2}/${t1}` : `${t1}/${t2}`)).join(' ');
}

export const isSameScore = (a: string[][], b: string[][]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((set, i) => set[0] === b[i][0] && set[1] === b[i][1]);
};

export function determineWinner(scoreMatrix: string[][]): TeamType {
    let winsTeam1 = 0;
    let winsTeam2 = 0;

    for (const [a, b] of scoreMatrix) {
        const score1 = parseInt(a);
        const score2 = parseInt(b);

        if (isNaN(score1) || isNaN(score2)) continue;

        if (score1 > score2) winsTeam1++;
        else winsTeam2++;
    }

    return winsTeam1 > winsTeam2 ? 'EQUIPO_1' : 'EQUIPO_2';
}

export function getPlayersMatchStats(result: string): PlayersMatchStatsType {
    const sets = result.trim().split(' ');
    let p1Sets = 0;
    let p2Sets = 0;
    let p1Games = 0;
    let p2Games = 0;
    const stats = {
        winnerGames: 0,
        winnerSets: 0,
        loserGames: 0,
        loserSets: 0,
    };
    sets.forEach((set, index) => {
        const [p1Str, p2Str] = set.split('/');
        const p1 = Number(p1Str);
        const p2 = Number(p2Str);

        const isSuperTiebreak = index === 2;

        if (p1 > p2) {
            if (isSuperTiebreak) {
                p1Sets++;
                p1Games += 1;
            } else {
                p1Sets++;
                p1Games += p1;
                p2Games += p2;
            }
        } else {
            if (isSuperTiebreak) {
                p2Sets++;
                p2Games += 1;
            } else {
                p2Sets++;
                p1Games += p1;
                p2Games += p2;
            }
        }
    });

    if (p1Sets === 2) {
        stats.winnerSets = 2;
        stats.winnerGames = p1Games;
        stats.loserSets = p2Sets;
        stats.loserGames = p2Games;
    } else if (p2Sets === 2) {
        stats.winnerSets = 2;
        stats.winnerGames = p2Games;
        stats.loserSets = p1Sets;
        stats.loserGames = p1Games;
    }

    return stats;
}

export function isScoreValid(setIndex: number, teamIndex: number, score: string[][]) {
    const valueStr = score[setIndex]?.[teamIndex];
    const value = valueStr === '' ? undefined : parseInt(valueStr, 10);
    const opponentValueStr = score[setIndex]?.[1 - teamIndex] ?? '0';
    const opponentValue = opponentValueStr === '' ? 0 : parseInt(opponentValueStr, 10);

    if (value === undefined) return true;

    if (setIndex < 2) {
        // invalid set values
        if (value < 0 || value > 7) return false;
        if (opponentValue < 0 || opponentValue > 7) return false;

        // validate set values for 7 games sets
        if (value === 7) {
            return opponentValue === 5 || opponentValue === 6 || opponentValue === 0;
        }
        if (opponentValue === 7) {
            return value === 5 || value === 6;
        }

        // validate set values for 6 games sets
        if (value === 6 && opponentValue < 5) return true;
        if (opponentValue === 6 && value < 5) return true;

        return false;
    } else {
        const nonEmptySets = score.filter((set) => set[0] !== '' && set[1] !== '');

        if (nonEmptySets.length >= 2) {
            const firstTwoSets = nonEmptySets.slice(0, 2);
            const team1Wins = firstTwoSets.filter((set) => {
                const team1Score = set[0] === '' ? 0 : parseInt(set[0]);
                const team2Score = set[1] === '' ? 0 : parseInt(set[1]);
                return team1Score > team2Score;
            }).length;

            const team2Wins = 2 - team1Wins;

            if ((team1Wins === 2 || team2Wins === 2) && nonEmptySets.length > 2) {
                return false;
            }
            if (value === 10 && value - opponentValue >= 2) {
                return true;
            }
            if (opponentValue === 10 && opponentValue - value >= 2) {
                return true;
            }
            if (value > 10 && value - opponentValue == 2) {
                return true;
            }
            if (opponentValue > 10 && opponentValue - value == 2) {
                return true;
            }

            return false;
        }
    }
}

export function validateScore(score: string[][]) {
    for (let setIndex = 0; setIndex < score.length; setIndex++) {
        for (let teamIndex = 0; teamIndex < score[setIndex].length; teamIndex++) {
            if (!isScoreValid(setIndex, teamIndex, score)) {
                return {
                    isValid: false,
                    message: 'Resultado invalido',
                };
            }
        }
    }

    const nonEmptySets = score.filter((set) => set[0] !== '' && set[1] !== '');

    if (nonEmptySets.length < 2)
        return {
            isValid: false,
            message: 'Resultado invalido',
        };

    if (nonEmptySets.length >= 2) {
        const firstTwoSets = nonEmptySets.slice(0, 2);
        const team1Wins = firstTwoSets.filter((set) => {
            const team1Score = set[0] === '' ? 0 : parseInt(set[0]);
            const team2Score = set[1] === '' ? 0 : parseInt(set[1]);
            return team1Score > team2Score;
        }).length;

        const team2Wins = 2 - team1Wins;

        if ((team1Wins === 2 || team2Wins === 2) && nonEmptySets.length > 2) {
            return {
                isValid: false,
                message: 'No se puede añadir supertiebreak si ya hay un ganador',
            };
        }
        if (team1Wins === 1 && team2Wins === 1 && nonEmptySets.length === 2) {
            return {
                isValid: false,
                message: 'Añade un ganador al supertiebreak antes de guardar',
            };
        }
    }

    return {
        isValid: true,
        message: '',
    };
}

export function hourToDefaultUTCDate(hour: string): Date {
    const [hours, minutes] = hour.split(':').map(Number);
    const date = new Date(0);
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}
