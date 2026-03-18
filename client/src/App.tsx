import { useState, useRef, useEffect } from 'react'
import './App.css'
import { TableLayout } from './components/TableLayout'
import { VirtualTable } from './components/VirtualTable'
import { FilterBar } from './components/FilterBar'

function App() {
  const [selectedTariff, setSelectedTariff] = useState<string | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    console.log('[status] App: selectedStatus =', selectedStatus === undefined ? 'undefined' : JSON.stringify(selectedStatus));
  }, [selectedStatus]);

  return (
    <div className="app-container">
      <header style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', marginBottom: '40px' }}>
        <h1>High-Performance Table (CRM Demo)</h1>
        <p style={{ color: 'var(--text-h)', opacity: 0.8 }}>
          Демонстрация работы с 5 000 000+ записей с использованием виртуализации и AbortController.
        </p>
      </header>

      <section id="table-section">
        <TableLayout>
          <FilterBar
            selectedTariff={selectedTariff}
            onTariffChange={setSelectedTariff}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            isLoading={isLoading}
            onAbort={() => abortRef.current?.()}
          />
          <VirtualTable
            tariff={selectedTariff}
            status={selectedStatus}
            abortRef={abortRef}
            onLoadingChange={setIsLoading}
          />
        </TableLayout>
      </section>

      <footer style={{ marginTop: '60px', padding: '20px 0', borderTop: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-h)' }}>
        <p>© 2024 CRM Billing System Demo. Оптимизировано для ИГРА-СЕРВИС.</p>
      </footer>
    </div>
  )
}

export default App
