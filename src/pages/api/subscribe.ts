import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/client';
import { NextApiResponse } from 'next-auth/internals/utils';
import { stripe } from '../../services/stripe';

/* eslint-disable import/no-anonymous-default-export */
export default async (request: NextApiRequest, response: NextApiResponse) => {
  console.info('running subscription');
  try {
    if (request.method === 'POST') {
      const session = await getSession({ req: request });

      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata: {}
      });

      const stripeCheckouSession = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
          {
            price: process.env.STRAPI_PRICING_KEY,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRAPI_CHECKOUT_SUCCESS_URL,
        cancel_url: process.env.STRAPI_CHECKOUT_CANCEL_URL,
      });

      return response.status(200).json({ sessionId: stripeCheckouSession.id });
    } else {
      response.setHeader('Allow', ['POST']);
      response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error) {
    console.info('holly godness', error);
    console.log(error.name);
    console.log(error.message);
    response.status(500).end(`Something went wrong`);
  }
};
