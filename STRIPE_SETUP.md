# Stripe Embedded Checkout Setup Guide

## Quick Setup Steps

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)
4. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

### 2. Update Your HTML File

In `ROCHE - Music_AkiraPreview_v2.html`, find this line:
```javascript
const stripe = Stripe('pk_live_YOUR_STRIPE_PUBLIC_KEY');
```
Replace `pk_live_YOUR_STRIPE_PUBLIC_KEY` with your actual **Publishable key**.

Also update the backend URL in two places:
- In `initializeEmbeddedCheckout` function: Replace `YOUR_BACKEND_URL` with your server URL
- In the `DOMContentLoaded` event listener: Replace `YOUR_BACKEND_URL` with your server URL

**Example:** If running locally, use `http://localhost:4242`
**Example:** If deployed to Heroku/Render, use `https://your-app-name.herokuapp.com`

### 3. Set Up Backend Server

#### Option A: Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the same directory as `server.js`:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
   PORT=4242
   ```

3. Run the server:
   ```bash
   node server.js
   ```

#### Option B: Deploy to Free Hosting (Recommended)

**Render.com (Free tier):**
1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (or upload files)
4. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables: Add `STRIPE_SECRET_KEY` with your secret key
5. Deploy!

**Vercel (Free tier):**
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "server.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "server.js" }]
   }
   ```
3. Run `vercel` and follow prompts
4. Set environment variable `STRIPE_SECRET_KEY` in Vercel dashboard

**Heroku (Free tier - limited):**
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `heroku config:set STRIPE_SECRET_KEY=sk_live_YOUR_KEY`
4. Run: `git push heroku main`

### 4. Test It

1. Open your HTML file in a browser
2. Click "Download" on any track
3. Enter email and select an amount
4. Click "Complete Support"
5. You should see the Stripe checkout form embedded in your modal!

### 5. Go Live

- Switch from `pk_test_` to `pk_live_` in your HTML
- Switch from `sk_test_` to `sk_live_` in your backend `.env`
- Redeploy your backend server
- Test with a real payment (small amount first!)

## Troubleshooting

**"Failed to initialize checkout":**
- Check that your backend server is running
- Verify the backend URL is correct in your HTML
- Check browser console for CORS errors

**Checkout doesn't appear:**
- Make sure you've replaced `YOUR_BACKEND_URL` in the HTML file
- Verify your Stripe publishable key is correct
- Check that the backend server is accessible

**Payment succeeds but download doesn't trigger:**
- Check the browser console for errors
- Verify the `downloadUrl` in your `musicData` is correct
- Check that the session status endpoint is working

## Security Notes

- ⚠️ Never commit your `.env` file or secret keys to GitHub
- ✅ Always use HTTPS in production
- ✅ Keep your secret keys safe - they can charge cards!

## Need Help?

- Stripe Docs: https://docs.stripe.com/payments/checkout/embedded
- Stripe Support: https://support.stripe.com/

