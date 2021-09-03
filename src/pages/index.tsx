/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { stripe } from '../components/services/stripe';
import { SubscribeButton } from '../components/SubscribeButton';

import styles from '../styles/home.module.scss';

export type HomeProps = {
  product: {
    priceId: string;
    amount: string;
  };
};

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.containerContent}>
        <section className={styles.hero}>
          <span>
            <span role="img" aria-label="Emoji clapping hands">
              👏
            </span>{' '}
            Hey, welcome
          </span>
          <h1>
            News about <br /> the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/woman.svg" alt="Woman coding with coffee" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRAPI_PRICING_KEY);

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24hrs = (seconds * minutes * hours)
  };
};
