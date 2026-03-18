import React from 'react';

export const SkeletonRow: React.FC = () => {
    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ flex: 1, height: '16px', borderRadius: '4px', margin: '0 20px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px', marginLeft: '20px' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px', marginLeft: '20px' }}></div>
        </div>
    );
};
