"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // Minimum scroll distance before hiding
      
      // Always show navbar when at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down past threshold
      else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        setIsVisible(false);
      }
      // Show navbar when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  return (
    <header className={`w-full fixed top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-secondary/70 bg-secondary/80 border-b border-accent/10 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-1">
        <Link href="/" className="flex items-center gap-2">
          <img src="/AMRUTAM%20LOGO.png" alt="AMRUTAM AI" className="h-8 md:h-10 w-auto" />
          <span className="sr-only">AMRUTAM AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1 text-xs text-accent/90 hover:text-accent border border-accent/20 hover:border-accent/40 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden" />
      </nav>
    </header>
  );
}
