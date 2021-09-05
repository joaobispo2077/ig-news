import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeClient } from '../../services/stripe/client';
import styles from './styles.module.scss';

export type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;

      const stripeClient = await getStripeClient();
      await stripeClient.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
