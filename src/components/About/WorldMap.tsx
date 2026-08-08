import type { CSSProperties } from 'react';

import { countryFlags, countryRelations, currentLocation } from '@/data/travel';
import {
  getPathBounds,
  projectWorldToPercent,
  WORLD_COUNTRIES,
  WORLD_MAP_HEIGHT,
  WORLD_MAP_WIDTH,
} from '@/lib/world-map';

const flagClipId = (code: string) => `world-map-flag-clip-${code}`;

/** Flagged countries hand their border to the flag outline drawn on top. */
const flagClassName = (code: string) =>
  countryFlags[code] ? 'world-map-country--flagged' : undefined;

export default function WorldMap() {
  const byRelation = (relation: string) =>
    WORLD_COUNTRIES.filter(
      (country) => countryRelations[country.code] === relation,
    );

  const home = byRelation('home');
  const visited = byRelation('visited');
  const rest = WORLD_COUNTRIES.filter(
    (country) => !countryRelations[country.code],
  );
  const pin = projectWorldToPercent(
    currentLocation.latitude,
    currentLocation.longitude,
  );
  const flagged = WORLD_COUNTRIES.filter(
    (country) => countryFlags[country.code],
  ).map((country) => ({
    country,
    flag: countryFlags[country.code],
    bounds: getPathBounds(country.path),
  }));

  return (
    <figure className="world-map">
      <div className="world-map-frame">
        <div
          className="world-map-plot"
          style={{ aspectRatio: `${WORLD_MAP_WIDTH} / ${WORLD_MAP_HEIGHT}` }}
        >
          <svg
            className="world-map-svg"
            viewBox={`0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}`}
            role="img"
            aria-label="World map with visited countries highlighted"
          >
            <g className="world-map-countries">
              {rest.map((country) => (
                <path key={country.code} d={country.path} />
              ))}
            </g>
            {/* Highlights last, so their heavier edges are not overdrawn. */}
            <g className="world-map-countries world-map-countries--visited">
              {visited.map((country) => (
                <path
                  key={country.code}
                  className={flagClassName(country.code)}
                  d={country.path}
                >
                  <title>{country.name}</title>
                </path>
              ))}
            </g>
            <g className="world-map-countries world-map-countries--home">
              {home.map((country) => (
                <path
                  key={country.code}
                  className={flagClassName(country.code)}
                  d={country.path}
                >
                  <title>{country.name}</title>
                </path>
              ))}
            </g>
            {/* Flag laid inside the country, then its border restored on top */}
            {flagged.map(({ country, flag, bounds }) => (
              <g key={country.code}>
                <clipPath id={flagClipId(country.code)}>
                  <path d={country.path} />
                </clipPath>
                <image
                  className="world-map-flag"
                  href={flag}
                  x={bounds.x}
                  y={bounds.y}
                  width={bounds.width}
                  height={bounds.height}
                  preserveAspectRatio="none"
                  clipPath={`url(#${flagClipId(country.code)})`}
                />
                <path
                  className="world-map-flag-outline"
                  d={country.path}
                  fill="none"
                />
              </g>
            ))}
          </svg>
          <p
            className="world-map-now"
            style={
              {
                '--pin-left': `${pin.left.toFixed(3)}%`,
                '--pin-top': `${pin.top.toFixed(3)}%`,
              } as CSSProperties
            }
          >
            <span className="world-map-now-dot" aria-hidden="true" />
            <span className="world-map-now-label">Now</span>
          </p>
        </div>
      </div>
      <figcaption className="world-map-caption">
        <span className="world-map-legend">
          <span className="world-map-legend-item">
            {countryFlags.KAZ ? (
              // biome-ignore lint/performance/noImgElement: native img keeps next/image out of the static export
              <img
                className="world-map-legend-flag"
                src={countryFlags.KAZ}
                alt=""
                width={16}
                height={8}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span
                className="world-map-legend-dot world-map-legend-dot--home"
                aria-hidden="true"
              />
            )}
            Home
          </span>
          <span className="world-map-legend-item">
            <span className="world-map-legend-dot" aria-hidden="true" />
            {visited.length} countries visited
          </span>
          <span className="world-map-legend-item">
            <span
              className="world-map-legend-dot world-map-legend-dot--now"
              aria-hidden="true"
            />
            Now in {currentLocation.city}
          </span>
        </span>
      </figcaption>
      {/* The map carries this visually; spell it out for assistive tech. */}
      <ul className="sr-only">
        {home.map((country) => (
          <li key={country.code}>{country.name} (home)</li>
        ))}
        {visited.map((country) => (
          <li key={country.code}>{country.name}</li>
        ))}
        <li>
          Currently living in {currentLocation.city}, {currentLocation.country}
        </li>
      </ul>
    </figure>
  );
}
