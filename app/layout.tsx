import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Caffè 54 | Digital Menu',
  description: 'Premium digital menu for Caffè 54',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[var(--color-warm-white)] text-[var(--color-text-main)] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
