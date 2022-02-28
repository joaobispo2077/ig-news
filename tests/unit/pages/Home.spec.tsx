import { render } from '@testing-library/react';
import Stripe from 'stripe';
import Home, { getStaticProps } from '../../../src/pages';
import { stripe } from '../../../src/services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));

jest.mock('../../../src/services/stripe');

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

  it('should loads initial data', async () => {
    const retrieveMocked = jest.mocked(stripe.prices.retrieve);

    retrieveMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 10000,
    } as unknown as Promise<Stripe.Response<Stripe.Price>>);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$100.00',
          },
        },
      }),
    );
  });
});
