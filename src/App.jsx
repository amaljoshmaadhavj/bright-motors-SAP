import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './store/useStore';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { KpiCards } from './components/Dashboard/KpiCards';
import { StockChart } from './components/Dashboard/StockChart';
import { InventoryTable } from './components/Dashboard/InventoryTable';
import { ReorderPanel } from './components/Reorder/ReorderPanel';
import { PrLog } from './components/PRLog/PrLog';
import { BusinessRules } from './components/BusinessRules/BusinessRules';
import { ToastContainer } from './components/UI/Toast';
import { DashboardSkeleton, useLoadingDelay } from './components/UI/Skeleton';

const VALID_VIEWS = ['dashboard', 'pr-log', 'rules'];

function getPathView() {
  const path = window.location.pathname.replace(/^\//, '');
  return VALID_VIEWS.includes(path) ? path : 'dashboard';
}

function Dashboard() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);

  const handleViewItem = (item, autoReorder = false) => {
    setSelectedItem(item);
    setReorderMode(autoReorder);
  };

  return (
    <div className="page-container">
      <KpiCards />
      <StockChart />
      <InventoryTable onViewItem={handleViewItem} />
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
  const [activeView, setActiveView] = useState(getPathView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoading = useLoadingDelay(1200);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    window.history.pushState(null, '', `/${view}`);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setActiveView(getPathView());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <StoreProvider>
      <div className="app">
        <Header onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="app-body">
          <Sidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="app-main">
            {isLoading ? (
              <DashboardSkeleton />
            ) : (
              <>
                {activeView === 'dashboard' && <Dashboard />}
                {activeView === 'pr-log' && <PrLog />}
                {activeView === 'rules' && <BusinessRules />}
              </>
            )}
          </main>
        </div>
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
