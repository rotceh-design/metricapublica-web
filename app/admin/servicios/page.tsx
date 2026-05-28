"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { deleteServicio, getServicios } from "@/lib/servicios";
import { Servicio } from "@/types/servicio";

export default function AdminServiciosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServicios = async () => {
    const data = await getServicios();
    setServicios(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadServicios();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este servicio?");

    if (!confirmDelete) return;

    await deleteServicio(id);
    await loadServicios();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando servicios...</p>
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

            <h1 className="text-3xl font-bold">Servicios</h1>

            <p className="mt-1 wrap-anywhere text-sm text-slate-400">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/5"
            >
              Volver
            </a>

            <a
              href="/admin/servicios/nuevo"
              className="rounded-xl bg-[#009B8D] px-5 py-3 text-center font-bold text-white transition hover:bg-[#00877a]"
            >
              Crear servicio
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {servicios.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                No hay servicios todavía
              </h2>

              <p className="mb-6 text-slate-400">
                Crea el primer servicio para mostrarlo en la web pública.
              </p>

              <a
                href="/admin/servicios/nuevo"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Crear servicio
              </a>
            </div>
          ) : (
            <div className="grid gap-5">
              {servicios.map((servicio) => (
                <article
                  key={servicio.id}
                  className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-[#0f2744]"
                >
                  <div className="grid gap-0 md:grid-cols-[170px_1fr]">
                    <div className="flex items-center justify-center bg-[#08111f] p-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-[#009B8D]/20 bg-[#009B8D]/10 text-5xl">
                        {servicio.icon || "◈"}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                              Orden {servicio.order || 0}
                            </span>

                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                              {servicio.active ? "Activo" : "Inactivo"}
                            </span>

                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                              {servicio.featured ? "Destacado" : "Normal"}
                            </span>
                          </div>

                          <h2 className="mb-2 wrap-anywhere text-2xl font-bold">
                            {servicio.title}
                          </h2>

                          <p className="mb-3 wrap-anywhere text-sm text-slate-500">
                            /servicios/{servicio.slug}
                          </p>

                          <p className="mb-4 max-w-3xl wrap-anywhere leading-7 text-slate-400">
                            {servicio.shortDescription}
                          </p>

                          {servicio.benefits?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {servicio.benefits.slice(0, 4).map((benefit) => (
                                <span
                                  key={benefit}
                                  className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs text-[#009B8D]"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                          <a
                            href={`/admin/servicios/editar/${servicio.id}`}
                            className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-[#009B8D]/10"
                          >
                            Editar
                          </a>

                          <button
                            onClick={() => handleDelete(servicio.id)}
                            className="rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}