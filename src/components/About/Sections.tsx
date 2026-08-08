'use client';

import Markdown from 'markdown-to-jsx';
import { createUniqueHeadingIds } from '@/lib/anchors';
import TravelMap from './TravelMap';
import WorldMap from './WorldMap';

/**
 * Components that `src/data/about.ts` can place with an HTML comment, e.g.
 * `<!-- travel-map -->`. The comment never reaches the markdown renderer.
 */
const embeds = {
  'travel-map': TravelMap,
  'world-map': WorldMap,
} as const;

const EMBED_MARKER = /<!--\s*(travel-map|world-map)\s*-->/;

interface AboutContentProps {
  markdown: string;
}

interface AboutSection {
  body: string;
  id: string;
  title: string;
}

interface ParsedAboutSection {
  body: string;
  title: string;
}

const sectionVariants: Record<string, string> = {
  'Fun Facts': 'about-section--compact',
  'I Like': 'about-section--compact',
  'I Dream Of': 'about-section--compact',
  'People I Admire': 'about-section--links',
};

function splitAboutMarkdown(markdown: string) {
  const trimmed = markdown.trim();
  const introHeading = '# Intro';

  if (!trimmed.startsWith(introHeading)) {
    return {
      intro: '',
      sections: parseSections(trimmed),
    };
  }

  const withoutIntroHeading = trimmed.slice(introHeading.length).trimStart();
  const nextHeadingIndex = withoutIntroHeading.search(/\n# /);

  if (nextHeadingIndex === -1) {
    return {
      intro: withoutIntroHeading.trim(),
      sections: [] as AboutSection[],
    };
  }

  return {
    intro: withoutIntroHeading.slice(0, nextHeadingIndex).trim(),
    sections: parseSections(
      withoutIntroHeading.slice(nextHeadingIndex + 1).trim(),
    ),
  };
}

function parseSections(markdown: string): AboutSection[] {
  const sections: ParsedAboutSection[] = markdown
    .split(/\n(?=# )/)
    .map((section) => section.trim())
    .filter((section) => section !== '')
    .map((section) => {
      const [heading, ...rest] = section.split('\n');

      return {
        title: heading.replace(/^#\s+/, '').trim(),
        body: rest.join('\n').trim(),
      };
    });

  const sectionIds = createUniqueHeadingIds(
    sections.map((section) => section.title),
  );

  return sections.map((section, index) => ({
    ...section,
    id: sectionIds[index] ?? 'section',
  }));
}

/**
 * `forceBlock` so a segment holding a single paragraph still renders as a <p>
 * and picks up the prose styles, instead of collapsing to inline text.
 */
const markdownOptions = { forceBlock: true };

/** Renders markdown, splicing in any embedded components at their markers. */
function Body({ markdown }: { markdown: string }) {
  // A capturing split alternates prose and marker names.
  const segments = markdown.split(new RegExp(EMBED_MARKER.source, 'g'));

  if (segments.length === 1) {
    return <Markdown options={markdownOptions}>{markdown}</Markdown>;
  }

  return (
    <>
      {segments.map((segment, index) => {
        if (index % 2 === 1) {
          const Embed = embeds[segment as keyof typeof embeds];
          return <Embed key={segment} />;
        }

        const prose = segment.trim();
        return prose ? (
          <Markdown key={prose} options={markdownOptions}>
            {prose}
          </Markdown>
        ) : null;
      })}
    </>
  );
}

function getSectionClassName(title: string) {
  const variant = sectionVariants[title];
  return variant ? `about-section ${variant}` : 'about-section';
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, sections } = splitAboutMarkdown(markdown);

  return (
    <article className="about-content">
      {intro ? (
        <div className="about-intro">
          <Body markdown={intro} />
        </div>
      ) : null}
      {sections.length > 0 ? (
        <nav className="about-section-nav" aria-label="About sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="about-section-nav-link"
            >
              {section.title}
            </a>
          ))}
        </nav>
      ) : null}
      {sections.map((section) => (
        <section
          key={section.id}
          className={getSectionClassName(section.title)}
        >
          <h2 id={section.id}>
            <a href={`#${section.id}`} className="about-section-heading-link">
              <span>{section.title}</span>
              <span className="about-section-heading-hash" aria-hidden="true">
                #
              </span>
            </a>
          </h2>
          <Body markdown={section.body} />
        </section>
      ))}
    </article>
  );
}
