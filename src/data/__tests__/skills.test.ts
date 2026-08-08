import { describe, expect, it } from 'vitest';

import skillGroups from '../resume/skills';

describe('skills data', () => {
  it('exports a non-empty list of groups', () => {
    expect(Array.isArray(skillGroups)).toBe(true);
    expect(skillGroups.length).toBeGreaterThan(0);
  });

  it('every group has a name and at least one skill', () => {
    for (const group of skillGroups) {
      expect(group.name.trim().length).toBeGreaterThan(0);
      expect(group.skills.length).toBeGreaterThan(0);
      expect(group.skills.every((skill) => skill.trim().length > 0)).toBe(true);
    }
  });

  it('has unique group names', () => {
    const names = skillGroups.map((group) => group.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('never lists the same skill in two groups', () => {
    // The previous model allowed multiple categories per skill, which rendered
    // the same tag two or three times and was the main source of bloat.
    const all = skillGroups.flatMap((group) => group.skills);
    const duplicates = all.filter(
      (skill, index) => all.indexOf(skill) !== index,
    );

    expect(duplicates).toEqual([]);
  });

  it('stays short enough to scan', () => {
    const total = skillGroups.reduce(
      (count, group) => count + group.skills.length,
      0,
    );

    expect(skillGroups.length).toBeLessThanOrEqual(6);
    expect(total).toBeLessThanOrEqual(30);
  });

  it('keeps spoken languages last, after the technical groups', () => {
    expect(skillGroups.at(-1)?.name).toBe('Spoken Languages');
  });
});
