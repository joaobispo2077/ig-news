/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffering(readable: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

const relevantEvents = new Set(['checkout.session.completed']);
export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const buf = await buffering(request);
    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRAPI_WEBHOOK_SECRET,
      );
    } catch (error) {
      console.error(error);
      return response.status(400).send(`Webhook error: ${error.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      console.log(`Received event`, type, event);
    }

    return response.json({
      received: true,
    });
  } else {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
