import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';

import { GET } from '../route';

describe('feed.xml route', () => {
  it('uses the canonical trailing-slash writing link and current author', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/writing/`);
    expect(xml).toContain(`${AUTHOR_NAME} - Writing`);
    expect(xml).not.toContain('<item>');
  });

  it('keeps the feed self link file-like', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/feed.xml`);
    expect(xml).not.toContain(`${SITE_URL}/feed.xml/`);
  });
});
