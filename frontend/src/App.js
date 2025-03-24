// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    axios.get('http://localhost:3001/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.ProductId === product.ProductId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.ProductId === product.ProductId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tech E-Commerce Store</h1>
      </header>
      
      <main>
        <div className="products-container">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.ProductId} className="product-card">
                <div className="product-image">
                  <img src={`/images/${product.ImageUrl}`} alt={product.Name} />
                </div>
                <h3>{product.Name}</h3>
                <p>{product.Description}</p>
                <p className="price">${product.Price.toFixed(2)}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.ProductId} className="cart-item">
                  <h3>{item.Name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${(item.Price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="cart-total">
                <h3>Total: ${cart.reduce((total, item) => total + (item.Price * item.quantity), 0).toFixed(2)}</h3>
                <button>Checkout</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;