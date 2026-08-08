export type DegreeDetail =
  | string
  | { label?: string; link: string; text: string };

export interface Degree {
  school: string;
  degree: string;
  /** Subject, rendered on its own line beneath the degree. */
  field?: string;
  link: string;
  year: number;
  location?: string;
  /**
   * Square, transparent-background logo in `public/images/logos/`. Marks with
   * dark lettering need the light plate `.degree-logo` applies in dark mode.
   */
  logo?: string;
  details?: DegreeDetail[];
}

const degrees: Degree[] = [
  {
    school: 'University of Ulsan',
    degree: 'Master of Science',
    field: 'AI and Computer Engineering',
    link: 'https://www.timeshighereducation.com/world-university-rankings/university-ulsan',
    logo: '/images/logos/university-of-ulsan.png',
    year: 2025,
    location: 'Ulsan, South Korea',
    details: [
      'September 2023 - August 2025',
      'GPA: 4.1/4.5',
      {
        label: 'Thesis:',
        text: 'Automated Noise Removal and CAD-to-Scan Comparison for Ship Component Inspection Using Terrestrial LiDAR Scanning',
        link: 'https://oak.ulsan.ac.kr/handle/2021.oak/20336',
      },
    ],
  },
  {
    school: 'Nazarbayev University',
    degree: 'Bachelor of Science in Computer Science',
    link: 'https://www.timeshighereducation.com/world-university-rankings/nazarbayev-university',
    logo: '/images/logos/nazarbayev-university.png',
    year: 2022,
    location: 'Astana, Kazakhstan',
    details: ['August 2018 - June 2022', 'GPA: 3.2/4.0'],
  },
];

export default degrees;
