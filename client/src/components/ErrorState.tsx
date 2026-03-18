import React from 'react';

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            margin: '20px 0'
        }}>
            <p style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 'bold' }}>{message}</p>
            <button
                onClick={onRetry}
                style={{
                    padding: '8px 24px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Попробовать снова
            </button>
        </div>
    );
};
