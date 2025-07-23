'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RankingTable } from './RankingTable';
import { fetchMorePlayers } from '@/lib/actions/stats';
import { PlayerCategoryStatsPromotionsType } from '@/types/stats';
interface RankingListProps {
    initialPlayers: PlayerCategoryStatsPromotionsType[];
    totalCount: number;
    search: string | undefined;
    categoryId: number;
    perPage: number;
}

export function RankingList({ initialPlayers, totalCount, search, categoryId, perPage }: RankingListProps) {
    const [players, setPlayers] = useState<PlayerCategoryStatsPromotionsType[]>(initialPlayers);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(players.length < totalCount);
    const loader = useRef(null);

    useEffect(() => {
        setPage(1);
        setPlayers(initialPlayers);
        setHasMore(initialPlayers.length < totalCount);
    }, [initialPlayers, search, totalCount]);

    const loadMorePlayers = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const newPlayers = await fetchMorePlayers({
                search,
                categoryId,
                page: nextPage,
                perPage,
            });

            setPlayers((prevPlayers) => [...prevPlayers, ...newPlayers]);
            setPage(nextPage);
            setHasMore(players.length + newPlayers.length < totalCount);
        } catch (error) {
            console.error('Failed to load more players:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, search, categoryId, perPage, players.length, totalCount]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && !loading && hasMore) {
                loadMorePlayers();
            }
        },
        [loading, hasMore, loadMorePlayers]
    );

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const currentLoader = loader.current;
        const observer = new IntersectionObserver(handleObserver, option);

        if (currentLoader && hasMore) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [handleObserver, hasMore]);

    return (
        <>
            <RankingTable rows={players} />
            {loading && <div className="text-center py-4 text-neutral-500">Cargando más jugadores...</div>}
            {!hasMore && players.length > 0 && (
                <div className="text-center py-4 text-neutral-500">Todos los jugadores cargados.</div>
            )}
            {hasMore && <div ref={loader} className="h-10 invisible" />}
        </>
    );
}
