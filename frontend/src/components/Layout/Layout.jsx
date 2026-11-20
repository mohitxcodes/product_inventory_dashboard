import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import API from '../../api/axios';
import './Layout.css';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    API.get('/api/products/low-stock?threshold=10')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setLowStockCount(data.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        lowStockCount={lowStockCount}
      />
      <div className={`layout-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
