const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const http = require('http');
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
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Mount API Routes
app.post('/api/checkout', checkoutHandler);
app.get('/api/config', configHandler);
app.get('/api/session-status', sessionStatusHandler);

function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string' && xForwardedFor.length) {
        return xForwardedFor.split(',')[0].trim();
    }
    return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '';
}

function normalizeIp(ip) {
    if (!ip) return '';
    if (ip.startsWith('::ffff:')) return ip.slice('::ffff:'.length);
    return ip;
}

function isPrivateIp(ip) {
    if (!ip) return true;
    if (ip === '::1' || ip === '127.0.0.1') return true;
    if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;

    if (ip.startsWith('172.')) {
        const parts = ip.split('.');
        const secondOctet = Number(parts[1]);
        if (Number.isFinite(secondOctet) && secondOctet >= 16 && secondOctet <= 31) return true;
    }

    return false;
}

function countryCodeFromHeaders(req) {
    const headerKeys = ['cf-ipcountry', 'x-vercel-ip-country', 'x-country-code'];
    for (const key of headerKeys) {
        const value = req.headers[key];
        if (typeof value === 'string' && value.length && value !== 'XX') return value.toUpperCase();
    }
    return null;
}

function buildLookupUrl(baseUrl, ip) {
    if (baseUrl.includes('{ip}')) return baseUrl.split('{ip}').join(encodeURIComponent(ip));

    const url = new URL(baseUrl);
    if (!url.searchParams.has('ip')) {
        url.searchParams.set('ip', ip);
    }
    return url.toString();
}

function getJson(url, timeoutMs = 1500) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const client = parsed.protocol === 'http:' ? http : https;

        const req = client.get(parsed, (resp) => {
            let data = '';
            resp.on('data', (chunk) => (data += chunk));
            resp.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error('timeout'));
        });
    });
}

// NOTE: /api/region removed; support modal uses local-only detection.

// Fallback for SPA/Static site
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(publicDir, 'index.html'));
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Void server running on port ${port}`));
