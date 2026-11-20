import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  FolderOpen,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import API from '../../api/axios';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import './Dashboard.css';

const CATEGORY_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
const HEALTH_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [valuationData, setValuationData] = useState([]);
  const [movementTimeline, setMovementTimeline] = useState([]);
  const [healthBreakdown, setHealthBreakdown] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'volume' | 'financial'

  const fetchDashboardData = async () => {
    try {
      const [statsRes, categoriesRes, transactionsRes, lowStockRes, productsRes] = await Promise.all([
        API.get('/api/dashboard/stats'),
        API.get('/api/categories'),
        API.get('/api/stock-transactions'),
        API.get('/api/products/low-stock?threshold=10'),
        API.get('/api/products?page=0&size=100'),
      ]);

      setStats(statsRes.data);

      const categories = categoriesRes.data || [];
      const products = productsRes.data?.content || productsRes.data || [];
      const txs = Array.isArray(transactionsRes.data) ? transactionsRes.data : [];

      // 1. Category Chart Data (Products count + Total Quantity)
      const catChart = categories.map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id);
        const totalUnits = catProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
        return {
          name: cat.name,
          products: cat.productCount || catProducts.length || 0,
          totalUnits: totalUnits,
        };
      });
      setCategoryData(catChart);

      // 2. Financial Valuation by Category
      const valChart = categories.map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id);
        const totalValue = catProducts.reduce((sum, p) => sum + (Number(p.price || 0) * (p.quantity || 0)), 0);
        return {
          name: cat.name,
          valuation: Math.round(totalValue),
        };
      });
      setValuationData(valChart);

      // 3. Stock Movement Flow Timeline (synthesized from transactions)
      const sortedTxs = [...txs].reverse();
      const timelineMap = {};
      sortedTxs.forEach((t, idx) => {
        const label = t.transactionDate ? new Date(t.transactionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Batch ${idx + 1}`;
        if (!timelineMap[label]) {
          timelineMap[label] = { date: label, inUnits: 0, outUnits: 0 };
        }
        if (t.type === 'STOCK_IN') {
          timelineMap[label].inUnits += t.quantity;
        } else {
          timelineMap[label].outUnits += t.quantity;
        }
      });
      setMovementTimeline(Object.values(timelineMap));

      // 4. Stock Health Breakdown
      const healthyCount = products.filter((p) => (p.quantity || 0) > 10).length;
      const lowCount = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) <= 10).length;
      const emptyCount = products.filter((p) => (p.quantity || 0) === 0).length;
      setHealthBreakdown([
        { name: 'Optimal (>10 Units)', value: healthyCount },
        { name: 'Low Stock (1-10 Units)', value: lowCount },
        { name: 'Out of Stock (0 Units)', value: emptyCount },
      ]);

      // Recent transactions (last 5)
      setRecentTransactions(txs.slice(0, 5));

      // Low stock list
      const low = Array.isArray(lowStockRes.data) ? lowStockRes.data : [];
      setLowStockItems(low.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return <LoadingSpinner text="Loading analytical metrics and charts..." />;
  }

  return (
    <div className="dashboard-container">
      {/* Header bar */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Inventory Dashboard</h1>
          <p className="page-subtitle">Real-time supply chain telemetry, valuation analytics & flow rates</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className={`btn btn-secondary ${refreshing ? 'loading' : ''}`}
            onClick={handleRefresh}
            title="Refresh metrics"
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            <span>Sync Data</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            <Plus size={16} />
            <span>Manage Inventory</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts || 0}
          color="var(--accent)"
        />
        <StatCard
          icon={FolderOpen}
          label="Categories"
          value={stats?.totalCategories || 0}
          color="#38bdf8"
        />
        <StatCard
          icon={DollarSign}
          label="Total Valuation"
          value={stats?.totalInventoryValue || 0}
          prefix="$"
          color="var(--success)"
        />
        <StatCard
          icon={ArrowDownRight}
          label="Units Stocked In"
          value={stats?.totalStockIn || 0}
          color="#34d399"
        />
        <StatCard
          icon={ArrowUpRight}
          label="Units Dispatched"
          value={stats?.totalStockOut || 0}
          color="#f43f5e"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={stats?.lowStockCount || 0}
          color="var(--warning)"
        />
      </div>

      {/* Analytics View Filter Controls */}
      <div className="dashboard-view-bar">
        <div className="view-selector-group">
          <button
            className={`view-selector-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Layers size={15} />
            <span>All Analytical Graphs</span>
          </button>
          <button
            className={`view-selector-btn ${activeTab === 'volume' ? 'active' : ''}`}
            onClick={() => setActiveTab('volume')}
          >
            <Activity size={15} />
            <span>Stock Flow & Movement</span>
          </button>
          <button
            className={`view-selector-btn ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <BarChart3 size={15} />
            <span>Valuation & Health</span>
          </button>
        </div>
        <span className="analytics-indicator">
          <span className="live-dot" /> Live Data Streaming Active
        </span>
      </div>

      {/* ROW 1 OF CHARTS: Area Chart (Stock Movement Trends) & Health Donut */}
      {(activeTab === 'all' || activeTab === 'volume') && (
        <div className="dashboard-charts-grid">
          {/* Chart 1: Stock Movement Area Flow */}
          <div className="card chart-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-section-title">Inbound vs Outbound Movement Trends</h3>
                <p className="card-section-desc">Timeline comparison of units received (Stock In) vs units dispatched (Stock Out)</p>
              </div>
              <Activity size={18} color="var(--accent-light)" />
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={movementTimeline} margin={{ top: 15, right: 25, left: -10, bottom: 15 }}>
                  <defs>
                    <linearGradient id="inColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="outColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    name="Stock In (Units)"
                    dataKey="inUnits"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#inColor)"
                  />
                  <Area
                    type="monotone"
                    name="Stock Out (Units)"
                    dataKey="outUnits"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#outColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Inventory Health & Depletion Gauge */}
          <div className="card chart-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-section-title">Stock Health Breakdown</h3>
                <p className="card-section-desc">Safety status ratio of all SKU catalog items</p>
              </div>
              <PieChartIcon size={18} color="var(--warning)" />
            </div>
            <div className="chart-wrapper donut-chart-wrapper">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={healthBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {healthBreakdown.map((entry, index) => (
                      <Cell key={`cell-health-${index}`} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-legend">
                {healthBreakdown.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: HEALTH_COLORS[index % HEALTH_COLORS.length] }}
                    />
                    <span className="legend-name">{entry.name}:</span>
                    <span className="legend-count">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 2 OF CHARTS: Valuation by Category & Products / Units Distribution */}
      {(activeTab === 'all' || activeTab === 'financial') && (
        <div className="dashboard-charts-grid">
          {/* Chart 3: Valuation by Category Bar Chart */}
          <div className="card chart-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-section-title">Inventory Valuation by Category ($)</h3>
                <p className="card-section-desc">Capital allocation and dollar value of current inventory</p>
              </div>
              <DollarSign size={18} color="var(--success)" />
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={valuationData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Valuation']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Bar
                    dataKey="valuation"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                  >
                    {valuationData.map((_, index) => (
                      <Cell key={`cell-val-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Category Distribution (SKUs vs Total Units) */}
          <div className="card chart-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-section-title">SKU Count & Total Units by Category</h3>
                <p className="card-section-desc">Comparison of catalog variety vs physical warehouse units</p>
              </div>
              <TrendingUp size={18} color="var(--accent-light)" />
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                  <Bar dataKey="products" name="SKU Count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalUnits" name="Physical Units" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Transactions & Low Stock Alerts */}
      <div className="dashboard-bottom-grid">
        {/* Recent Transactions */}
        <div className="card table-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Recent Stock Activity</h3>
              <p className="card-section-desc">Latest incoming and outgoing inventory logs</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/transactions')}
            >
              View All
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Date & Time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-state">
                      No transactions recorded yet
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 600 }}>{tx.productName}</td>
                      <td>
                        <Badge variant={tx.type === 'STOCK_IN' ? 'success' : 'danger'} size="sm">
                          {tx.type === 'STOCK_IN' ? 'IN' : 'OUT'}
                        </Badge>
                      </td>
                      <td style={{ fontWeight: 600, color: tx.type === 'STOCK_IN' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.type === 'STOCK_IN' ? `+${tx.quantity}` : `-${tx.quantity}`}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: 180 }} className="truncate">
                        {tx.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card alert-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Critical Attention</h3>
              <p className="card-section-desc">Items falling beneath minimum threshold (10 units)</p>
            </div>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => navigate('/low-stock')}
            >
              Restock Center
            </button>
          </div>

          <div className="low-stock-list">
            {lowStockItems.length === 0 ? (
              <div className="empty-stock-ok">
                <div className="ok-icon">✓</div>
                <p>All stock levels are optimal. No critical shortages detected.</p>
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="low-stock-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-sku">{item.sku} • {item.categoryName}</span>
                  </div>
                  <div className="item-action">
                    <Badge variant={item.quantity === 0 ? 'danger' : 'warning'}>
                      {item.quantity === 0 ? 'Out of Stock' : `${item.quantity} left`}
                    </Badge>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/transactions', { state: { preselectProduct: item.id } })}
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
