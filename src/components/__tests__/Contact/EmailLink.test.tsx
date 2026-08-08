import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('renders the email domain', () => {
    render(<EmailLink />);

    expect(screen.getByText('@gmail.com')).toBeInTheDocument();
  });

  it('renders as a mailto link', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'mailto:cap.cafu@gmail.com');
  });

  it('renders the local part separately for styling', () => {
    render(<EmailLink />);

    expect(screen.getByText('cap.cafu')).toHaveClass('contact-email-prefix');
  });
});
