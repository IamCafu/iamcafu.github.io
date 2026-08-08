/**
 * Projects shown on the resume page. Distinct from `src/data/projects.ts`,
 * which is card-shaped (image, featured) for the `/projects` Archive grid.
 *
 * These entries divide the material with `work.ts` rather than repeating it: a
 * position states scope and outcome, and the project behind it states how the
 * thing works. Citations belong to `presentations.ts`, so no entry here ends
 * with "presented at". Keep a claim in exactly one of the three.
 *
 * Confidentiality: internal system and repository names, customer site names,
 * and unit serial numbers are deliberately absent — describe the system, not
 * the codebase. Scanner model names and measured figures are cleared for
 * publication. `attribution` exists so shared work is never implied to be sole
 * work; fill it in whenever a colleague led part of the project.
 *
 * Writing rules for the bullets, all three lists:
 * - Stay inside the project. Do not explain a sibling project to justify this
 *   one, and do not describe the wider pipeline — only the part this project
 *   owns, plus whatever mechanism is needed to make that part legible.
 * - Explain, don't name. A term an outside reader cannot unpack (an internal
 *   identifier, an unexplained parameter) is worth less than the plain sentence
 *   it stands for.
 * - Every bullet earns its length with a mechanism, a number, or a decision.
 */
export interface ProjectMetric {
  /** Short figure, e.g. '19 min'. Kept terse — it renders large. */
  value: string;
  /** What the figure measures, e.g. 'end-to-end at that scale'. */
  label: string;
}

/** A run of bullet text. The object form renders as a link. */
export type ProjectPointSegment = string | { text: string; link: string };

/**
 * A bullet: a plain string in the common case, or a list of segments when part
 * of the line should link out — citing a paper or tool inline without turning
 * the whole bullet into a link.
 */
export type ProjectPoint = string | ProjectPointSegment[];

/** Flattens a bullet to plain text, for React keys and for tests. */
export function projectPointText(point: ProjectPoint): string {
  if (typeof point === 'string') {
    return point;
  }

  return point
    .map((segment) => (typeof segment === 'string' ? segment : segment.text))
    .join('');
}

export interface Project {
  title: string;
  /** Context line under the title — the employer, team, or 'Personal project'. */
  role?: string;
  /** Repository, demo, or write-up. Renders the title as a link when present. */
  link?: string;
  /**
   * ISO date driving the newest-first ordering check in the data tests and the
   * `<time>` attribute. Optional, and paired with `dateLabel`: work projects
   * inherit their period from the role rather than carrying one of their own,
   * so leave both off rather than restating the employment dates.
   */
  date?: string;
  /** Display form of `date`, which may be a range. */
  dateLabel?: string;
  /** One or two sentences on what the thing is. Always visible. */
  overview: string;
  /** At most two headline figures. Always visible; omit rather than pad. */
  metrics?: ProjectMetric[];
  /** What I personally did. Required — this is the point of the entry. */
  contribution: ProjectPoint[];
  /** The hard parts, and the reasoning behind the approach taken. */
  challenges?: ProjectPoint[];
  /** Measurable results. */
  outcomes?: ProjectPoint[];
  /** Credit for work that was not solely mine, shown beneath the overview. */
  attribution?: string;
  /**
   * Rendered as pills. Only list technologies the underlying work actually
   * uses — this is a resume, not a keyword field.
   */
  tech?: string[];
}

// Order is editorial, not chronological: the point-cloud processing work leads,
// then sensor timing, then the operator application, with the earlier research
// project last. No entry carries a date, so nothing here is sorted
// automatically — this sequence is the intended one.
const projects: Project[] = [
  {
    title: 'Dynamic Object Removal',
    role: 'VITOM Inc. · SLAM Team',
    overview:
      'Developed a scalable point-cloud filtering pipeline that removes moving objects, floating noise, multipath artifacts, and airborne particles to produce clean static maps for downstream processing.',
    metrics: [
      { value: 'up to 3.5 billion', label: 'points, on 64 GB RAM' },
      { value: '~21 s', label: 'to filter a 57-million-point scan' },
    ],
    contribution: [
      [
        'Integrated ',
        {
          text: 'DUFOMap',
          link: 'https://arxiv.org/abs/2403.01449',
        },
        ' as the default dynamic-object removal stage across all VITOM scanner models, including Robin, Parrot, and MK3.',
      ],
      'Reduced peak memory use so the algorithm runs stably on a 64 GB RAM machine.',
      'Simplified the output pipeline to generate a single cleaned point-cloud file, replacing the old MOR (moving object removal) filtering for all scanners.',
      'Evaluated multiple configurations across different real-world captures.',
    ],
    challenges: [
      'Dynamic points close to static geometry survived the filter — a walking person’s legs left above the floor after the rest of the body was removed — so that case had to be handled separately.',
      'Parameter tuning required balancing noise removal against erosion of thin structures and object boundaries.',
      'Adapting the filter across LiDAR models meant handling both repetitive ring patterns, as on the Hesai XT32, and non-repetitive patterns, as on the Livox Mid-360.',
    ],
    outcomes: [
      'On a machine with 64 GB of RAM, the pipeline comfortably handles up to 3.5 billion raw points.',
      'Filtered a 60-minute production scan with the Hesai XT32 in single-return mode — roughly 2.3 billion points — in 18 minutes, and a 57-million-point indoor scan in approximately 21 seconds.',
    ],
    tech: ['Python', 'DUFOMap', 'Open3D', 'HDF5', 'LAS', 'TBB'],
  },
  {
    title: 'Point Cloud Colorization',
    role: 'VITOM Inc. · SLAM Team',
    overview:
      'Developed a colorization pipeline that projects wide-angle RGB imagery onto SLAM-reconstructed LiDAR maps.',
    metrics: [{ value: '1–2 px', label: 'projection accuracy at 1920×1440' }],
    contribution: [
      'Architected the pipeline to color batches of LiDAR frames against a shared image, replacing per-frame processing.',
      'Built the motion-compensation step that aligns each scan to its paired image, interpolating scanner pose from IMU orientation to correct the capture-time difference.',
      'Added per-camera image masking to exclude permanently invalid regions, such as lens edges and rig components, from the output.',
      'Fixed colorization of georeferenced output and integrated the pipeline into the post-processing application.',
      'Extended support to dual wide-angle capture devices such as the Insta360.',
    ],
    challenges: [
      'Points hidden from the camera must not receive color, requiring occlusion detection and motion compensation before projection.',
      'Colorization is highly sensitive to timing error — a few milliseconds of clock offset is invisible in geometry but visibly smears color across edges during rotation.',
    ],
    outcomes: [
      'Achieved 1–2 pixel projection accuracy at 1920×1440.',
      'Replaced the previous method as the default across all VITOM scanner models — including Robin, Parrot, and MK3 — with improved speed and stability.',
    ],
    tech: ['Python', 'Open3D', 'NumPy', 'Fisheye projection'],
  },
  {
    title: 'Sensor Time Synchronization',
    role: 'VITOM Inc. · SLAM Team',
    overview:
      'Developed a multi-sensor time synchronization and calibration system for camera, IMU, and LiDAR using PTP and residual time-offset estimation.',
    // Both figures are how tightly the estimate repeats, NOT the offset itself
    // — the measured offsets are an order of magnitude larger. The camera value
    // is the even/odd keyframe split agreement, the IMU value the spread across
    // independent recordings. Keep 'precision' in the label: without it the
    // tile reads as though the offset were under a millisecond.
    metrics: [
      { value: '< 1 ms', label: 'camera-to-LiDAR offset precision' },
      { value: '~1 ms', label: 'IMU-to-LiDAR offset precision' },
    ],
    // Ordered as the two layers stack: discipline the clocks first, then measure
    // the offset that discipline cannot remove.
    contribution: [
      'Developed a PTP-based synchronization system for LiDAR, camera, and IMU sensors, supporting both hardware and software timestamping.',
      'Replaced the previous synchronization daemon with linuxptp and introduced scanner-specific configuration for clock modes and network interfaces.',
      'Added real-time clock health monitoring and recovery tools to detect synchronization failures before data collection.',
      'Built a camera–LiDAR time-offset estimator using LiDAR intensity projection and normalized mutual information.',
      [
        'Integrated the ',
        {
          text: 'iKalibr',
          link: 'https://github.com/Unsigned-Long/iKalibr',
        },
        ' targetless calibration framework into a single-command Docker workflow for IMU–LiDAR calibration.',
      ],
      'Implemented a repeatable correction pipeline that preserves original timestamps and records calibration results with quality metrics.',
    ],
    challenges: [
      'Camera, LiDAR, and IMU data were timestamped through different clock sources, introducing fixed delays and synchronization errors.',
      'The existing PTP setup showed increasing clock drift during long recordings.',
    ],
    outcomes: [
      'Achieved consistent camera–LiDAR offset estimates with sub-millisecond variation.',
      'Obtained IMU–LiDAR calibration results consistent within approximately one millisecond.',
    ],
    tech: [
      'Python',
      'NumPy',
      'SciPy',
      'OpenCV',
      'ROS 2',
      'linuxptp',
      'iKalibr',
      'Docker',
      'systemd',
    ],
  },
  {
    title: 'LiDAR Scanner Web Application',
    role: 'VITOM Inc.',
    overview:
      'Developed the web application used to operate LiDAR scanners — recording, live 3D preview, sensor status, and data processing.',
    // No metrics: this project's wins are qualitative — modernization,
    // automation, quality infrastructure. The counts that were here (PHP files,
    // test modules) measured artifacts rather than results, and both facts still
    // live in Outcomes where they read as consequences.
    contribution: [
      'Rebuilt a legacy PHP application into a Flask API with a modular JavaScript front end, separating UI, API, and infrastructure into independent layers.',
      'Introduced YAML-driven configuration as the single source of truth for each scanner’s sensors, network, and runtime settings.',
      'Automated device provisioning and in-field updates, replacing manual setup procedures.',
      'Established the project’s first CI pipeline and unit test suite, covering API routes and configuration loading.',
    ],
    challenges: [
      'Sensors had to be initialized in a strict order for the system to run reliably, and the previous application did not enforce it consistently, leaving it unstable.',
      'The original interface was unintuitive and not built around how operators actually run a scan.',
    ],
    outcomes: [
      'Delivered a redesigned, intuitive operator interface organized around the scanning workflow.',
      'Reduced the PHP codebase from 28 files to 1, consolidating server logic behind a single API.',
      'New scanners deploy from one configuration file instead of a manual setup process.',
      'Regressions caught in CI rather than during field deployment.',
    ],
    tech: [
      'Python',
      'Flask',
      'JavaScript',
      'Three.js',
      'Socket.IO',
      'ROS 2',
      'pytest',
      'systemd',
    ],
  },
  {
    title: 'Automated Ship Component Inspection',
    role: 'Korea Institute of Industrial Technology',
    link: 'https://oak.ulsan.ac.kr/handle/2021.oak/20336',
    overview:
      'Developed an automated pipeline that isolates a target ship component from cluttered terrestrial LiDAR scans and measures its deviation against the CAD model. Subject of my MSc thesis.',
    metrics: [
      { value: '91.5%', label: 'match to manual segmentation' },
      { value: '~15 min', label: 'end-to-end on a 515-million-point scan' },
    ],
    contribution: [
      'Built the pipeline that automatically isolates the target component from raw, cluttered LiDAR scans.',
      'Aligned the isolated scan to its CAD model and classified surface deviation into acceptable, warning, and critical bands.',
    ],
    challenges: [
      'The target component accounted for under 0.04% of the scanned volume, buried among cranes, scaffolding, and neighbouring blocks that defeated existing filters.',
    ],
    outcomes: [
      'Automated segmentation preserved 91.5% of the manually segmented component, with no human intervention.',
      'Reduced inspection of a full shipyard scan to roughly 15 minutes, replacing slow and inconsistent manual segmentation.',
    ],
    tech: ['Python', 'Open3D', 'NumPy', 'SciPy', 'CloudCompare'],
  },
];

export default projects;
