import { describe, expect, it } from 'vitest';

import projects, { projectPointText } from '../resume/projects';

/**
 * Internal system/repository names, customer site names, and unit serials are
 * not cleared for publication. Scanner model names and measured figures are.
 */
const EMBARGOED = [
  'motivSLAM',
  'motivROS',
  'vitom_gui',
  'CloudMan',
  'Vitom Core',
  'vitomCore',
  'motiv-ncb',
  'Hiroshima',
  'Odaiba',
  'Shinagawa',
  'aquapark',
];

describe('resume projects data', () => {
  it('exports a non-empty array of projects', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project has an overview and at least one contribution', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.overview.trim().length).toBeGreaterThan(0);
      expect(project.contribution.length).toBeGreaterThan(0);
      expect(
        project.contribution.every(
          (item) => projectPointText(item).trim().length > 0,
        ),
      ).toBe(true);
    }
  });

  it('dated projects carry both a valid ISO date and a label', () => {
    for (const project of projects) {
      if (project.date === undefined && project.dateLabel === undefined) {
        continue;
      }

      expect(new Date(String(project.date)).toString()).not.toBe(
        'Invalid Date',
      );
      expect(project.dateLabel?.trim().length).toBeGreaterThan(0);
    }
  });

  it('dated projects are sorted newest first among themselves', () => {
    const dates = projects
      .map((project) => project.date)
      .filter((date): date is string => date !== undefined)
      .map((date) => new Date(date).getTime());

    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  it('links are valid URLs when present', () => {
    const urls = projects.flatMap((project) => [
      ...(project.link ? [project.link] : []),
      ...[
        ...project.contribution,
        ...(project.challenges ?? []),
        ...(project.outcomes ?? []),
      ]
        .filter((point): point is Exclude<typeof point, string> =>
          Array.isArray(point),
        )
        .flatMap((point) =>
          point
            .filter(
              (segment): segment is { text: string; link: string } =>
                typeof segment !== 'string',
            )
            .map((segment) => segment.link),
        ),
    ]);

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).toMatch(/^https?:\/\/.+/);
    }
  });

  it('shows at most two metrics per project, each with a value and label', () => {
    for (const project of projects) {
      if (!project.metrics) {
        continue;
      }

      expect(project.metrics.length).toBeGreaterThan(0);
      expect(project.metrics.length).toBeLessThanOrEqual(2);

      for (const metric of project.metrics) {
        expect(metric.value.trim().length).toBeGreaterThan(0);
        expect(metric.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('tech is a non-empty array when present', () => {
    for (const project of projects) {
      if (project.tech) {
        expect(project.tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('has unique project titles', () => {
    const titles = projects.map((project) => project.title);

    expect(new Set(titles).size).toBe(titles.length);
  });

  it('never publishes embargoed internal or customer names', () => {
    const corpus = JSON.stringify(projects).toLowerCase();

    for (const term of EMBARGOED) {
      expect(corpus).not.toContain(term.toLowerCase());
    }
  });

  it('never publishes unit serial numbers', () => {
    // URLs carry digit runs legitimately (arXiv IDs, DOIs), so strip them
    // first: the risk being guarded is a serial like robin_000012 in prose.
    const prose = JSON.stringify(projects).replace(/https?:\/\/[^"]*/g, '');

    expect(prose).not.toMatch(/\d{5,}/);
  });
});
