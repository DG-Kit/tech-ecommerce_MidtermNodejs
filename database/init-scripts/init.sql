CREATE DATABASE TechStore;
GO

USE TechStore;
GO

-- Create Products Table
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(10, 2) NOT NULL,
    ImageUrl NVARCHAR(255),
    Category NVARCHAR(50),
    StockQuantity INT DEFAULT 0
);
GO

-- Create Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreateDate DATETIME DEFAULT GETDATE()
);
GO

-- Create Orders Table
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT REFERENCES Users(UserId),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending'
);
GO

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemId INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT REFERENCES Orders(OrderId),
    ProductId INT REFERENCES Products(ProductId),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL
);
GO

-- Insert Sample Products
INSERT INTO Products (Name, Description, Price, ImageUrl, Category, StockQuantity)
VALUES 
('Laptop Pro X1', 'High-performance laptop with 16GB RAM', 1299.99, 'laptop1.jpg', 'Laptops', 25),
('Smartphone Galaxy X', 'Latest smartphone with 5G capabilities', 899.99, 'phone1.jpg', 'Smartphones', 50),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'headphones1.jpg', 'Accessories', 100),
('4K Monitor', '27-inch 4K display with HDR', 349.99, 'monitor1.jpg', 'Monitors', 15),
('Gaming Mouse', 'RGB gaming mouse with adjustable DPI', 59.99, 'mouse1.jpg', 'Accessories', 75);
GO