import { render, screen } from '@testing-library/react';
import { AsyncExample } from '../../../../src/components/AsyncExample';

describe('<AsyncExample />', () => {
  it('should renders correctly', async () => {
    render(<AsyncExample />);

    // expect(screen.getByText('Click me')).toBeInTheDocument(); get dont await
    expect(await screen.findByText('Click me')).toBeInTheDocument();
  });
});
