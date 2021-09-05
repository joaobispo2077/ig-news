import { query } from 'faunadb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
    signingKey:
      '{"kty":"oct","kid":"Kz8d4zLqjwFJbQIEl3LtXXSuIXepiISm0LwmvofZR08","alg":"HS512","k":"Bi29iqIvWGqjgQND92HyStPNyxEXzKvLy1sVGcDUuMM"}',
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email),
                ),
              ),
            ),
            query.Create(query.Collection('users'), {
              data: { email },
            }),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email),
              ),
            ),
          ),
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
