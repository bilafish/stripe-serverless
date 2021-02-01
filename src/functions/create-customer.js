const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
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

  try {
    const customer = await stripe.customers.create({
      email: email,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ customer }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error }),
    };
  }
};
