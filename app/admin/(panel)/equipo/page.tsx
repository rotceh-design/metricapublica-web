"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { deleteIntegranteEquipo, getEquipo } from "@/lib/equipo";
import { EquipoIntegrante } from "@/types/equipo";

const imageAspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
} as const;

type TeamImageAspect = keyof typeof imageAspectClasses;
type TeamImageFit = "cover" | "contain";
type TeamImagePosition = "center" | "top" | "bottom" | "left" | "right";

export default function AdminEquipoPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [equipo, setEquipo] = useState<EquipoIntegrante[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadEquipo = async () => {
    const data = await getEquipo();
    setEquipo(data);

    if (!selectedId && data.length > 0) {
      setSelectedId(data[0].id);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadEquipo();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const sortedEquipo = useMemo(() => {
    return [...equipo].sort((a, b) => {
      const orderA = Number(a.order || 0);
      const orderB = Number(b.order || 0);

      return orderA - orderB;
    });
  }, [equipo]);

  const selectedIntegrante = useMemo(() => {
    return (
      sortedEquipo.find((integrante) => integrante.id === selectedId) ||
      sortedEquipo[0] ||
      null
    );
  }, [sortedEquipo, selectedId]);

  const totalActive = equipo.filter((integrante) =>
    Boolean(integrante.active)
  ).length;

  const totalInactive = equipo.filter(
    (integrante) => !Boolean(integrante.active)
  ).length;

  const totalFeatured = equipo.filter((integrante) =>
    Boolean(integrante.featured)
  ).length;

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "¿Seguro que quieres eliminar este integrante?"
    );

    if (!confirmDelete) return;

    await deleteIntegranteEquipo(id);

    const remaining = equipo.filter((integrante) => integrante.id !== id);
    setEquipo(remaining);
    setSelectedId(remaining[0]?.id || "");

    await loadEquipo();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">Cargando equipo...</p>
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

            <h1 className="mt-1 text-3xl font-black md:text-4xl">Equipo</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Administra integrantes, fotografías, biografías, estado público y
              orden de aparición con una vista visual tipo galería editorial.
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
              href="/admin/equipo/nuevo"
              className="rounded-2xl bg-[#009B8D] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#00877a]"
            >
              Agregar integrante
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1760px]">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Total integrantes" value={String(equipo.length)} />
            <StatCard label="Activos" value={String(totalActive)} />
            <StatCard label="Inactivos" value={String(totalInactive)} />
            <StatCard label="Destacados" value={String(totalFeatured)} />
          </div>

          {sortedEquipo.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <div className="border-b border-white/10 bg-[#08111f]/70 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#009B8D]">
                        Cortina editorial
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-white">
                        Integrantes del equipo
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                        Selecciona una tarjeta para revisar el perfil,
                        acciones, estado y configuración visual del integrante.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <SmallPill label={`${sortedEquipo.length} perfiles`} />
                      <SmallPill label={`${totalActive} activos`} />
                      <SmallPill label={`${totalFeatured} destacados`} />
                    </div>
                  </div>
                </div>

                <div className="relative p-5 sm:p-6">
                  <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-20 bg-linear-to-r from-[#0f2744] to-transparent md:block" />
                  <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-20 bg-linear-to-l from-[#0f2744] to-transparent md:block" />

                  <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
                    {sortedEquipo.map((integrante) => {
                      const isSelected = selectedIntegrante?.id === integrante.id;

                      return (
                        <TeamCurtainCard
                          key={integrante.id}
                          integrante={integrante}
                          selected={isSelected}
                          onSelect={() => setSelectedId(integrante.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>

              {selectedIntegrante && (
                <SelectedProfilePanel
                  integrante={selectedIntegrante}
                  onDelete={() => handleDelete(selectedIntegrante.id)}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function TeamCurtainCard({
  integrante,
  selected,
  onSelect,
}: {
  integrante: EquipoIntegrante;
  selected: boolean;
  onSelect: () => void;
}) {
  const imageAspect = normalizeAspect(integrante.imageAspect);
  const imageFit = normalizeFit(integrante.imageFit);
  const imagePosition = normalizePosition(integrante.imagePosition);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-[230px] shrink-0 overflow-hidden rounded-[1.7rem] border text-left shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 sm:w-[260px] ${
        selected
          ? "border-[#009B8D] bg-[#009B8D]/10 ring-2 ring-[#009B8D]/25"
          : "border-white/10 bg-[#08111f] hover:border-[#009B8D]/45"
      }`}
    >
      <div className={`relative bg-[#08111f] ${imageAspectClasses[imageAspect]}`}>
        {integrante.imageUrl ? (
          <img
            src={integrante.imageUrl}
            alt={integrante.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full transition duration-500 group-hover:scale-[1.06]"
            style={{
              objectFit: imageFit as CSSProperties["objectFit"],
              objectPosition: imagePosition as CSSProperties["objectPosition"],
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-[#009B8D]">
            MP
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f] via-[#08111f]/30 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              integrante.active
                ? "bg-[#009B8D]/90 text-white"
                : "bg-white/10 text-slate-200 backdrop-blur"
            }`}
          >
            {integrante.active ? "Activo" : "Inactivo"}
          </span>

          {integrante.featured && (
            <span className="rounded-full border border-[#009B8D]/25 bg-[#08111f]/85 px-3 py-1 text-xs font-black text-[#20d6c7] backdrop-blur">
              Destacado
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="wrap-anywhere text-xl font-black leading-tight text-white">
            {integrante.name || "Sin nombre"}
          </p>

          <p className="mt-1 line-clamp-2 wrap-anywhere text-sm font-bold text-[#20d6c7]">
            {integrante.role || "Sin cargo"}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#08111f] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
            Orden {integrante.order || 0}
          </span>

          <span className="text-xs font-semibold text-slate-500">
            {selected ? "Seleccionado" : "Ver detalle"}
          </span>
        </div>

        <p className="line-clamp-3 wrap-anywhere text-sm leading-6 text-slate-400">
          {integrante.bio || "Sin biografía registrada."}
        </p>
      </div>
    </button>
  );
}

function SelectedProfilePanel({
  integrante,
  onDelete,
}: {
  integrante: EquipoIntegrante;
  onDelete: () => void;
}) {
  const imageAspect = normalizeAspect(integrante.imageAspect);
  const imageFit = normalizeFit(integrante.imageFit);
  const imagePosition = normalizePosition(integrante.imagePosition);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
      <div className="grid gap-0 xl:grid-cols-[380px_1fr]">
        <div className="relative bg-[#08111f] p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,155,141,0.16),transparent_45%)]" />

          <div className="relative mx-auto max-w-[340px] overflow-hidden rounded-[1.8rem] border border-[#009B8D]/20 bg-[#08111f] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
            <div className={imageAspectClasses[imageAspect]}>
              {integrante.imageUrl ? (
                <img
                  src={integrante.imageUrl}
                  alt={integrante.name}
                  className="h-full w-full"
                  style={{
                    objectFit: imageFit as CSSProperties["objectFit"],
                    objectPosition:
                      imagePosition as CSSProperties["objectPosition"],
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-black text-[#009B8D]">
                  MP
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap gap-2">
                <SmallPill label={`Orden ${integrante.order || 0}`} />

                <StatusPill
                  active={Boolean(integrante.active)}
                  activeLabel="Activo"
                  inactiveLabel="Inactivo"
                />

                <StatusPill
                  active={Boolean(integrante.featured)}
                  activeLabel="Destacado"
                  inactiveLabel="Normal"
                />

                <SmallPill label={`${imageAspect} · ${imageFit}`} />
              </div>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#009B8D]">
                Perfil seleccionado
              </p>

              <h2 className="wrap-anywhere text-4xl font-black leading-tight text-white">
                {integrante.name || "Sin nombre"}
              </h2>

              <p className="mt-3 wrap-anywhere text-lg font-black text-[#20d6c7]">
                {integrante.role || "Sin cargo definido"}
              </p>

              <p className="mt-3 wrap-anywhere text-sm font-semibold text-slate-500">
                /equipo/{integrante.slug}
              </p>

              <p className="mt-6 max-w-4xl whitespace-pre-wrap wrap-anywhere text-base leading-8 text-slate-400">
                {integrante.bio || "Sin biografía registrada."}
              </p>

              <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-4 text-sm md:grid-cols-3">
                <SmallInfo
                  label="Correo"
                  value={integrante.email || "No definido"}
                />

                <SmallInfo
                  label="LinkedIn"
                  value={integrante.linkedin || "No definido"}
                />

                <SmallInfo
                  label="Visibilidad"
                  value={integrante.active ? "Visible" : "Oculto"}
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
              <Link
                href={`/admin/equipo/editar/${integrante.id}`}
                className="rounded-2xl border border-[#009B8D]/30 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#009B8D]/10"
              >
                Editar perfil
              </Link>

              {integrante.active && (
                <Link
                  href={`/equipo/${integrante.slug}`}
                  target="_blank"
                  className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  Ver público
                </Link>
              )}

              <button
                type="button"
                onClick={onDelete}
                className="rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeAspect(value?: string): TeamImageAspect {
  if (value === "square" || value === "portrait" || value === "wide") {
    return value;
  }

  return "square";
}

function normalizeFit(value?: string): TeamImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "cover";
}

function normalizePosition(value?: string): TeamImagePosition {
  if (
    value === "center" ||
    value === "top" ||
    value === "bottom" ||
    value === "left" ||
    value === "right"
  ) {
    return value;
  }

  return "center";
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

function SmallPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}

function StatusPill({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${
        active
          ? "border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7]"
          : "border-white/10 bg-white/5 text-slate-400"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
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
      <h2 className="mb-2 text-2xl font-black">No hay integrantes todavía</h2>

      <p className="mb-6 text-slate-400">
        Agrega el primer integrante para mostrarlo en la web pública.
      </p>

      <Link
        href="/admin/equipo/nuevo"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Agregar integrante
      </Link>
    </div>
  );
}