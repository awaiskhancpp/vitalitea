'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

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
  const searchBarRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const { itemCount, openCartDrawer, lastAddedName } = useCart()

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

  const handleLinkClick = () => setMenuOpen(false)

  const isShop = pathname === '/shop' || pathname?.startsWith('/shop/')
  const isCreamPage = isShop || pathname === '/bag' || pathname === '/checkout'
  // Home/landing: transparent so the hero (`-mt-[105px]` in HeroSection) shows under the bar again.
  // Shop, bag, checkout: same cream as those pages.
  const navBarBg = isCreamPage ? 'bg-[#F5F1E8]' : 'bg-transparent'
  const mobileMenuBg = isCreamPage ? 'bg-[#F5F1E8]' : 'bg-white/95'

  return (
    <nav className={`sticky top-0 z-50 w-full ${navBarBg}`}>
      <div className="flex w-full items-center justify-between px-6 pt-[42px] sm:px-10 lg:px-[6.94%]">
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="VitaliTea Logo"
            width={139}
            height={65}
            className="h-16 w-36 object-contain"
          />
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap font-['Host_Grotesk'] text-base font-normal leading-5 transition-colors hover:text-[#627E5C]
      ${
        pathname === link.href
          ? 'rounded-[13.62px] px-[18px] bg-[#627E5C] py-1.5 text-white font-normal leading-[100%]'
          : 'text-black'
      }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2.5 md:flex">
          <div
            className="flex h-10 w-64 items-center gap-2.5 rounded-full bg-white px-3.5"
            style={{ boxShadow: '2px 2px 10px 0px rgba(0,0,0,0.12)' }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent font-['Host_Grotesk'] text-sm text-black outline-none placeholder:text-gray-400"
            />
            <Image src="/searchicon.png" alt="" width={20} height={20} className="shrink-0" />
          </div>

          <button aria-label="Account" className="rounded-full transition-colors">
            <Image src="/usericon.png" alt="Account" width={22} height={22} />
          </button>

          <div className="h-4 w-px shrink-0 bg-black" />

          <button
            type="button"
            onClick={openCartDrawer}
            aria-label="Open shopping bag"
            className={`relative inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0 transition-[transform,opacity] duration-300 hover:opacity-80 ${
              lastAddedName ? 'scale-110' : ''
            }`}
          >
            <Image src="/cart.png" alt="" width={23} height={23} />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-[#627E5C] px-1 text-[11px] font-medium text-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
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
            type="button"
            onClick={openCartDrawer}
            aria-label="Open shopping bag"
            className={`relative flex rounded-full p-2 transition-transform duration-300 hover:bg-gray-100 ${
              lastAddedName ? 'scale-110' : ''
            }`}
          >
            <Image src="/cart.png" alt="" width={23} height={23} />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute right-0 top-1 flex h-[16px] min-w-[16px] animate-pop items-center justify-center rounded-full bg-[#627E5C] px-0.5 text-[10px] font-medium text-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
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
      {searchOpen && (
        <div className="w-full px-6 pb-3 md:hidden" ref={searchBarRef}>
          <div className="flex h-10 w-full items-center gap-2.5 rounded-full bg-white px-3.5 shadow-md">
            <Image src="/searchicon.png" alt="" width={18} height={18} className="shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent font-['Inter'] text-sm text-neutral-900 outline-none placeholder:text-gray-400"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
      {menuOpen && (
        <div
          className={`flex w-full flex-col gap-4 border-t border-gray-100 px-6 py-4 md:hidden ${mobileMenuBg}`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="font-['Inter'] text-base font-normal text-neutral-900 transition-colors hover:text-[#627E5C]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
