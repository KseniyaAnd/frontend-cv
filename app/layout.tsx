import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Frontend',
  description: 'CV application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
