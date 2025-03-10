import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Markdown Editor | Create and preview markdown in real-time",
  description:
    "A beautiful, responsive markdown editor with real-time preview, syntax highlighting, and dark mode support.",
  keywords: ["markdown", "editor", "preview", "real-time", "syntax highlighting", "dark mode"],
  authors: [{ name: "Markdown Editor" }],
  openGraph: {
    title: "Markdown Editor | Create and preview markdown in real-time",
    description:
      "A beautiful, responsive markdown editor with real-time preview, syntax highlighting, and dark mode support.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'