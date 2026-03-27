# GLP-1 × API

A lightweight Express API that surfaces trending GLP-1 questions from X (formerly Twitter).  
Currently serves mocked data — swap in a real data source when ready.

## Quick Start

```bash
npm install
npm start          # → http://localhost:3000
```

## Endpoints

### `GET /`

Health check.

```bash
curl http://localhost:3000/
# {"status":"ok","message":"GLP1 x402 API skeleton running"}
```

### `GET /glp1/x-top-questions`

Returns the most-asked GLP-1 questions on X.

| Query Param | Default | Description                       |
|-------------|---------|-----------------------------------|
| `days`      | `7`     | Look-back window in days          |
| `language`  | `en`    | ISO 639-1 language code to filter |

```bash
# Defaults (last 7 days, English)
curl http://localhost:3000/glp1/x-top-questions

# Custom: last 30 days, Spanish
curl "http://localhost:3000/glp1/x-top-questions?days=30&language=es"
```

Example response:

```json
{
  "generated_at": "2026-03-24T20:00:00.000Z",
  "time_window_days": 7,
  "language": "en",
  "questions": [
    {
      "question": "What are the long-term side effects of GLP-1 medications?",
      "count": 132,
      "keywords": ["side effects", "long term", "GLP-1"],
      "example_tweet_ids": ["1234567890001", "1234567890002", "1234567890003"]
    }
  ]
}
```

## Tests

```bash
npm test
```

Tests use [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) and cover:

- Health-check response
- Default and custom query parameters (`days`, `language`)
- Response shape validation (fields, types)
- ISO timestamp format

## Project Structure

```
.
├── server.js               # Express app + routes
├── package.json
├── README.md
└── __tests__/
    └── server.test.js      # API integration tests
```

## License

MIT
