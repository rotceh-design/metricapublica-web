"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const modules = [
  {
    title: "Noticias",
    description: "Crear, editar, publicar o eliminar noticias.",
    href: "/admin/noticias",
  },
  {
    title: "Estudios",
    description: "Administrar estudios, publicaciones, imágenes y PDF.",
    href: "/admin/estudios",
  },
  {
    title: "Servicios",
    description: "Modificar servicios visibles en la página pública.",
    href: "/admin/servicios",
  },
  {
    title: "Equipo",
    description: "Administrar integrantes, cargos, fotografías y biografías.",
    href: "/admin/equipo",
  },
];

export default function AdminDashboardPage() {
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Verificando acceso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-[#009B8D]/10 bg-[#0f2744] px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>
            <h1 className="text-3xl font-bold">Métrica Pública</h1>
            <p className="mt-1 text-sm text-slate-400">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-[#009B8D]/30 px-5 py-3 font-semibold text-white transition hover:bg-[#009B8D]/10"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Módulos de administración</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <a
                key={module.href}
                href={module.href}
                className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-6 transition hover:-translate-y-1 hover:border-[#009B8D]/40"
              >
                <h3 className="mb-3 text-xl font-bold">{module.title}</h3>
                <p className="text-sm leading-6 text-slate-400">
                  {module.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}