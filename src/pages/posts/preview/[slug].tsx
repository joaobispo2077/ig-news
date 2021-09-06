/* eslint-disable jsx-a11y/anchor-is-valid */
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../../services/prismic';

import styles from '../post.module.scss';
import { useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type PostProps = {
  post: Post;
};

export default function PostPreview({ post }: PostProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [post.slug, router, session]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.content} ${styles.preview}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?{' '}
            <Link href="/">
              <a>
                Subscribe now
                <span role="img" aria-label="emoji hugging">
                  🤗
                </span>
              </a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // paths: [] when is empty load static page in the first access (runtime moment)
  //  paths: [
  //    { params: { slug: '5-das-licoes-que-aprendi-em-1-mes-estagiando-como-desenvolvedor-fullstack-em-uma-tech-startup' }
  //  ] when exists some post, generate page in the build moment
  /* fallback
      true => try to generate page
      false => return 404 if static page doesnt exists
      blocking => when content there is not generated try load page with SSR
  */

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // minutes
  };
};
