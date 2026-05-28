"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  BarChart2,
  Compass,
  Landmark,
  Map,
  TrendingUp,
  Brain,
  MessageSquare,
  Search,
  ClipboardList,
  Handshake,
  Settings2,
  Hexagon,
  Globe,
  Users,
  FileText,
  Lightbulb,
  Target,
  ShieldCheck,
  PieChart,
  Microscope,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { createServiceSlug, createServicio } from "@/lib/servicios";
import { ServicioFormData } from "@/types/servicio";

// ─── Icon registry ────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { id: "bar-chart",     label: "Estadísticas",   Icon: BarChart2      },
  { id: "compass",       label: "Orientación",    Icon: Compass        },
  { id: "landmark",      label: "Institucional",  Icon: Landmark       },
  { id: "map",           label: "Territorial",    Icon: Map            },
  { id: "trending-up",   label: "Crecimiento",    Icon: TrendingUp     },
  { id: "brain",         label: "Análisis",       Icon: Brain          },
  { id: "message",       label: "Comunicación",   Icon: MessageSquare  },
  { id: "search",        label: "Investigación",  Icon: Search         },
  { id: "clipboard",     label: "Informes",       Icon: ClipboardList  },
  { id: "handshake",     label: "Consultoría",    Icon: Handshake      },
  { id: "settings",      label: "Gestión",        Icon: Settings2      },
  { id: "hexagon",       label: "Estrategia",     Icon: Hexagon        },
  { id: "globe",         label: "Internacional",  Icon: Globe          },
  { id: "users",         label: "Comunidad",      Icon: Users          },
  { id: "file-text",     label: "Documentos",     Icon: FileText       },
  { id: "lightbulb",     label: "Innovación",     Icon: Lightbulb      },
  { id: "target",        label: "Objetivos",      Icon: Target         },
  { id: "shield",        label: "Transparencia",  Icon: ShieldCheck    },
  { id: "pie-chart",     label: "Datos",          Icon: PieChart       },
  { id: "microscope",    label: "Estudio",        Icon: Microscope     },
] as const;

type IconId = (typeof ICON_OPTIONS)[number]["id"];

// Helper: get the Icon component by id
function getIconById(id: IconId) {
  return ICON_OPTIONS.find((o) => o.id === id)?.Icon ?? BarChart2;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NuevoServicioPage() {
  const router = useRouter();

  const [checking, setChecking]       = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [hoveredIcon, setHoveredIcon] = useState<IconId | null>(null);

  const [form, setForm] = useState<ServicioFormData & { icon: IconId }>({
    title:            "",
    slug:             "",
    shortDescription: "",
    description:      "",
    icon:             "bar-chart",
    order:            1,
    active:           true,
    featured:         true,
    benefits:         [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { router.push("/admin/login"); return; }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  const benefits = useMemo(() =>
    benefitsText.split("\n").map((s) => s.trim()).filter(Boolean),
    [benefitsText]
  );

  const updateField = <T extends keyof typeof form>(
    field: T,
    value: (typeof form)[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createServiceSlug(String(value)) }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createServicio({
        ...form,
        slug:     form.slug || createServiceSlug(form.title),
        benefits,
      });
      router.push("/admin/servicios");
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el servicio. Revisa Firestore y tu sesión.");
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = getIconById(form.icon as IconId);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Verificando acceso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Servicios
            </p>
            <h1 className="text-4xl font-bold">Crear nuevo servicio</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Agrega servicios que luego aparecerán en la página pública de Métrica Pública.
            </p>
          </div>

          <a
            href="/admin/servicios"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold transition hover:bg-white/5"
          >
            Volver
          </a>
        </div>

        {/* ── Layout ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-2xl md:p-8"
          >
            <div className="grid gap-5">

              {/* Title */}
              <Field label="Título del servicio">
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ej: Estudios de opinión pública"
                  className={inputCls}
                  required
                />
              </Field>

              {/* Slug */}
              <Field label="Slug / URL">
                <input
                  value={form.slug}
                  onChange={(e) => updateField("slug", createServiceSlug(e.target.value))}
                  placeholder="estudios-de-opinion-publica"
                  className={inputCls}
                  required
                />
                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL final: /servicios/{form.slug || "mi-servicio"}
                </p>
              </Field>

              {/* Icon + Order */}
              <div className="grid gap-5 md:grid-cols-[1fr_160px]">

                {/* Icon picker */}
                <Field label="Ícono del servicio">
                  <div
                    role="radiogroup"
                    aria-label="Seleccionar ícono"
                    className="grid grid-cols-5 gap-2 sm:grid-cols-10"
                  >
                    {ICON_OPTIONS.map(({ id, label, Icon }) => {
                      const selected = form.icon === id;
                      const hovered  = hoveredIcon === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={label}
                          title={label}
                          onClick={() => updateField("icon", id as IconId)}
                          onMouseEnter={() => setHoveredIcon(id as IconId)}
                          onMouseLeave={() => setHoveredIcon(null)}
                          className={[
                            "group relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-150",
                            selected
                              ? "border-[#009B8D] bg-[#009B8D]/20 shadow-[0_0_12px_rgba(0,155,141,0.35)]"
                              : "border-white/10 bg-white/5 hover:border-[#009B8D]/50 hover:bg-[#009B8D]/10",
                          ].join(" ")}
                        >
                          <Icon
                            size={20}
                            strokeWidth={selected ? 2.2 : 1.6}
                            className={
                              selected
                                ? "text-[#009B8D]"
                                : "text-slate-400 group-hover:text-[#009B8D]/80 transition-colors"
                            }
                          />
                          {/* Tooltip */}
                          {hovered && !selected && (
                            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a1628] border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 shadow-xl z-10">
                              {label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected icon label */}
                  {form.icon && (
                    <p className="mt-2 text-xs text-slate-500">
                      Seleccionado:{" "}
                      <span className="font-semibold text-[#009B8D]">
                        {ICON_OPTIONS.find((o) => o.id === form.icon)?.label}
                      </span>
                    </p>
                  )}
                </Field>

                {/* Order */}
                <Field label="Orden">
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => updateField("order", Number(e.target.value))}
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              {/* Short description */}
              <Field label="Descripción corta">
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  placeholder="Resumen breve que aparecerá en tarjetas y listados..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  required
                />
              </Field>

              {/* Full description */}
              <Field label="Descripción completa">
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Explica el servicio, su enfoque, utilidad y alcance..."
                  rows={9}
                  className={`${inputCls} resize-none leading-7`}
                  required
                />
              </Field>

              {/* Benefits */}
              <Field label="Beneficios">
                <textarea
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder={`Escribe un beneficio por línea:\nDiagnóstico claro\nRecomendaciones accionables\nLectura territorial`}
                  rows={5}
                  className={`${inputCls} resize-none leading-7`}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Cada línea se guardará como un beneficio independiente.
                </p>
              </Field>

              {/* Toggles */}
              <div className="grid gap-4 md:grid-cols-2">
                <Toggle
                  checked={form.active}
                  onChange={(v) => updateField("active", v)}
                  title="Servicio activo"
                  subtitle="Si está activo, se mostrará en la web pública."
                />
                <Toggle
                  checked={form.featured}
                  onChange={(v) => updateField("featured", v)}
                  title="Servicio destacado"
                  subtitle="Se marcará como relevante dentro del sitio."
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#009B8D] px-6 py-4 font-bold transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Guardando servicio..." : "Guardar servicio"}
              </button>

            </div>
          </form>

          {/* ── Preview aside ── */}
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] shadow-2xl">

              {/* Header preview */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#08111f] to-[#0f2744] p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  {/* Icon display */}
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#009B8D]/30 bg-[#009B8D]/15 shadow-[0_0_24px_rgba(0,155,141,0.2)]">
                    <ActiveIcon
                      size={36}
                      strokeWidth={1.5}
                      className="text-[#009B8D]"
                    />
                  </div>

                  {/* Badges */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                      Orden {form.order || 0}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {form.active ? "Activo" : "Inactivo"}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {form.featured ? "Destacado" : "Normal"}
                    </span>
                  </div>

                  <h2 className="wrap-anywhere text-3xl font-bold leading-tight">
                    {form.title || "Título del servicio"}
                  </h2>

                  <p className="mt-4 wrap-anywhere text-lg leading-8 text-slate-300">
                    {form.shortDescription ||
                      "Aquí aparecerá la descripción corta del servicio."}
                  </p>
                </div>
              </div>

              {/* Body preview */}
              <div className="p-7">
                <div className="mb-6 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    Descripción completa
                  </p>
                  <div className="max-h-64 overflow-hidden whitespace-pre-wrap wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.description ||
                      "La descripción completa del servicio aparecerá aquí mientras escribes."}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    Beneficios
                  </p>

                  {benefits.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Aún no has agregado beneficios.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex gap-3 rounded-xl border-l-4 border-[#009B8D] bg-[#009B8D]/10 px-4 py-3 text-sm text-slate-200"
                        >
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#009B8D]" />
                          <span className="wrap-anywhere">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  subtitle,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  subtitle: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#08111f]/70 p-5">
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Custom toggle switch */}
      <div
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[#009B8D]" : "bg-white/15",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </div>
    </label>
  );
}