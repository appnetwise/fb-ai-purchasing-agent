-- Seed Suppliers
INSERT INTO suppliers (id, name, country, lead_time_days, moq, rating) VALUES
('11111111-1111-1111-1111-111111111111', 'GlobalFoods', 'UAE', 1, 0, 4.5),
('22222222-2222-2222-2222-222222222222', 'EuroProduce', 'UAE', 2, 50, 4.8),
('33333333-3333-3333-3333-333333333333', 'PrimeImports', 'USA', 5, 200, 4.2),
('44444444-4444-4444-4444-444444444444', 'MarketLine', 'UAE', 1, 0, 4.1),
('55555555-5555-5555-5555-555555555555', 'MetroSupply', 'UAE', 2, 100, 4.0)
ON CONFLICT (id) DO NOTHING;

-- Seed Catalog Items (from suppliers.csv)
INSERT INTO supplier_catalog_items (supplier_id, sku, name, pack, unit_price, currency) VALUES
('11111111-1111-1111-1111-111111111111', 'GFD-001', 'Fresh Apples Granny Smith', '10 x 1kg', 38.00, 'USD'),
('22222222-2222-2222-2222-222222222222', 'EP-778', 'Apples Granny Smith', '12/900g', 36.00, 'USD'),
('33333333-3333-3333-3333-333333333333', 'PI-552', 'Granny Smith Apple', '5lb', 17.50, 'USD'),
('44444444-4444-4444-4444-444444444444', 'ML-104', 'Chicken Breast Boneless', '4 x 2.5kg', 82.00, 'USD'),
('55555555-5555-5555-5555-555555555555', 'MS-886', 'Boneless Chicken Breast', '10lb', 40.00, 'USD')
ON CONFLICT (supplier_id, sku) DO NOTHING;
