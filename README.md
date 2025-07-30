# 🧶 Crochet E-Commerce API

This is a RESTful API for an e-commerce platform built with **Node.js**, **Express**, **MongoDB**, and **JWT** authentication. It allows users to register, log in, view products, manage carts, and make payments via **Paystack**. Admins can manage products and update order statuses.

---

## 🌐 Live Demo

> 🔗 [View the Live API on Render](https://your-deployed-api.onrender.com)

> 🔍 **Swagger API Docs**:  
Visit the link above and **append `/api-docs`** to access the full API documentation:  



You can test endpoints directly in the browser, including protected routes (with JWT token support).

---

## 🚀 Features

### 👤 Authentication
- Register new users
- Login & receive JWT token
- Protected routes for authenticated users

### 🛍️ Products
- View all products
- View a product by ID
- Admin: create, update, delete products

### 🛒 Cart
- Add items to cart
- Remove items
- View current cart

### 💳 Payment (Paystack)
- Initialize secure payment
- Verify payment and create order
- Only verified payments create orders

### 📦 Orders
- Users: view their own orders
- Admin: update order status to `processing`, `shipped`, `delivered`

### 📚 Swagger Documentation
- Auto-generated API docs via Swagger UI
- Try routes in-browser
- Login via JWT (Authorize button)

---

## 🔧 Technologies

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Paystack API (for payments)
- Swagger (API documentation)

---
