export interface Presentation {
  title: string;
  authors: string;
  event: string;
  location: string;
  date: string;
  dateLabel: string;
  type: 'Oral' | 'Poster';
  link?: string;
}

const presentations: Presentation[] = [
  {
    title:
      'AI-Assisted Search for Industrial Components Using a Local Database and Large Language Models',
    authors: 'S. Amangeldi, S. B. Park, J. H. Ha, Y. K. Kwon, D. H. Kim',
    event:
      'International Conference on Precision Engineering and Sustainable Manufacturing 2025',
    location: 'Chiang Mai, Thailand',
    date: '2025-07-01',
    dateLabel: 'July 2025',
    type: 'Poster',
  },
  {
    title:
      'Comparative Analysis of Point Cloud Scans and 3D CAD Data for Dimensional Inspection in Shipbuilding Components',
    authors: 'S. Amangeldi, N. T. Phan, A. Tleuliyev, Y. K. Kwon, D. H. Kim',
    event: 'Korean Society for Precision Engineering Conference',
    location: 'Jeju, South Korea',
    date: '2024-05-01',
    dateLabel: 'May 2024',
    type: 'Poster',
    link: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798461',
  },
  {
    title:
      'Various Approaches to Improve a Production Process and Distribution Efficiency Using Software and Additive Manufacturing in Ship-building Industry',
    authors:
      'D. H. Kim, N. T. Phan, A. Tleuliyev, S. Amangeldi, Y. K. Kwon, S. B. Park',
    event: 'Korean Society for Precision Engineering Conference',
    location: 'Jeju, South Korea',
    date: '2024-05-01',
    dateLabel: 'May 2024',
    type: 'Oral',
    link: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798922',
  },
  {
    title:
      'Selection of Suppliers and Allocation Orders in Ship Manufacture Using Adapt Genetic Algorithm',
    authors: 'N. T. Phan, A. Tleuliyev, S. Amangeldi, Y. K. Kwon, D. H. Kim',
    event: 'Korean Society for Precision Engineering Conference',
    location: 'Jeju, South Korea',
    date: '2024-05-01',
    dateLabel: 'May 2024',
    type: 'Poster',
    link: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798464',
  },
  {
    title:
      'Synthesizing Audio Representations from 3D Models for Comparative Analysis',
    authors: 'A. Tleuliyev, Y. K. Kwon, N. T. Phan, S. Amangeldi, D. H. Kim',
    event: 'Korean Society for Precision Engineering Conference',
    location: 'Jeju, South Korea',
    date: '2024-05-01',
    dateLabel: 'May 2024',
    type: 'Poster',
    link: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11798470',
  },
];

export default presentations;
