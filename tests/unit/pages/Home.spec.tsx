import { render } from '@testing-library/react';
import Home from '../../../src/pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));

describe('<Home />', () => {
  it('should renders correctly', () => {
    const { getByText } = render(
      <Home
        product={{
          priceId: 'fake-price-id',
          amount: 'R$10,00',
        }}
      />,
    );

    expect(getByText('for R$10,00 month')).toBeInTheDocument();
  });
});
