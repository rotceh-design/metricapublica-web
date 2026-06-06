"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

  const sortedSectores = useMemo(() => {
    return [...sectores].sort((a, b) => {
      const orderA = Number(a.order || 0);
      const orderB = Number(b.order || 0);

      return orderA - orderB;
    });
  }, [sectores]);

  const totalActive = sectores.filter((sector) => Boolean(sector.active)).length;

  const totalInactive = sectores.filter(
    (sector) => !Boolean(sector.active)
  ).length;

  const totalFeatured = sectores.filter((sector) =>
    Boolean(sector.featured)
  ).length;

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este sector?");

    if (!confirmDelete) return;

    await deleteSector(id);
    await loadSectores();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">Cargando sectores...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-[#009B8D]/10 bg-[#08111f] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>

            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Sectores
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Administra los sectores visibles de la web pública, su ícono,
              orden, estado, destacado y descripción institucional.
            </p>

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/dashboard"
              className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/5"
            >
              Volver al dashboard
            </Link>

            <Link
              href="/admin/sectores/nuevo"
              className="rounded-2xl bg-[#009B8D] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#00877a]"
            >
              Crear sector
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1760px]">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Total sectores" value={String(sectores.length)} />
            <StatCard label="Activos" value={String(totalActive)} />
            <StatCard label="Inactivos" value={String(totalInactive)} />
            <StatCard label="Destacados" value={String(totalFeatured)} />
          </div>

          {sortedSectores.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sortedSectores.map((sector) => {
                const isActive = Boolean(sector.active);
                const isFeatured = Boolean(sector.featured);

                return (
                  <article
                    key={sector.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:border-[#009B8D]/35 hover:shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-6"
                  >
                    <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[#009B8D]/10 blur-3xl transition group-hover:bg-[#009B8D]/15" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-[#1a365d]/60 blur-3xl" />

                    <div className="relative z-10">
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <Link
                          href={`/admin/sectores/editar/${sector.id}`}
                          className="flex h-18 w-18 items-center justify-center rounded-[1.5rem] border border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7] shadow-[0_20px_70px_rgba(0,155,141,0.12)] transition group-hover:scale-105 group-hover:bg-[#009B8D]/15"
                        >
                          <SectorIcon iconKey={sector.iconKey || "gobierno"} />
                        </Link>

                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
                            Orden {sector.order || 0}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${
                              isActive
                                ? "border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7]"
                                : "border-white/10 bg-white/5 text-slate-400"
                            }`}
                          >
                            {isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-5 flex flex-wrap gap-2">
                        {isFeatured && (
                          <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
                            Destacado
                          </span>
                        )}

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                          Sector
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-500">
                          {sector.iconKey || "gobierno"}
                        </span>
                      </div>

                      <h2 className="mb-3 wrap-anywhere text-2xl font-black leading-tight text-white">
                        {sector.title}
                      </h2>

                      <p className="mb-4 wrap-anywhere text-sm font-semibold text-slate-500">
                        /sectores/{sector.slug}
                      </p>

                      <p className="mb-6 min-h-24 wrap-anywhere leading-7 text-slate-400">
                        {sector.description || "Sin descripción registrada."}
                      </p>

                      <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-4 text-sm">
                        <SmallInfo
                          label="Identidad visual"
                          value={sector.iconKey || "gobierno"}
                        />

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <SmallInfo
                            label="Estado"
                            value={isActive ? "Activo" : "Inactivo"}
                          />

                          <SmallInfo
                            label="Tipo"
                            value={isFeatured ? "Destacado" : "Normal"}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/admin/sectores/editar/${sector.id}`}
                          className="flex-1 rounded-2xl border border-[#009B8D]/30 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#009B8D]/10"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(sector.id)}
                          className="flex-1 rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="line-clamp-2 wrap-anywhere font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <h2 className="mb-2 text-2xl font-black">No hay sectores todavía</h2>

      <p className="mb-6 text-slate-400">
        Crea el primer sector para mostrarlo en la página pública.
      </p>

      <Link
        href="/admin/sectores/nuevo"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Crear sector
      </Link>
    </div>
  );
}