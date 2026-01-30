const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// 1. Middleware (Open for Localhost Testing)
app.use(cors()); 
app.use(express.json());

// 2. THE HEALTH CHECK (Put it right here!)
app.get("/", (req, res) => {
  res.status(200).send("Server is Active");
});

// 2. Database Connection (Back to Localhost)
const db = mysql.createConnection({
    host: 'aquaflow-db-mysql-jonathan17cajes-e908.j.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_r2CB5cYQLuWyWr8iJPx',
    database: 'defaultdb',
    port: 24733,
    ssl: {
        rejectUnauthorized: false // This is mandatory for Aiven
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to Aiven MySQL:', err.message);
        return;
    }
    console.log('Successfully connected to Aiven Cloud Database!');
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

// Delete Order
app.delete('/api/orders/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting from database:", err);
            return res.status(500).send(err);
        }
        res.status(200).send("Order deleted successfully");
    });
});
// 4. Server Start (Dynamic Port for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});