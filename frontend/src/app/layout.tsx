import type { Metadata } from 'next';
import { IBM_Plex_Mono, Doto } from 'next/font/google';
import './globals.css';

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
});

const doto = Doto({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-doto',
});

export const metadata: Metadata = {
  title: 'SusMeter AI — The Deterministic Judgment Layer',
  description:
    'Upload one photo — get your LinkedIn-to-Interpol ratio in under 12 seconds. Proprietary AuraNet™ inference. Full emotional damage.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexMono.variable} ${doto.variable}`}>
        <div className="dotGrid" style={{ minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
