import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeClient } from '../../services/stripe/client';
import styles from './styles.module.scss';

export type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      return router.push('/posts');
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
