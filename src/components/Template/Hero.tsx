import Link from 'next/link';

import { AUTHOR_NAME } from '@/lib/utils';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={709} height={945} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">{AUTHOR_NAME}</span>
        </h1>

        <p className="hero-tagline">
          3D Computer Vision Engineer at{' '}
          <a href="https://vitom-tech.com/en/" className="hero-highlight">
            VITOM Inc.
          </a>
          , working on SLAM, LiDAR-based perception, and multi-sensor fusion for
          robotics and industrial applications.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">3D Point Clouds</span>
          <span className="hero-chip">SLAM &amp; Sensor Fusion</span>
          <span className="hero-chip">Robotics Perception</span>
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Resume
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
