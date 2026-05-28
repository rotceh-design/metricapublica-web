"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  FileText,
  Home,
  Users,
  Mail,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

import { auth } from "@/lib/firebase";

const contentModules = [
  {
    title: "Página Nosotros",
    description:
      "Edita el hero, enfoque, pilares y textos principales de la página Nosotros.",
    href: "/admin/contenido/nosotros",
    Icon: Users,
    status: "Activo",
  },
  {
    title: "Página Inicio",
    description:
    "Edita textos principales del home, llamados a la acción y bloques destacados.",
    href: "/admin/contenido/inicio",
    Icon: Home,
    status: "Activo",
  },
  {
    title: "Página Contacto",
    description:
      "Edita textos, datos de contacto, correo visible y mensajes informativos.",
    href: "/admin/contenido/contacto",
    Icon: Mail,
    status: "Próximo",
  },
  {
    title: "Footer",
    description:
      "Edita textos finales, enlaces, datos institucionales y contenido del pie de página.",
    href: "/admin/contenido/footer",
    Icon: LayoutGrid,
    status: "Próximo",
  },
];

export default function AdminContenidoPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando contenido editable...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="relative overflow-hidden border-b border-[#009B8D]/10 bg-[#08111f] px-6 py-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#1a365d]/40 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>

            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Contenido editable
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Administra textos y bloques informativos de las páginas públicas
              sin tocar el código del proyecto.
            </p>

            <p className="mt-3 wrap-anywhere text-sm text-slate-500">
              Sesión iniciada como{" "}
              <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/5"
            >
              Volver al dashboard
            </a>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
            >
              Ver sitio
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15">
                  <FileText size={28} className="text-[#009B8D]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Editor de contenido del sitio
                  </h2>

                  <p className="mt-2 max-w-3xl text-slate-400">
                    Cada módulo permite editar textos específicos de una página.
                    Los cambios se guardan en Firebase y se muestran
                    automáticamente en la web pública.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {contentModules.map((module) => (
              <article
                key={module.href}
                className="group rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]/25">
                    <module.Icon
                      size={28}
                      strokeWidth={1.8}
                      className="text-[#009B8D]"
                    />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      module.status === "Activo"
                        ? "bg-[#009B8D]/15 text-[#009B8D]"
                        : "border border-white/10 text-slate-500"
                    }`}
                  >
                    {module.status}
                  </span>
                </div>

                <h3 className="mb-3 wrap-anywhere text-2xl font-bold">
                  {module.title}
                </h3>

                <p className="mb-6 min-h-24 wrap-anywhere text-sm leading-6 text-slate-400">
                  {module.description}
                </p>

                {module.status === "Activo" ? (
                  <a
                    href={module.href}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#009B8D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
                  >
                    Editar contenido
                    <ChevronRight size={16} strokeWidth={2.4} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-500"
                  >
                    Próximamente
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}