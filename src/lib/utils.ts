/**
 * Shared utility functions and constants
 */

// Site configuration
export const SITE_URL = 'https://iamcafu.github.io';
export const AUTHOR_NAME = 'Sagi Amangeldi';
export const TWITTER_HANDLE: string | undefined = undefined;
export const CONTACT_EMAIL = 'cap.cafu@gmail.com';
export const CONTACT_EMAIL_LOCAL_PART = CONTACT_EMAIL.split('@')[0];
export const CONTACT_EMAIL_DOMAIN = `@${CONTACT_EMAIL.split('@')[1]}`;
export const SITE_IMAGE_PATH = '/images/me.jpg';
export const SITE_IMAGE_DIMENSIONS = {
  width: 709,
  height: 945,
} as const;

// Canonical one-line bio, shared across page metadata, OpenGraph, and JSON-LD.
export const SITE_DESCRIPTION =
  '3D Computer Vision Engineer in Tokyo working on SLAM, LiDAR-based perception, point-cloud processing, and robotics, with an M.S. in AI and Computer Engineering from the University of Ulsan.';

// Image dimension constants
export const AVATAR_SIZE = {
  hero: 120,
  footer: 80,
  sidebar: 200,
} as const;

export const PROJECT_IMAGE = {
  width: 600,
  height: 400,
} as const;

/**
 * Formats a date string to a human-readable format.
 * Parses as UTC to avoid timezone shifts.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Parse as UTC to avoid timezone shifts
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
