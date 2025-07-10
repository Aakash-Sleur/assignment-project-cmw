import type React from "react"
import type { Metadata } from "next"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import localFont from 'next/font/local'

const satoshi = localFont({
    src: [
        {
            path: '../public/fonts/Satoshi-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/Satoshi-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/Satoshi-Bold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/Satoshi-Black.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-satoshi',
    display: 'swap',
})

export const metadata: Metadata = {
  title: "Job Search Platform",
  description: "Find your dream job with our modern job search platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body className={`${satoshi.variable} ${satoshi.className}`}>
      <MantineProvider
          theme={{
              fontFamily: 'var(--font-satoshi), sans-serif',
              headings: { fontFamily: 'var(--font-satoshi), sans-serif' },
          }}
      >
          {children}
      </MantineProvider>

      </body>
    </html>
  );
}