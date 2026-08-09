import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    // First person, first name only; the full name stays in metadata and schema.
    expect(aboutMarkdown).toContain('I am Sagi, a 3D Computer Vision Engineer');
    expect(aboutMarkdown).not.toContain('Sagi Amangeldi');
    expect(aboutMarkdown).toContain('VITOM');
  });

  it('does not duplicate resume-specific sections', () => {
    expect(aboutMarkdown).not.toContain('# Engineering Focus');
    expect(aboutMarkdown).not.toContain('# Education');
    expect(aboutMarkdown).not.toContain('# Presentations');
  });

  it('contains the some history section', () => {
    expect(aboutMarkdown).toContain('# Some History');
    expect(aboutMarkdown).toContain('studying physics deeply in high school');
    expect(aboutMarkdown).toContain('changed my path to computer science');
    expect(aboutMarkdown).toContain(
      'applied 3D perception systems for robotics',
    );
  });

  // Travel / Geography and People I Admire are currently disabled. They are
  // preserved verbatim in the block comment at the top of src/data/about.ts;
  // restore these assertions alongside them.
  it('omits the disabled sections and their map embeds', () => {
    expect(aboutMarkdown).not.toContain('# Travel / Geography');
    expect(aboutMarkdown).not.toContain('# People I Admire');
    expect(aboutMarkdown).not.toContain('<!-- travel-map -->');
    expect(aboutMarkdown).not.toContain('<!-- world-map -->');
  });

  it('contains personal sections', () => {
    expect(aboutMarkdown).toContain('# I Like');
    expect(aboutMarkdown).toContain('# Fun Facts');
    expect(aboutMarkdown).toContain('# I Dream Of');
  });

  it('contains I Like bullets in the preferred order', () => {
    expect(aboutMarkdown).toContain(`# I Like

- High tech.
- Playing football, sometimes watching.
- Books.`);
  });

  it('does not duplicate languages as a standalone section', () => {
    expect(aboutMarkdown).not.toContain('# Languages');
    expect(aboutMarkdown).toContain(
      'I speak English, Kazakh, Russian, Turkish, and Korean.',
    );
  });

  it('contains the typing speed fun fact', () => {
    expect(aboutMarkdown).toContain('I can type around 100 WPM');
    expect(aboutMarkdown).toContain('1-2%');
  });

  it("contains the Rubik's Cube fun fact", () => {
    expect(aboutMarkdown).toContain(
      "I can solve a Rubik's Cube in under 2 minutes",
    );
    expect(aboutMarkdown).toContain('0.2% to 1%');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThanOrEqual(1);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers).toEqual([
      '# Intro',
      '# Some History',
      '# I Like',
      '# Fun Facts',
      '# I Dream Of',
    ]);
  });
});
