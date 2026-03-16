import type {Metadata} from 'next';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Calabar FuelFinder',
  description: 'Live fuel prices and station locator for Calabar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <main className="max-w-4xl mx-auto px-4 pt-4 md:pt-8">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
