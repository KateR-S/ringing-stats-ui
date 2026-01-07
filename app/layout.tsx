import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ringing Stats UI',
  description: 'Frontend for bellboard tower scraper',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Ringing Stats</h1>
                  <div className="flex gap-4">
                    <Link href="/" className="hover:underline">
                      Upload
                    </Link>
                    <Link href="/towers" className="hover:underline">
                      Towers
                    </Link>
                    <Link href="/performances" className="hover:underline">
                      Performances
                    </Link>
                  </div>
                </nav>
              </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
