import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Presentations from '../../Resume/Presentations';

const mockPresentations = [
  {
    title: 'AI-Assisted Search for Industrial Components',
    authors: 'S. Amangeldi, D. H. Kim',
    event: 'PRESM2025',
    location: 'Chiang Mai, Thailand',
    date: '2025-07-01',
    dateLabel: 'July 2025',
    type: 'Oral' as const,
  },
  {
    title: 'Point Cloud Scans and 3D CAD Data',
    authors: 'S. Amangeldi, Y. K. Kwon',
    event: 'KSPE',
    location: 'Jeju, South Korea',
    date: '2024-05-01',
    dateLabel: 'May 2024',
    type: 'Poster' as const,
    link: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798461',
  },
];

describe('Presentations', () => {
  it('renders the presentations section with title', () => {
    render(<Presentations data={mockPresentations} />);

    expect(
      screen.getByRole('heading', { name: /presentations/i }),
    ).toBeInTheDocument();
  });

  it('renders all presentations', () => {
    render(<Presentations data={mockPresentations} />);

    expect(
      screen.getByText('AI-Assisted Search for Industrial Components'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Point Cloud Scans and 3D CAD Data'),
    ).toBeInTheDocument();
  });

  it('renders presentation links when present', () => {
    render(<Presentations data={mockPresentations} />);

    const link = screen.getByRole('link', {
      name: /point cloud scans and 3d cad data/i,
    });
    expect(link).toHaveAttribute(
      'href',
      'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798461',
    );
  });

  it('has anchor link for navigation', () => {
    render(<Presentations data={mockPresentations} />);

    const anchor = document.getElementById('presentations');
    expect(anchor).toBeInTheDocument();
  });
});
