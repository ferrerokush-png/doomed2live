const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import API handlers
const checkoutHandler = require('./api/checkout');
const configHandler = require('./api/config');
const sessionStatusHandler = require('./api/session-status');

const app = express();

// Security: Stricter CORS
const allowedOrigins = [
    'http://localhost:4242',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://doomed2live.com',
    'https://www.doomed2live.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, '.')));

// Mount API Routes
app.post('/api/checkout', checkoutHandler);
app.get('/api/config', configHandler);
app.get('/api/session-status', sessionStatusHandler);

// Fallback for SPA/Static site
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Void server running on port ${port}`));
