import type { Metadata } from 'next'
import './globals.css'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_CITY_NAME} Live Pothole Map`,
  description: 'A community-powered platform to report potholes and damaged roads.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://openstreetmap.org" />
        <link rel="preconnect" href="https://b.tile.openstreetmap.org" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
