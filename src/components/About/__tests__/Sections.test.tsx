import { render, screen, waitFor, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

function getActualSectionTitles(markdown: string) {
  return Array.from(markdown.matchAll(/^# (.+)$/gm))
    .map((match) => match[1])
    .filter((title) => title !== 'Intro');
}

describe('AboutContent', () => {
  it('renders intro copy without an Intro heading', () => {
    render(
      <AboutContent
        markdown={`# Intro

Hello from the intro.

# Some History

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toBeInTheDocument();
  });

  it('assigns section variants for compact and links sections', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I Like

- Running

# People I Admire

- [Example](https://example.com)`}
      />,
    );

    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('about-section--compact');
    expect(sections[1]).toHaveClass('about-section--links');
  });

  it('adds stable heading ids for deep links', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Some History

- Built a thing.

# Travel / Geography

- Went somewhere.`}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toHaveAttribute('id', 'some-history');
    expect(
      screen.getByRole('heading', { name: 'Travel / Geography' }),
    ).toHaveAttribute('id', 'travel-geography');
  });

  // The embed mechanism is still wired up in Sections.tsx even though the real
  // about copy no longer uses it, so this drives it from a fixture.
  it('splices both maps in at their markers', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Travel / Geography

- I am originally from Kazakhstan.

<!-- travel-map -->

Outside Kazakhstan, I went to Russia first.

<!-- world-map -->`}
      />,
    );

    const travelSection = container.querySelector(
      '.about-section:has(#travel-geography)',
    ) as HTMLElement;

    expect(container.querySelectorAll('.travel-map')).toHaveLength(1);
    expect(container.querySelectorAll('.world-map')).toHaveLength(1);
    expect(travelSection.querySelector('.travel-map')).toBeInTheDocument();
    expect(travelSection.querySelector('.world-map')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Cities visited' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'World map with visited countries highlighted',
      }),
    ).toBeInTheDocument();

    // City map after the Kazakhstan bullet, then the trip copy, then the world.
    const blocks = Array.from(travelSection.children).map((child) => {
      for (const name of ['travel-map', 'world-map']) {
        if (child.classList.contains(name)) {
          return name;
        }
      }
      return child.tagName.toLowerCase();
    });

    expect(blocks).toEqual(['h2', 'ul', 'travel-map', 'p', 'world-map']);
    expect(travelSection.querySelector('p')).toHaveTextContent(
      'Outside Kazakhstan, I went to Russia first',
    );
    expect(
      travelSection.querySelector('ul')?.querySelectorAll('li'),
    ).toHaveLength(1);
    expect(travelSection.querySelector('ul')).toHaveTextContent(
      'I am originally from Kazakhstan',
    );
  });

  it('never renders a marker as visible text', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);

    expect(container.textContent).not.toContain('travel-map -->');
    expect(container.textContent).not.toContain('world-map -->');
    expect(container.textContent).not.toContain('<!--');
  });

  it('omits the maps when their markers are absent', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Travel / Geography

- Went somewhere.`}
      />,
    );

    expect(container.querySelector('.travel-map')).toBeNull();
    expect(container.querySelector('.world-map')).toBeNull();
    expect(screen.getByText('Went somewhere.')).toBeInTheDocument();
  });

  it('renders section navigation and self-links for the real about markdown', () => {
    const sectionTitles = getActualSectionTitles(aboutMarkdown);
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const nav = screen.getByRole('navigation', { name: 'About sections' });

    expect(within(nav).getAllByRole('link')).toHaveLength(sectionTitles.length);

    for (const title of sectionTitles) {
      const headingId = createHeadingId(title);
      const heading = screen.getByRole('heading', { name: title });

      expect(heading).toHaveAttribute('id', headingId);
      expect(within(nav).getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `#${headingId}`,
      );
      expect(
        container.querySelector(`h2#${headingId} > a[href="#${headingId}"]`),
      ).toBeTruthy();
    }
  });

  it('renders matching hash links and heading ids into static markup', () => {
    const html = renderToStaticMarkup(
      <AboutContent markdown={aboutMarkdown} />,
    );

    expect(html).toContain('href="#some-history"');
    expect(html).toContain('id="some-history"');
    expect(html).toContain('href="#i-like"');
    expect(html).toContain('id="i-like"');
    expect(html).toContain('href="#fun-facts"');
    expect(html).toContain('id="fun-facts"');
    expect(html).toContain('href="#i-dream-of"');
    expect(html).toContain('id="i-dream-of"');
    expect(html).not.toContain('href="#travel-geography"');
    expect(html).not.toContain('href="#people-i-admire"');
    expect(html).not.toContain('href="#languages"');
    expect(html).not.toContain('id="languages"');
    expect(html).not.toContain('href="#engineering-focus"');
    expect(html).not.toContain('href="#education"');
    expect(html).not.toContain('href="#presentations"');
  });

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    const nav = screen.getByRole('navigation', { name: 'About sections' });
    const navLink = within(nav).getByRole('link', {
      name: 'I Dream Of',
    });

    navLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#i-dream-of');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'I Dream Of',
    );

    const heading = screen.getByRole('heading', {
      name: 'I Dream Of',
    });
    const permalink = within(heading).getByRole('link', {
      name: 'I Dream Of',
    });

    permalink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#i-dream-of');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'I Dream Of',
    );
  });
});
