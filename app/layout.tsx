import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Aprovação Total - Plataforma de Estudos de Alta Performance',
  description: 'Sua preparação. Sua evolução. Sua aprovação. Plataforma SaaS de alta performance para concursos públicos, OAB e residência médica.',
  openGraph: {
    title: 'Aprovação Total - Plataforma de Estudos de Alta Performance',
    description: 'Sua preparação. Sua evolução. Sua aprovação. Plataforma SaaS de alta performance para concursos públicos, OAB e residência médica.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aprovação Total - Plataforma de Estudos de Alta Performance',
    description: 'Sua preparação. Sua evolução. Sua aprovação. Plataforma SaaS de alta performance para concursos públicos, OAB e residência médica.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased text-[#0F172A] bg-[#F8FAFC]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
