import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Project } from '@/data/resume/projects';

import Projects from '../../Resume/Projects';

const mockProjects: Project[] = [
  {
    title: 'Sensor Time-Offset Calibration',
    role: 'VITOM Inc. · SLAM Team',
    link: 'https://example.com/offset',
    date: '2026-07-01',
    dateLabel: 'July 2026',
    overview: 'Measures the residual clock offset that survives PTP.',
    attribution: 'Spatial calibration was a colleague’s work.',
    metrics: [
      { value: '< 1 ms', label: 'camera offset stability' },
      { value: '± 120 ms', label: 'offset search range' },
    ],
    contribution: [
      'Built the camera–LiDAR estimator.',
      [
        'Wrapped ',
        { text: 'iKalibr', link: 'https://example.com/ikalibr' },
        ' for the IMU path.',
      ],
    ],
    challenges: ['PTP leaves a constant residual.'],
    outcomes: ['Offsets stable to under a millisecond.'],
    tech: ['Python', 'iKalibr'],
  },
  {
    // Minimal entry: only the required fields.
    title: 'Desktop Post-Processing Application',
    overview: 'Drives SLAM, filtering, and coloring over recorded datasets.',
    contribution: ['Refactored the desktop GUI.'],
  },
];

describe('Projects', () => {
  it('renders the projects section with title', () => {
    render(<Projects data={mockProjects} />);

    expect(
      screen.getByRole('heading', { name: /^projects$/i }),
    ).toBeInTheDocument();
  });

  it('renders every project with its overview', () => {
    render(<Projects data={mockProjects} />);

    expect(
      screen.getByText('Sensor Time-Offset Calibration'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Measures the residual clock offset that survives PTP.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Desktop Post-Processing Application'),
    ).toBeInTheDocument();
  });

  it('links the title when the project has a link', () => {
    render(<Projects data={mockProjects} />);

    expect(
      screen.getByRole('link', { name: /sensor time-offset calibration/i }),
    ).toHaveAttribute('href', 'https://example.com/offset');
  });

  it('renders metrics as value and label pairs', () => {
    render(<Projects data={mockProjects} />);

    expect(screen.getByText('< 1 ms')).toBeInTheDocument();
    expect(screen.getByText('camera offset stability')).toBeInTheDocument();
    // Only the first project supplies metrics.
    expect(document.querySelectorAll('.project-metric')).toHaveLength(2);
  });

  it('groups detail bullets under labelled blocks', () => {
    render(<Projects data={mockProjects} />);

    // Both projects carry a contribution; only the first has the other two.
    expect(
      screen.getAllByRole('heading', { name: 'Contribution', level: 5 }),
    ).toHaveLength(2);
    expect(
      screen.getByRole('heading', { name: 'Challenges', level: 5 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Outcomes', level: 5 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Built the camera–LiDAR estimator.'),
    ).toBeInTheDocument();
  });

  it('renders an inline link inside a bullet without linking the whole line', () => {
    render(<Projects data={mockProjects} />);

    const link = screen.getByRole('link', { name: 'iKalibr' });
    expect(link).toHaveAttribute('href', 'https://example.com/ikalibr');

    // The surrounding text stays outside the anchor.
    const bullet = link.closest('li');
    expect(bullet).toHaveTextContent('Wrapped iKalibr for the IMU path.');
    expect(bullet?.querySelectorAll('a')).toHaveLength(1);
  });

  it('omits Challenges and Outcomes blocks when a project has neither', () => {
    render(<Projects data={[mockProjects[1]]} />);

    expect(
      screen.getByRole('heading', { name: 'Contribution', level: 5 }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Challenges', level: 5 }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Outcomes', level: 5 }),
    ).not.toBeInTheDocument();
  });

  it('names only the blocks a project actually carries in the summary', () => {
    render(<Projects data={mockProjects} />);

    const summaries = document.querySelectorAll('summary');
    // First project has all three; second has contribution only.
    expect(summaries[0]).toHaveTextContent(
      'Contribution, challenges & outcomes',
    );
    expect(summaries[1]).toHaveTextContent('Contribution');
    expect(summaries[1]).not.toHaveTextContent('challenges');
    expect(summaries[1]).not.toHaveTextContent('outcomes');
  });

  it('joins two blocks with an ampersand rather than a comma', () => {
    render(
      <Projects
        data={[{ ...mockProjects[1], outcomes: ['Shipped to production.'] }]}
      />,
    );

    expect(document.querySelector('summary')).toHaveTextContent(
      'Contribution & outcomes',
    );
  });

  it('puts the detail behind a details element so no JS is required', () => {
    render(<Projects data={mockProjects} />);

    const details = document.querySelectorAll('details.project-item-details');
    expect(details).toHaveLength(2);
    // Collapsed by default keeps the section scannable.
    expect((details[0] as HTMLDetailsElement).open).toBe(false);
    expect(details[0].querySelector('summary')).toHaveTextContent(
      /contribution, challenges & outcomes/i,
    );
  });

  it('renders optional role, attribution, and tech only when present', () => {
    render(<Projects data={mockProjects} />);

    expect(screen.getByText('VITOM Inc. · SLAM Team')).toBeInTheDocument();
    expect(
      screen.getByText('Spatial calibration was a colleague’s work.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();

    expect(document.querySelectorAll('.project-item-role')).toHaveLength(1);
    expect(document.querySelectorAll('.project-item-attribution')).toHaveLength(
      1,
    );
    expect(document.querySelectorAll('.project-item-tech')).toHaveLength(1);
  });

  it('marks up dates as machine-readable time elements when present', () => {
    render(<Projects data={mockProjects} />);

    const date = screen.getByText('July 2026');
    expect(date.tagName).toBe('TIME');
    expect(date).toHaveAttribute('datetime', '2026-07-01');
    expect(document.querySelectorAll('.project-item-date')).toHaveLength(1);
  });

  it('renders nothing when there are no projects', () => {
    const { container } = render(<Projects data={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
