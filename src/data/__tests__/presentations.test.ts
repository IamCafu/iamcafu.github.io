import { describe, expect, it } from 'vitest';

import presentations from '../resume/presentations';

describe('presentations data', () => {
  it('exports an array of presentations', () => {
    expect(Array.isArray(presentations)).toBe(true);
    expect(presentations.length).toBeGreaterThan(0);
  });

  it('each presentation has required properties', () => {
    for (const presentation of presentations) {
      expect(presentation).toHaveProperty('title');
      expect(presentation).toHaveProperty('authors');
      expect(presentation).toHaveProperty('event');
      expect(presentation).toHaveProperty('location');
      expect(presentation).toHaveProperty('date');
      expect(presentation).toHaveProperty('dateLabel');
      expect(presentation).toHaveProperty('type');
    }
  });

  it('presentation dates are valid and sorted newest first', () => {
    for (let i = 0; i < presentations.length; i++) {
      const current = new Date(presentations[i].date);
      expect(current.toString()).not.toBe('Invalid Date');

      if (i < presentations.length - 1) {
        const next = new Date(presentations[i + 1].date);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    }
  });

  it('links are valid URLs when present', () => {
    for (const presentation of presentations) {
      if (presentation.link) {
        expect(presentation.link).toMatch(/^https?:\/\/.+/);
      }
    }
  });
});
