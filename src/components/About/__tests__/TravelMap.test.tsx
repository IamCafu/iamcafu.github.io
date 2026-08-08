import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  type KazakhstanCity,
  otherKazakhstanCities,
  visitedKazakhstanCities,
} from '@/data/travel';
import { projectToPercent } from '@/lib/kazakhstan-map';
import TravelMap from '../TravelMap';

const allCities = [...visitedKazakhstanCities, ...otherKazakhstanCities];

/** Pins are identified by data-city, since labels may carry annotations. */
const pinFor = (scope: HTMLElement, name: string) =>
  scope.querySelector(`[data-city="${name}"]`) as HTMLElement;

const cityNamesIn = (scope: HTMLElement) =>
  Array.from(scope.querySelectorAll('[data-city]'), (pin) =>
    pin.getAttribute('data-city'),
  );

function westToEast(cities: KazakhstanCity[]) {
  return [...cities]
    .sort((first, second) => first.longitude - second.longitude)
    .map((city) => city.name);
}

describe('TravelMap', () => {
  it('renders a pin for every visited and context city', () => {
    render(<TravelMap />);

    const visited = screen.getByRole('list', { name: 'Cities visited' });
    const context = screen.getByRole('list', { name: 'Other major cities' });

    expect(within(visited).getAllByRole('listitem')).toHaveLength(
      visitedKazakhstanCities.length,
    );
    expect(within(context).getAllByRole('listitem')).toHaveLength(
      otherKazakhstanCities.length,
    );

    for (const city of visitedKazakhstanCities) {
      expect(pinFor(visited, city.name)).toBeTruthy();
    }
    for (const city of otherKazakhstanCities) {
      expect(pinFor(context, city.name)).toBeTruthy();
    }
  });

  it('marks context pins so they render in the secondary color', () => {
    const { container } = render(<TravelMap />);

    for (const city of otherKazakhstanCities) {
      expect(pinFor(container, city.name)).toHaveClass(
        'travel-map-pin--context',
      );
    }
    for (const city of visitedKazakhstanCities) {
      expect(pinFor(container, city.name)).not.toHaveClass(
        'travel-map-pin--context',
      );
    }
  });

  it('orders pins within each group from west to east', () => {
    render(<TravelMap />);

    const readCities = (name: string) =>
      cityNamesIn(screen.getByRole('list', { name }));

    expect(readCities('Cities visited')).toEqual(
      westToEast(visitedKazakhstanCities),
    );
    expect(readCities('Other major cities')).toEqual(
      westToEast(otherKazakhstanCities),
    );
  });

  it('positions each pin at its projected coordinates', () => {
    const { container } = render(<TravelMap />);

    for (const city of allCities) {
      const pin = pinFor(container, city.name);
      const anchor = pin.parentElement as HTMLElement;
      const { left, top } = projectToPercent(city.latitude, city.longitude);

      expect(anchor.style.getPropertyValue('--pin-left')).toBe(
        `${left.toFixed(3)}%`,
      );
      expect(anchor.style.getPropertyValue('--pin-top')).toBe(
        `${top.toFixed(3)}%`,
      );
    }

    // Every pin stays inside the map box.
    for (const anchor of container.querySelectorAll<HTMLElement>(
      '.travel-map-pin-anchor',
    )) {
      for (const property of ['--pin-left', '--pin-top']) {
        const percent = Number.parseFloat(
          anchor.style.getPropertyValue(property),
        );

        expect(percent).toBeGreaterThanOrEqual(0);
        expect(percent).toBeLessThanOrEqual(100);
      }
    }
  });

  it('staggers the entrance animation as one west-to-east sweep', () => {
    const { container } = render(<TravelMap />);

    const sweep = westToEast(allCities);

    for (const [expectedIndex, name] of sweep.entries()) {
      const anchor = pinFor(container, name).parentElement as HTMLElement;

      expect(anchor.style.getPropertyValue('--pin-index')).toBe(
        String(expectedIndex),
      );
    }
  });

  it('applies label placement and the capital variant', () => {
    const { container } = render(<TravelMap />);

    expect(pinFor(container, 'Astana')).toHaveClass('travel-map-pin--capital');
    expect(pinFor(container, 'Almaty')).not.toHaveClass(
      'travel-map-pin--capital',
    );

    // Defaults to a right-hand label, overridden per city in the data.
    for (const [city, placement] of [
      ['Almaty', 'right'],
      ['Shymkent', 'bottom'],
      ['Turkestan', 'left'],
      ['Semey', 'left'],
    ]) {
      expect(pinFor(container, city)).toHaveAttribute(
        'data-label-placement',
        placement,
      );
    }
  });

  it('gives the hometown the ringed dot, with no label annotation', () => {
    const { container } = render(<TravelMap />);

    const hometowns = container.querySelectorAll('.travel-map-pin--hometown');
    const turkestan = pinFor(container, 'Turkestan');

    expect(
      visitedKazakhstanCities.filter((city) => city.isHometown),
    ).toHaveLength(1);
    expect(hometowns).toHaveLength(1);
    expect(hometowns[0]).toBe(turkestan);
    // The dot style carries it; the label stays just the city name.
    expect(screen.getByRole('button', { name: 'Turkestan' })).toBe(turkestan);
    expect(turkestan).not.toHaveClass('travel-map-pin--capital');
  });

  it('hides the decorative map artwork from assistive tech', () => {
    const { container } = render(<TravelMap />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 1000 559.9');
    expect(container.querySelector('.travel-map-country')).toHaveAttribute('d');
    expect(
      container.querySelectorAll('.travel-map-water path').length,
    ).toBeGreaterThan(0);
  });

  it('captions the map with a legend for both pin colors', () => {
    const { container } = render(<TravelMap />);

    const caption = container.querySelector('figcaption');

    expect(caption).toHaveTextContent(
      `${visitedKazakhstanCities.length} cities visited`,
    );
    expect(caption).toHaveTextContent(
      `${otherKazakhstanCities.length} other major cities`,
    );
    expect(container.querySelectorAll('.travel-map-legend-dot')).toHaveLength(
      2,
    );
  });
});
