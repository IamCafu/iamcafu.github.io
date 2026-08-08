'use client';

import { useEffect, useRef, useState } from 'react';

import projects from '@/data/resume/projects';

const allSections = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Projects', id: 'projects' },
  { name: 'Skills', id: 'skills' },
  { name: 'Research', id: 'presentations' },
] as const;

type SectionId = (typeof allSections)[number]['id'];

/** The Projects section only renders when it has data behind it; without this
 *  the nav would offer a link to an anchor that is not on the page. */
const sections = allSections.filter(
  (section) => section.id !== 'projects' || projects.length > 0,
);

/** Offset from top of viewport for intersection detection (header height + nav) */
const INTERSECTION_MARGIN = '-20% 0px -75% 0px';

export default function ResumeNav() {
  const [activeSection, setActiveSection] = useState<SectionId>('experience');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if IntersectionObserver is available (not in test environment)
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create IntersectionObserver for efficient scroll tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible (highest intersection ratio)
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        let targetEntry: IntersectionObserverEntry | null = null;

        if (visibleEntries.length > 0) {
          // When there are visible entries, pick the one with the highest intersection ratio
          targetEntry = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev,
          );
        } else if (entries.length > 0) {
          // When no entries are intersecting, fall back to the entry closest to the viewport
          targetEntry = entries.reduce((prev, current) => {
            const prevDistance = Math.abs(prev.boundingClientRect.top);
            const currentDistance = Math.abs(current.boundingClientRect.top);
            return currentDistance < prevDistance ? current : prev;
          });
        }

        if (targetEntry) {
          const sectionId = sections.find(
            (s) => s.id === targetEntry.target.id,
          );
          if (sectionId) {
            setActiveSection(sectionId.id);
          }
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <nav className="resume-nav" aria-label="Resume sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`resume-nav-link ${activeSection === section.id ? 'active' : ''}`}
          aria-current={activeSection === section.id ? 'location' : undefined}
        >
          {section.name}
        </a>
      ))}
    </nav>
  );
}
