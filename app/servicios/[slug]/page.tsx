"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { getActiveServicioBySlug } from "@/lib/servicios";
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

export default function ServicioDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicio = async () => {
      try {
        const data = await getActiveServicioBySlug(slug);
        setServicio(data);
      } catch (error) {
        console.error("Error cargando servicio:", error);
        setServicio(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadServicio();
    }
  }, [slug]);

  const iconOption = useMemo(() => {
    return getIconOption(servicio?.icon);
  }, [servicio?.icon]);

  const benefits = useMemo(() => {
    return servicio?.benefits || [];
  }, [servicio?.benefits]);

  const descriptionParagraphs = useMemo(() => {
    return splitParagraphs(servicio?.description || "");
  }, [servicio?.description]);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[6%] top-72 h-56 w-56 rounded-full bg-[#1a365d]/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {loading ? (
            <LoadingState />
          ) : !servicio ? (
            <NotFoundState />
          ) : (
            <article>
              <Link
                href="/servicios"
                className="mb-8 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-sm font-black text-[#20d6c7] transition hover:border-[#009B8D]/50 hover:bg-[#009B8D]/15 hover:text-white"
              >
                ← Volver a servicios
              </Link>

              <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] via-[#10243d] to-[#08111f] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.25)] md:p-10">
                <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#1a365d]/50 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] border border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7] shadow-[0_20px_70px_rgba(0,155,141,0.12)]">
                      <ServiceIcon icon={servicio.icon} option={iconOption} />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-4 flex flex-wrap gap-3">
                        {servicio.featured && (
                          <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm font-black text-[#20d6c7]">
                            Servicio destacado
                          </span>
                        )}

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                          Métrica Pública
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                          {iconOption?.label || "Servicio"}
                        </span>
                      </div>

                      <h1 className="max-w-5xl wrap-anywhere text-4xl font-black leading-tight text-white md:text-6xl">
                        {servicio.title}
                      </h1>
                    </div>
                  </div>

                  <p className="max-w-3xl wrap-anywhere text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
                    {servicio.shortDescription}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/contacto"
                      className="inline-flex justify-center rounded-2xl bg-[#009B8D] px-6 py-4 font-black text-white transition hover:bg-[#00877a]"
                    >
                      Solicitar información
                    </Link>

                    <Link
                      href="/servicios"
                      className="inline-flex justify-center rounded-2xl border border-white/10 px-6 py-4 font-black text-slate-200 transition hover:bg-white/5 hover:text-white"
                    >
                      Ver otros servicios
                    </Link>
                  </div>
                </div>
              </header>

              <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <section className="space-y-8">
                  <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div className="border-b border-white/10 bg-[#08111f]/70 px-7 py-5 md:px-10">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#009B8D]">
                        Descripción del servicio
                      </p>
                    </div>

                    <div className="space-y-6 p-7 md:p-10">
                      {descriptionParagraphs.length > 0 ? (
                        descriptionParagraphs.map((paragraph, index) => (
                          <p
                            key={`${paragraph.slice(0, 24)}-${index}`}
                            className="wrap-anywhere text-lg leading-9 text-slate-300"
                          >
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-lg leading-9 text-slate-400">
                          Este servicio todavía no tiene una descripción
                          completa registrada.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-10">
                    <div className="mb-7 flex flex-col gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#009B8D]">
                        Beneficios
                      </p>

                      <h2 className="text-3xl font-black text-white">
                        Qué aporta este servicio
                      </h2>
                    </div>

                    {benefits.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {benefits.map((benefit, index) => (
                          <div
                            key={`${benefit}-${index}`}
                            className="rounded-[1.5rem] border border-white/10 bg-[#0a1628]/70 p-5"
                          >
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-sm font-black text-[#20d6c7]">
                              {index + 1}
                            </div>

                            <p className="wrap-anywhere leading-7 text-slate-300">
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        Este servicio todavía no tiene beneficios registrados.
                      </p>
                    )}
                  </div>
                </section>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Información
                    </p>

                    <div className="space-y-5 text-sm text-slate-400">
                      <InfoItem label="Estado" value="Servicio activo" />

                      <InfoItem
                        label="Tipo"
                        value={servicio.featured ? "Destacado" : "Normal"}
                      />

                      <InfoItem
                        label="Categoría visual"
                        value={iconOption?.label || "Servicio"}
                      />

                      <InfoItem
                        label="Beneficios"
                        value={`${benefits.length} registrados`}
                      />

                      <InfoItem
                        label="URL"
                        value={`/servicios/${servicio.slug}`}
                        wrap
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7]">
                      <ServiceIcon icon={servicio.icon} option={iconOption} />
                    </div>

                    <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Próximo paso
                    </p>

                    <h3 className="mb-3 text-2xl font-black text-white">
                      ¿Necesitas este servicio?
                    </h3>

                    <p className="mb-5 text-sm leading-6 text-slate-400">
                      Contacta a Métrica Pública para revisar alcance,
                      objetivos, tiempos y requerimientos del proyecto.
                    </p>

                    <Link
                      href="/contacto"
                      className="block rounded-2xl bg-[#009B8D] px-6 py-4 text-center font-black text-white transition hover:bg-[#00877a]"
                    >
                      Solicitar información
                    </Link>
                  </div>

                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Servicios
                    </p>

                    <p className="mb-5 text-sm leading-6 text-slate-400">
                      También puedes revisar el catálogo completo de soluciones
                      disponibles.
                    </p>

                    <Link
                      href="/servicios"
                      className="font-black text-[#20d6c7] transition hover:text-white"
                    >
                      Ver todos los servicios →
                    </Link>
                  </div>
                </aside>
              </div>
            </article>
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

    return <Icon size={34} strokeWidth={1.7} />;
  }

  return <span className="text-4xl">{icon || "◈"}</span>;
}

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function InfoItem({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className={`font-bold text-white ${wrap ? "wrap-anywhere" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando servicio...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Servicio
      </span>

      <h1 className="mb-4 text-4xl font-black">Servicio no encontrado</h1>

      <p className="mb-6 text-slate-400">
        El servicio no existe o no está activo actualmente.
      </p>

      <Link
        href="/servicios"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Volver a servicios
      </Link>
    </div>
  );
}
