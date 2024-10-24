
# Backend setup with Express.js, PostgreSQL, and CORS

# Importing required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express(); // Initializing Express
const port = 5000; // Setting port for backend

# Configuring PostgreSQL connection pool
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

app.use(cors()); // Enabling CORS for frontend-backend communication
app.use(bodyParser.json()); // Parsing incoming JSON requests

# Route to fetch all products
app.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows); // Returning products as JSON
});

# Route to add a new product
app.post('/products', async (req, res) => {
    const { name, description, price, quantity } = req.body;
    const result = await pool.query(
        'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, quantity]
    );
    res.status(201).json(result.rows[0]); // Returning the newly created product
});

# Route to update an existing product by ID
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
        [name, description, price, quantity, id]
    );
    res.json(result.rows[0]); // Returning the updated product
});

# Route to delete a product by ID
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.sendStatus(204); // Sending success response without content
});

# Start the backend server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
