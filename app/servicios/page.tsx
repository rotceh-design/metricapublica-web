"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Brain,
  ClipboardList,
  Compass,
  FileText,
  Globe,
  Handshake,
  Hexagon,
  Landmark,
  Lightbulb,
  Map,
  MessageSquare,
  Microscope,
  PieChart,
  Search,
  Settings2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveServicios } from "@/lib/servicios";
import { Servicio } from "@/types/servicio";

const ICON_OPTIONS = [
  { id: "bar-chart", label: "Estadísticas", Icon: BarChart2 },
  { id: "compass", label: "Orientación", Icon: Compass },
  { id: "landmark", label: "Institucional", Icon: Landmark },
  { id: "map", label: "Territorial", Icon: Map },
  { id: "trending-up", label: "Crecimiento", Icon: TrendingUp },
  { id: "brain", label: "Análisis", Icon: Brain },
  { id: "message", label: "Comunicación", Icon: MessageSquare },
  { id: "search", label: "Investigación", Icon: Search },
  { id: "clipboard", label: "Informes", Icon: ClipboardList },
  { id: "handshake", label: "Consultoría", Icon: Handshake },
  { id: "settings", label: "Gestión", Icon: Settings2 },
  { id: "hexagon", label: "Estrategia", Icon: Hexagon },
  { id: "globe", label: "Internacional", Icon: Globe },
  { id: "users", label: "Comunidad", Icon: Users },
  { id: "file-text", label: "Documentos", Icon: FileText },
  { id: "lightbulb", label: "Innovación", Icon: Lightbulb },
  { id: "target", label: "Objetivos", Icon: Target },
  { id: "shield", label: "Transparencia", Icon: ShieldCheck },
  { id: "pie-chart", label: "Datos", Icon: PieChart },
  { id: "microscope", label: "Estudio", Icon: Microscope },
] as const;

const LEGACY_ICON_MAP: Record<string, string> = {
  "📊": "bar-chart",
  "🧭": "compass",
  "🏛️": "landmark",
  "🗺️": "map",
  "📈": "trending-up",
  "🧠": "brain",
  "💬": "message",
  "🔎": "search",
  "📋": "clipboard",
  "🤝": "handshake",
  "⚙️": "settings",
  "◈": "hexagon",
};

type IconOption = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const data = await getActiveServicios();
        setServicios(data);
      } catch (error) {
        console.error("Error cargando servicios:", error);
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };

    loadServicios();
  }, []);

  const sortedServicios = useMemo(() => {
    return [...servicios].sort((a, b) => {
      const orderA = Number(a.order || 0);
      const orderB = Number(b.order || 0);

      return orderA - orderB;
    });
  }, [servicios]);

  const featuredCount = useMemo(() => {
    return sortedServicios.filter((servicio) => Boolean(servicio.featured))
      .length;
  }, [sortedServicios]);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[4%] top-80 h-60 w-60 rounded-full bg-[#1a365d]/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
            Servicios
          </span>

          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-6xl">
                Soluciones de investigación para tomar mejores decisiones
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Desarrollamos estudios, análisis y asesoría estratégica para
                instituciones, campañas, empresas y organizaciones que necesitan
                evidencia clara, confiable y accionable.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Catálogo activo
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniStat label="Servicios" value={String(sortedServicios.length)} />
                <MiniStat label="Destacados" value={String(featuredCount)} />
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : sortedServicios.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedServicios.map((servicio) => {
                const benefits = servicio.benefits || [];
                const iconOption = getIconOption(servicio.icon);
                const isFeatured = Boolean(servicio.featured);

                return (
                  <article
                    key={servicio.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/80 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
                  >
                    <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[#009B8D]/10 blur-3xl transition group-hover:bg-[#009B8D]/15" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-[#1a365d]/70 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col p-7">
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <Link
                          href={`/servicios/${servicio.slug}`}
                          className="flex h-17 w-17 items-center justify-center rounded-[1.35rem] border border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7] shadow-[0_20px_70px_rgba(0,155,141,0.12)] transition group-hover:scale-105 group-hover:bg-[#009B8D]/15"
                        >
                          <ServiceIcon icon={servicio.icon} option={iconOption} />
                        </Link>

                        <div className="flex flex-wrap justify-end gap-2">
                          {isFeatured && (
                            <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
                              Destacado
                            </span>
                          )}

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                            Servicio
                          </span>
                        </div>
                      </div>

                      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#009B8D]">
                        {iconOption?.label || "Servicio"}
                      </p>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-black leading-tight text-white">
                        <Link
                          href={`/servicios/${servicio.slug}`}
                          className="transition hover:text-[#20d6c7]"
                        >
                          {servicio.title}
                        </Link>
                      </h2>

                      <p className="mb-6 line-clamp-4 wrap-anywhere leading-7 text-slate-400">
                        {servicio.shortDescription ||
                          "Servicio disponible para instituciones, organizaciones y equipos que requieren evidencia para decidir mejor."}
                      </p>

                      {benefits.length > 0 && (
                        <div className="mb-7 rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-4">
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Beneficios
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {benefits.slice(0, 3).map((benefit, index) => (
                              <span
                                key={`${benefit}-${index}`}
                                className="wrap-anywhere rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-semibold text-[#20d6c7]"
                              >
                                {benefit}
                              </span>
                            ))}

                            {benefits.length > 3 && (
                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-500">
                                +{benefits.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4">
                        <Link
                          href={`/servicios/${servicio.slug}`}
                          className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a]"
                        >
                          Ver servicio
                        </Link>

                        <span className="text-xs font-semibold text-slate-500">
                          Orden {servicio.order || 0}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function getIconOption(value?: string): IconOption | null {
  if (!value) return ICON_OPTIONS[0];

  const normalizedId = LEGACY_ICON_MAP[value] || value;
  const option = ICON_OPTIONS.find((item) => item.id === normalizedId);

  return option || null;
}

function ServiceIcon({
  icon,
  option,
}: {
  icon?: string;
  option: IconOption | null;
}) {
  if (option) {
    const Icon = option.Icon;

    return <Icon size={32} strokeWidth={1.7} />;
  }

  return <span className="text-4xl">{icon || "◈"}</span>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#08111f]/70 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando servicios...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <h2 className="mb-3 text-2xl font-black">
        Aún no hay servicios activos
      </h2>

      <p className="text-slate-400">
        Los servicios inactivos no se mostrarán en esta página. Activa un
        servicio desde el panel administrativo.
      </p>
    </div>
  );
}