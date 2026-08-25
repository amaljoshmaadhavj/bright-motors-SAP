import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Bell, User, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function Header() {
  const { kpis, state } = useStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const lowStockItems = state.inventory.filter(i => i.currentQty < i.rop);

  return (
    <header className="sap-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon">BM</div>
          <div className="logo-text">
            <span className="logo-title">Bright Motors</span>
            <span className="logo-subtitle">SAP Materials Management</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-badge">
          <span className="badge-label">Active PR</span>
          <span className="badge-value">{kpis.activePr}</span>
        </div>

        {/* Notifications */}
        <div className="header-dropdown-wrap" ref={notifRef}>
          <button
            className={`header-icon-btn ${showNotif ? 'active' : ''}`}
            title="Notifications"
            onClick={() => { setShowNotif(v => !v); setShowSettings(false); }}
          >
            <Bell size={18} />
            {kpis.belowRop > 0 && <span className="notification-dot">{kpis.belowRop}</span>}
          </button>
          {showNotif && (
            <div className="header-dropdown notif-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                <button className="dropdown-close" onClick={() => setShowNotif(false)}><X size={14} /></button>
              </div>
              <div className="dropdown-body">
                {lowStockItems.length === 0 ? (
                  <div className="dropdown-empty">
                    <CheckCircle size={20} />
                    <span>All stock levels are healthy.</span>
                  </div>
                ) : (
                  lowStockItems.map(item => (
                    <div key={item.id} className="notif-item">
                      <AlertTriangle size={14} className="notif-icon-warn" />
                      <div className="notif-text">
                        <strong>{item.id}</strong> is below reorder point
                        <span className="notif-detail">Current: {item.currentQty} / ROP: {item.rop}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="header-dropdown-wrap" ref={settingsRef}>
          <button
            className={`header-icon-btn ${showSettings ? 'active' : ''}`}
            title="Settings"
            onClick={() => { setShowSettings(v => !v); setShowNotif(false); }}
          >
            <Settings size={18} />
          </button>
          {showSettings && (
            <div className="header-dropdown settings-dropdown">
              <div className="dropdown-header">
                <span>Settings</span>
                <button className="dropdown-close" onClick={() => setShowSettings(false)}><X size={14} /></button>
              </div>
              <div className="dropdown-body">
                <div className="settings-item">
                  <Info size={14} />
                  <div>
                    <strong>Plant Access</strong>
                    <span>PLT-100, PLT-200</span>
                  </div>
                </div>
                <div className="settings-item">
                  <Info size={14} />
                  <div>
                    <strong>Role</strong>
                    <span>Store Keeper — Materials Management</span>
                  </div>
                </div>
                <div className="settings-item">
                  <Info size={14} />
                  <div>
                    <strong>AI Recommendation</strong>
                    <span>{import.meta.env.VITE_OPENAI_API_KEY ? 'OpenAI connected' : 'Rule-based fallback (no API key)'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="header-user">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Store Manager</span>
            <span className="user-role">PLT-100 / PLT-200</span>
          </div>
        </div>
      </div>
    </header>
  );
}
