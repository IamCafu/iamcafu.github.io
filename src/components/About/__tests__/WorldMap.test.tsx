import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { countryFlags, countryRelations, currentLocation } from '@/data/travel';
import {
  getPathBounds,
  projectWorldToPercent,
  WORLD_COUNTRIES,
} from '@/lib/world-map';
import WorldMap from '../WorldMap';

const codesFor = (relation: string) =>
  Object.entries(countryRelations)
    .filter(([, value]) => value === relation)
    .map(([code]) => code);

const nameFor = (code: string) =>
  WORLD_COUNTRIES.find((country) => country.code === code)?.name;

describe('WorldMap', () => {
  it('draws every country so borders are visible', () => {
    const { container } = render(<WorldMap />);

    expect(
      container.querySelectorAll('.world-map-countries path'),
    ).toHaveLength(WORLD_COUNTRIES.length);
  });

  it('fills the home country in its own color', () => {
    const { container } = render(<WorldMap />);

    const homePaths = container.querySelectorAll(
      '.world-map-countries--home path',
    );

    expect(codesFor('home')).toEqual(['KAZ']);
    expect(homePaths).toHaveLength(1);
    expect(homePaths[0].querySelector('title')?.textContent).toBe('Kazakhstan');
  });

  it('keeps home and visited countries in separate layers', () => {
    const { container } = render(<WorldMap />);

    const visitedTitles = Array.from(
      container.querySelectorAll('.world-map-countries--visited title'),
      (title) => title.textContent,
    );

    expect(visitedTitles).toHaveLength(codesFor('visited').length);
    expect(visitedTitles).not.toContain('Kazakhstan');
    expect(visitedTitles).toContain(nameFor('JPN'));
  });

  it('pins the current location at its projected coordinates', () => {
    const { container } = render(<WorldMap />);

    const pin = container.querySelector('.world-map-now') as HTMLElement;
    const { left, top } = projectWorldToPercent(
      currentLocation.latitude,
      currentLocation.longitude,
    );

    expect(pin).toHaveTextContent('Now');
    expect(pin.style.getPropertyValue('--pin-left')).toBe(
      `${left.toFixed(3)}%`,
    );
    expect(pin.style.getPropertyValue('--pin-top')).toBe(`${top.toFixed(3)}%`);
    // Tokyo sits in the eastern hemisphere, north of the equator.
    expect(left).toBeGreaterThan(80);
    expect(top).toBeGreaterThan(30);
    expect(top).toBeLessThan(55);
  });

  it('carries no country labels on the map itself', () => {
    const { container } = render(<WorldMap />);

    // Names live in <title> and the screen-reader list, never as drawn text.
    expect(container.querySelectorAll('svg text')).toHaveLength(0);
  });

  it('labels the map and lists the countries for assistive tech', () => {
    const { container } = render(<WorldMap />);

    expect(
      screen.getByRole('img', {
        name: 'World map with visited countries highlighted',
      }),
    ).toBeInTheDocument();

    const srList = container.querySelector('ul.sr-only');

    expect(srList?.querySelectorAll('li')).toHaveLength(
      Object.keys(countryRelations).length + 1,
    );
    expect(srList).toHaveTextContent('Kazakhstan (home)');
    expect(srList).toHaveTextContent(
      `Currently living in ${currentLocation.city}, ${currentLocation.country}`,
    );
  });

  it('captions the map with a legend for home, visited and now', () => {
    const { container } = render(<WorldMap />);

    const caption = container.querySelector('figcaption');

    expect(caption).toHaveTextContent('Home');
    expect(caption).toHaveTextContent(
      `${codesFor('visited').length} countries visited`,
    );
    expect(caption).toHaveTextContent(`Now in ${currentLocation.city}`);
    // Home is a flag swatch; visited and now stay colored dots.
    expect(container.querySelectorAll('.world-map-legend-dot')).toHaveLength(2);
    expect(container.querySelector('.world-map-legend-flag')).toHaveAttribute(
      'src',
      countryFlags.KAZ,
    );
  });
});

describe('WorldMap flag fills', () => {
  it('lays each flag over its country, clipped to that country', () => {
    const { container } = render(<WorldMap />);

    for (const [code, flag] of Object.entries(countryFlags)) {
      const country = WORLD_COUNTRIES.find((entry) => entry.code === code);
      const image = container.querySelector(
        `image[href="${flag}"]`,
      ) as SVGImageElement;
      const clipId = `world-map-flag-clip-${code}`;

      expect(country).toBeDefined();
      expect(image).toBeTruthy();
      expect(image.getAttribute('clip-path')).toBe(`url(#${clipId})`);
      expect(
        container.querySelector(`clipPath#${clipId} path`)?.getAttribute('d'),
      ).toBe(country?.path);
    }
  });

  it('sizes the flag to the bounding box of its country', () => {
    const { container } = render(<WorldMap />);

    const country = WORLD_COUNTRIES.find((entry) => entry.code === 'KAZ');
    const bounds = getPathBounds(country?.path ?? '');
    const image = container.querySelector(
      `image[href="${countryFlags.KAZ}"]`,
    ) as SVGImageElement;

    expect(image.getAttribute('x')).toBe(String(bounds.x));
    expect(image.getAttribute('y')).toBe(String(bounds.y));
    expect(image.getAttribute('width')).toBe(String(bounds.width));
    expect(image.getAttribute('height')).toBe(String(bounds.height));
    // Kazakhstan is about twice as wide as it is tall here, like the flag.
    expect(bounds.width / bounds.height).toBeGreaterThan(1.7);
    expect(bounds.width / bounds.height).toBeLessThan(2.6);
  });

  it('keeps the flat fill underneath as a fallback', () => {
    const { container } = render(<WorldMap />);

    // The solid home path still renders, so a failed image load is not a hole.
    expect(
      container.querySelector('.world-map-countries--home path'),
    ).toHaveAttribute('d');
    expect(container.querySelector('.world-map-flag-outline')).toHaveAttribute(
      'fill',
      'none',
    );
  });
});
