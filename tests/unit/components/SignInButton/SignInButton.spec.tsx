/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { SignInButton } from '../../../../src/components/SignInButton';

jest.mock('next-auth/client');

describe('<SignInButton />', () => {
  it('should renders correctly when user is not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    const { getByText } = render(<SignInButton />);

    expect(getByText('Sign with github')).toBeInTheDocument();
  });

  it('should renders correctly when user is authenticated', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          image: 'https://avatars2.githubusercontent.com/u/1234567?v=4',
        },
      },
      true,
    ]);

    const { getByText } = render(<SignInButton />);

    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
