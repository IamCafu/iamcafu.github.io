import { faCircleDown } from '@fortawesome/free-regular-svg-icons/faCircleDown';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Metadata } from 'next';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import Presentations from '@/components/Resume/Presentations';
import Projects from '@/components/Resume/Projects';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import degrees from '@/data/resume/degrees';
import presentations from '@/data/resume/presentations';
import projects from '@/data/resume/projects';
import skillGroups from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description:
    'Sagi Amangeldi resume: 3D computer vision, SLAM, LiDAR perception, point-cloud processing, robotics, and AI and computer engineering.',
  path: '/resume/',
});

const CV_FILE_ID = '1bNSf1muTz0EDR9Bj3begTiwQYO5B59Gw';
const CV_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${CV_FILE_ID}`;
const CV_VIEW_URL = `https://drive.google.com/file/d/${CV_FILE_ID}/view?usp=sharing`;

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="resume-title">Resume</h1>
          <p className="resume-summary">
            For a short version, you can view or download my summarized CV using
            the buttons below. For a more detailed overview, continue scrolling
            through this page.
          </p>
          <div className="resume-actions" aria-label="CV actions">
            <a
              className="button"
              href={CV_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faCircleDown}
                className="resume-action-icon"
                aria-hidden="true"
              />
              Download CV
            </a>
            <a
              className="button button-secondary"
              href={CV_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faEye}
                className="resume-action-icon"
                aria-hidden="true"
              />
              View CV
            </a>
          </div>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          {projects.length > 0 ? (
            <section id="projects" className="resume-section">
              <Projects data={projects} />
            </section>
          ) : null}

          <section id="skills" className="resume-section">
            <Skills data={skillGroups} />
          </section>

          <section id="presentations" className="resume-section">
            <Presentations data={presentations} />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
