import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ResumeNav from '../../Resume/ResumeNav';

describe('ResumeNav', () => {
  afterEach(() => {
    vi.doUnmock('@/data/resume/projects');
    vi.resetModules();
  });

  it('renders navigation element', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders links to all resume sections', () => {
    render(<ResumeNav />);

    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute(
      'href',
      '#education',
    );
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute(
      'href',
      '#skills',
    );
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'href',
      '#projects',
    );
    // Label is shortened for the nav; the anchor keeps its original id.
    expect(screen.getByRole('link', { name: /research/i })).toHaveAttribute(
      'href',
      '#presentations',
    );
  });

  it('renders 5 navigation links', () => {
    render(<ResumeNav />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
  });

  it('omits the Projects link when there are no resume projects', async () => {
    vi.resetModules();
    vi.doMock('@/data/resume/projects', () => ({ default: [] }));

    const { default: NavWithoutProjects } = await import(
      '../../Resume/ResumeNav'
    );
    render(<NavWithoutProjects />);

    expect(
      screen.queryByRole('link', { name: /projects/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('has correct CSS class', () => {
    render(<ResumeNav />);

    const nav = document.querySelector('.resume-nav');
    expect(nav).toBeInTheDocument();
  });

  it('experience link is active by default', () => {
    render(<ResumeNav />);

    const experienceLink = screen.getByRole('link', { name: /experience/i });
    expect(experienceLink).toHaveClass('active');
  });
});
