import type { CSSProperties } from 'react';

import {
  type KazakhstanCity,
  otherKazakhstanCities,
  visitedKazakhstanCities,
} from '@/data/travel';
import {
  KAZAKHSTAN_MAP_HEIGHT,
  KAZAKHSTAN_MAP_WIDTH,
  KAZAKHSTAN_OUTLINE_PATH,
  KAZAKHSTAN_WATER_BODIES,
  projectToPercent,
} from '@/lib/kazakhstan-map';

const WATER_CLIP_ID = 'travel-map-water-clip';

function sortWestToEast(cities: KazakhstanCity[]) {
  return [...cities].sort(
    (first, second) => first.longitude - second.longitude,
  );
}

// One continuous west-to-east entrance sweep across both groups of pins.
const sweepOrder = new Map(
  sortWestToEast([...visitedKazakhstanCities, ...otherKazakhstanCities]).map(
    (city, index) => [city.name, index],
  ),
);

interface PinListProps {
  cities: KazakhstanCity[];
  label: string;
  variant: 'visited' | 'context';
}

function PinList({ cities, label, variant }: PinListProps) {
  return (
    <ul
      className={`travel-map-pins travel-map-pins--${variant}`}
      aria-label={label}
    >
      {sortWestToEast(cities).map((city) => {
        const { left, top } = projectToPercent(city.latitude, city.longitude);
        const pinClassNames = ['travel-map-pin'];

        if (variant === 'context') {
          pinClassNames.push('travel-map-pin--context');
        }
        if (city.isCapital) {
          pinClassNames.push('travel-map-pin--capital');
        }
        if (city.isHometown) {
          pinClassNames.push('travel-map-pin--hometown');
        }

        return (
          <li
            key={city.name}
            className="travel-map-pin-anchor"
            style={
              {
                '--pin-left': `${left.toFixed(3)}%`,
                '--pin-top': `${top.toFixed(3)}%`,
                '--pin-index': sweepOrder.get(city.name) ?? 0,
              } as CSSProperties
            }
          >
            <button
              type="button"
              className={pinClassNames.join(' ')}
              data-city={city.name}
              data-label-placement={city.labelPlacement ?? 'right'}
            >
              <span className="travel-map-pin-dot" aria-hidden="true" />
              <span className="travel-map-pin-label">{city.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function TravelMap() {
  return (
    <figure className="travel-map">
      <div className="travel-map-frame">
        <div
          className="travel-map-plot"
          style={{
            aspectRatio: `${KAZAKHSTAN_MAP_WIDTH} / ${KAZAKHSTAN_MAP_HEIGHT}`,
          }}
        >
          <svg
            className="travel-map-svg"
            viewBox={`0 0 ${KAZAKHSTAN_MAP_WIDTH} ${KAZAKHSTAN_MAP_HEIGHT}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <clipPath id={WATER_CLIP_ID}>
                <path d={KAZAKHSTAN_OUTLINE_PATH} />
              </clipPath>
            </defs>
            <path className="travel-map-country" d={KAZAKHSTAN_OUTLINE_PATH} />
            <g className="travel-map-water" clipPath={`url(#${WATER_CLIP_ID})`}>
              {KAZAKHSTAN_WATER_BODIES.map((water) => (
                <path key={water.name} d={water.path} />
              ))}
            </g>
          </svg>
          {/* Visited pins come first for reading order; CSS keeps them on top */}
          <PinList
            cities={visitedKazakhstanCities}
            label="Cities visited"
            variant="visited"
          />
          <PinList
            cities={otherKazakhstanCities}
            label="Other major cities"
            variant="context"
          />
        </div>
      </div>
      <figcaption className="travel-map-caption">
        <span className="travel-map-legend">
          <span className="travel-map-legend-item">
            <span className="travel-map-legend-dot" aria-hidden="true" />
            {visitedKazakhstanCities.length} cities visited
          </span>
          <span className="travel-map-legend-item">
            <span
              className="travel-map-legend-dot travel-map-legend-dot--context"
              aria-hidden="true"
            />
            {otherKazakhstanCities.length} other major cities
          </span>
        </span>
        <span className="travel-map-caption-hint">Tap a pin for its name.</span>
      </figcaption>
    </figure>
  );
}
