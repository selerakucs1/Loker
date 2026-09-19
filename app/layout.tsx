import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Lowongan Kerja Lamongan Terbaru - Google Jobs Search & Auto Update',
  description: 'Portal pencarian lowongan kerja Lamongan terbaru dengan antarmuka Google Jobs dan pembaruan otomatis via web scraping & AI grounding.',
  openGraph: {
    title: 'Lowongan Kerja Lamongan Terbaru - Google Jobs Search & Auto Update',
    description: 'Portal pencarian lowongan kerja Lamongan terbaru dengan antarmuka Google Jobs dan pembaruan otomatis via web scraping & AI grounding.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lowongan Kerja Lamongan Terbaru',
    description: 'Portal pencarian lowongan kerja Lamongan terbaru dengan antarmuka Google Jobs dan pembaruan otomatis via web scraping & AI grounding.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
