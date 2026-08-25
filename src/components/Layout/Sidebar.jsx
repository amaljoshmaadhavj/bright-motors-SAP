import { LayoutDashboard, FileText, BookOpen, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pr-log', label: 'PR Log', icon: FileText },
  { id: 'rules', label: 'Business Rules', icon: BookOpen },
];

export function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="sap-sidebar">
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon size={18} />
            <span className="sidebar-label">{item.label}</span>
            {activeView === item.id && <ChevronRight size={14} className="sidebar-chevron" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
      </div>
    </aside>
  );
}
