/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react';
import { Header } from '../../../../src/components/Header';

jest.mock('next/router', () => {
  const nextRouterMock = {
    useRouter: () => ({
      asPath: '/',
    }),
  };

  return nextRouterMock;
});

jest.mock('next-auth/client', () => {
  const nextAuthClientMock = {
    useSession: () => [null, false],
  };

  return nextAuthClientMock;
});

describe('<Header />', () => {
  it('should be able to render correctly', () => {
    const { getByText } = render(<Header />);

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Posts')).toBeInTheDocument();
  });
});
