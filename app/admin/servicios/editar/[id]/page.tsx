"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  Activity,
  ArrowLeft,
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
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import {
  createServiceSlug,
  getServicio,
  updateServicio,
} from "@/lib/servicios";
import { ServicioFormData } from "@/types/servicio";

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

const LEGACY_ICON_MAP: Record<string, IconId> = {
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

type IconId = (typeof ICON_OPTIONS)[number]["id"];

type ServicioEditorForm = ServicioFormData & {
  icon: IconId;
};

function getIconOption(id: string) {
  return ICON_OPTIONS.find((option) => option.id === id) || ICON_OPTIONS[0];
}

function normalizeIconId(value?: string): IconId {
  if (!value) return "bar-chart";

  const found = ICON_OPTIONS.find((option) => option.id === value);

  if (found) return found.id;

  return LEGACY_ICON_MAP[value] || "bar-chart";
}

export default function EditarServicioPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [benefitsText, setBenefitsText] = useState("");

  const [form, setForm] = useState<ServicioEditorForm>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    icon: "bar-chart",
    order: 1,
    active: true,
    featured: true,
    benefits: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);

      const servicio = await getServicio(id);

      if (!servicio) {
        router.push("/admin/servicios");
        return;
      }

      setForm({
        title: servicio.title || "",
        slug: servicio.slug || "",
        shortDescription: servicio.shortDescription || "",
        description: servicio.description || "",
        icon: normalizeIconId(servicio.icon),
        order: servicio.order || 1,
        active: servicio.active ?? true,
        featured: servicio.featured ?? true,
        benefits: servicio.benefits || [],
      });

      setBenefitsText((servicio.benefits || []).join("\n"));
      setChecking(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  const benefits = useMemo(() => {
    return benefitsText
      .split("\n")
      .map((benefit) => benefit.trim())
      .filter(Boolean);
  }, [benefitsText]);

  const selectedIcon = getIconOption(form.icon);
  const ActiveIcon = selectedIcon.Icon;

  const completionScore = useMemo(() => {
    const checks = [
      form.title.trim().length > 0,
      form.slug.trim().length > 0,
      form.shortDescription.trim().length > 0,
      form.description.trim().length > 0,
      form.icon.trim().length > 0,
      Number(form.order) > 0,
      benefits.length > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [form, benefits.length]);

  const updateField = <T extends keyof ServicioEditorForm>(
    field: T,
    value: ServicioEditorForm[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createServiceSlug(String(value)) }
        : {}),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await updateServicio(id, {
        ...form,
        slug: form.slug || createServiceSlug(form.title),
        benefits,
      });

      router.push("/admin/servicios");
    } catch (error) {
      console.error(error);
      setError("No se pudo guardar el servicio. Revisa Firestore y tu sesión.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
            <Activity size={28} className="animate-pulse text-[#009B8D]" />
          </div>

          <p className="font-semibold text-slate-400">Cargando servicio...</p>
        </div>
      </main>
    );
  }

  return (
    <AdminEditorShell
      title="Editar servicio"
      description="Actualiza el servicio público, su ícono, descripción, beneficios, orden y estado de visibilidad."
      userEmail={user?.email}
      backHref="/admin/servicios"
      backLabel="Volver a servicios"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="edit-servicio-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="edit-servicio-form" onSubmit={handleSubmit}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/servicios"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={16} />
              Volver a servicios
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill label={`Orden ${form.order || 0}`} />
            <InfoPill label={form.active ? "Activo" : "Inactivo"} />
            <InfoPill label={form.featured ? "Destacado" : "Normal"} />
            <InfoPill label={`${benefits.length} beneficios`} />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.45fr)_minmax(420px,0.65fr)]">
          <section className="space-y-5">
            <EditableServicePublication
              form={form}
              benefitsText={benefitsText}
              benefits={benefits}
              selectedIconLabel={selectedIcon.label}
              ActiveIcon={ActiveIcon}
              onUpdateField={updateField}
              onUpdateBenefits={setBenefitsText}
            />

            {error && (
              <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:h-fit">
            <IconSettingsPanel
              value={form.icon}
              onChange={(icon) => updateField("icon", icon)}
            />

            <ServiceSummaryPanel
              slug={form.slug}
              order={form.order}
              active={form.active}
              featured={form.featured}
              iconLabel={selectedIcon.label}
              benefitsCount={benefits.length}
              completionScore={completionScore}
            />
          </aside>
        </div>

        <div className="sticky bottom-4 z-20 mt-5 rounded-[1.7rem] border border-[#009B8D]/15 bg-[#08111f]/95 p-3 shadow-2xl backdrop-blur 2xl:hidden">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .field-input::placeholder {
          color: rgb(100 116 139);
        }

        .field-input:focus {
          border-color: rgba(0, 155, 141, 0.8);
          background: rgba(255, 255, 255, 0.07);
        }

        .field-textarea {
          width: 100%;
          resize: none;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .field-textarea::placeholder {
          color: rgb(100 116 139);
        }

        .field-textarea:focus {
          border-color: rgba(0, 155, 141, 0.8);
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </AdminEditorShell>
  );
}

function EditableServicePublication({
  form,
  benefitsText,
  benefits,
  selectedIconLabel,
  ActiveIcon,
  onUpdateField,
  onUpdateBenefits,
}: {
  form: ServicioEditorForm;
  benefitsText: string;
  benefits: string[];
  selectedIconLabel: string;
  ActiveIcon: LucideIcon;
  onUpdateField: <T extends keyof ServicioEditorForm>(
    field: T,
    value: ServicioEditorForm[T]
  ) => void;
  onUpdateBenefits: (value: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#20d6c7]">
            Servicio editable
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
            Web pública
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_140px_180px]">
          <FieldGroup label="Slug / URL">
            <input
              value={form.slug}
              onChange={(event) =>
                onUpdateField("slug", createServiceSlug(event.target.value))
              }
              placeholder="estudios-de-opinion-publica"
              className="field-input"
              required
            />

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              URL final: /servicios/{form.slug || "mi-servicio"}
            </p>
          </FieldGroup>

          <FieldGroup label="Orden">
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(event) =>
                onUpdateField("order", Number(event.target.value))
              }
              className="field-input"
              required
            />
          </FieldGroup>

          <div className="grid gap-3">
            <Toggle
              checked={form.active}
              onChange={(value) => onUpdateField("active", value)}
              title="Activo"
            />

            <Toggle
              checked={form.featured}
              onChange={(value) => onUpdateField("featured", value)}
              title="Destacado"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <div className="rounded-[1.7rem] border border-white/10 bg-[#08111f] p-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] border border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7] shadow-[0_20px_70px_rgba(0,155,141,0.12)]">
              <ActiveIcon size={38} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                Ícono seleccionado
              </p>

              <p className="text-xl font-black text-white">
                {selectedIconLabel}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Este ícono acompañará el servicio en listados, tarjetas y
                páginas públicas.
              </p>
            </div>
          </div>

          <FieldGroup label="Título principal">
            <input
              value={form.title}
              onChange={(event) => onUpdateField("title", event.target.value)}
              placeholder="Ej: Estudios de opinión pública"
              className="field-input text-xl font-black sm:text-2xl"
              required
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Descripción corta">
          <textarea
            value={form.shortDescription}
            onChange={(event) =>
              onUpdateField("shortDescription", event.target.value)
            }
            placeholder="Resumen breve que aparecerá en tarjetas y listados..."
            rows={4}
            className="field-textarea"
            required
          />
        </FieldGroup>

        <FieldGroup label="Descripción completa">
          <textarea
            value={form.description}
            onChange={(event) =>
              onUpdateField("description", event.target.value)
            }
            placeholder="Explica el servicio, su enfoque, utilidad y alcance..."
            rows={13}
            className="field-textarea leading-7"
            required
          />
        </FieldGroup>

        <section className="rounded-[1.7rem] border border-white/10 bg-[#08111f] p-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
            Beneficios
          </p>

          <p className="mb-4 text-sm leading-6 text-slate-400">
            Escribe un beneficio por línea. Se guardarán como elementos
            independientes.
          </p>

          <textarea
            value={benefitsText}
            onChange={(event) => onUpdateBenefits(event.target.value)}
            placeholder={`Diagnóstico claro\nRecomendaciones accionables\nLectura territorial`}
            rows={7}
            className="field-textarea leading-7"
          />

          {benefits.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <span
                  key={`${benefit}-${index}`}
                  className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-semibold text-[#20d6c7]"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function IconSettingsPanel({
  value,
  onChange,
}: {
  value: IconId;
  onChange: (value: IconId) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
          Biblioteca de íconos
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Identidad visual
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Selecciona el ícono que represente mejor el servicio.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 2xl:grid-cols-4">
        {ICON_OPTIONS.map(({ id, label, Icon }) => {
          const selected = value === id;

          return (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => onChange(id)}
              className={`group flex aspect-square items-center justify-center rounded-2xl border transition ${
                selected
                  ? "border-[#009B8D] bg-[#009B8D]/20 shadow-[0_0_24px_rgba(0,155,141,0.2)]"
                  : "border-white/10 bg-white/5 hover:border-[#009B8D]/50 hover:bg-[#009B8D]/10"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={selected ? 2.2 : 1.7}
                className={
                  selected
                    ? "text-[#20d6c7]"
                    : "text-slate-400 transition group-hover:text-[#20d6c7]"
                }
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#08111f] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Seleccionado
        </p>

        <p className="mt-1 font-black text-white">
          {getIconOption(value).label}
        </p>
      </div>
    </section>
  );
}

function ServiceSummaryPanel({
  slug,
  order,
  active,
  featured,
  iconLabel,
  benefitsCount,
  completionScore,
}: {
  slug: string;
  order: number;
  active: boolean;
  featured: boolean;
  iconLabel: string;
  benefitsCount: number;
  completionScore: number;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Resumen
      </p>

      <div className="mt-4 space-y-4 text-sm">
        <SummaryItem label="Completitud" value={`${completionScore}%`} />
        <SummaryItem label="Estado" value={active ? "Activo" : "Inactivo"} />
        <SummaryItem
          label="Destacado"
          value={featured ? "Destacado" : "Normal"}
        />
        <SummaryItem label="Orden" value={String(order || 0)} />
        <SummaryItem label="Ícono" value={iconLabel} />
        <SummaryItem label="Beneficios" value={`${benefitsCount}`} />
        <SummaryItem
          label="URL"
          value={`/servicios/${slug || "mi-servicio"}`}
          wrap
        />
      </div>
    </section>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
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
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        checked
          ? "border-[#009B8D]/35 bg-[#009B8D]/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <span className="text-sm font-black text-white">{title}</span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#009B8D]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}

function SummaryItem({
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

      <p className={`font-black text-white ${wrap ? "wrap-anywhere" : ""}`}>
        {value}
      </p>
    </div>
  );
}