/* eslint-disable jsx-a11y/anchor-is-valid */
import { render, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { NextRouter, useRouter } from 'next/router';
import { SubscribeButton } from '../../../../src/components/SubscribeButton';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../../../src/services/stripe/client');

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

  // it('should be able to calls redirectToCheckout logged in user and without subscription', () => {
  //   const useSessionMocked = jest.mocked(useSession);
  //   useSessionMocked.mockReturnValueOnce([
  //     {
  //       user: {
  //         name: 'John Doe',
  //         email: 'john.doe@example.com',
  //         image: 'https://avatars2.githubusercontent.com/u/1234567?v=4',
  //       },
  //     },
  //     true,
  //   ]);

  //   const { getByText } = render(<SubscribeButton />);

  //   expect(getByText('John Doe')).toBeInTheDocument();
  // });
});
