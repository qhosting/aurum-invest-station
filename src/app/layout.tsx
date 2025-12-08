import type { Metadata } from "next"
import { Inter, Fira_Code } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ChatwootWidget } from "@/components/ChatwootWidget"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  title: "AURUM INVEST STATION - Professional Trading Dashboard",
  description: "Multi-tenant trading dashboard with AI coaching integration, performance analytics, and automated trade logging.",
  keywords: ["trading", "forex", "dashboard", "analytics", "investment"],
  authors: [{ name: "MiniMax Agent" }],
  creator: "MiniMax Agent",
  publisher: "AURUM INVEST STATION",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#D4AF37",
  colorScheme: "dark",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://auruminvest.mx",
    title: "AURUM INVEST STATION",
    description: "Professional Trading Dashboard with AI Coaching",
    siteName: "AURUM INVEST STATION",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AURUM INVEST STATION",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUM INVEST STATION",
    description: "Professional Trading Dashboard with AI Coaching",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-[#0A192F] text-white antialiased">
        <AuthProvider>
          {children}
          <ChatwootWidget />
        </AuthProvider>
      </body>
    </html>
  )
}