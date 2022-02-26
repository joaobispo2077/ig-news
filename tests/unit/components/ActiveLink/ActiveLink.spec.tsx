/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react';
import { ActiveLink } from '../../../../src/components/ActiveLink';

jest.mock('next/router', () => {
  const nextRouterMock = {
    useRouter: () => ({
      asPath: '/',
    }),
  };

  return nextRouterMock;
});

describe('<ActiveLink />', () => {
  it('should be able to render correctly', () => {
    const { getByText, getByRole } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(getByText('Home')).toBeInTheDocument();
  });

  it('should be able receive active class', () => {
    const { getByRole } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(getByRole('link')).toHaveProperty('className', 'active');
  });
});
