/**
 * Skills, grouped for reading rather than for filtering.
 *
 * Rules that keep this section short and scannable:
 * - Every skill appears in exactly one group. The previous model let a skill
 *   carry several categories, which rendered it two or three times.
 * - No self-rated competency. An unlabelled 1–5 scale communicates nothing to a
 *   reader and invites scepticism; ordering inside a group carries the emphasis
 *   instead, strongest first.
 * - Leave out what is assumed at this level (editors, version control). A tool
 *   nobody would be surprised you use costs space and signals nothing.
 * - Keep this in step with the `tech` pills in `projects.ts`: a technology worth
 *   listing here should be one the projects actually demonstrate.
 */
export interface SkillGroup {
  name: string;
  /** Ordered deliberately — most relevant first, not alphabetically. */
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    name: '3D Vision & Point Clouds',
    skills: [
      'Open3D',
      'PCL',
      'OpenCV',
      'PyVista',
      'Trimesh',
      'Three.js',
      'CloudCompare',
      'MeshLab',
    ],
  },
  {
    name: 'Robotics & SLAM',
    skills: [
      'SLAM',
      'VSLAM',
      'Sensor Fusion',
      'LiDAR–IMU–Camera Calibration',
      '3D Reconstruction',
      'ROS 2',
    ],
  },
  {
    name: 'Programming',
    skills: ['Python', 'C++', 'JavaScript'],
  },
  {
    name: 'Tools & Platforms',
    skills: ['Linux', 'Docker', 'PyTorch'],
  },
  {
    name: 'Spoken Languages',
    // Levels kept in step with cv/resume_faangpath.tex.
    skills: [
      'English (advanced)',
      'Kazakh (native)',
      'Russian (bilingual)',
      'Turkish (B2)',
      'Korean (TOPIK 2)',
    ],
  },
];

export default skillGroups;
