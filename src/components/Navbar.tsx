'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { MouseEvent as ReactMouseEvent } from 'react'

interface NavLink {
  label: string
  href: string
}
interface NavbarProps {
  links: NavLink[]
}

export default function Navbar({ links }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartCount] = useState(0)
  const searchBarRef = useRef<HTMLDivElement | null>(null)

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | ReactMouseEvent) => {
      const target = event.target as Node | null
      if (searchBarRef.current && target && !searchBarRef.current.contains(target)) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="absolute left-0 right-0 top-[42px] z-40 bg-transparent">
      <div className="mx-auto w-full max-w-[1440px] px-[100px]">
        <div className="flex h-[65px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center">
            <img
              src="/logo.png"
              alt="VitaliTea Logo"
              className="block h-[65px] w-[139px] object-contain"
            />
          </Link>

          {/* Desktop nav links — 0.83deg rotation, 40px gap */}
          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap font-['Host_Grotesk'] text-[16px] font-normal leading-[1.33] text-black transition-colors hover:text-[#627E5C]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: search pill + account + divider + cart */}
          <div className="hidden items-center gap-[10px] md:flex">
            {/* Search pill: icon LEFT → 1px divider → input */}
            <div className="flex h-[39px] w-[264px] items-center gap-[10px] rounded-[100px] bg-white px-[14px] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.12)]">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent font-['Host_Grotesk'] text-[14px] text-black outline-none placeholder:text-[#9ca3af]"
              />
              <Image src="/searchicon.png" alt="" width={20} height={20} className="shrink-0" />
            </div>

            {/* Account icon */}
            <button aria-label="Account" className="rounded-full p-0 transition-colors">
              <Image src="/usericon.png" alt="Account" width={22} height={22} />
            </button>

            {/* 1px vertical divider between account and cart */}
            <div className="h-[15px] w-px shrink-0 bg-black" />

            {/* Cart icon */}
            <button aria-label="Cart" className="relative rounded-full p-0 transition-colors">
              <Image src="/cart.png" alt="Cart" width={23} height={23} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#627E5C] text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: search toggle + cart + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              aria-label="Cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Image src="/cart.png" alt="Cart" width={23} height={23} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile expandable search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3 px-2" ref={searchBarRef}>
            <div
              className="flex w-full items-center bg-white"
              style={{
                height: '39px',
                borderRadius: '100px',
                paddingLeft: '14px',
                paddingRight: '14px',
                boxShadow: '2px 2px 10px 0px rgba(0,0,0,0.12)',
                gap: '10px',
              }}
            >
              <Image
                src="/searchicon.png"
                alt=""
                width={18}
                height={18}
                style={{ flexShrink: 0 }}
              />
              <div style={{ width: '1px', height: '15px', background: '#000', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-[14px] text-[#1a1a1a] placeholder-[#9ca3af]"
                style={{ fontFamily: 'Inter, sans-serif' }}
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Mobile nav menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-2 text-[16px] font-normal text-[#1a1a1a] transition-colors hover:text-[#627E5C]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
