const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { session_id } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        const customerEmail = session.customer_details ? session.customer_details.email : null;

        res.status(200).json({
            status: session.status,
            customer_email: customerEmail
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
