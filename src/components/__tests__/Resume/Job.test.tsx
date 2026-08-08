import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Job from '../../Resume/Experience/Job';

describe('Job', () => {
  const mockJob = {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-15',
    endDate: '2023-06-30',
    location: 'Tokyo, Japan',
    summary: 'Led development of **critical systems**.',
    highlights: ['Shipped feature X', 'Improved performance by 50%'],
  };

  it('renders company name with link', () => {
    render(<Job data={mockJob} />);

    const link = screen.getByRole('link', { name: /acme corp/i });
    expect(link).toHaveAttribute('href', 'https://acme.com');
  });

  it('renders position title on its own line below the heading', () => {
    render(<Job data={mockJob} />);

    const role = document.querySelector('.role');

    expect(role).toHaveTextContent('Senior Engineer');
    expect(screen.getByRole('heading', { level: 4 })).not.toContainElement(
      role as HTMLElement,
    );
  });

  it('renders the department after the company name', () => {
    render(<Job data={{ ...mockJob, department: 'Platform Team' }} />);

    const heading = screen.getByRole('heading', { level: 4 });

    expect(heading).toHaveTextContent('Acme Corp, Platform Team');
    expect(heading.querySelector('.job-department')).toHaveTextContent(
      'Platform Team',
    );
  });

  it('keeps the department outside the company link', () => {
    render(<Job data={{ ...mockJob, department: 'Platform Team' }} />);

    const link = screen.getByRole('link', { name: /acme corp/i });

    expect(link).toHaveTextContent('Acme Corp');
    expect(link.textContent).not.toContain('Platform Team');
  });

  it('omits the department separator when absent', () => {
    render(<Job data={mockJob} />);

    const heading = screen.getByRole('heading', { level: 4 });

    expect(heading).toHaveTextContent('Acme Corp');
    expect(heading.textContent).not.toContain(',');
    expect(document.querySelector('.job-department')).toBeNull();
  });

  it('formats date range correctly', () => {
    render(<Job data={mockJob} />);

    expect(screen.getByText(/january 2020/i)).toBeInTheDocument();
    expect(screen.getByText(/june 2023/i)).toBeInTheDocument();
  });

  it('renders location opposite the date range', () => {
    render(<Job data={mockJob} />);

    const metadata = document.querySelector('.job-meta');

    expect(metadata).toContainElement(screen.getByText(/january 2020/i));
    expect(metadata).toContainElement(screen.getByText('Tokyo, Japan'));
  });

  it('shows Present for current job (no end date)', () => {
    const currentJob = {
      ...mockJob,
      endDate: undefined,
    };

    render(<Job data={currentJob} />);

    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });

  it('renders summary with markdown', () => {
    render(<Job data={mockJob} />);

    // Summary text should be present
    expect(screen.getByText(/led development of/i)).toBeInTheDocument();
  });

  it('renders highlights as list items', () => {
    render(<Job data={mockJob} />);

    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Improved performance by 50%')).toBeInTheDocument();

    const listItems = document.querySelectorAll('.points > li');
    expect(listItems.length).toBe(2);
  });

  it('renders detailed highlights with a nested detail list', () => {
    const jobWithDetails = {
      ...mockJob,
      highlights: [
        {
          summary: 'Built the calibration pipeline',
          details: ['Camera intrinsics', 'LiDAR–camera extrinsics'],
        },
        'Shipped feature X',
      ],
    };

    render(<Job data={jobWithDetails} />);

    expect(screen.getByText(/built the calibration pipeline/i)).toBeVisible();

    const details = document.querySelectorAll('.point-details > li');
    expect(details.length).toBe(2);
    expect(details[0]).toHaveTextContent('Camera intrinsics');
    expect(details[1]).toHaveTextContent('LiDAR–camera extrinsics');
  });

  it('nests detail lists inside their parent highlight', () => {
    const jobWithDetails = {
      ...mockJob,
      highlights: [
        { summary: 'Parent claim', details: ['Supporting detail'] },
        'Standalone claim',
      ],
    };

    render(<Job data={jobWithDetails} />);

    const topLevel = document.querySelectorAll('.points > li');
    expect(topLevel.length).toBe(2);
    expect(topLevel[0].querySelector('.point-details')).toBeInTheDocument();
    expect(topLevel[1].querySelector('.point-details')).toBeNull();
  });

  it('handles missing summary gracefully', () => {
    const jobWithoutSummary = {
      ...mockJob,
      summary: undefined,
    };

    render(<Job data={jobWithoutSummary} />);

    // Should not crash, highlights should still render
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
  });

  it('handles missing highlights gracefully', () => {
    const jobWithoutHighlights = {
      ...mockJob,
      highlights: undefined,
    };

    render(<Job data={jobWithoutHighlights} />);

    // Should not crash, summary should still render
    expect(screen.getByText(/led development/i)).toBeInTheDocument();

    const list = document.querySelector('.points');
    expect(list).not.toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Job data={mockJob} />);

    const article = document.querySelector('article.jobs-container');
    expect(article).toBeInTheDocument();
  });
});
