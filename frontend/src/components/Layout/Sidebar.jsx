import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ArrowLeftRight,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: FolderOpen },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/low-stock', label: 'Low Stock', icon: AlertTriangle, badge: true },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, lowStockCount }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onMobileClose}
      />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo">IP</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Inventory Pro</span>
            <span className="sidebar-brand-label">Admin Suite</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onMobileClose}
              >
                <Icon className="sidebar-link-icon" size={20} />
                <span className="sidebar-link-text">{item.label}</span>
                {item.badge && lowStockCount > 0 && (
                  <span className="sidebar-link-badge">{lowStockCount}</span>
                )}
              </NavLink>
            );
          })}

          <div className="sidebar-section-label" style={{ marginTop: '1.25rem' }}>Portal</div>
          <NavLink
            to="/"
            className="sidebar-link"
            onClick={onMobileClose}
          >
            <Globe className="sidebar-link-icon" size={20} />
            <span className="sidebar-link-text">Landing Page</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
