import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Cormorant_Garamond } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ParticlesBackground } from '@/components/common/ParticlesBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EN2H Booking Platform',
  description: 'Simple bookings. Better service. Explore available services, choose a convenient date and time, and submit your booking in a few simple steps.',
  keywords: ['booking', 'services', 'appointment', 'scheduling'],
  openGraph: {
    title: 'EN2H Booking Platform',
    description: 'Simple bookings. Better service.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable} ${cormorantGaramond.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('en2h-theme');
                const theme = stored || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })()
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ParticlesBackground />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            aria-label="Notifications"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
