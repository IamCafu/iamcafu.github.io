import { describe, expect, it } from 'vitest';

import work, { isDetailedHighlight } from '../resume/work';

describe('work data', () => {
  it('exports an array of positions', () => {
    expect(Array.isArray(work)).toBe(true);
    expect(work.length).toBeGreaterThan(0);
  });

  it('each position has required properties', () => {
    for (const job of work) {
      expect(job).toHaveProperty('name');
      expect(job).toHaveProperty('position');
      expect(job).toHaveProperty('url');
      expect(job).toHaveProperty('startDate');

      expect(typeof job.name).toBe('string');
      expect(typeof job.position).toBe('string');
      expect(typeof job.url).toBe('string');
      expect(typeof job.startDate).toBe('string');
    }
  });

  it('startDate is a valid date string', () => {
    for (const job of work) {
      const date = new Date(job.startDate);
      expect(date.toString()).not.toBe('Invalid Date');
    }
  });

  it('endDate is valid when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const date = new Date(job.endDate);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('endDate is after startDate when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const start = new Date(job.startDate);
        const end = new Date(job.endDate);
        expect(end.getTime()).toBeGreaterThan(start.getTime());
      }
    }
  });

  it('urls are valid', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const job of work) {
      expect(job.url).toMatch(urlRegex);
    }
  });

  // Resume should show at least one current/active position
  it('has at least one current position (no endDate)', () => {
    const currentJobs = work.filter((job) => !job.endDate);
    expect(currentJobs.length).toBeGreaterThanOrEqual(1);
  });

  it('includes a location for the current position', () => {
    const currentJob = work.find((job) => !job.endDate);

    expect(currentJob?.location).toBe('Tokyo, Japan');
  });

  it('includes locations for previous Ulsan positions', () => {
    const ulsanJobs = work.filter((job) =>
      ['Korea Institute of Industrial Technology', 'K-Labs'].includes(job.name),
    );

    expect(ulsanJobs).toHaveLength(2);
    expect(
      ulsanJobs.every((job) => job.location === 'Ulsan, South Korea'),
    ).toBe(true);
  });

  it('uses the current KITECH role title', () => {
    const kitechJob = work.find(
      (job) => job.name === 'Korea Institute of Industrial Technology',
    );

    expect(kitechJob?.position).toBe('Computer Vision Engineer');
  });

  it('highlights are arrays when present', () => {
    for (const job of work) {
      if (job.highlights) {
        expect(Array.isArray(job.highlights)).toBe(true);
        expect(job.highlights.length).toBeGreaterThan(0);
      }
    }
  });

  // `name` feeds JSON-LD worksFor and the footer, so the team lives separately
  it('keeps the team in department rather than the company name', () => {
    const currentJob = work.find((job) => !job.endDate);

    expect(currentJob?.name).toBe('VITOM Inc.');
    expect(currentJob?.department).toBe('SLAM Team');

    const kitechJob = work.find(
      (job) => job.name === 'Korea Institute of Industrial Technology',
    );

    expect(kitechJob?.department).toBe(
      '3D Printing Manufacturing Process Center',
    );

    const kLabsJob = work.find((job) => job.name === 'K-Labs');

    expect(kLabsJob?.department).toBe('Software Development Team');
  });

  it('detailed highlights carry a summary and at least one detail', () => {
    for (const job of work) {
      for (const highlight of job.highlights ?? []) {
        if (!isDetailedHighlight(highlight)) {
          continue;
        }

        expect(highlight.summary.trim().length).toBeGreaterThan(0);
        expect(highlight.details.length).toBeGreaterThan(0);
        expect(
          highlight.details.every((detail) => detail.trim().length > 0),
        ).toBe(true);
      }
    }
  });

  // Detail is evidence for the claim above it, not a restatement of it
  it('detailed highlights keep the summary shorter than its details', () => {
    for (const job of work) {
      for (const highlight of job.highlights ?? []) {
        if (!isDetailedHighlight(highlight)) {
          continue;
        }

        expect(highlight.details.join(' ').length).toBeGreaterThan(
          highlight.summary.length,
        );
      }
    }
  });

  it('has positions from different years', () => {
    const years = work.map((job) => new Date(job.startDate).getFullYear());
    const uniqueYears = new Set(years);

    // Resume should contain work from multiple years
    expect(uniqueYears.size).toBeGreaterThan(1);
  });

  it('company names are non-empty', () => {
    for (const job of work) {
      expect(job.name.trim().length).toBeGreaterThan(0);
    }
  });
});
