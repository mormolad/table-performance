import React from 'react';

export const TableLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="table-layout" style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
      <h2>Table Layout Placeholder</h2>
      <div className="table-container" style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
};
