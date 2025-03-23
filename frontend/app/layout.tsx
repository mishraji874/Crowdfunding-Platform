import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import type React from "react" // Added import for React
import { WalletProvider } from "@/context/WalletContext";
import { WagmiProviderWrapper } from '@/providers/wagmi-provider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'CryptoLaunch - Web3 Crowdfunding Platform',
  description: 'Support innovative projects on the Sepolia testnet using cryptocurrency',
  icons: {
    icon: [
      {
        url: 'https://img.icons8.com/fluency/48/ethereum.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        url: 'https://img.icons8.com/fluency/96/ethereum.png',
        sizes: '96x96',
        type: 'image/png',
      }
    ],
    shortcut: ['https://img.icons8.com/fluency/96/ethereum.png'],
    apple: ['https://img.icons8.com/fluency/96/ethereum.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <WalletProvider>
              {children}
            </WalletProvider>
          </ThemeProvider>
        </WagmiProviderWrapper>
      </body>
    </html>
  )
}

import './globals.css'