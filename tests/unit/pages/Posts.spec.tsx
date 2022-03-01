import { render } from '@testing-library/react';
import Posts, { getStaticProps } from '../../../src/pages/posts';

const posts = [
  {
    slug: 'mock-article',
    title: 'Mock title',
    excerpt: 'Mock excerpt'.repeat(10),
    updatedAt: 'March 1, 2020',
  },
];

describe('<Posts />', () => {
  it('should renders correctly', () => {
    const { getByText } = render(<Posts posts={posts} />);

    expect(getByText('Mock title')).toBeInTheDocument();
  });

  // it('should loads initial data', async () => {
  //   const retrieveMocked = jest.mocked(stripe.prices.retrieve);

  //   retrieveMocked.mockResolvedValueOnce({
  //     id: 'fake-price-id',
  //     unit_amount: 10000,
  //   } as unknown as Promise<Stripe.Response<Stripe.Price>>);

  //   const response = await getStaticProps({});

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         product: {
  //           priceId: 'fake-price-id',
  //           amount: '$100.00',
  //         },
  //       },
  //     }),
  //   );
  // });
});
