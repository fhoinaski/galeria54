import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Caffè 54 | Digital Menu',
  description: 'Premium digital menu for Caffè 54',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-[#FCFAF3] text-[var(--color-text-main)] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
