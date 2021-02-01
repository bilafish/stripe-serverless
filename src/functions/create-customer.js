const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  try {
    const customer = await stripe.customers.create({
      email: email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ customer }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
};
