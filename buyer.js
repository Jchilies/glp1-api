const { x402Client, wrapFetchWithPayment, x402HTTPClient } = require("@x402/fetch");
const { registerExactEvmScheme } = require("@x402/evm/exact/client");
const { privateKeyToAccount } = require("viem/accounts");
require("dotenv").config();

const buyerPrivateKey = process.env.BUYER_PRIVATE_KEY;

if (!buyerPrivateKey) {
  throw new Error("Missing BUYER_PRIVATE_KEY in .env");
}

const signer = privateKeyToAccount(buyerPrivateKey);

const client = new x402Client();
registerExactEvmScheme(client, { signer });

const fetchWithPayment = wrapFetchWithPayment(fetch, client);

async function run() {
  const url = "https://glp1-x402-api.onrender.com/glp1/x-top-questions-paid";

  const response = await fetchWithPayment(url, {
    method: "GET"
  });

  console.log("Status:", response.status);
  console.log("Content-Type:", response.headers.get("content-type"));

  const text = await response.text();
  console.log("Raw response:", text);

  if (response.ok) {
    const httpClient = new x402HTTPClient(client);
    const paymentResponse = httpClient.getPaymentSettleResponse(
      (name) => response.headers.get(name)
    );
    console.log("Payment settled:", paymentResponse);
  }
}

run().catch(console.error);
