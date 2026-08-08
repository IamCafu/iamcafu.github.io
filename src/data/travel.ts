/**
 * Cities plotted on the about page travel map.
 *
 * To add a city: append an entry with its latitude/longitude to the right list
 * and, if its label would collide with a neighbour, set `labelPlacement`. Entry
 * order does not matter - the map sorts pins west to east.
 */

export type CityLabelPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface KazakhstanCity {
  name: string;
  latitude: number;
  longitude: number;
  /** Label position relative to the pin. Defaults to `right`. */
  labelPlacement?: CityLabelPlacement;
  /** Renders the pin with the capital marker. */
  isCapital?: boolean;
  /** Renders the pin as my hometown, with the same marker as the capital. */
  isHometown?: boolean;
}

/** Cities I have visited - drawn in the accent color. */
export const visitedKazakhstanCities: KazakhstanCity[] = [
  { name: 'Astana', latitude: 51.1694, longitude: 71.4491, isCapital: true },
  { name: 'Almaty', latitude: 43.238, longitude: 76.8829 },
  {
    name: 'Shymkent',
    latitude: 42.3417,
    longitude: 69.5901,
    labelPlacement: 'bottom',
  },
  {
    name: 'Turkestan',
    latitude: 43.2973,
    longitude: 68.2517,
    labelPlacement: 'left',
    isHometown: true,
  },
  { name: 'Aktau', latitude: 43.651, longitude: 51.158 },
  { name: 'Aktobe', latitude: 50.2839, longitude: 57.167 },
  { name: 'Atyrau', latitude: 47.0945, longitude: 51.9238 },
  { name: 'Oral', latitude: 51.2333, longitude: 51.3667 },
  { name: 'Taraz', latitude: 42.9, longitude: 71.3667 },
  {
    name: 'Taldykorgan',
    latitude: 45.0156,
    longitude: 78.3736,
    labelPlacement: 'left',
  },
  { name: 'Pavlodar', latitude: 52.2873, longitude: 76.9674 },
  { name: 'Kokshetau', latitude: 53.2833, longitude: 69.3833 },
  { name: 'Zhezkazgan', latitude: 47.7833, longitude: 67.7667 },
  { name: 'Kyzylorda', latitude: 44.8479, longitude: 65.5093 },
  { name: 'Karagandy', latitude: 49.8047, longitude: 73.1094 },
];

/**
 * Other major cities, drawn muted for geographic context. Roughly the 200k+
 * cities that are not on the visited list. Temirtau is left out because it
 * lands on top of Karagandy at this scale, and Ekibastuz by choice.
 */
/** How a country relates to me, which decides how the world map fills it. */
export type CountryRelation = 'home' | 'visited';

/**
 * Countries highlighted on the world map, keyed by ISO 3166-1 alpha-3 code as
 * published in `WORLD_COUNTRIES` (`src/lib/world-map.ts`) - add a code here and
 * that country lights up.
 */
export const countryRelations: Record<string, CountryRelation> = {
  KAZ: 'home', // where I am from
  RUS: 'visited', // summer Olympiad camp
  UZB: 'visited',
  KOR: 'visited', // lived there three years
  THA: 'visited', // conference
  JPN: 'visited', // where I live now, marked by currentLocation below
};

/**
 * Countries drawn with their flag instead of a flat fill, by ISO code. Flags
 * live in `public/images/flags/`; the flat fill for the country's relation
 * stays underneath as a fallback if the image cannot load.
 */
export const countryFlags: Record<string, string> = {
  KAZ: '/images/flags/kazakhstan.svg',
  JPN: '/images/flags/japan.svg',
};

/** Where I live now, pinned on the world map. */
export const currentLocation = {
  city: 'Tokyo',
  country: 'Japan',
  latitude: 35.6762,
  longitude: 139.6503,
};

export const otherKazakhstanCities: KazakhstanCity[] = [
  { name: 'Petropavl', latitude: 54.8667, longitude: 69.15 },
  { name: 'Kostanay', latitude: 53.2144, longitude: 63.6246 },
  {
    name: 'Semey',
    latitude: 50.4111,
    longitude: 80.2275,
    labelPlacement: 'left',
  },
  { name: 'Oskemen', latitude: 49.9737, longitude: 82.6103 },
];
