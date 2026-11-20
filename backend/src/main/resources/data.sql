-- =============================================
-- Seed Data for Product Inventory Management
-- =============================================

-- Categories
INSERT INTO categories (name, description, created_at) VALUES ('Electronics', 'Electronic devices and gadgets', NOW());
INSERT INTO categories (name, description, created_at) VALUES ('Clothing', 'Apparel and fashion items', NOW());
INSERT INTO categories (name, description, created_at) VALUES ('Books', 'Physical and digital books', NOW());
INSERT INTO categories (name, description, created_at) VALUES ('Home & Kitchen', 'Home appliances and kitchen essentials', NOW());

-- Products
-- Electronics (category_id = 1)
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'ELEC-001', 29.99, 150, 1, NOW(), NOW());
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 'ELEC-002', 89.99, 75, 1, NOW(), NOW());

-- Clothing (category_id = 2)
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Cotton T-Shirt', 'Premium cotton crew neck t-shirt', 'CLTH-001', 19.99, 200, 2, NOW(), NOW());
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Denim Jeans', 'Classic fit blue denim jeans', 'CLTH-002', 49.99, 5, 2, NOW(), NOW());

-- Books (category_id = 3)
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Java Programming', 'Comprehensive guide to Java programming', 'BOOK-001', 39.99, 50, 3, NOW(), NOW());
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Spring Boot in Action', 'Hands-on guide to building Spring Boot applications', 'BOOK-002', 44.99, 8, 3, NOW(), NOW());

-- Home & Kitchen (category_id = 4)
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Coffee Maker', 'Programmable 12-cup coffee maker', 'HOME-001', 59.99, 30, 4, NOW(), NOW());
INSERT INTO products (name, description, sku, price, quantity, category_id, created_at, updated_at) VALUES
('Blender', 'High-speed countertop blender 1000W', 'HOME-002', 79.99, 3, 4, NOW(), NOW());

-- Stock Transactions
-- Stock In transactions
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(1, 'STOCK_IN', 100, 'Initial stock purchase', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(1, 'STOCK_IN', 50, 'Restock order #1001', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(2, 'STOCK_IN', 75, 'Initial stock purchase', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(3, 'STOCK_IN', 200, 'Bulk order from supplier', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(5, 'STOCK_IN', 50, 'Publisher shipment', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(7, 'STOCK_IN', 30, 'Warehouse delivery', NOW());

-- Stock Out transactions
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(3, 'STOCK_OUT', 15, 'Online order fulfillment', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(4, 'STOCK_OUT', 3, 'Store sale', NOW());
INSERT INTO stock_transactions (product_id, type, quantity, notes, transaction_date) VALUES
(8, 'STOCK_OUT', 2, 'Customer order #2045', NOW());
