const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: 'master',  // Connect to master first
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Connect to database
let pool;
const connectToDb = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server master database');
    
    // Check if TechStore database exists
    const result = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'TechStore'");
    
    if (result.recordset.length === 0) {
      console.log('TechStore database not found, creating it...');
      
      try {
        // Create the database
        await pool.request().query('CREATE DATABASE TechStore');
        console.log('TechStore database created successfully');
        
        // Disconnect from master and connect to TechStore
        await pool.close();
        dbConfig.database = 'TechStore';
        pool = await sql.connect(dbConfig);
        console.log('Connected to TechStore database');
        
        // Create tables and insert sample data
        console.log('Creating tables and inserting sample data...');
        
        // Create Products Table
        await pool.request().query(`
          CREATE TABLE Products (
            ProductId INT PRIMARY KEY IDENTITY(1,1),
            Name NVARCHAR(100) NOT NULL,
            Description NVARCHAR(MAX),
            Price DECIMAL(10, 2) NOT NULL,
            ImageUrl NVARCHAR(255),
            Category NVARCHAR(50),
            StockQuantity INT DEFAULT 0
          )
        `);
        
        // Create Users Table
        await pool.request().query(`
          CREATE TABLE Users (
            UserId INT PRIMARY KEY IDENTITY(1,1),
            Username NVARCHAR(50) NOT NULL UNIQUE,
            Email NVARCHAR(100) NOT NULL UNIQUE,
            PasswordHash NVARCHAR(255) NOT NULL,
            CreateDate DATETIME DEFAULT GETDATE()
          )
        `);
        
        // Create Orders Table
        await pool.request().query(`
          CREATE TABLE Orders (
            OrderId INT PRIMARY KEY IDENTITY(1,1),
            UserId INT REFERENCES Users(UserId),
            OrderDate DATETIME DEFAULT GETDATE(),
            TotalAmount DECIMAL(10, 2) NOT NULL,
            Status NVARCHAR(20) DEFAULT 'Pending'
          )
        `);
        
        // Create OrderItems Table
        await pool.request().query(`
          CREATE TABLE OrderItems (
            OrderItemId INT PRIMARY KEY IDENTITY(1,1),
            OrderId INT REFERENCES Orders(OrderId),
            ProductId INT REFERENCES Products(ProductId),
            Quantity INT NOT NULL,
            UnitPrice DECIMAL(10, 2) NOT NULL
          )
        `);
        
        // Insert Sample Products
        await pool.request().query(`
          INSERT INTO Products (Name, Description, Price, ImageUrl, Category, StockQuantity)
          VALUES 
          ('Laptop Pro X1', 'High-performance laptop with 16GB RAM', 1299.99, 'laptop1.jpg', 'Laptops', 25),
          ('Smartphone Galaxy X', 'Latest smartphone with 5G capabilities', 899.99, 'phone1.jpg', 'Smartphones', 50),
          ('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'headphones1.jpg', 'Accessories', 100),
          ('4K Monitor', '27-inch 4K display with HDR', 349.99, 'monitor1.jpg', 'Monitors', 15),
          ('Gaming Mouse', 'RGB gaming mouse with adjustable DPI', 59.99, 'mouse1.jpg', 'Accessories', 75)
        `);
        
        console.log('Database setup completed successfully');
      } catch (err) {
        console.error('Error setting up database:', err);
        setTimeout(connectToDb, 5000);
        return;
      }
    } else {
      // Disconnect from master and connect to TechStore
      await pool.close();
      dbConfig.database = 'TechStore';
      pool = await sql.connect(dbConfig);
      console.log('Connected to TechStore database');
    }
  } catch (err) {
    console.error('Database connection failed:', err);
    setTimeout(connectToDb, 5000);
  }
};

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Products WHERE ProductId = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).send('Product not found');
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  connectToDb();
});