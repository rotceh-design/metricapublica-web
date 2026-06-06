"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Activity, ArrowLeft, Save } from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import SectorIcon, { sectorIconOptions } from "@/components/icons/SectorIcons";
import { auth } from "@/lib/firebase";
import { createSector, createSectorSlug } from "@/lib/sectores";
import { SectorFormData, SectorIconKey } from "@/types/sector";

type SectorEditorForm = SectorFormData;

export default function NuevoSectorPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<SectorEditorForm>({
    title: "",
    slug: "",
    description: "",
    iconKey: "gobierno",
    order: 1,
    active: true,
    featured: true,
  });

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

  const selectedIconLabel = useMemo(() => {
    return (
      sectorIconOptions.find((option) => option.value === form.iconKey)
        ?.label || "Gobierno"
    );
  }, [form.iconKey]);

  const completionScore = useMemo(() => {
    const checks = [
      form.title.trim().length > 0,
      form.slug.trim().length > 0,
      form.description.trim().length > 0,
      form.iconKey.trim().length > 0,
      Number(form.order) > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [form]);

  const updateField = <T extends keyof SectorEditorForm>(
    field: T,
    value: SectorEditorForm[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createSectorSlug(String(value)) }
        : {}),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await createSector({
        ...form,
        slug: form.slug || createSectorSlug(form.title),
      });

      router.push("/admin/sectores");
    } catch (error) {
      console.error(error);
      setError("No se pudo guardar el sector. Revisa Firestore y tu sesión.");
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

          <p className="font-semibold text-slate-400">Verificando acceso...</p>
        </div>
      </main>
    );
  }

  return (
    <AdminEditorShell
      title="Crear sector"
      description="Construye un sector público con ícono, descripción, orden, visibilidad y marca de destacado."
      userEmail={user?.email}
      backHref="/admin/sectores"
      backLabel="Volver a sectores"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="new-sector-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="new-sector-form" onSubmit={handleSubmit}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/sectores"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={16} />
              Volver a sectores
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill label={`Orden ${form.order || 0}`} />
            <InfoPill label={form.active ? "Activo" : "Inactivo"} />
            <InfoPill label={form.featured ? "Destacado" : "Normal"} />
            <InfoPill label={selectedIconLabel} />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.45fr)_minmax(420px,0.65fr)]">
          <section className="space-y-5">
            <EditableSectorPublication
              form={form}
              selectedIconLabel={selectedIconLabel}
              onUpdateField={updateField}
            />

            {error && (
              <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:h-fit">
            <IconSettingsPanel
              value={form.iconKey}
              onChange={(iconKey) => updateField("iconKey", iconKey)}
            />

            <SectorSummaryPanel
              slug={form.slug}
              order={form.order}
              active={form.active}
              featured={form.featured}
              iconLabel={selectedIconLabel}
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
            {saving ? "Guardando..." : "Guardar sector"}
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

function EditableSectorPublication({
  form,
  selectedIconLabel,
  onUpdateField,
}: {
  form: SectorEditorForm;
  selectedIconLabel: string;
  onUpdateField: <T extends keyof SectorEditorForm>(
    field: T,
    value: SectorEditorForm[T]
  ) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#20d6c7]">
            Sector editable
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
                onUpdateField("slug", createSectorSlug(event.target.value))
              }
              placeholder="gobierno"
              className="field-input"
              required
            />

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              URL futura: /sectores/{form.slug || "mi-sector"}
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
              <SectorIcon iconKey={form.iconKey} className="h-10 w-10" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                Ícono seleccionado
              </p>

              <p className="text-xl font-black text-white">
                {selectedIconLabel}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Este ícono acompañará el sector en tarjetas, módulos públicos y
                administración.
              </p>
            </div>
          </div>

          <FieldGroup label="Nombre del sector">
            <input
              value={form.title}
              onChange={(event) => onUpdateField("title", event.target.value)}
              placeholder="Ej: Gobierno"
              className="field-input text-xl font-black sm:text-2xl"
              required
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Descripción">
          <textarea
            value={form.description}
            onChange={(event) =>
              onUpdateField("description", event.target.value)
            }
            placeholder="Describe cómo Métrica Pública apoya a este sector..."
            rows={13}
            className="field-textarea leading-7"
            required
          />
        </FieldGroup>
      </div>
    </section>
  );
}

function IconSettingsPanel({
  value,
  onChange,
}: {
  value: SectorIconKey;
  onChange: (value: SectorIconKey) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
          Biblioteca de sectores
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Identidad visual
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Selecciona el ícono que represente mejor el sector o público objetivo.
        </p>
      </div>

      <div className="grid gap-2">
        {sectorIconOptions.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-[#009B8D] bg-[#009B8D]/20 shadow-[0_0_24px_rgba(0,155,141,0.2)]"
                  : "border-white/10 bg-white/5 hover:border-[#009B8D]/50 hover:bg-[#009B8D]/10"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-[#20d6c7]">
                <SectorIcon iconKey={option.value} className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <p className="font-black text-white">{option.label}</p>
                <p className="wrap-anywhere text-xs text-slate-500">
                  {option.value}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SectorSummaryPanel({
  slug,
  order,
  active,
  featured,
  iconLabel,
  completionScore,
}: {
  slug: string;
  order: number;
  active: boolean;
  featured: boolean;
  iconLabel: string;
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
        <SummaryItem
          label="URL"
          value={`/sectores/${slug || "mi-sector"}`}
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