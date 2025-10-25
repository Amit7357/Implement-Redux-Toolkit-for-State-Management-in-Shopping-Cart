
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>My Shop - Redux Toolkit Cart</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [] // { id, name, price, quantity }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // action.payload: { id, name, price }
      const { id, name, price } = action.payload;
      const existing = state.items.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, name, price, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      // payload: id
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      // payload: { id, quantity }
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import React from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

export default function App() {
  return (
    <div className="page">
      <header>
        <h1>My Shop</h1>
      </header>

      <main>
        <h2 className="section-title">Products</h2>
        <ProductList />

        <h2 className="section-title">Shopping Cart</h2>
        <Cart />
      </main>
      <footer className="footer-note">Redux Toolkit demo — that's how grown-ups do state.</footer>
    </div>
  );
}

import React from "react";
import ProductCard from "./ProductCard";

/*
 Simple product data. In a real app you'd fetch this.
 The IDs are stable so cart slice can identify items.
*/
const PRODUCTS = [
  { id: "p1", name: "Laptop", price: 1200 },
  { id: "p2", name: "Mouse", price: 25 },
  { id: "p3", name: "Keyboard", price: 45 },
];

export default function ProductList() {
  return (
    <div className="product-list">
      {PRODUCTS.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <div className="price">${product.price}</div>
      <button
        className="btn"
        onClick={() => dispatch(addToCart({ id: product.id, name: product.name, price: product.price }))}
      >
        Add to Cart
      </button>
    </div>
  );
}

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../slices/cartSlice";

export default function Cart() {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  if (items.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  return (
    <div className="cart">
      {items.map(item => (
        <div className="cart-row" key={item.id}>
          <div className="cart-name">{item.name} (${item.price})</div>
          <input
            className="qty-input"
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: e.target.value }))}
          />
          <button className="btn small" onClick={() => dispatch(removeFromCart(item.id))}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <strong>Total:</strong> ${total.toFixed(2)}
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={() => { dispatch(clearCart()); }}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

/* Basic reset */
* { box-sizing: border-box; }
body {
  font-family: "Georgia", serif;
  margin: 0;
  background: #fff;
  color: #111;
  padding: 30px;
}

/* Page container mimic screenshot */
.page {
  max-width: 1100px;
  margin: 0 auto;
  border: 3px solid #333;
  padding: 30px;
  min-height: 80vh;
}

/* Headings */
header h1 {
  text-align: center;
  font-size: 48px;
  margin: 0 0 10px 0;
}

.section-title {
  text-align: center;
  font-size: 36px;
  margin: 30px 0 10px;
}

/* Products grid like screenshot */
.product-list {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin: 20px 0 40px;
  flex-wrap: wrap;
}

.product-card {
  width: 220px;
  height: 220px;
  border-radius: 10px;
  border: 2px solid #eee;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.02) inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #fff;
}

.product-card h3 {
  margin: 8px 0;
  font-size: 26px;
}

.price {
  margin: 8px 0 16px 0;
  font-size: 20px;
}

/* Buttons */
.btn {
  border: 2px solid #888;
  padding: 6px 14px;
  border-radius: 4px;
  background: #eee;
  cursor: pointer;
  font-size: 16px;
}

.btn.small {
  padding: 6px 10px;
  font-size: 14px;
}

/* Cart */
.cart {
  max-width: 720px;
  margin: 0 auto;
  padding: 10px 20px;
}

.cart-empty {
  text-align: center;
  font-size: 20px;
  margin: 12px 0 40px;
}

.cart-row {
  display: flex;
  gap: 16px;
  align-items: center;
  margin: 12px 0;
}

.cart-name {
  flex: 1;
  font-size: 18px;
}

.qty-input {
  width: 64px;
  padding: 6px;
  font-size: 16px;
}

/* Summary */
.cart-summary {
  margin-top: 20px;
  text-align: left;
  font-size: 18px;
}

/* Footer note */
.footer-note {
  margin-top: 20px;
  font-size: 12px;
  text-align: center;
  color: #666;
}