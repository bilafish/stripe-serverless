const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Handle Preflight request
  // To enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "This is a preflight request!",
    };
  }

  const { customerId, priceId } = JSON.parse(event.body);

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    collection_method: "send_invoice",
    expand: ["latest_invoice.payment_intent"],
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(subscription),
  };
};
