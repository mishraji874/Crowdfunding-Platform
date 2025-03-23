"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react" // Add useEffect
import { useAccount } from 'wagmi'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // Add mounted state
  const { address } = useAccount()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isOwner = address?.toLowerCase() === "0x0B970EB36C1EC85706fDB4f0F3AEB572dFC3582b".toLowerCase()

  // Base navigation links (always present)
  const baseNavLinks = [
    { href: "/", label: "Home" },
    { href: "/charts", label: "Explore" },
    { href: "/projects", label: "Projects" },
    { href: "/profile", label: "Profile" },
  ]

  // Only add Create Campaign if mounted and isOwner
  const navLinks = mounted && isOwner
    ? [...baseNavLinks.slice(0, 3), { href: "/create-campaign", label: "Create Campaign" }, baseNavLinks[3]]
    : baseNavLinks

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname?.startsWith(path)
  }

  // Don't render navigation items until mounted
  if (!mounted) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
        <div className="flex h-16 items-center px-4">
          {/* Only render the logo and theme toggle while mounting */}
          <div className="flex items-center justify-between w-full">
            <div className="w-1/4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold">CryptoLaunch</span>
              </Link>
            </div>
            <div className="flex items-center justify-end space-x-4 w-1/4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="w-1/4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">CryptoLaunch</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center w-2/4">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors text-sm font-medium relative py-1",
                    "hover:text-foreground",
                    isActive(link.href)
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center justify-end space-x-4 w-1/4">
            <ModeToggle />
            <button
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-accent text-foreground font-semibold"
                    : "text-foreground/60 hover:bg-accent/50 hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

