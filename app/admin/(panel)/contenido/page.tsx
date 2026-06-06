"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  ChevronRight,
  Globe2,
  Home,
  LayoutGrid,
  Mail,
  Settings,
  Users,
} from "lucide-react";

import { auth } from "@/lib/firebase";

const contentModules = [
  {
    title: "Página Inicio",
    description:
      "Edita textos principales del home, llamados a la acción y bloques destacados.",
    href: "/admin/contenido/inicio",
    Icon: Home,
    status: "Activo",
  },
  {
    title: "Página Nosotros",
    description:
      "Edita el hero, enfoque, pilares y textos principales de la página Nosotros.",
    href: "/admin/contenido/nosotros",
    Icon: Users,
    status: "Activo",
  },
  {
    title: "Página Contacto",
    description:
      "Edita textos, datos de contacto, correo visible y mensajes informativos.",
    href: "/admin/contenido/contacto",
    Icon: Mail,
    status: "Activo",
  },
  {
    title: "Footer",
    description:
      "Edita textos finales, enlaces, datos institucionales y contenido del pie de página.",
    href: "/admin/contenido/footer",
    Icon: LayoutGrid,
    status: "Activo",
  },
  {
    title: "Ajustes globales",
    description:
      "Edita redes sociales, estado del sitio y mensaje de mantenimiento.",
    href: "/admin/contenido/global",
    Icon: Settings,
    status: "Activo",
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
      <main className="flex min-h-[360px] items-center justify-center text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">
            Cargando contenido editable...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="text-white">
      <section className="mb-6 rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              Contenido editable
            </p>

            <h1 className="text-3xl font-black md:text-4xl">
              Selecciona qué parte del sitio quieres editar
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Administra las páginas públicas, el footer y los ajustes globales
              desde un solo lugar.
            </p>

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              Sesión activa:{" "}
              <span className="font-semibold text-slate-300">
                {user?.email}
              </span>
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#20d6c7]">
            <Globe2 size={14} />
            {contentModules.length} módulos activos
          </span>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contentModules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group flex min-h-[150px] flex-col rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]">
                <module.Icon
                  size={28}
                  strokeWidth={1.8}
                  className="text-[#20d6c7] transition group-hover:text-white"
                />
              </div>

              <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black text-[#20d6c7]">
                {module.status}
              </span>
            </div>

            <h2 className="mb-3 wrap-anywhere text-2xl font-black">
              {module.title}
            </h2>

            <p className="wrap-anywhere text-sm leading-6 text-slate-400">
              {module.description}
            </p>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-4 py-3 text-sm font-black text-white transition group-hover:bg-[#00877a]">
                Editar contenido
                <ChevronRight size={16} strokeWidth={2.4} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}