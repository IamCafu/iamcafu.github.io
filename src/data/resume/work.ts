/**
 * A highlight that carries supporting detail. JSON Resume models `highlights`
 * as plain strings, so positions can mix both forms: use a string when the
 * claim stands on its own, and this shape when it needs evidence beneath it.
 */
export interface DetailedHighlight {
  summary: string;
  details: string[];
}

export type Highlight = string | DetailedHighlight;

export function isDetailedHighlight(
  highlight: Highlight,
): highlight is DetailedHighlight {
  return typeof highlight !== 'string';
}

/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  /**
   * Team or division within the company. Shown in the resume header only —
   * `name` stays the legal entity because it feeds JSON-LD `worksFor` and the
   * footer's current-role line.
   */
  department?: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  location?: string;
  summary?: string;
  highlights?: Highlight[];
}

const work: Position[] = [
  {
    name: 'VITOM Inc.',
    department: 'SLAM Team',
    position: '3D Computer Vision Engineer',
    url: 'https://vitom-tech.com/en/',
    startDate: '2025-07-01',
    location: 'Tokyo, Japan',
    summary: `Working on SLAM and LiDAR-based perception for robotics and industrial
    applications.`,
    highlights: [
      'Own the sensor-fusion foundation for the scanning platform: calibration, timing, and synchronization across LiDAR, IMU, and camera.',
      'Replaced both production perception stages — dynamic object removal and map colorization — now running on every scanner model.',
      'Led the port from Python to C++ and the move off Open3D onto in-house geometry built for the scanners.',
      'Rebuilt the scanner web tool end to end, retiring its PHP stack.',
    ],
  },
  {
    name: 'Korea Institute of Industrial Technology',
    department: '3D Printing Manufacturing Process Center',
    position: 'Computer Vision Engineer',
    url: 'https://kamic.or.kr/en/regional-center/ulsan/',
    startDate: '2023-10-01',
    endDate: '2025-07-01',
    location: 'Ulsan, South Korea',
    summary: `Applied 3D vision and AI to manufacturing problems, in joint
    research with industry partners.`,
    // The three further studies co-authored here are listed individually under
    // Research and Presentations, so they are not restated as a highlight.
    highlights: [
      'Delivered automated point-cloud inspection for shipbuilding components in joint research with Hyundai Heavy Industries, who built on the algorithms.',
      "Built an LLM-assisted search platform for a partner's industrial CAD library.",
    ],
  },
  {
    name: 'K-Labs',
    department: 'Software Development Team',
    position: 'Software Engineer',
    url: 'http://www.klabs.co.kr/en',
    startDate: '2022-12-01',
    endDate: '2023-10-01',
    location: 'Ulsan, South Korea',
    summary: `Built 3D point-cloud tooling for additive-manufacturing and
    reverse-engineering workflows.`,
    highlights: [
      'Converted a largely manual scan-to-CAD pipeline to partial automation, cutting operator time per conversion.',
      'Integrated point-cloud post-processing and denoising into internal engineering tools.',
    ],
  },
];

export default work;
