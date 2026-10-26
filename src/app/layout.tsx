import type { Metadata } from 'next';
import { DM_Mono, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  // Makes canonical and hreflang URLs absolute, as search engines require.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Sanity Claude Demo', template: '%s | Sanity Claude Demo' },
  description: 'A tech blog about building with Next.js, Sanity and Claude Code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${dmMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
