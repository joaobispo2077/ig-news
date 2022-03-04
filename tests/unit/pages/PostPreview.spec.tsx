import { DefaultClient } from '@prismicio/client/types/client';
import { render } from '@testing-library/react';
import PostPreview, {
  getStaticProps,
} from '../../../src/pages/posts/preview/[slug]';
import { getPrismicClient } from '../../../src/services/prismic';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

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
jest.mock('next/router');

describe('<PostPreview />', () => {
  it('should renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue([null, false]);

    const { getByText } = render(<PostPreview post={post} />);

    expect(getByText('Mock title')).toBeInTheDocument();
    expect(getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('should be able to redirect an user to real post when has a subscription', async () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValue([
      {
        activeSubscription: 'fake-active-subscription',
      },
      false,
    ] as any);

    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValue({
      push: pushMocked,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it('should be able to load initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(mockPrismicPost),
    } as unknown as DefaultClient);

    const response = await getStaticProps({
      params: {
        slug: post.slug,
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        },
      }),
    );
  });
});
