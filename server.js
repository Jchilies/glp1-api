const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GLP1 x402 API skeleton running' });
});

// Placeholder endpoint
// GLP1 questions from X (mocked for now)
app.get('/glp1/x-top-questions', (req, res) => {

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
app.get('/glp1/x-top-questions-paid', (req, res) => {
  const days = parseInt(req.query.days || '7', 10);
  const language = req.query.language || 'en';

  const response = {
    generated_at: new Date().toISOString(),
    time_window_days: days,
    language,
    questions: [
      {
        question: 'What are the long-term side effects of GLP-1 medications?',
        count: 132,
        keywords: ['side effects', 'long term'],
        example_tweet_ids: ['1234567890001']
      },
      {
        question: 'How long do I need to stay on Ozempic or Wegovy for weight loss?',
        count: 98,
        keywords: ['duration', 'Ozempic', 'Wegovy'],
        example_tweet_ids: ['2234567890001']
      },
      {
        question: 'Can I stop GLP-1s without regaining the weight?',
        count: 85,
        keywords: ['stopping', 'regain', 'maintenance'],
        example_tweet_ids: ['3234567890001']
      }
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
