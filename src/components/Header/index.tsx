/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss';
import { useSession } from 'next-auth/client';

export const Header = () => {
  const [session] = useSession();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img
          src={session ? `/images/logo_active.svg` : `/images/logo.svg`}
          alt="ig.news"
        />

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
