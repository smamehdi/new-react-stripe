import Stripe from "stripe";

const stripe = new Stripe('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', {apiVersion: '2024-04-10'});

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "cad",
      });

      res.status(200).send(paymentIntent.client_secret);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
