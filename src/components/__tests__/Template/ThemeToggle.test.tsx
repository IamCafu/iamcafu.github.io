import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import ThemeToggle from '../../Template/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  it('renders theme toggle button', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('theme-toggle');
    });
  });

  it('starts in dark mode', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode',
      );
    });
  });

  it('does not apply localStorage preference on load', async () => {
    window.localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode',
      );
    });
  });

  it('toggles theme on click', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode',
      );
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to dark mode',
      );
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('updates document data-theme attribute', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });
});
