"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full relative z-40 bg-secondary/90 backdrop-blur-md supports-[backdrop-filter]:bg-secondary/80 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <Image
            src="/AMRUTAM LOGO.png"
            alt="Amrutam Logo"
            width={130}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
                  isActive
                    ? "bg-accent/90 text-white border-accent shadow-sm"
                    : "text-accent/80 hover:text-accent border-accent/20 hover:border-accent/40 hover:bg-accent/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="md:hidden" />
      </nav>
    </header>
  );
}
