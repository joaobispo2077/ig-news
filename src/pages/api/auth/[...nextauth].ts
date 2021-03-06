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
    async session(session) {
      try {
        const { Get, Match, Index, Select, Casefold, Intersection } = query;
        const userActiveSubscription = await fauna.query(
          Get(
            Intersection([
              Match(
                Index('subscription_by_user_ref'),
                Select(
                  'ref',
                  Get(
                    Match(Index('user_by_email'), Casefold(session.user.email)),
                  ),
                ),
              ),
              Match(Index('subscription_by_status'), 'active'),
            ]),
          ),
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch (e) {
        console.log(e);
        return { ...session, activeSubscription: null };
      }
    },
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
