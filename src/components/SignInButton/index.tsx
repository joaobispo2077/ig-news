import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export const SignInButton = () => {
  const [session] = useSession();

  return session ? (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#04D361" /> {session.user.name}
      <FiX color="#737380" onClick={() => signOut()} />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" /> Sign with github
    </button>
  );
};
