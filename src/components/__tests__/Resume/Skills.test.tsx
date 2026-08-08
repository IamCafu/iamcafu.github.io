import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SkillGroup } from '@/data/resume/skills';

import Skills from '../../Resume/Skills';

const mockGroups: SkillGroup[] = [
  { name: '3D Vision', skills: ['Open3D', 'PCL', 'OpenCV'] },
  { name: 'Programming', skills: ['Python', 'C++'] },
  { name: 'Spoken Languages', skills: ['English', 'Kazakh'] },
];

describe('Skills', () => {
  it('renders the skills section with title', () => {
    render(<Skills data={mockGroups} />);

    expect(
      screen.getByRole('heading', { name: 'Skills', level: 3 }),
    ).toBeInTheDocument();
  });

  it('renders a heading per group, in the order given', () => {
    render(<Skills data={mockGroups} />);

    const titles = Array.from(
      document.querySelectorAll('.skill-group-title'),
    ).map((el) => el.textContent);

    expect(titles).toEqual(['3D Vision', 'Programming', 'Spoken Languages']);
  });

  it('renders every skill exactly once', () => {
    render(<Skills data={mockGroups} />);

    const tags = Array.from(document.querySelectorAll('.skill-tag')).map(
      (el) => el.textContent,
    );

    expect(tags).toHaveLength(7);
    expect(new Set(tags).size).toBe(tags.length);
    expect(screen.getByText('Open3D')).toBeInTheDocument();
    expect(screen.getByText('Kazakh')).toBeInTheDocument();
  });

  it('preserves the order of skills inside a group', () => {
    render(<Skills data={mockGroups} />);

    const firstGroup = document.querySelectorAll('.skill-group')[0];
    const names = Array.from(firstGroup.querySelectorAll('.skill-tag')).map(
      (el) => el.textContent,
    );

    expect(names).toEqual(['Open3D', 'PCL', 'OpenCV']);
  });

  it('marks up each group as a list, and ships no filter buttons', () => {
    render(<Skills data={mockGroups} />);

    expect(document.querySelectorAll('ul.skill-tags')).toHaveLength(3);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
