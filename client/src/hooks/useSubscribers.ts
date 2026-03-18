import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { fetchSubscribers } from '../api';
import type { Subscriber } from '../types';

interface UseSubscribersProps {
    limit: number;
    tariff?: string;
    status?: string;
}

export const useSubscribers = ({ limit, tariff, status }: UseSubscribersProps) => {
    const [data, setData] = useState<Subscriber[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const loadData = useCallback(async (nextPage: number, isNewFilter: boolean = false) => {
        // Отменяем предыдущий запрос
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Создаем новый контроллер
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        console.log('[status] useSubscribers.loadData: page=', nextPage, 'limit=', limit, 'tariff=', tariff, 'status=', status);

        try {
            const response = await fetchSubscribers(nextPage, limit, tariff, status, controller.signal);

            const statusesInData = [...new Set(response.data.map((r) => r.status))];
            console.log('[status] useSubscribers: получено', response.data.length, 'строк, isNewFilter=', isNewFilter, ', статусы в data:', statusesInData);

            setData((prev) => (isNewFilter ? response.data : [...prev, ...response.data]));
            setHasMore(response.hasMore);
            setPage(nextPage);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('[status] useSubscribers: запрос отменён');
                return;
            }
            setError('Ошибка при загрузке данных');
            console.error(err);
        } finally {
            // Сбрасываем состояние загрузки только если это актуальный запрос
            if (abortControllerRef.current === controller) {
                setLoading(false);
            }
        }
    }, [limit, tariff, status]);

    // Сброс при смене фильтра
    useEffect(() => {
        console.log('[status] useSubscribers.effect: смена фильтра, tariff=', tariff, ', status=', status);
        setPage(1);
        setHasMore(true);
        loadData(1, true);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [tariff, status, loadData]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadData(page + 1);
        }
    }, [loading, hasMore, page, loadData]);

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);

    return { data, loading, hasMore, error, loadMore, abort };
};
