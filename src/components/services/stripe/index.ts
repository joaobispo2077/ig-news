import Stripe from 'stripe';
import { version } from '../../../../package.json';

export const stripe = new Stripe(process.env.STRAPI_API_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'dev-study-test',
    version: version,
  },
});
