/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';
import { useRouter } from 'next/router';
// import Image from 'next/image';

import styles from './styles.module.scss';

export const Header = () => {
  const { asPath } = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};
