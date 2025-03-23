'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { ConnectWallet } from "@/components/connect-wallet"

const ClientButton = dynamic(() => import('@/components/client-button'), {
  ssr: false,
})

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Revolutionize Your Crowdfunding with Blockchain
            </h1>
            <p className="text-lg sm:text-xl opacity-90">
              Launch your campaign for with instant transactions,
              complete transparency, and zero intermediaries.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 items-center justify-center md:justify-start">
              <ConnectWallet buttonClassName="bg-emerald-500 hover:bg-emerald-600 text-white" />
              <Link href="/projects">
                <ClientButton variant="secondary" className="w-full sm:w-auto bg-white hover:bg-white text-black transition-all duration-300 transform hover:scale-105">
                  Explore Campaigns
                </ClientButton>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 w-full">
            <div className="relative aspect-[16/9] w-full max-w-[500px] mx-auto">
              <Image
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
                alt="Crowdfunding Hero Image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-secondary py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold">100%</h3>
            <p className="text-muted-foreground">Secure Transactions</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold">0%</h3>
            <p className="text-muted-foreground">Platform Fees</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">Campaign Access</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
              <p className="text-muted-foreground">Link your MetaMask wallet to get started with Web3 crowdfunding</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Create Campaign</h3>
              <p className="text-muted-foreground">Set up your campaign with details, goals, and timeline</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Share & Promote</h3>
              <p className="text-muted-foreground">Share your campaign with your network and potential supporters</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-3">Receive Funds</h3>
              <p className="text-muted-foreground">Get funds directly to your wallet when campaign succeeds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose CryptoLaunch?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Blockchain Powered</h3>
              <p className="text-muted-foreground">Leverage the security and transparency of Ethereum network for your campaigns.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Smart Contracts</h3>
              <p className="text-muted-foreground">Automated fund distribution and complete transparency in transactions.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
              <p className="text-muted-foreground">Connect with supporters worldwide without currency barriers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects CTA Section */}
      <div className="w-full py-12 sm:py-16 bg-secondary/50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Explore Amazing Projects</h2>
          <p className="mb-6 sm:mb-8 text-muted-foreground">Discover innovative campaigns and support creative minds worldwide</p>
          <Link href="/projects">
            <ClientButton
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </ClientButton>
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image
                    src="https://img.freepik.com/free-photo/3d-illustration-cute-cartoon-character-with-glasses_1142-41044.jpg"
                    alt="Alex Thompson Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Alex Thompson</h4>
                  <p className="text-sm text-muted-foreground">Tech Entrepreneur</p>
                </div>
              </div>
              <p className="text-muted-foreground">"CryptoLaunch made it incredibly easy to fund my startup. The transparency of blockchain technology gave my investors confidence."</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image
                    src="https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-bow_1142-40307.jpg"
                    alt="Sarah Chen Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-muted-foreground">Artist & Creator</p>
                </div>
              </div>
              <p className="text-muted-foreground">"As an artist, I found the perfect platform to fund my exhibition. The community here truly supports creative projects."</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image
                    src="https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-hat_1142-40327.jpg"
                    alt="Michael Rivera Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rivera</h4>
                  <p className="text-sm text-muted-foreground">Social Entrepreneur</p>
                </div>
              </div>
              <p className="text-muted-foreground">"The smart contract functionality ensures complete transparency. My supporters could track every penny of their contribution."</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How do I start a campaign?</h3>
              <p className="text-muted-foreground">Connect your MetaMask wallet, click on "Create Campaign", and follow the simple setup process.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What cryptocurrencies are supported?</h3>
              <p className="text-muted-foreground">Currently, we support ETH on the Sepolia testnet. More options coming soon!</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Is my contribution secure?</h3>
              <p className="text-muted-foreground">Yes, all transactions are secured by Ethereum smart contracts and are fully transparent.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Launch Your Campaign?</h2>
          <p className="mb-4">Contact us to start your crowdfunding journey today.</p>
          <p className="mb-6 text-lg font-semibold">📧 {" "}
            <a
              href="mailto:anindyakanti04@gmail.com"
              className="text-blue-300 hover:text-blue-100 underline"
            >
              anindyakanti04@gmail.com
            </a>
          </p>
          <div className="mt-8 p-4 bg-red-500/10 border border-red-300 rounded-lg">
            <p className="text-sm text-white">
              <span className="font-bold">⚠️ Important Notice:</span><br />
              Any attempt to submit false or fraudulent campaign requests will result in immediate blacklisting of the wallet address and legal action may be taken. We maintain a strict verification process to protect our community.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

