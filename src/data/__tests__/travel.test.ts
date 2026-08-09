import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import {
  type KazakhstanCity,
  otherKazakhstanCities,
  visitedKazakhstanCities,
} from '@/data/travel';
import { projectPoint } from '@/lib/kazakhstan-map';

const allCities = [...visitedKazakhstanCities, ...otherKazakhstanCities];

/** Names listed in the "Travel / Geography" section of the about copy. */
function getCitiesNamedInAboutCopy() {
  const travelSection = aboutMarkdown
    .split('# Travel / Geography')[1]
    ?.split(/\n# /)[0];
  const cityList = travelSection?.match(/including ([^.]+)\./)?.[1];

  return (cityList ?? '')
    .split(/,\s*and\s+|,\s*|\s+and\s+/)
    .map((name) => name.trim())
    .filter((name) => name !== '');
}

describe('visitedKazakhstanCities', () => {
  // The "Travel / Geography" section is currently disabled in src/data/about.ts,
  // so there is no prose to cross-check against. Restore this alongside it — the
  // helper above still works once the section is back.
  it.skip('matches the cities named in the about copy', () => {
    const namedCities = getCitiesNamedInAboutCopy();

    expect(namedCities.length).toBeGreaterThan(0);
    expect(
      [...visitedKazakhstanCities.map((city) => city.name)].sort(),
    ).toEqual([...namedCities].sort());
  });

  it('marks Astana as the only capital', () => {
    const capitals = allCities.filter((city) => city.isCapital);

    expect(capitals.map((city) => city.name)).toEqual(['Astana']);
  });
});

describe('otherKazakhstanCities', () => {
  it('only holds cities the about copy does not claim as visited', () => {
    const visitedNames = new Set(
      visitedKazakhstanCities.map((city) => city.name),
    );

    for (const city of otherKazakhstanCities) {
      expect(visitedNames.has(city.name)).toBe(false);
      expect(getCitiesNamedInAboutCopy()).not.toContain(city.name);
    }
  });
});

describe('all mapped cities', () => {
  it('lists every city once', () => {
    const names = allCities.map((city) => city.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps coordinates inside Kazakhstan', () => {
    for (const city of allCities) {
      expect(city.latitude).toBeGreaterThan(40);
      expect(city.latitude).toBeLessThan(56);
      expect(city.longitude).toBeGreaterThan(46);
      expect(city.longitude).toBeLessThan(88);
    }
  });

  it('keeps pins far enough apart to stay readable', () => {
    // Guards against adding a city that lands on top of an existing pin
    // (Temirtau, for example, is ~10 units from Karagandy).
    const MINIMUM_SEPARATION = 30;
    const projected = allCities.map((city: KazakhstanCity) => ({
      name: city.name,
      ...projectPoint(city.latitude, city.longitude),
    }));

    for (const [index, city] of projected.entries()) {
      for (const other of projected.slice(index + 1)) {
        const distance = Math.hypot(city.x - other.x, city.y - other.y);

        expect(
          distance,
          `${city.name} and ${other.name} are ${distance.toFixed(1)} units apart`,
        ).toBeGreaterThan(MINIMUM_SEPARATION);
      }
    }
  });
});
