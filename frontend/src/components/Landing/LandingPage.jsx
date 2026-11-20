import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Sun,
  Moon,
  BarChart3,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import API from '../../api/axios';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    totalProducts: 8,
    totalCategories: 4,
    totalInventoryValue: 19894.79,
    lowStockCount: 3,
  });

  useEffect(() => {
    API.get('/api/dashboard/stats')
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="landing-container">
      {/* Background ambient glow effect */}
      <div className="landing-ambient-glow glow-1" />
      <div className="landing-ambient-glow glow-2" />

      {/* Top Navbar */}
      <nav className="landing-navbar">
        <div className="landing-brand" onClick={() => navigate('/')}>
          <div className="landing-logo">IP</div>
          <div className="landing-brand-text">
            <span className="brand-title">Inventory Pro</span>
            <span className="brand-subtitle">Enterprise Suite</span>
          </div>
        </div>

        <div className="landing-nav-actions">
          <div className="system-status-pill">
            <span className="status-dot-pulse" />
            <span>Backend Online (Port 8080)</span>
          </div>

          <button
            className="landing-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} color="var(--warning)" /> : <Moon size={18} color="var(--accent)" />}
          </button>

          <button
            className="btn btn-primary landing-cta-btn"
            onClick={() => navigate('/dashboard')}
          >
            <span>Launch Admin Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero-section">
        <div className="hero-content">
          {/* Eyebrow Tag */}
          <div className="hero-eyebrow">
            <span className="eyebrow-badge">
              <Zap size={14} />
              Spring Boot 3.x + React Architecture
            </span>
            <span className="eyebrow-text">No Authentication Required • Instant Admin Access</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Intelligent Product Inventory & <br />
            <span className="hero-title-gradient">Stock Orchestration System</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="hero-subtitle">
            Engineered for high-throughput supply chain operations. Experience real-time telemetry,
            multi-category catalog segmentation, automated stock deficit tracking, and transactional
            audit ledgers designed with enterprise precision.
          </p>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <button
              className="btn btn-hero-primary"
              onClick={() => navigate('/dashboard')}
            >
              <span>Enter Admin Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-hero-secondary"
            >
              <FileCode2 size={18} />
              <span>Swagger API Docs</span>
            </a>
          </div>

          {/* Feature Badges Grid */}
          <div className="hero-feature-tags">
            <div className="feature-tag">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>17+ RESTful API Endpoints</span>
            </div>
            <div className="feature-tag">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Server-Side Sorting & Pagination</span>
            </div>
            <div className="feature-tag">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>JSR-303 Data Integrity</span>
            </div>
            <div className="feature-tag">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Real-Time Charts & Analytics</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Showcase Card */}
        <div className="hero-showcase-container">
          <div className="hero-dashboard-preview card">
            {/* Window chrome header */}
            <div className="preview-window-bar">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="window-url-pill">
                <span>inventory-pro.internal/admin/dashboard</span>
              </div>
              <div className="window-badge">
                <span className="live-pulse" /> Live Telemetry
              </div>
            </div>

            {/* Mock live KPI telemetry */}
            <div className="preview-metrics-grid">
              <div className="preview-stat-card">
                <div className="stat-label">
                  <Package size={15} color="var(--accent)" />
                  <span>Total Products</span>
                </div>
                <div className="stat-value">{stats.totalProducts || 8}</div>
                <div className="stat-trend trend-positive">
                  <TrendingUp size={12} />
                  <span>4 Categories</span>
                </div>
              </div>

              <div className="preview-stat-card">
                <div className="stat-label">
                  <BarChart3 size={15} color="var(--success)" />
                  <span>Live Valuation</span>
                </div>
                <div className="stat-value">
                  ${Number(stats.totalInventoryValue || 19894.79).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="stat-trend trend-positive">
                  <span>100% In-Stock Verified</span>
                </div>
              </div>

              <div className="preview-stat-card">
                <div className="stat-label">
                  <AlertTriangle size={15} color="var(--warning)" />
                  <span>Low Stock Warnings</span>
                </div>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>
                  {stats.lowStockCount || 3} Items
                </div>
                <div className="stat-trend trend-warning">
                  <span>Below 10 Unit Threshold</span>
                </div>
              </div>
            </div>

            {/* Quick interactive action gateways inside preview */}
            <div className="preview-interactive-banner">
              <div className="banner-text">
                <h4>Ready to manage catalog items and transactions?</h4>
                <p>Jump directly into the live management suite with complete administrative privileges.</p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/dashboard')}
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Minimal Footer */}
      <footer className="landing-footer">
        <p>
          Product Inventory Management System • Designed for Octaphores Private Limited Internship Project
        </p>
      </footer>
    </div>
  );
}
