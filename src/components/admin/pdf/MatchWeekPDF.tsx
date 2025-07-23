import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { MatchDayWithMatchesType } from '@/types/matchDay';
import { format } from '@formkit/tempo';
import { PlayerMatchWithPlayersType } from '@/types/playerMatch';
import { MatchUpdateResultType } from '@/types/matches';
import { ClubWithCourtsType } from '@/types/club';
import { Fragment } from 'react';

const clubColors = {
    APUR: {
        primary: '#D9EAD3',
        secondary: '#e8f5f1',
    },
    PALOS_VERDES: {
        primary: '#FCE5CD',
        secondary: '#fff5e8',
    },
    TALLERES: {
        primary: '#C9DAF8',
        secondary: '#e8f1f5',
    },
};

const styles = StyleSheet.create({
    page: {
        orientation: 'landscape',
        padding: 40,
    },
    header: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateHeader: {
        fontSize: 16,
        marginBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        borderBottomWidth: 0,
        borderColor: '#000',
    },
    tableRowHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        minHeight: 100,
        maxHeight: 130,
        pageBreakInside: 'avoid',
    },
    tableHeader: {
        borderTopWidth: 1,
        fontWeight: 'semibold',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: '#000',
    },
    lastCell: {
        flex: 1,
        padding: 5,
        borderColor: '#000',
        borderRightWidth: 1,
    },
    timeCell: {
        flex: 0.5,
        padding: 5,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        fontSize: 12,
    },
    rightCell: {
        borderRightWidth: 1,
    },
    playersContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    teamText: {
        fontSize: 10,
        textAlign: 'center',
    },
    vsText: {
        fontSize: 12,
        textAlign: 'center',
    },
    noMatches: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

interface Props {
    apurMatches: MatchDayWithMatchesType[];
    palosVerdesMatches: MatchDayWithMatchesType[];
    talleresMatches: MatchDayWithMatchesType[];
    clubCourts: ClubWithCourtsType[];
}

function renderPlayers(playerMatches: PlayerMatchWithPlayersType[], selectedCategoryId: number) {
    const teams = {
        EQUIPO_1: playerMatches.filter((pm) => pm.team === 'EQUIPO_1'),
        EQUIPO_2: playerMatches.filter((pm) => pm.team === 'EQUIPO_2'),
    };

    const renderPlayerName = (playerMatch: PlayerMatchWithPlayersType) => {
        const stats = playerMatch.player.categoryStats.find((stat) => stat.categoryId === selectedCategoryId);
        const points = stats ? stats.points : 0;
        const matchesPlayed = stats ? stats.matchesPlayed : 0;

        return `[${points}] ${playerMatch.player.firstName} ${playerMatch.player.lastName} (${matchesPlayed})`;
    };

    return (
        <View style={styles.playersContainer}>
            <Text style={[styles.teamText, { marginBottom: 2 }]}>
                {teams.EQUIPO_1.map(renderPlayerName).join(' / ')}
            </Text>
            <Text style={styles.vsText}>vs</Text>
            <Text style={[styles.teamText, { marginTop: 2 }]}>{teams.EQUIPO_2.map(renderPlayerName).join(' / ')}</Text>
        </View>
    );
}

function renderMatchesTable(
    matches: MatchDayWithMatchesType['matches'],
    club: 'APUR' | 'PALOS VERDES' | 'TALLERES',
    clubWithCourts: ClubWithCourtsType[]
) {
    if (matches.length === 0) {
        return <Text style={styles.noMatches}>No hay partidos programados</Text>;
    }

    const colorsKey = club === 'PALOS VERDES' ? 'PALOS_VERDES' : club;

    const matchesByHour: Record<string, Record<string, MatchUpdateResultType>> = {};
    const allCourtsByClub = clubWithCourts.filter((cl) => cl.name == club)[0].courts;
    const allCourts = allCourtsByClub.map((court) => court.name);

    matches.forEach((match) => {
        const time = format({ date: match.hour, format: 'HH:mm', tz: 'UTC' });
        if (!matchesByHour[time]) {
            matchesByHour[time] = {};
        }
        matchesByHour[time][match.court.name] = match;
    });

    const sortedCourts = Array.from(allCourts).sort();
    const sortedTimes = Object.keys(matchesByHour).sort();

    const dynamicStyles = StyleSheet.create({
        clubHeader: {
            backgroundColor: clubColors[colorsKey].primary,
            color: '#000',
            fontSize: 12,
            textAlign: 'center',
        },
        clubCell: {
            backgroundColor: clubColors[colorsKey].primary,
        },
        row: {
            minHeight: 60,
            pageBreakInside: 'avoid',
        },
    });
    return (
        <View style={styles.table}>
            <View style={[styles.tableRowHeader, styles.tableHeader, dynamicStyles.clubHeader]}>
                <View style={styles.timeCell}>
                    <Text>Hora</Text>
                </View>
                {sortedCourts.map((court, index) => (
                    <View key={index} style={index === sortedCourts.length - 1 ? styles.lastCell : styles.tableCell}>
                        <Text>{court}</Text>
                    </View>
                ))}
            </View>

            {sortedTimes.map((time, timeIndex) => (
                <View key={timeIndex} style={[styles.tableRow, dynamicStyles.clubCell, dynamicStyles.row]} wrap={false}>
                    <View style={styles.timeCell}>
                        <Text>{time}</Text>
                    </View>
                    {sortedCourts.map((court, courtIndex) => {
                        const match = matchesByHour[time][court];
                        return (
                            <View
                                key={courtIndex}
                                style={courtIndex === sortedCourts.length - 1 ? styles.lastCell : styles.tableCell}
                            >
                                {match ? (
                                    <>
                                        <Text style={{ textAlign: 'center', marginBottom: 2, fontSize: 10 }}>
                                            {match.type}
                                        </Text>
                                        <Text style={{ textAlign: 'center', marginBottom: 2, fontSize: 10 }}>
                                            {match.category.name}
                                        </Text>

                                        {renderPlayers(match.playerMatches, match.category.id)}
                                    </>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

export function MatchWeekPDF({ apurMatches, palosVerdesMatches, talleresMatches, clubCourts }: Props) {
    const renderClubPage = (
        dayMatches: MatchDayWithMatchesType,
        club: 'APUR' | 'PALOS VERDES' | 'TALLERES',
        color: string,
        clubName: string
    ) => {
        return (
            <Page size="A4" style={styles.page} orientation="landscape">
                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 12 }}>
                    Los [ ] indican la cantidad de puntos del jugador en la categoria y los ( ) indican la cantidad de
                    partidos jugados.
                </Text>
                <Text style={[styles.dateHeader, { color }]}>
                    {format(dayMatches.date, 'dddd', 'es').replace(/^\w/, (c) => c.toUpperCase())}{' '}
                    {format(dayMatches.date, 'DD/MM')} {clubName}
                </Text>
                {renderMatchesTable(dayMatches.matches, club, clubCourts)}
            </Page>
        );
    };

    return (
        <Document>
            {apurMatches.map((dayMatches, dayIndex) => (
                <Fragment key={`day-${dayIndex}`}>
                    {renderClubPage(dayMatches, 'APUR', '#54993c', 'APUR')}
                    {renderClubPage(palosVerdesMatches[dayIndex], 'PALOS VERDES', '#d98c2b', 'PALOS VERDES')}
                    {renderClubPage(talleresMatches[dayIndex], 'TALLERES', '#2b7bd9', 'TALLERES')}
                </Fragment>
            ))}
        </Document>
    );
}
