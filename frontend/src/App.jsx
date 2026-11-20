import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LandingPage from './components/Landing/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import CategoryList from './components/Categories/CategoryList';
import TransactionList from './components/Transactions/TransactionList';
import LowStock from './components/LowStock/LowStock';

function App() {
  return (
    <Routes>
      {/* Landing page with Hero Section */}
      <Route path="/" element={<LandingPage />} />

      {/* Admin Dashboard layout and sub-pages */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/low-stock" element={<LowStock />} />
      </Route>
    </Routes>
  );
}

export default App;
