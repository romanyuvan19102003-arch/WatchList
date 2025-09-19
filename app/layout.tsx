import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastProvider from '../components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieList - Your Personal Movie Watchlist',
  description: 'Discover, track, and manage your favorite movies with MovieList. Create your personal watchlist and never miss a great film.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <main className="flex-1 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}