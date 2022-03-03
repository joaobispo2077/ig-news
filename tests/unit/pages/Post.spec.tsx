import { DefaultClient } from '@prismicio/client/types/client';
import { render } from '@testing-library/react';
import Post, { getServerSideProps } from '../../../src/pages/posts/[slug]';
import { getPrismicClient } from '../../../src/services/prismic';
import { getSession } from 'next-auth/client';

const post = {
  slug: 'mock-article',
  title: 'Mock title',
  content: '<p>Mock content</p>',
  updatedAt: 'March 1, 2020',
};

const mockPrismicPosts = [
  {
    uid: 'mock-article',
    data: {
      title: [
        {
          type: 'heading',
          text: 'Mock title',
        },
      ],
      content: [
        {
          type: 'paragraph',
          text: 'Mock excerpt',
        },
      ],
    },
    last_publication_date: '04-01-2022',
  },
];

jest.mock('../../../src/services/prismic');

jest.mock('@prismicio/client');
jest.mock('next-auth/client');

describe('<Posts />', () => {
  it('should renders correctly', () => {
    const { getByText } = render(<Post post={post} />);

    expect(getByText('Mock title')).toBeInTheDocument();
    expect(getByText('Mock content')).toBeInTheDocument();
  });

  it('should be able to redirect an user that has no subscription', async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValue({
      activeSubscription: false,
    });

    const response = await getServerSideProps({
      req: {
        cookies: null,
      },
      params: {
        slug: 'mock-article',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      }),
    );
  });

  // it('should loads initial data', async () => {
  //   const getPrismicClientMocked = jest.mocked(getPrismicClient);
  //   getPrismicClientMocked.mockReturnValueOnce({
  //     query: jest.fn().mockResolvedValueOnce({
  //       results: mockPrismicPosts,
  //     }),
  //   } as unknown as DefaultClient);

  //   const response = await getStaticProps({});

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         posts: [
  //           {
  //             slug: 'mock-article',
  //             title: 'Mock title',
  //             excerpt: 'Mock excerpt',
  //             updatedAt: '01 de abril de 2022',
  //           },
  //         ],
  //       },
  //     }),
  //   );
  // });
});
