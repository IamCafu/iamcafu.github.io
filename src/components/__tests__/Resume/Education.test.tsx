import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Education from '../../Resume/Education';
import Degree from '../../Resume/Education/Degree';

const mockDegrees = [
  {
    school: 'University of Ulsan',
    degree: 'M.S. AI and Computer Engineering',
    link: 'https://www.timeshighereducation.com/world-university-rankings/university-ulsan',
    year: 2025,
    location: 'Ulsan, South Korea',
    details: ['GPA: 4.1/4.5'],
  },
  {
    school: 'Nazarbayev University',
    degree: 'B.S. Computer Science',
    link: 'https://www.timeshighereducation.com/world-university-rankings/nazarbayev-university',
    year: 2022,
  },
];

describe('Degree title', () => {
  it('puts the field on its own line beneath the degree', () => {
    render(
      <Degree
        data={{
          school: 'University of Ulsan',
          degree: 'Master of Science',
          field: 'AI and Computer Engineering',
          link: 'https://example.com',
          year: 2025,
        }}
      />,
    );

    const heading = screen.getByRole('heading', { level: 4 });
    const field = heading.querySelector('.degree-field');

    expect(heading).toHaveTextContent('Master of Science');
    expect(field).toHaveTextContent('in AI and Computer Engineering');
  });

  it('omits the field line when absent', () => {
    render(
      <Degree
        data={{
          school: 'Nazarbayev University',
          degree: 'B.S. Computer Science',
          link: 'https://example.com',
          year: 2022,
        }}
      />,
    );

    expect(document.querySelector('.degree-field')).toBeNull();
  });
});

describe('Education', () => {
  it('renders the education section with title', () => {
    render(<Education data={mockDegrees} />);

    expect(
      screen.getByRole('heading', { name: /education/i }),
    ).toBeInTheDocument();
  });

  it('renders all degrees', () => {
    render(<Education data={mockDegrees} />);

    expect(
      screen.getByText('M.S. AI and Computer Engineering'),
    ).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
  });

  it('renders school links', () => {
    render(<Education data={mockDegrees} />);

    const ulsanLink = screen.getByRole('link', { name: /ulsan/i });
    expect(ulsanLink).toHaveAttribute(
      'href',
      'https://www.timeshighereducation.com/world-university-rankings/university-ulsan',
    );

    const nuLink = screen.getByRole('link', { name: /nazarbayev/i });
    expect(nuLink).toHaveAttribute(
      'href',
      'https://www.timeshighereducation.com/world-university-rankings/nazarbayev-university',
    );
  });

  it('has anchor link for navigation', () => {
    render(<Education data={mockDegrees} />);

    const anchor = document.getElementById('education');
    expect(anchor).toBeInTheDocument();
  });
});

describe('Degree', () => {
  const mockDegree = {
    school: 'University of Ulsan',
    degree: 'M.S. AI and Computer Engineering',
    link: 'https://www.timeshighereducation.com/world-university-rankings/university-ulsan',
    year: 2025,
    location: 'Ulsan, South Korea',
    details: ['GPA: 4.1/4.5'],
  };

  it('renders degree title', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'M.S. AI and Computer Engineering',
    );
  });

  it('renders school name with link', () => {
    render(<Degree data={mockDegree} />);

    const link = screen.getByRole('link', { name: /ulsan/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.timeshighereducation.com/world-university-rankings/university-ulsan',
    );
  });

  it('links the logo to the school without duplicating it for screen readers', () => {
    render(<Degree data={{ ...mockDegree, logo: '/images/logos/uou.png' }} />);

    const logoLink = document.querySelector('a.degree-logo');

    expect(logoLink).toHaveAttribute('href', mockDegree.link);
    expect(logoLink).toHaveAttribute('aria-hidden', 'true');
    expect(logoLink).toHaveAttribute('tabindex', '-1');
    // Decorative: the school-name link beside it carries the accessible name.
    expect(logoLink?.querySelector('img')).toHaveAttribute('alt', '');
    expect(screen.getAllByRole('link', { name: /ulsan/i })).toHaveLength(1);
  });

  // Year orders the data but is not shown; the detail list carries the dates.
  it('keeps the year out of the school line', () => {
    render(<Degree data={mockDegree} />);

    const school = document.querySelector('.school');

    expect(school).toHaveTextContent('University of Ulsan');
    expect(school?.textContent).not.toContain('2025');
    expect(document.querySelector('.school time')).toBeNull();
  });

  it('displays optional details', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByText('GPA: 4.1/4.5')).toBeInTheDocument();
    expect(screen.getByText(/Ulsan, South Korea/)).toBeInTheDocument();
  });

  it('renders linked details', () => {
    render(
      <Degree
        data={{
          ...mockDegree,
          details: [
            {
              label: 'Thesis:',
              text: 'Automated Noise Removal and CAD-to-Scan Comparison for Ship Component Inspection Using Terrestrial LiDAR Scanning',
              link: 'https://oak.ulsan.ac.kr/handle/2021.oak/20336',
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole('link', {
        name: /automated noise removal and cad-to-scan comparison/i,
      }),
    ).toHaveAttribute('href', 'https://oak.ulsan.ac.kr/handle/2021.oak/20336');
    expect(
      screen.queryByRole('link', { name: /thesis/i }),
    ).not.toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Degree data={mockDegree} />);

    const article = document.querySelector('article.degree-container');
    expect(article).toBeInTheDocument();
  });
});
