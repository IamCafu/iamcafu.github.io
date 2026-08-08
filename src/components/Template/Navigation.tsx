'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';

import Hamburger from './Hamburger';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <span className="logo-text">SA</span>
      </Link>

      <nav className="nav-links">
        {routes
          .filter((l) => !l.index)
          .map((l) => (
            <Link
              key={l.label}
              href={l.path}
              className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
              aria-current={isActive(l.path) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
      </nav>

      {/* The theme toggle is deliberately not rendered: light mode is unfinished,
          so the site stays on the `data-theme="dark"` set in app/layout.tsx.
          `ThemeToggle` and its tests are intact — restore the import and drop
          `<ThemeToggle />` back in above `<Hamburger />` to re-enable it. */}
      <div className="nav-actions">
        <Hamburger />
      </div>
    </header>
  );
}
