import { DefaultClient } from '@prismicio/client/types/client';
import { render } from '@testing-library/react';
import PostPreview, {
  getStaticProps,
} from '../../../src/pages/posts/preview/[slug]';
import { getPrismicClient } from '../../../src/services/prismic';
import { getSession, useSession } from 'next-auth/client';

const post = {
  slug: 'mock-article',
  title: 'Mock title',
  content: '<p>Mock content</p>',
  updatedAt: '01 de abril de 2022',
};

const mockPrismicPost = {
  last_publication_date: '04-01-2022',
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
        text: 'Mock content',
      },
    ],
  },
};

jest.mock('../../../src/services/prismic');

jest.mock('@prismicio/client');
jest.mock('next-auth/client');

describe('<PostPreview />', () => {
  it('should renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue([null, false]);

    const { getByText } = render(<PostPreview post={post} />);

    expect(getByText('Mock title')).toBeInTheDocument();
    expect(getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  // it('should be able to redirect an user that has no subscription', async () => {
  //   const getSessionMocked = jest.mocked(getSession);
  //   getSessionMocked.mockResolvedValue({
  //     activeSubscription: null,
  //   });

  //   const response = await getServerSideProps({
  //     req: {
  //       cookies: null,
  //     },
  //     params: {
  //       slug: 'mock-article',
  //     },
  //   } as any);

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       redirect: {
  //         destination: '/',
  //         permanent: false,
  //       },
  //     }),
  //   );
  // });

  // it('should be able to returns post when user has an active subscription', async () => {
  //   const getSessionMocked = jest.mocked(getSession);
  //   getSessionMocked.mockResolvedValue({
  //     activeSubscription: 'fake-active-subscription',
  //   });

  //   const getPrismicClientMocked = jest.mocked(getPrismicClient);
  //   getPrismicClientMocked.mockReturnValueOnce({
  //     getByUID: jest.fn().mockResolvedValueOnce(mockPrismicPost),
  //   } as unknown as DefaultClient);

  //   const response = await getServerSideProps({
  //     req: {
  //       cookies: null,
  //     },
  //     params: {
  //       slug: 'mock-article',
  //     },
  //   } as any);

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         post,
  //       },
  //     }),
  //   );
  // });
});
