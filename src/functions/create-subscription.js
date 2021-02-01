const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { paymentMethodId, customerId } = JSON.parse(event.body);
  let paymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentMethod }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
};
