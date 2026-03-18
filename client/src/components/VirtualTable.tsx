import React, { useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSubscribers } from '../hooks/useSubscribers';
import { SkeletonRow } from './SkeletonRow';
import { ErrorState } from './ErrorState';

interface VirtualTableProps {
    rowHeight?: number;
    overscan?: number;
    limit?: number;
    tariff?: string;
    status?: string;
    abortRef?: React.MutableRefObject<(() => void) | null>;
    onLoadingChange?: (loading: boolean) => void;
}

export const VirtualTable: React.FC<VirtualTableProps> = ({
    rowHeight = 40,
    overscan = 10,
    limit = 100,
    tariff,
    status,
    abortRef,
    onLoadingChange,
}) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const { data, loading, hasMore, error, loadMore, abort } = useSubscribers({ limit, tariff, status });

    if (abortRef) abortRef.current = abort;

    useEffect(() => {
        return () => {
            if (abortRef) abortRef.current = null;
        };
    }, [abortRef]);

    const handleRetry = useCallback(() => {
        window.location.reload(); // Simple retry for now, or we could expose a retry function from useSubscribers
    }, []);

    useEffect(() => {
        onLoadingChange?.(loading);
    }, [loading, onLoadingChange]);

    // Сброс скролла при смене фильтра
    useEffect(() => {
        if (parentRef.current) {
            parentRef.current.scrollTop = 0;
        }
    }, [tariff, status]);

    const rowVirtualizer = useVirtualizer({
        count: hasMore ? data.length + 1 : data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: overscan,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    // Проверка необходимости подгрузки при скролле
    useEffect(() => {
        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem) return;

        if (lastItem.index >= data.length - 1 && hasMore && !loading && !error) {
            loadMore();
        }
    }, [virtualItems, data.length, hasMore, loading, loadMore, error]);

    if (error) {
        return <ErrorState message={error} onRetry={handleRetry} />;
    }

    if (!loading && data.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--bg)'
            }}>
                Ничего не найдено
            </div>
        );
    }

    return (
        <div
            ref={parentRef}
            className="virtual-table-container"
            style={{
                height: '600px',
                width: '100%',
                overflow: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--bg)',
                position: 'relative',
            }}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualItems.map((virtualRow) => {
                    const isLoaderRow = virtualRow.index > data.length - 1;
                    const subscriber = data[virtualRow.index];

                    return (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                                boxSizing: 'border-box',
                                color: 'var(--text)',
                                fontSize: '14px',
                            }}
                        >
                            {isLoaderRow ? (
                                <SkeletonRow />
                            ) : (
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                    <span style={{ width: '80px' }}>#{subscriber.id}</span>
                                    <span style={{ flex: 1, fontWeight: 'bold' }}>{subscriber.name || subscriber.msisdn}</span>
                                    <span style={{ width: '120px' }}>{subscriber.tariff}</span>                                    <span style={{ width: '100px', textAlign: 'right' }}>
                                        {subscriber.balance.toFixed(2)} ₽
                                    </span>
                                    <span
                                        style={{
                                            width: '100px',
                                            textAlign: 'center',
                                            color: subscriber.status?.toLowerCase() === 'active' ? '#10b981' : '#ef4444'
                                        }}
                                    >
                                        {subscriber.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
