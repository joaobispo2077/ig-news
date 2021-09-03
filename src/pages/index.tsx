import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';

import styles from '../styles/home.module.scss';
export default function Home() {
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
            <span>for $9.90/month</span>
          </p>

          <SubscribeButton />
        </section>
        <img src="/images/woman.svg" alt="Woman coding with coffee" />
      </main>
    </>
  );
}
