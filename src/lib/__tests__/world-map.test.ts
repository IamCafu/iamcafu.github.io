import { describe, expect, it } from 'vitest';

import { countryRelations, currentLocation } from '@/data/travel';
import {
  projectWorldToPercent,
  WORLD_COUNTRIES,
  WORLD_MAP_HEIGHT,
  WORLD_MAP_WIDTH,
} from '@/lib/world-map';

describe('WORLD_COUNTRIES', () => {
  it('covers the world with unique codes', () => {
    const codes = WORLD_COUNTRIES.map((country) => country.code);

    expect(codes.length).toBeGreaterThan(150);
    expect(new Set(codes).size).toBe(codes.length);
    // Natural Earth's -99 placeholder must be resolved to a usable code.
    expect(codes).not.toContain('-99');
  });

  it('has a name and a closed path for every country', () => {
    for (const country of WORLD_COUNTRIES) {
      expect(country.name).not.toBe('');
      expect(country.path.startsWith('M')).toBe(true);
      expect(country.path.endsWith('Z')).toBe(true);
    }
  });

  it('fits every path inside the viewBox', () => {
    for (const country of WORLD_COUNTRIES) {
      const points = Array.from(
        country.path.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g),
        (match) => ({
          x: Number.parseFloat(match[1]),
          y: Number.parseFloat(match[2]),
        }),
      );

      expect(points.length).toBeGreaterThan(2);

      for (const point of points) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(WORLD_MAP_WIDTH);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(WORLD_MAP_HEIGHT);
      }
    }
  });

  it('resolves every highlighted country code', () => {
    for (const code of Object.keys(countryRelations)) {
      expect(
        WORLD_COUNTRIES.find((country) => country.code === code),
        `no country in the world map matches ${code}`,
      ).toBeDefined();
    }
  });

  it('omits Antarctica', () => {
    expect(WORLD_COUNTRIES.some((country) => country.code === 'ATA')).toBe(
      false,
    );
  });
});

describe('projectWorldToPercent', () => {
  it('puts the origin at the centre of the projection', () => {
    // Greenwich meridian, so longitude 0 is the horizontal midpoint.
    expect(projectWorldToPercent(0, 0).left).toBeCloseTo(50, 6);
  });

  it('orders latitudes north to south and longitudes west to east', () => {
    expect(projectWorldToPercent(60, 0).top).toBeLessThan(
      projectWorldToPercent(-30, 0).top,
    );
    expect(projectWorldToPercent(0, -120).left).toBeLessThan(
      projectWorldToPercent(0, 120).left,
    );
  });

  it('keeps the current location inside the map box', () => {
    const { left, top } = projectWorldToPercent(
      currentLocation.latitude,
      currentLocation.longitude,
    );

    expect(left).toBeGreaterThan(0);
    expect(left).toBeLessThan(100);
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(100);
  });
});
