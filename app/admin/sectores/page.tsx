"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import SectorIcon from "@/components/icons/SectorIcons";
import { auth } from "@/lib/firebase";
import { deleteSector, getSectores } from "@/lib/sectores";
import { Sector } from "@/types/sector";

export default function AdminSectoresPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSectores = async () => {
    const data = await getSectores();
    setSectores(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadSectores();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este sector?");

    if (!confirmDelete) return;

    await deleteSector(id);
    await loadSectores();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando sectores...</p>
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

            <h1 className="text-3xl font-bold">Sectores</h1>

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
              href="/admin/sectores/nuevo"
              className="rounded-xl bg-[#009B8D] px-5 py-3 text-center font-bold text-white transition hover:bg-[#00877a]"
            >
              Crear sector
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {sectores.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                No hay sectores todavía
              </h2>

              <p className="mb-6 text-slate-400">
                Crea el primer sector para mostrarlo en la página pública.
              </p>

              <a
                href="/admin/sectores/nuevo"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Crear sector
              </a>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sectores.map((sector) => (
                <article
                  key={sector.id}
                  className="group rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#009B8D] transition group-hover:bg-[#009B8D]/25">
                      <SectorIcon iconKey={sector.iconKey || "gobierno"} />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                        Orden {sector.order || 0}
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                        {sector.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {sector.featured && (
                      <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                        Destacado
                      </span>
                    )}

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                      Sector
                    </span>
                  </div>

                  <h2 className="mb-3 wrap-anywhere text-2xl font-bold">
                    {sector.title}
                  </h2>

                  <p className="mb-3 wrap-anywhere text-sm text-slate-500">
                    /sectores/{sector.slug}
                  </p>

                  <p className="mb-6 min-h-24 wrap-anywhere leading-7 text-slate-400">
                    {sector.description}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`/admin/sectores/editar/${sector.id}`}
                      className="flex-1 rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-[#009B8D]/10"
                    >
                      Editar
                    </a>

                    <button
                      onClick={() => handleDelete(sector.id)}
                      className="flex-1 rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
                    >
                      Eliminar
                    </button>
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