import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
) {
  console.info('initiating saveSubscription...');
  const { Get, Match, Index, Select } = query;
  const userRef = await fauna.query(
    Select('ref', Get(Match(Index('user_by_stripe_customer_id'), customerId))),
  );
  console.info('REF is: ', userRef);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionResume = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  const { Create, Collection } = query;
  await fauna.query(
    Create(Collection('subscriptions'), {
      data: subscriptionResume,
    }),
  );

  console.info('saving user subscription...', subscriptionId, customerId);
}
