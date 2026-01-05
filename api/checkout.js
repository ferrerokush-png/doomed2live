const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, email, name, itemTitle } = req.body;
    const amountNumber = Number(amount);

    if (!Number.isFinite(amountNumber)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const unitAmount = Math.round(amountNumber * 100);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const allowedOrigins = new Set([
      'http://localhost:4242',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://doomed2live.com',
      'https://www.doomed2live.com'
    ]);
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
    const baseUrl = allowedOrigins.has(origin) ? origin : process.env.PUBLIC_SITE_ORIGIN;

    if (!baseUrl) {
      return res.status(400).json({ error: 'Invalid origin' });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: itemTitle || 'Music Donation',
            },
            unit_amount: unitAmount, // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${baseUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email, // Pre-fill email
      metadata: {
        donorName: name,
        itemTitle: itemTitle
      },
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
