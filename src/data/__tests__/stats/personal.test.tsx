import { describe, expect, it } from 'vitest';

import data from '../../stats/personal';

describe('personal stats data', () => {
  it('exports an array of stats', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('each stat has required properties', () => {
    for (const stat of data) {
      expect(stat).toHaveProperty('key');
      expect(stat).toHaveProperty('label');
      expect(typeof stat.label).toBe('string');
    }
  });

  it('has an experience stat', () => {
    const experienceStat = data.find((s) => s.key === 'experience');

    expect(experienceStat).toBeDefined();
    expect(experienceStat!.label).toBe('Years of experience');
    expect(experienceStat!.value).toBe('3+');
  });

  it('has a languages stat', () => {
    const languagesStat = data.find((s) => s.key === 'languages');

    expect(languagesStat).toBeDefined();
    expect(languagesStat!.label).toBe('Languages');
    expect(languagesStat!.value).toBe(5);
  });

  it('has a current location stat', () => {
    const locationStat = data.find((s) => s.key === 'location');

    expect(locationStat).toBeDefined();
    expect(locationStat!.label).toBe('Current city');
    expect(locationStat!.value).toBe('Tokyo, Japan');
  });
});
