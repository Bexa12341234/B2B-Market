-- Clear all data
DELETE FROM OrderItem;
DELETE FROM "Order";
DELETE FROM POSItem;
DELETE FROM POSSession;
DELETE FROM Product;
DELETE FROM Category;
DELETE FROM User;
DELETE FROM Segment;

-- Create basic users (passwords are 'password123')
INSERT INTO User (phone, name, password, role, createdAt, updatedAt) VALUES ('+998901234567', 'System Admin', '$2b$10$S6UoI6M4zV9Qp6V6G2L6uO6L6uO6L6uO6L6uO6L6uO6L6uO6L6uO', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO User (phone, name, password, role, createdAt, updatedAt) VALUES ('+998907654321', 'PharmaCorp Inc.', '$2b$10$S6UoI6M4zV9Qp6V6G2L6uO6L6uO6L6uO6L6uO6L6uO6L6uO6L6uO', 'SUPPLIER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO User (phone, name, password, role, createdAt, updatedAt) VALUES ('+998901112233', 'City Pharmacy #1', '$2b$10$S6UoI6M4zV9Qp6V6G2L6uO6L6uO6L6uO6L6uO6L6uO6L6uO6L6uO', 'RETAIL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Segments
INSERT INTO Segment (name) VALUES ('Pharmacies');
INSERT INTO Segment (name) VALUES ('General Shops');

-- Categories
INSERT INTO Category (name) VALUES ('Medications');
