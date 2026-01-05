# DOOMED2LIVE

Official website codebase for ROCHÈ.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Stripe keys:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   ```

3. Run the development server:
   ```bash
   npm start
   ```

   The site will be available at `http://localhost:4242`.

## Architecture

- `server.js`: Express server that handles the backend API and serves the frontend.
- `index.html`: Main entry point (Structure).
- `style.css`: Visual styling (Aesthetics).
- `script.js`: Frontend logic and interaction.
- `api/`: Backend logic for Stripe payments.
