import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, ExternalLink, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/transactions': 'Transactions',
  '/low-stock': 'Low Stock Alerts',
};

export default function Header({ sidebarCollapsed, onMobileMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const currentPage = pageNames[location.pathname] || 'Dashboard';

  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMobileMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="header-breadcrumb">
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
            className="header-breadcrumb-root"
          >
            Inventory Pro
          </span>
          <span>/</span>
          <span className="header-breadcrumb-current">{currentPage}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Landing Page Link */}
        <button
          className="header-landing-btn"
          onClick={() => navigate('/')}
          title="Return to Landing Page"
        >
          <Sparkles size={14} color="var(--accent)" />
          <span>Landing Page</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={17} className="theme-icon sun-icon" />
              <span className="theme-label">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={17} className="theme-icon moon-icon" />
              <span className="theme-label">Dark Mode</span>
            </>
          )}
        </button>

        <div className="header-avatar" title="Mohit Kumar (Admin)">
          MK
        </div>
      </div>
    </header>
  );
}
