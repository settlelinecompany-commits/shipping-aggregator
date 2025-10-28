-- Shipping Aggregator Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street_line_1 VARCHAR(255) NOT NULL,
  street_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  country VARCHAR(2) DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_date DATE NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_weight_lb DECIMAL(10,2) NOT NULL,
  total_items INTEGER NOT NULL,
  order_currency VARCHAR(3) DEFAULT 'USD',
  order_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  weight_lb DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Create shipments table
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(20) NOT NULL CHECK (carrier IN ('ups', 'usps', 'fedex', 'dhl', 'aramex')),
  service_level VARCHAR(100) NOT NULL,
  tracking_number VARCHAR(100),
  label_url TEXT,
  package_type VARCHAR(100) NOT NULL,
  weight_lb DECIMAL(10,2) NOT NULL,
  length_in DECIMAL(10,2) NOT NULL,
  width_in DECIMAL(10,2) NOT NULL,
  height_in DECIMAL(10,2) NOT NULL,
  rate_amount DECIMAL(10,2) NOT NULL,
  rate_currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'purchased', 'in_transit', 'delivered')),
  shipped_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_shipments_order_id ON shipments(order_id);
CREATE INDEX idx_shipments_carrier ON shipments(carrier);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_customers_email ON customers(email);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - adjust based on your auth needs)
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on shipments" ON shipments FOR ALL USING (true);

-- Insert sample data
INSERT INTO customers (name, company, email, phone, street_line_1, street_line_2, city, state, zip, country) VALUES
('Simon Kreuz', 'Shippo', 'info@goshippo.com', '415-123-4567', '965 Mission Street', 'Apt. #203', 'San Francisco', 'CA', '94103', 'US'),
('Ahmed Al-Rashid', 'Tech Solutions LLC', 'ahmed@techsolutions.ae', '+971-50-123-4567', 'Sheikh Zayed Road', 'Tower 1, Floor 15', 'Dubai', 'Dubai', '12345', 'AE'),
('Sarah Johnson', 'E-commerce Plus', 'sarah@ecommerceplus.com', '555-0123', '123 Business Ave', 'Suite 200', 'New York', 'NY', '10001', 'US'),
('Mohammed Hassan', 'Digital Ventures', 'mohammed@digitalventures.ae', '+971-4-567-8900', 'Jumeirah Beach Road', 'Villa 45', 'Dubai', 'Dubai', '54321', 'AE'),
('Emily Chen', 'Global Logistics', 'emily@globallogistics.com', '555-0456', '456 Commerce St', 'Floor 8', 'Los Angeles', 'CA', '90210', 'US');

-- Insert sample orders
INSERT INTO orders (order_number, order_date, customer_id, status, total_weight_lb, total_items, order_currency, order_amount) VALUES
('ORD-1000', '2024-01-15', 1, 'shipped', 2.5, 3, 'USD', 89.99),
('ORD-1001', '2024-01-16', 2, 'processing', 1.2, 2, 'AED', 150.00),
('ORD-1002', '2024-01-17', 3, 'pending', 0.8, 1, 'USD', 25.50),
('ORD-1003', '2024-01-18', 4, 'delivered', 3.2, 4, 'AED', 200.00),
('ORD-1004', '2024-01-19', 5, 'shipped', 1.5, 2, 'USD', 45.75);

-- Insert sample order items
INSERT INTO order_items (order_id, title, sku, quantity, weight_lb, price) VALUES
(1, 'Wireless Headphones', 'WH-001', 1, 0.5, 29.99),
(1, 'Phone Case', 'PC-002', 2, 0.2, 15.00),
(1, 'Charging Cable', 'CC-003', 1, 0.1, 12.99),
(2, 'Laptop Stand', 'LS-004', 1, 1.0, 45.00),
(2, 'Mouse Pad', 'MP-005', 1, 0.2, 8.00),
(3, 'USB Hub', 'UH-006', 1, 0.8, 25.50),
(4, 'Monitor', 'MON-007', 1, 2.5, 120.00),
(4, 'Keyboard', 'KB-008', 1, 0.7, 50.00),
(5, 'Webcam', 'WC-009', 1, 0.8, 35.75),
(5, 'Microphone', 'MIC-010', 1, 0.7, 10.00);

-- Insert sample shipments
INSERT INTO shipments (order_id, carrier, service_level, tracking_number, package_type, weight_lb, length_in, width_in, height_in, rate_amount, status, shipped_date) VALUES
(1, 'ups', '2nd Day Air', '1Z999AA1234567890', 'Express Envelope', 2.5, 12.5, 9.5, 2.0, 16.00, 'in_transit', '2024-01-15 10:30:00'),
(2, 'usps', 'Priority Mail', '9400123456789012345678', 'Poly Mailer', 1.2, 14.0, 10.0, 1.0, 8.85, 'pending', NULL),
(3, 'fedex', 'Ground', '123456789012', 'Soft Pack', 0.8, 10.0, 8.0, 1.5, 12.50, 'pending', NULL),
(4, 'dhl', 'Express', '1234567890', 'Box', 3.2, 15.0, 12.0, 8.0, 45.00, 'delivered', '2024-01-18 14:20:00'),
(5, 'aramex', 'Standard', 'AR123456789', 'Envelope', 1.5, 11.0, 8.5, 1.0, 18.50, 'in_transit', '2024-01-19 09:15:00');
