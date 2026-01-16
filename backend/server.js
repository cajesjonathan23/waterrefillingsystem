const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// 1. Middleware (Open for Localhost Testing)
app.use(cors()); 
app.use(express.json());

// 2. Database Connection (Back to Localhost)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your local MySQL username
    password: '',      // Your local MySQL password
    database: 'water_station' // Your local database name
});

db.connect(err => {
    if (err) { 
        console.error('❌ Local DB Connection Error:', err.message); 
        return; 
    }
    console.log('✅ Connected to Local MySQL!');
});

// 3. Routes

// Create Order
app.post('/api/orders', (req, res) => {
    const { customer_name, phone, address, product_name, quantity, total_amount, payment_method } = req.body;
    const order_date = new Date().toLocaleString();
    const sql = "INSERT INTO orders (customer_name, phone, address, product_name, quantity, total_amount, payment_method, status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)";
    
    db.query(sql, [customer_name, phone, address, product_name, quantity, total_amount, payment_method, order_date], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ orderId: result.insertId, date: order_date });
    });
});

// Get All Orders
app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY id DESC", (err, results) => res.json(results));
});

// Get Single Order
app.get('/api/orders/:id', (req, res) => {
    db.query("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, result) => res.json(result[0]));
});

// Update Status
app.patch('/api/orders/:id', (req, res) => {
    db.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.send("Updated"));
});

// 4. Server Start (Locked to Port 5000)
app.listen(5000, () => {
    console.log("🚀 Local Server running on http://localhost:5000");
});