import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumePage from '../page';

const cvFileId = '1bNSf1muTz0EDR9Bj3begTiwQYO5B59Gw';
const cvDownloadUrl = `https://drive.google.com/uc?export=download&id=${cvFileId}`;
const cvViewUrl = `https://drive.google.com/file/d/${cvFileId}/view?usp=sharing`;

describe('ResumePage', () => {
  it('renders CV actions between the summary and section navigation', () => {
    render(<ResumePage />);

    const summary = screen.getByText(/For a short version/i);
    const actions = screen.getByLabelText('CV actions');
    const navigation = screen.getByRole('navigation', {
      name: 'Resume sections',
    });

    expect(summary.compareDocumentPosition(actions)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(actions.compareDocumentPosition(navigation)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('links to the CV download and browser view', () => {
    render(<ResumePage />);

    const downloadLink = screen.getByRole('link', { name: /download cv/i });
    const viewLink = screen.getByRole('link', { name: /view cv/i });

    expect(downloadLink).toHaveAttribute('href', cvDownloadUrl);
    expect(downloadLink).toHaveAttribute('target', '_blank');
    expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(viewLink).toHaveAttribute('href', cvViewUrl);
    expect(viewLink).toHaveAttribute('target', '_blank');
    expect(viewLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
