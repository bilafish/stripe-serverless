const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
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
    expand: ["latest_invoice.payment_intent"],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(subscription),
  };
};
