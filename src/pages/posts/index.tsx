import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#a">
            <time>12 de março de 2021</time>
            <strong>How Stripe Designs Beautiful Websites</strong>
            <p>
              Examining the tips and tricks used to make Stripes website design
              a notch above the rest.
            </p>
          </a>
          <a href="#a">
            <time>12 de março de 2021</time>
            <strong>How Stripe Designs Beautiful Websites</strong>
            <p>
              Examining the tips and tricks used to make Stripes website design
              a notch above the rest.
            </p>
          </a>
          <a href="#a">
            <time>12 de março de 2021</time>
            <strong>How Stripe Designs Beautiful Websites</strong>
            <p>
              Examining the tips and tricks used to make Stripes website design
              a notch above the rest.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    },
  );

  console.info(response);

  return {
    props: {},
  };
};
