require('dotenv').config()
const express = require('express');
const Order = require('./models/order.model');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cookieParser());
app.use(express.json());
// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200'
}));

// Checkout Process
app.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id']; // Assuming the user ID is passed in the headers

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch orders for the user
        const orders = await Order.find({ userId });
        console.log('orders', orders);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
});

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
mongoose.connect(`${url}/${dbName}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
