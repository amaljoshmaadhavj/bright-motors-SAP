import { useState, useEffect, useCallback } from 'react';
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

const VALID_VIEWS = ['dashboard', 'pr-log', 'rules'];

function getHashView() {
  const hash = window.location.hash.replace('#', '');
  return VALID_VIEWS.includes(hash) ? hash : 'dashboard';
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
  const [activeView, setActiveView] = useState(getHashView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoading = useLoadingDelay(1200);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    window.location.hash = view;
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const view = getHashView();
      setActiveView(view);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
