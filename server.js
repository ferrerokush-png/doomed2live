// Simple Node.js/Express backend for Stripe Embedded Checkout
// Run this with: node server.js (requires: npm install express stripe cors dotenv)

const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Get from Stripe Dashboard
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Allow your HTML site to talk to this server

// Create a Checkout Session for Embedded Checkout
app.post('/create-checkout-session', async (req, res) => {
    const { amount, email, name, itemTitle } = req.body;

    try {
        // Convert amount to pence (Stripe uses smallest currency unit)
        const amountInPence = Math.round(amount * 100);

        // Create a Checkout Session for embedded checkout
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded', // This makes it embeddable
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: itemTitle || 'ROCHÈ Music Support',
                            description: `Pay what you want support for ${itemTitle}`,
                        },
                        unit_amount: amountInPence, // Amount in pence
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            mode: 'payment',
            return_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                customer_name: name || '',
                item_title: itemTitle || '',
            },
        });

        res.send({ clientSecret: session.client_secret });
    } catch (error) {
        res.status(400).send({ error: { message: error.message } });
    }
});

// Retrieve Checkout Session status (for handling success)
app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
        status: session.status,
        customer_email: session.customer_details?.email,
    });
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Void server running on port ${port}`));

