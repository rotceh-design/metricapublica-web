"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  BarChart2,
  ExternalLink,
  FileText,
  Home,
  LayoutGrid,
  Mail,
  Map,
  RotateCcw,
  Save,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import {
  defaultInicioContenido,
  getInicioContenido,
  updateInicioContenido,
} from "@/lib/contenido";
import { InicioContenido } from "@/types/contenido";

const previewBlocks = [
  {
    Icon: LayoutGrid,
    labelKey: "servicesLabel",
    titleKey: "servicesTitle",
    descriptionKey: "servicesDescription",
  },
  {
    Icon: BarChart2,
    labelKey: "studiesLabel",
    titleKey: "studiesTitle",
    descriptionKey: "studiesDescription",
  },
  {
    Icon: Map,
    labelKey: "sectorsLabel",
    titleKey: "sectorsTitle",
    descriptionKey: "sectorsDescription",
  },
  {
    Icon: Mail,
    labelKey: "contactLabel",
    titleKey: "contactTitle",
    descriptionKey: "contactDescription",
  },
] as const;

export default function AdminContenidoInicioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<InicioContenido>(defaultInicioContenido);

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);

      try {
        const data = await getInicioContenido();
        setForm(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el contenido de la página Inicio.");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const contentValues = useMemo(
    () => [
      form.heroLabel,
      form.heroTitle,
      form.heroDescription,
      form.primaryButtonLabel,
      form.primaryButtonHref,
      form.secondaryButtonLabel,
      form.secondaryButtonHref,
      form.servicesLabel,
      form.servicesTitle,
      form.servicesDescription,
      form.studiesLabel,
      form.studiesTitle,
      form.studiesDescription,
      form.sectorsLabel,
      form.sectorsTitle,
      form.sectorsDescription,
      form.contactLabel,
      form.contactTitle,
      form.contactDescription,
    ],
    [form]
  );

  const completionScore = useMemo(() => {
    const completed = contentValues.filter(
      (value) => value.trim().length > 0
    ).length;

    return Math.round((completed / contentValues.length) * 100);
  }, [contentValues]);

  const totalWords = useMemo(() => {
    return contentValues
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [contentValues]);

  const updateField = (field: keyof InicioContenido, value: string) => {
    setStatusMessage("");
    setError("");

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setStatusMessage("");

    try {
      await updateInicioContenido(form);
      setStatusMessage("Contenido de Inicio actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar el contenido. Revisa Firestore y tu sesión."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    const confirmReset = confirm(
      "¿Seguro que quieres volver a los textos base? Luego debes guardar para aplicar el cambio."
    );

    if (!confirmReset) return;

    setForm(defaultInicioContenido);
    setStatusMessage("");
    setError("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">
            Cargando contenido editable...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AdminEditorShell
      title="Página Inicio"
      description="Edita los textos principales del home: hero, servicios, estudios, sectores y contacto."
      userEmail={user?.email}
      backHref="/admin/contenido"
      backLabel="Volver a contenido"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="inicio-content-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="inicio-content-form" onSubmit={handleSave}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/contenido"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              Volver a contenido
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/25 bg-[#009B8D]/10 px-4 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15 hover:text-white"
            >
              <ExternalLink size={16} />
              Ver inicio
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill label={`${totalWords} palabras`} />
            <InfoPill label="Home" />
            <InfoPill label="Contenido público" />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.35fr)_minmax(440px,0.75fr)]">
          <section className="space-y-5">
            <EditorShellCard
              title="Editor de contenido"
              description="Los cambios se verán en la página de inicio después de guardar."
              actions={
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw size={16} />
                  Restaurar base
                </button>
              }
            >
              <div className="grid gap-6">
                <EditorSection
                  title="Hero principal"
                  description="Primera sección visible del home: título, bajada y botones principales."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.heroLabel}
                    onChange={(value) => updateField("heroLabel", value)}
                    placeholder="Ej: Métrica Pública"
                  />

                  <TextArea
                    label="Título principal"
                    value={form.heroTitle}
                    onChange={(value) => updateField("heroTitle", value)}
                    rows={3}
                    placeholder="Título principal del home"
                  />

                  <TextArea
                    label="Descripción principal"
                    value={form.heroDescription}
                    onChange={(value) =>
                      updateField("heroDescription", value)
                    }
                    rows={4}
                    placeholder="Texto introductorio del home"
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <TextInput
                      label="Botón principal"
                      value={form.primaryButtonLabel}
                      onChange={(value) =>
                        updateField("primaryButtonLabel", value)
                      }
                      placeholder="Ej: Ver servicios"
                    />

                    <TextInput
                      label="URL botón principal"
                      value={form.primaryButtonHref}
                      onChange={(value) =>
                        updateField("primaryButtonHref", value)
                      }
                      placeholder="/servicios"
                    />

                    <TextInput
                      label="Botón secundario"
                      value={form.secondaryButtonLabel}
                      onChange={(value) =>
                        updateField("secondaryButtonLabel", value)
                      }
                      placeholder="Ej: Contactar"
                    />

                    <TextInput
                      label="URL botón secundario"
                      value={form.secondaryButtonHref}
                      onChange={(value) =>
                        updateField("secondaryButtonHref", value)
                      }
                      placeholder="/contacto"
                    />
                  </div>
                </EditorSection>

                <EditorSection
                  title="Bloque Servicios"
                  description="Encabezado del bloque donde se muestran servicios activos."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.servicesLabel}
                    onChange={(value) => updateField("servicesLabel", value)}
                    placeholder="Ej: Servicios"
                  />

                  <TextArea
                    label="Título"
                    value={form.servicesTitle}
                    onChange={(value) => updateField("servicesTitle", value)}
                    rows={3}
                    placeholder="Título del bloque servicios"
                  />

                  <TextArea
                    label="Descripción"
                    value={form.servicesDescription}
                    onChange={(value) =>
                      updateField("servicesDescription", value)
                    }
                    rows={4}
                    placeholder="Descripción del bloque servicios"
                  />
                </EditorSection>

                <EditorSection
                  title="Bloque Estudios"
                  description="Encabezado del bloque de estudios y publicaciones."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.studiesLabel}
                    onChange={(value) => updateField("studiesLabel", value)}
                    placeholder="Ej: Estudios"
                  />

                  <TextArea
                    label="Título"
                    value={form.studiesTitle}
                    onChange={(value) => updateField("studiesTitle", value)}
                    rows={3}
                    placeholder="Título del bloque estudios"
                  />

                  <TextArea
                    label="Descripción"
                    value={form.studiesDescription}
                    onChange={(value) =>
                      updateField("studiesDescription", value)
                    }
                    rows={4}
                    placeholder="Descripción del bloque estudios"
                  />
                </EditorSection>

                <EditorSection
                  title="Bloque Sectores"
                  description="Encabezado del bloque donde se muestran sectores activos."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.sectorsLabel}
                    onChange={(value) => updateField("sectorsLabel", value)}
                    placeholder="Ej: Sectores"
                  />

                  <TextArea
                    label="Título"
                    value={form.sectorsTitle}
                    onChange={(value) => updateField("sectorsTitle", value)}
                    rows={3}
                    placeholder="Título del bloque sectores"
                  />

                  <TextArea
                    label="Descripción"
                    value={form.sectorsDescription}
                    onChange={(value) =>
                      updateField("sectorsDescription", value)
                    }
                    rows={4}
                    placeholder="Descripción del bloque sectores"
                  />
                </EditorSection>

                <EditorSection
                  title="Bloque Contacto"
                  description="Llamado final para contactar a Métrica Pública."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.contactLabel}
                    onChange={(value) => updateField("contactLabel", value)}
                    placeholder="Ej: Contacto"
                  />

                  <TextArea
                    label="Título"
                    value={form.contactTitle}
                    onChange={(value) => updateField("contactTitle", value)}
                    rows={3}
                    placeholder="Título del bloque contacto"
                  />

                  <TextArea
                    label="Descripción"
                    value={form.contactDescription}
                    onChange={(value) =>
                      updateField("contactDescription", value)
                    }
                    rows={4}
                    placeholder="Descripción del bloque contacto"
                  />
                </EditorSection>

                {statusMessage && (
                  <div className="rounded-[1.5rem] border border-[#009B8D]/30 bg-[#009B8D]/10 px-5 py-4 text-sm font-bold text-slate-200">
                    {statusMessage}
                  </div>
                )}

                {error && (
                  <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-6 py-4 font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Guardando contenido..." : "Guardar contenido"}
                </button>
              </div>
            </EditorShellCard>
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:h-fit">
            <PreviewPanel form={form} />

            <SummaryPanel
              completionScore={completionScore}
              totalWords={totalWords}
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
            {saving ? "Guardando..." : "Guardar contenido"}
          </button>
        </div>
      </form>
    </AdminEditorShell>
  );
}

function EditorShellCard({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{title}</h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          </div>

          {actions}
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/10 bg-[#08111f]/60 p-5">
      <div className="mb-5">
        <h3 className="text-xl font-black text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function PreviewPanel({ form }: { form: InicioContenido }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="relative overflow-hidden bg-linear-to-br from-[#08111f] to-[#0f2744] p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#009B8D]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009B8D]/15">
            <Home size={28} className="text-[#20d6c7]" />
          </div>

          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#009B8D]">
            {form.heroLabel || "Inicio"}
          </p>

          <h2 className="wrap-anywhere text-4xl font-black leading-tight">
            {form.heroTitle || "Título principal"}
          </h2>

          <p className="mt-5 wrap-anywhere leading-8 text-slate-300">
            {form.heroDescription || "Descripción principal"}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row 2xl:flex-col">
            <span className="rounded-2xl bg-[#009B8D] px-5 py-3 text-center text-sm font-black text-white">
              {form.primaryButtonLabel || "Botón principal"}
            </span>

            <span className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white">
              {form.secondaryButtonLabel || "Botón secundario"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        {previewBlocks.map(({ Icon, labelKey, titleKey, descriptionKey }) => (
          <PreviewBlock
            key={labelKey}
            Icon={Icon}
            label={form[labelKey]}
            title={form[titleKey]}
            description={form[descriptionKey]}
          />
        ))}
      </div>
    </section>
  );
}

function PreviewBlock({
  Icon,
  label,
  title,
  description,
}: {
  Icon: ElementType;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/80 p-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D]/15">
        <Icon size={20} className="text-[#20d6c7]" />
      </div>

      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        {label || "Etiqueta"}
      </p>

      <h4 className="wrap-anywhere font-black">
        {title || "Título del bloque"}
      </h4>

      <p className="mt-2 wrap-anywhere text-sm leading-6 text-slate-400">
        {description || "Descripción del bloque."}
      </p>
    </div>
  );
}

function SummaryPanel({
  completionScore,
  totalWords,
}: {
  completionScore: number;
  totalWords: number;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Resumen
      </p>

      <div className="mt-4 space-y-4 text-sm">
        <SummaryItem label="Completitud" value={`${completionScore}%`} />
        <SummaryItem label="Palabras totales" value={String(totalWords)} />
        <SummaryItem label="Página" value="/" />
        <SummaryItem label="Estado" value="Editable" />
      </div>
    </section>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="wrap-anywhere font-black text-white">{value}</p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
      />
    </div>
  );
}