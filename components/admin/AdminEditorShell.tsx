"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, LogOut } from "lucide-react";

type AdminEditorShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  userEmail?: string | null;
  backHref: string;
  backLabel: string;
  onLogout: () => void | Promise<void>;
  actions?: ReactNode;
};

export default function AdminEditorShell({
  children,
  title,
  description,
  userEmail,
  backHref,
  backLabel,
  onLogout,
  actions,
}: AdminEditorShellProps) {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="sticky top-0 z-40 border-b border-[#009B8D]/10 bg-[#08111f]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={backHref}
              aria-label={backLabel}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={20} />
            </Link>

            <Link
              href="/admin/dashboard"
              className="hidden items-center gap-3 sm:flex"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#009B8D] text-sm font-black text-white shadow-lg shadow-[#009B8D]/20">
                MP
              </div>

              <div className="min-w-0">
                <p className="text-sm font-black leading-none text-white">
                  Métrica Pública
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Panel editorial
                </p>
              </div>
            </Link>

            <div className="min-w-0 sm:hidden">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Editor
              </p>

              <h1 className="truncate text-lg font-black text-white">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7] md:flex"
            >
              <ExternalLink size={16} />
              Ver sitio
            </Link>

            {actions}

            <button
              type="button"
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/20 md:flex"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <section className="w-full px-4 py-5 sm:px-6 2xl:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[calc(100vw-48px)]">
          <div className="mb-6 overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#08111f] via-[#0f2744] to-[#1a365d] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-[#009B8D]/30 bg-[#009B8D]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#20d6c7]">
                  Editor de contenido
                </div>

                <h1 className="max-w-4xl wrap-anywhere text-3xl font-black leading-tight sm:text-4xl">
                  {title}
                </h1>

                {description && (
                  <p className="mt-3 max-w-3xl wrap-anywhere text-sm leading-7 text-slate-300 sm:text-base">
                    {description}
                  </p>
                )}
              </div>

              <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:block">
                <p className="text-xs text-slate-300">Sesión activa</p>

                <p className="mt-1 max-w-[260px] truncate text-sm font-bold text-white">
                  {userEmail || "Administrador"}
                </p>
              </div>
            </div>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}