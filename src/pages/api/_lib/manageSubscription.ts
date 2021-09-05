import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const { Get, Match, Index, Select } = query;
  const userRef = await fauna.query(
    Select('ref', Get(Match(Index('user_by_stripe_customer_id'), customerId))),
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionResume = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    const { Create, Collection } = query;
    await fauna.query(
      Create(Collection('subscriptions'), {
        data: subscriptionResume,
      }),
    );
  } else {
    const { Replace } = query;
    await fauna.query(
      Replace(
        Select('ref', Get(Match(Index('subscription_by_id'), subscriptionId))),
        {
          data: subscriptionResume,
        },
      ),
    );
  }
}
