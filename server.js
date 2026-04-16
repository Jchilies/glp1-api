const express = require("express");
const { paymentMiddleware, x402ResourceServer } = require("@x402/express");
const { ExactEvmScheme } = require("@x402/evm/exact/server");
const { HTTPFacilitatorClient } = require("@x402/core/server");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const payTo = process.env.PAY_TO;

app.use(express.json());

if (!payTo) {
  throw new Error("Missing PAY_TO in environment variables");
}

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://api.cdp.coinbase.com/platform/v2/x402"
});

const x402Server = new x402ResourceServer(facilitatorClient).register(
  "eip155:8453",
  new ExactEvmScheme()
);

function buildQuestions(days, language) {
  return {
    generated_at: new Date().toISOString(),
    time_window_days: days,
    language,
    questions: [
      {
        question: "What are people saying about GLP-1 side effects this week?",
        count: 18,
        keywords: ["glp1", "side effects", "nausea"],
        example_tweet_ids: ["1001", "1002"]
      },
      {
        question: "Are people talking more about Ozempic or Wegovy right now?",
        count: 14,
        keywords: ["ozempic", "wegovy", "comparison"],
        example_tweet_ids: ["1003", "1004"]
      },
      {
        question: "What are the most discussed reasons people stop taking GLP-1 drugs?",
        count: 11,
        keywords: ["glp1", "stopping", "cost"],
        example_tweet_ids: ["1005", "1006"]
      },
      {
        question: "Which GLP-1 side effects are mentioned most often in recent posts?",
        count: 16,
        keywords: ["glp1", "side effects", "fatigue"],
        example_tweet_ids: ["1007", "1008"]
      },
      {
        question: "Are users discussing weight regain after stopping GLP-1 medications?",
        count: 9,
        keywords: ["weight regain", "glp1", "stopping"],
        example_tweet_ids: ["1009", "1010"]
      }
    ]
  };
}

app.use(
  paymentMiddleware(
    {
      "GET /glp1/x-top-questions-paid": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.01",
            network: "eip155:8453",
            payTo: payTo
          }
        ],
        description: "Premium GLP-1 questions API",
        mimeType: "application/json"
      }
    },
    x402Server
  )
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "GLP1 x402 API running"
  });
});

app.get("/glp1/x-top-questions", (req, res) => {
  const days = parseInt(req.query.days || "7", 10);
  const language = req.query.language || "en";

  res.json(buildQuestions(days, language));
});

app.get("/glp1/x-top-questions-paid", (req, res) => {
  const days = parseInt(req.query.days || "7", 10);
  const language = req.query.language || "en";

  res.json(buildQuestions(days, language));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GLP1 API listening on port ${PORT}`);
  });
}

module.exports = app;
