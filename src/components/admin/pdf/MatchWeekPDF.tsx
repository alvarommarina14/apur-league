import { Page, Text, View, Document, StyleSheet, render } from '@react-pdf/renderer';
import { MatchDayWithMatchesType } from '@/types/matchDay';
import { format } from '@formkit/tempo';
import { PlayerMatchWithPlayersType } from '@/types/playerMatch';
const styles = StyleSheet.create({
    page: {
        orientation: 'landscape',
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

interface Props {
    apurMatches: MatchDayWithMatchesType[];
    palosVerdesMatches: MatchDayWithMatchesType[];
    talleresMatches: MatchDayWithMatchesType[];
}

export function MatchWeekPDF({ apurMatches, palosVerdesMatches, talleresMatches }: Props) {
    const renderPlayers = (playerMatches: PlayerMatchWithPlayersType[]) => {
        const teams = {
            EQUIPO_1: playerMatches.filter((pm) => pm.team === 'EQUIPO_1'),
            EQUIPO_2: playerMatches.filter((pm) => pm.team === 'EQUIPO_2'),
        };

        return (
            <>
                <Text>{teams.EQUIPO_1.map((p) => `${p.player.firstName} ${p.player.lastName}`).join(' / ')}</Text>
                {' vs '}
                <Text>{teams.EQUIPO_2.map((p) => `${p.player.firstName} ${p.player.lastName}`).join(' / ')}</Text>
            </>
        );
    };
    return (
        <Document>
            <Page size="A4" style={styles.page} orientation="landscape">
                <View style={styles.section}>
                    {apurMatches.map((dayMatches, dayIndex) => (
                        <View key={dayIndex} style={{ marginBottom: 8 }}>
                            <Text>
                                Partidos APUR
                                {' ' + format(dayMatches.date, 'dddd', 'es') + ' ' + format(dayMatches.date, 'DD/MM')}
                            </Text>
                            {dayMatches.matches.map((match, matchIndex) => (
                                <Text key={matchIndex}>
                                    {match.court.name} - {match.type} -{' '}
                                    {format({
                                        date: match.hour,
                                        format: 'HH:mm',
                                        tz: 'UTC',
                                    })}
                                    {renderPlayers(match.playerMatches)}
                                </Text>
                            ))}
                            <Text>
                                Partidos Palos Verdes
                                {' ' + format(dayMatches.date, 'dddd', 'es') + ' ' + format(dayMatches.date, 'DD/MM')}
                            </Text>
                            {palosVerdesMatches[dayIndex].matches.map((match, matchIndex) => (
                                <Text key={matchIndex}>
                                    {match.court.name} - {match.type} -{' '}
                                    {format({
                                        date: match.hour,
                                        format: 'HH:mm',
                                        tz: 'UTC',
                                    })}
                                    {renderPlayers(match.playerMatches)}
                                </Text>
                            ))}
                            <Text>
                                Partidos Talleres
                                {' ' + format(dayMatches.date, 'dddd', 'es') + ' ' + format(dayMatches.date, 'DD/MM')}
                            </Text>
                            {talleresMatches[dayIndex].matches.map((match, matchIndex) => (
                                <Text key={matchIndex}>
                                    {match.court.name} - {match.type} -{' '}
                                    {format({
                                        date: match.hour,
                                        format: 'HH:mm',
                                        tz: 'UTC',
                                    })}
                                    {renderPlayers(match.playerMatches)}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
