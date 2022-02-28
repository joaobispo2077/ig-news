/* eslint-disable jsx-a11y/anchor-is-valid */
import { Stripe } from '@stripe/stripe-js';
import { render, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { NextRouter, useRouter } from 'next/router';
import { SubscribeButton } from '../../../../src/components/SubscribeButton';
import { api } from '../../../../src/services/api';
import { getStripeClient } from '../../../../src/services/stripe/client';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../../../src/services/stripe/client');
jest.mock('../../../../src/services/api');

describe('<SubscribeButton />', () => {
  it('should be able to calls signIn function when user is not signed in', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    const signInMocked = jest.mocked(signIn);
    signInMocked.mockReturnValueOnce(jest.fn());

    const { getByText } = render(<SubscribeButton priceId="abc" />);

    const button = getByText('Subscribe now');
    fireEvent.click(button);

    expect(signInMocked).toHaveBeenCalledWith('github');
  });

  it('should be able to redirect to /posts if user already have a subscription and is logged in', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: true,
      },
      true,
    ]);

    const useRouterMocked = jest.mocked<() => NextRouter>(useRouter);
    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as unknown as NextRouter);

    const { getByText } = render(<SubscribeButton priceId="abc" />);

    const button = getByText('Subscribe now');
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });

  it('should be able to calls redirectToCheckout when user was logged in and has no subscription', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: false,
      },
      true,
    ]);

    const sessionId = 'odlkfhjdaskghsd-random-session-id';

    const apiMocked = api as jest.Mocked<typeof api>;
    apiMocked.post.mockReturnValueOnce(
      Promise.resolve({
        data: {
          sessionId,
        },
      }),
    );

    const getStripeClientMocked = jest.mocked(getStripeClient);
    const redirectToCheckoutMock = jest.fn().mockResolvedValueOnce({});

    getStripeClientMocked.mockResolvedValueOnce({
      redirectToCheckout: redirectToCheckoutMock,
    } as unknown as Stripe);

    const { getByText } = render(<SubscribeButton priceId="abc" />);

    const button = getByText('Subscribe now');
    fireEvent.click(button);

    expect(apiMocked.post).toHaveBeenCalledWith('/subscribe');
    expect(getStripeClientMocked).toHaveBeenCalled();
    expect(redirectToCheckoutMock).toHaveBeenCalledWith({
      sessionId,
    });
  });
});
