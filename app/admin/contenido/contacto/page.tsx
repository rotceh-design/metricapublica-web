"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Save } from "lucide-react";

export default function AdminContenidoContactoPage() {
  return (
    <main>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/admin/contenido"
          className="inline-flex items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
        >
          <ArrowLeft size={16} />
          Volver a contenido
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] via-[#10243d] to-[#08111f] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-10">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
            <Mail size={30} />
          </div>

          <span className="mb-4 block text-sm font-black uppercase tracking-[0.22em] text-[#20d6c7]">
            Contenido editable
          </span>

          <h1 className="wrap-anywhere text-4xl font-black leading-tight md:text-6xl">
            Página Contacto
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Aquí editaremos los textos, datos visibles, correo público,
            información institucional y mensajes de apoyo de la página Contacto.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-[#009B8D]/15 bg-[#08111f]/80 p-5">
            <p className="text-sm leading-7 text-slate-400">
              La ruta ya queda activa. El siguiente paso será conectarla a
              Firestore con campos reales para editar el contenido público.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white opacity-60"
          >
            <Save size={18} />
            Guardar contenido
          </button>
        </div>
      </section>
    </main>
  );
}