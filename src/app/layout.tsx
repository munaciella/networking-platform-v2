import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Footer from '@/components/Footer';

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
  title: 'NetworEd',
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
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body
          className={`min-h-screen flex flex-col ${roboto.variable} ${robotoMono.variable}`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} >
          <Toaster position='bottom-left'/>

          <header className="sticky top-0 z-50 border-b bg-white dark:bg-zinc-800">
        <Header />
          </header>

          <div className="bg-[#f4f2ed] dark:bg-black flex-1 w-full">
        <main className='max-w-6xl mx-auto'>{children}</main>
          </div>
          </ThemeProvider>
          <div className='bg-[#f4f2ed] dark:bg-black'>

          <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
