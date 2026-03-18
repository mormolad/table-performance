import React from 'react';

interface FilterBarProps {
    selectedTariff?: string;
    onTariffChange: (tariff?: string) => void;
    selectedStatus?: string;
    onStatusChange: (status?: string) => void;
    isLoading: boolean;
    onAbort?: () => void;
}

const TARIFFS = [
    { value: '', label: 'Все тарифы' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Pro', label: 'Pro' },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Frozen', label: 'Frozen' },
];

const STATUSES = [
    { value: '', label: 'Все' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Active', label: 'Active' },
];

const selectStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    outline: 'none',
} as const;

export const FilterBar: React.FC<FilterBarProps> = ({
    selectedTariff,
    onTariffChange,
    selectedStatus,
    onStatusChange,
    isLoading,
    onAbort,
}) => {
    return (
        <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label htmlFor="tariff-select" style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                Тариф:
            </label>
            <select
                id="tariff-select"
                value={selectedTariff || ''}
                onChange={(e) => onTariffChange(e.target.value || undefined)}
                disabled={isLoading}
                style={{ ...selectStyle, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
                {TARIFFS.map((tariff) => (
                    <option key={tariff.value} value={tariff.value}>
                        {tariff.label}
                    </option>
                ))}
            </select>
            <label htmlFor="status-select" style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                Статус:
            </label>
            <select
                id="status-select"
                value={selectedStatus || ''}
                onChange={(e) => {
                    const value = e.target.value;
                    console.log('[status] FilterBar: выбор статуса =', value === '' ? '(все)' : JSON.stringify(value));
                    onStatusChange(value || undefined);
                }}
                disabled={isLoading}
                style={{ ...selectStyle, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
                {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
            {isLoading && (
                <>
                    <span style={{ fontSize: '12px', color: 'var(--accent)', fontStyle: 'italic' }}>
                        Загрузка...
                    </span>
                    {onAbort && (
                        <button
                            type="button"
                            onClick={onAbort}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }}
                        >
                            Прервать запрос
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
