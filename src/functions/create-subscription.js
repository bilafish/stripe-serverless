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

  const { paymentMethodId, customerId, priceId } = JSON.parse(event.body);
  let paymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        error: {
          message: error.message,
        },
      }),
    };
  }

  let updateCustomerDefaultPaymentMethod = await stripe.customers.update(
    customerId,
    {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    }
  );

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: 7,
    expand: ["latest_invoice.payment_intent"],
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(subscription),
  };
};
