"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/eligibilite", label: "Éligibilité" },
  { href: "/calcul", label: "Calcul" },
  { href: "/dossier", label: "Ma demande" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{ backgroundColor: "var(--primary-dark)" }}
      className="text-white shadow-lg"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">💧</span>
          <div>
            <div className="font-bold text-base leading-tight">
              Dégrèvement Eau
            </div>
            <div className="text-xs text-sky-300 leading-tight">
              Loi Warsmann
            </div>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-sky-600 text-white"
                  : "text-sky-100 hover:bg-sky-700 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <nav className="flex sm:hidden items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                pathname === link.href
                  ? "bg-sky-600 text-white"
                  : "text-sky-200 hover:bg-sky-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
