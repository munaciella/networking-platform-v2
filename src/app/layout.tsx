import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { ClerkProvider } from '@clerk/nextjs';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`min-h-screen flex flex-col ${roboto.variable} ${robotoMono.variable}`}
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
    </ClerkProvider>
  );
}
