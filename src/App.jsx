import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './store/useStore';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { KpiCards } from './components/Dashboard/KpiCards';
import { InventoryTable } from './components/Dashboard/InventoryTable';
import { ReorderPanel } from './components/Reorder/ReorderPanel';
import { PrLog } from './components/PRLog/PrLog';
import { BusinessRules } from './components/BusinessRules/BusinessRules';
import { ToastContainer } from './components/UI/Toast';
import { DashboardSkeleton, useLoadingDelay } from './components/UI/Skeleton';

function Dashboard() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const isLoading = useLoadingDelay(1200);

  const handleViewItem = (item, autoReorder = false) => {
    setSelectedItem(item);
    setReorderMode(autoReorder);
  };

  return (
    <div className="page-container">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <KpiCards />
          <InventoryTable onViewItem={handleViewItem} />
        </>
      )}
      <AnimatePresence>
        {selectedItem && (
          <ReorderPanel
            item={selectedItem}
            reorderMode={reorderMode}
            onClose={() => { setSelectedItem(null); setReorderMode(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <StoreProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="app-main">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'pr-log' && <PrLog />}
            {activeView === 'rules' && <BusinessRules />}
          </main>
        </div>
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
