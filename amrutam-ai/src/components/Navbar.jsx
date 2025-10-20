import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-secondary/70 bg-secondary/80 border-b border-accent/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src="/AMRUTAM LOGO.png"
            alt="Amrutam Logo"
            width={140}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-accent/90 hover:text-accent border border-accent/20 hover:border-accent/40 transition-colors"
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
