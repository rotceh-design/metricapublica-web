"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart2,
  Compass,
  ExternalLink,
  Handshake,
  Mail,
  Map,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveEquipo } from "@/lib/equipo";
import {
  defaultNosotrosContenido,
  getNosotrosContenido,
} from "@/lib/contenido";
import { EquipoIntegrante } from "@/types/equipo";
import { NosotrosContenido } from "@/types/contenido";

const imageAspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
} as const;

type TeamImageAspect = keyof typeof imageAspectClasses;
type TeamImageFit = "cover" | "contain";
type TeamImagePosition = "center" | "top" | "bottom" | "left" | "right";

export default function NosotrosPage() {
  const [equipo, setEquipo] = useState<EquipoIntegrante[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [contenido, setContenido] = useState<NosotrosContenido>(
    defaultNosotrosContenido
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [equipoData, contenidoData] = await Promise.all([
          getActiveEquipo(),
          getNosotrosContenido(),
        ]);

        setEquipo(equipoData);
        setContenido(contenidoData);

        if (equipoData.length > 0) {
          const featured = equipoData.find((integrante) =>
            Boolean(integrante.featured)
          );

          setSelectedId(featured?.id || equipoData[0].id);
        }
      } catch (error) {
        console.error("Error cargando página Nosotros:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

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

  const pillars = useMemo(
    () => [
      {
        Icon: BarChart2,
        title: contenido.pillarOneTitle,
        description: contenido.pillarOneDescription,
      },
      {
        Icon: Compass,
        title: contenido.pillarTwoTitle,
        description: contenido.pillarTwoDescription,
      },
      {
        Icon: Map,
        title: contenido.pillarThreeTitle,
        description: contenido.pillarThreeDescription,
      },
      {
        Icon: Handshake,
        title: contenido.pillarFourTitle,
        description: contenido.pillarFourDescription,
      },
    ],
    [contenido]
  );

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#1a365d]/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-black uppercase tracking-[0.22em] text-[#009B8D]">
            {contenido.heroLabel}
          </span>

          <h1 className="mb-6 max-w-5xl wrap-anywhere text-5xl font-black leading-tight md:text-7xl">
            {contenido.heroTitle}
          </h1>

          <p className="max-w-3xl wrap-anywhere text-lg leading-8 text-slate-300">
            {contenido.heroDescription}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HeroStat label="Enfoque" value="Evidencia" />
            <HeroStat label="Trabajo" value="Territorio" />
            <HeroStat label="Decisiones" value="Datos" />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#009B8D]/10 blur-3xl" />

            <div className="relative z-10">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                {contenido.focusLabel}
              </p>

              <h2 className="mb-5 wrap-anywhere text-3xl font-black leading-tight md:text-4xl">
                {contenido.focusTitle}
              </h2>

              <div className="space-y-5 text-slate-300">
                <p className="wrap-anywhere leading-8">
                  {contenido.focusParagraphOne}
                </p>

                <p className="wrap-anywhere leading-8">
                  {contenido.focusParagraphTwo}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map(({ Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-[0_28px_90px_rgba(0,0,0,0.26)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]/25">
                  <Icon
                    size={26}
                    strokeWidth={1.8}
                    className="text-[#20d6c7]"
                  />
                </div>

                <h3 className="mb-3 wrap-anywhere text-2xl font-black">
                  {title}
                </h3>

                <p className="wrap-anywhere leading-7 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0f2744] px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(26,54,93,0.75),transparent_40%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                {contenido.teamLabel}
              </span>

              <h2 className="max-w-4xl wrap-anywhere text-4xl font-black leading-tight md:text-6xl">
                {contenido.teamTitle}
              </h2>
            </div>

            <p className="max-w-xl wrap-anywhere leading-7 text-slate-400">
              {contenido.teamDescription}
            </p>
          </div>

          {loading ? (
            <TeamLoading />
          ) : sortedEquipo.length === 0 ? (
            <EmptyTeam />
          ) : (
            <div className="space-y-8">
              {selectedIntegrante && (
                <FeaturedTeamProfile integrante={selectedIntegrante} />
              )}

              <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f]/70 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#009B8D]">
                        
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-white">
                        Explora los perfiles
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500">
                      
                    </p>
                  </div>
                </div>

                <div className="relative p-5 sm:p-6">
                  <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-16 bg-linear-to-r from-[#08111f] to-transparent md:block" />
                  <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-16 bg-linear-to-l from-[#08111f] to-transparent md:block" />

                  <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
                    {sortedEquipo.map((integrante) => (
                      <TeamCurtainCard
                        key={integrante.id}
                        integrante={integrante}
                        selected={selectedIntegrante?.id === integrante.id}
                        onSelect={() => setSelectedId(integrante.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeaturedTeamProfile({
  integrante,
}: {
  integrante: EquipoIntegrante;
}) {
  const imageAspect = normalizeAspect(integrante.imageAspect);
  const imageFit = normalizeFit(integrante.imageFit);
  const imagePosition = normalizePosition(integrante.imagePosition);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0a1628] to-[#08111f] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
      <div className="grid gap-0 lg:grid-cols-[420px_1fr]">
        <div className="relative bg-[#08111f] p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,155,141,0.18),transparent_45%)]" />

          <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-[1.8rem] border border-[#009B8D]/20 bg-[#08111f] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
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

        <div className="p-7 md:p-10">
          <div className="mb-5 flex flex-wrap gap-2">
            {integrante.featured && (
              <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
                Integrante destacado
              </span>
            )}

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
              Equipo Métrica Pública
            </span>
          </div>

          <h3 className="wrap-anywhere text-4xl font-black leading-tight md:text-5xl">
            {integrante.name}
          </h3>

          <p className="mt-4 wrap-anywhere text-xl font-black text-[#20d6c7]">
            {integrante.role || "Integrante del equipo"}
          </p>

          <p className="mt-6 max-w-4xl whitespace-pre-wrap wrap-anywhere text-lg leading-9 text-slate-300">
            {integrante.bio || "Sin biografía publicada."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/equipo/${integrante.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a]"
            >
              Ver perfil completo
              <ArrowUpRight size={17} strokeWidth={2} />
            </Link>

            {integrante.email && (
              <a
                href={`mailto:${integrante.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                <Mail size={17} />
                Contactar
              </a>
            )}

            {integrante.linkedin && (
              <a
                href={integrante.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-4 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15 hover:text-white"
              >
                <ExternalLink size={17} />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
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
      className={`group w-[230px] shrink-0 overflow-hidden rounded-[1.7rem] border text-left shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 sm:w-[260px] ${
        selected
          ? "border-[#009B8D] bg-[#009B8D]/10 ring-2 ring-[#009B8D]/25"
          : "border-white/10 bg-[#0a1628] hover:border-[#009B8D]/45"
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

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f] via-[#08111f]/25 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
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
            {integrante.role || "Integrante"}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#08111f] p-4">
        <p className="line-clamp-3 wrap-anywhere text-sm leading-6 text-slate-400">
          {integrante.bio || "Sin biografía publicada."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {selected ? "Seleccionado" : "Ver destacado"}
          </span>

          <ArrowUpRight
            size={16}
            className="text-[#20d6c7] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </button>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744]/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.14)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function EmptyTeam() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0a1628] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15">
        <Users size={30} strokeWidth={1.8} className="text-[#009B8D]" />
      </div>

      <h3 className="mb-3 text-2xl font-black">
        Aún no hay integrantes publicados
      </h3>

      <p className="text-slate-400">
        Los integrantes inactivos no se mostrarán en esta página. Activa
        integrantes desde el panel administrativo.
      </p>
    </div>
  );
}

function TeamLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0a1628] p-5"
        >
          <div className="aspect-square animate-pulse rounded-[1.7rem] bg-white/5" />

          <div className="px-2 pb-4 pt-6">
            <div className="mb-3 h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="mb-5 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />

            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-4/6 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
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