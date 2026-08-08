import { describe, expect, it } from 'vitest';

import { otherKazakhstanCities, visitedKazakhstanCities } from '@/data/travel';
import {
  KAZAKHSTAN_MAP_HEIGHT,
  KAZAKHSTAN_MAP_WIDTH,
  KAZAKHSTAN_OUTLINE_PATH,
  KAZAKHSTAN_WATER_BODIES,
  projectPoint,
  projectToPercent,
} from '@/lib/kazakhstan-map';

function parsePathPoints(path: string) {
  return Array.from(path.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g), (match) => ({
    x: Number.parseFloat(match[1]),
    y: Number.parseFloat(match[2]),
  }));
}

describe('projectPoint', () => {
  it('places northern latitudes above southern ones', () => {
    const astana = projectPoint(51.1694, 71.4491);
    const almaty = projectPoint(43.238, 76.8829);

    expect(astana.y).toBeLessThan(almaty.y);
  });

  it('places western longitudes left of eastern ones', () => {
    const aktau = projectPoint(43.651, 51.158);
    const almaty = projectPoint(43.238, 76.8829);

    expect(aktau.x).toBeLessThan(almaty.x);
  });

  it('keeps every mapped city inside the map box', () => {
    for (const city of [...visitedKazakhstanCities, ...otherKazakhstanCities]) {
      const { x, y } = projectPoint(city.latitude, city.longitude);

      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(KAZAKHSTAN_MAP_WIDTH);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(KAZAKHSTAN_MAP_HEIGHT);
    }
  });
});

describe('projectToPercent', () => {
  it('expresses projected points as percentages of the map box', () => {
    const { x, y } = projectPoint(48, 67);
    const { left, top } = projectToPercent(48, 67);

    expect(left).toBeCloseTo((x / KAZAKHSTAN_MAP_WIDTH) * 100, 6);
    expect(top).toBeCloseTo((y / KAZAKHSTAN_MAP_HEIGHT) * 100, 6);
  });
});

describe('map geometry', () => {
  it('fits the outline to the viewBox', () => {
    const points = parsePathPoints(KAZAKHSTAN_OUTLINE_PATH);
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);

    expect(points.length).toBeGreaterThan(100);
    expect(Math.min(...xs)).toBeCloseTo(0, 0);
    expect(Math.max(...xs)).toBeCloseTo(KAZAKHSTAN_MAP_WIDTH, 0);
    expect(Math.min(...ys)).toBeCloseTo(0, 0);
    expect(Math.max(...ys)).toBeCloseTo(KAZAKHSTAN_MAP_HEIGHT, 0);
  });

  it('describes closed water body paths', () => {
    expect(KAZAKHSTAN_WATER_BODIES.length).toBeGreaterThan(0);

    for (const water of KAZAKHSTAN_WATER_BODIES) {
      expect(water.name).not.toBe('');
      expect(water.path.startsWith('M')).toBe(true);
      expect(water.path.endsWith('Z')).toBe(true);
    }
  });

  it('projects Almaty onto Kazakhstan land, not into the map margins', () => {
    // Sanity check that the projection and the generated path share one frame:
    // Almaty sits in the south-east, so it should land in that quadrant.
    const { left, top } = projectToPercent(43.238, 76.8829);

    expect(left).toBeGreaterThan(60);
    expect(top).toBeGreaterThan(60);
  });
});
