const express = require('express');
const { x402Express } = require('x402-express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GLP1 x402 API skeleton running' });
});

// Placeholder endpoint
// GLP1 questions from X (mocked for now)
const paywall = x402Express({
  price: '0.10', // 10 cents
  assetCode: 'USD',
  network: 'base-sepolia', // safer test network
  description: 'Access GLP1 top questions'
});
app.get('/glp1/x-top-questions', paywall, (req, res) => {
  const days = parseInt(req.query.days || '7', 10);
  const language = req.query.language || 'en';

  const response = {
    generated_at: new Date().toISOString(),
    time_window_days: days,
    language,
    questions: [
      // ...your existing questions array...
    ]
  };

  res.json(response);
});

 

// Start server only when run directly (not when imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GLP1 API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
