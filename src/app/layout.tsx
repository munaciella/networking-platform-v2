import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Networking Platform',
  description: 'An alternative professional networking platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col"
      >
        {/* Toaster */}

        <header className="sticky top-0 z-50 border-b bg-white">
          <Header />
        </header>

        <div className="bg-[#f4f2ed] flex-1 w-full">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
