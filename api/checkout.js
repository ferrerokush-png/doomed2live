const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, email, name, itemTitle } = req.body;

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
            unit_amount: Math.round(amount * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
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
