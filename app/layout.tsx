import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';

import { SiteSchema } from '@/components/Schema';
import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import ScrollToTop from '@/components/Template/ScrollToTop';
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/utils';
import './tailwind.css';

const robotoMono = Roboto_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: AUTHOR_NAME,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    '3D computer vision',
    'SLAM',
    'LiDAR',
    'point cloud processing',
    'robotics',
    'sensor fusion',
    'AI and computer engineering',
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/`,
    siteName: AUTHOR_NAME,
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_IMAGE_PATH,
        width: SITE_IMAGE_DIMENSIONS.width,
        height: SITE_IMAGE_DIMENSIONS.height,
        alt: AUTHOR_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    ...(TWITTER_HANDLE
      ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE }
      : {}),
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={robotoMono.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <SiteSchema />
      </head>
      <body>
        <ScrollToTop />
        <div className="site-wrapper">
          <Navigation />
          {children}
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
