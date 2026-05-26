"use client";

import { useState } from "react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Quiénes Somos", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Estudios", href: "/estudios" },
  { label: "Noticias", href: "/noticias" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#009B8D]/10 bg-[#0a1628]/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D] font-bold text-white">
            MP
          </div>

          <div className="leading-tight">
            <p className="text-base font-bold text-white">Métrica Pública</p>
            <p className="text-xs text-slate-400">Investigación y datos</p>
          </div>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-slate-300 transition hover:text-[#009B8D]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/admin/login"
          className="hidden rounded-lg border border-[#009B8D]/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#009B8D]/10 lg:inline-flex"
        >
          Acceso admin
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          aria-label="Abrir menú"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#0a1628] px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-300 transition hover:text-[#009B8D]"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/admin/login"
              className="mt-2 rounded-lg border border-[#009B8D]/40 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Acceso admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
}