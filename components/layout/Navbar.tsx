"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Estudios", href: "/estudios" },
  { label: "Noticias", href: "/noticias" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#009B8D]/10 bg-[#071221]/82 text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-10 2xl:px-14">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D] font-black text-white shadow-[0_16px_45px_rgba(0,155,141,0.28)] transition group-hover:-translate-y-0.5 group-hover:bg-[#00877a]">
            MP
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#071221] bg-[#20d6c7]" />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-black text-white">
              Métrica Pública
            </p>
            <p className="truncate text-xs font-semibold text-slate-400">
              Investigación · datos · estrategia
            </p>
          </div>
        </Link>

        <div className="hidden items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-[#009B8D] text-white shadow-[0_10px_30px_rgba(0,155,141,0.22)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contacto"
            className="rounded-full border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-3 text-sm font-black text-[#20d6c7] transition hover:-translate-y-0.5 hover:bg-[#009B8D] hover:text-white"
          >
            Hablemos
          </Link>

          <Link
            href="/admin/login"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-[#009B8D]/35 hover:bg-white/5 hover:text-white"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-black text-white transition hover:bg-white/10 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#071221]/96 px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-xl gap-3">
            {navItems.map((item, index) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between rounded-2xl border px-4 py-4 transition ${
                    active
                      ? "border-[#009B8D]/35 bg-[#009B8D]/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                        active
                          ? "bg-[#009B8D] text-white"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-black">{item.label}</span>
                  </span>

                  <span className="text-[#20d6c7] transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              );
            })}

            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-[#009B8D] px-5 py-4 text-center text-sm font-black text-white transition hover:bg-[#00877a]"
              >
                Hablemos
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-black text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Acceso admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}