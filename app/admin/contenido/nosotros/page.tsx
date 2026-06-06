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
import {
  BarChart2,
  Compass,
  ExternalLink,
  FileText,
  Handshake,
  Map,
  RotateCcw,
  Save,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import {
  defaultNosotrosContenido,
  getNosotrosContenido,
  updateNosotrosContenido,
} from "@/lib/contenido";
import { NosotrosContenido } from "@/types/contenido";

const previewPillars = [
  {
    Icon: BarChart2,
    titleKey: "pillarOneTitle",
    descriptionKey: "pillarOneDescription",
  },
  {
    Icon: Compass,
    titleKey: "pillarTwoTitle",
    descriptionKey: "pillarTwoDescription",
  },
  {
    Icon: Map,
    titleKey: "pillarThreeTitle",
    descriptionKey: "pillarThreeDescription",
  },
  {
    Icon: Handshake,
    titleKey: "pillarFourTitle",
    descriptionKey: "pillarFourDescription",
  },
] as const;

export default function AdminContenidoNosotrosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<NosotrosContenido>(
    defaultNosotrosContenido
  );

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
        const data = await getNosotrosContenido();
        setForm(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el contenido de la página Nosotros.");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const completionScore = useMemo(() => {
    const values = [
      form.heroLabel,
      form.heroTitle,
      form.heroDescription,
      form.focusLabel,
      form.focusTitle,
      form.focusParagraphOne,
      form.focusParagraphTwo,
      form.pillarOneTitle,
      form.pillarOneDescription,
      form.pillarTwoTitle,
      form.pillarTwoDescription,
      form.pillarThreeTitle,
      form.pillarThreeDescription,
      form.pillarFourTitle,
      form.pillarFourDescription,
      form.teamLabel,
      form.teamTitle,
      form.teamDescription,
    ];

    const completed = values.filter((value) => value.trim().length > 0).length;

    return Math.round((completed / values.length) * 100);
  }, [form]);

  const totalWords = useMemo(() => {
    return Object.values(form)
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [form]);

  const updateField = (field: keyof NosotrosContenido, value: string) => {
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
      await updateNosotrosContenido(form);
      setStatusMessage("Contenido actualizado correctamente.");
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

    setForm(defaultNosotrosContenido);
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
      title="Página Nosotros"
      description="Edita los textos principales de la página pública Nosotros: hero, enfoque, pilares institucionales y bloque de equipo."
      userEmail={user?.email}
      backHref="/admin/contenido"
      backLabel="Volver a contenido"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="nosotros-content-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="nosotros-content-form" onSubmit={handleSave}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/contenido"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              Volver a contenido
            </Link>

            <Link
              href="/nosotros"
              target="_blank"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/25 bg-[#009B8D]/10 px-4 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15 hover:text-white"
            >
              <ExternalLink size={16} />
              Ver página pública
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill label={`${totalWords} palabras`} />
            <InfoPill label="Nosotros" />
            <InfoPill label="Contenido público" />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.35fr)_minmax(440px,0.75fr)]">
          <section className="space-y-5">
            <EditorShellCard
              title="Editor de contenido"
              description="Los cambios se verán en /nosotros después de guardar."
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
                  description="Primera impresión de la página Nosotros."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.heroLabel}
                    onChange={(value) => updateField("heroLabel", value)}
                    placeholder="Ej: Nosotros"
                  />

                  <TextArea
                    label="Título principal"
                    value={form.heroTitle}
                    onChange={(value) => updateField("heroTitle", value)}
                    rows={3}
                    placeholder="Título principal de la página"
                  />

                  <TextArea
                    label="Descripción principal"
                    value={form.heroDescription}
                    onChange={(value) =>
                      updateField("heroDescription", value)
                    }
                    rows={4}
                    placeholder="Texto introductorio de la página Nosotros"
                  />
                </EditorSection>

                <EditorSection
                  title="Bloque Enfoque"
                  description="Texto editorial que explica la mirada de Métrica Pública."
                >
                  <TextInput
                    label="Etiqueta de sección"
                    value={form.focusLabel}
                    onChange={(value) => updateField("focusLabel", value)}
                    placeholder="Ej: Nuestro enfoque"
                  />

                  <TextArea
                    label="Título del enfoque"
                    value={form.focusTitle}
                    onChange={(value) => updateField("focusTitle", value)}
                    rows={3}
                    placeholder="Título del bloque de enfoque"
                  />

                  <TextArea
                    label="Párrafo 1"
                    value={form.focusParagraphOne}
                    onChange={(value) =>
                      updateField("focusParagraphOne", value)
                    }
                    rows={4}
                    placeholder="Primer párrafo del enfoque"
                  />

                  <TextArea
                    label="Párrafo 2"
                    value={form.focusParagraphTwo}
                    onChange={(value) =>
                      updateField("focusParagraphTwo", value)
                    }
                    rows={4}
                    placeholder="Segundo párrafo del enfoque"
                  />
                </EditorSection>

                <EditorSection
                  title="Pilares"
                  description="Cuatro pilares que se muestran como tarjetas en la página pública."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <PillarEditor
                      number="01"
                      titleLabel="Pilar 1"
                      titleValue={form.pillarOneTitle}
                      descriptionLabel="Descripción pilar 1"
                      descriptionValue={form.pillarOneDescription}
                      onTitleChange={(value) =>
                        updateField("pillarOneTitle", value)
                      }
                      onDescriptionChange={(value) =>
                        updateField("pillarOneDescription", value)
                      }
                    />

                    <PillarEditor
                      number="02"
                      titleLabel="Pilar 2"
                      titleValue={form.pillarTwoTitle}
                      descriptionLabel="Descripción pilar 2"
                      descriptionValue={form.pillarTwoDescription}
                      onTitleChange={(value) =>
                        updateField("pillarTwoTitle", value)
                      }
                      onDescriptionChange={(value) =>
                        updateField("pillarTwoDescription", value)
                      }
                    />

                    <PillarEditor
                      number="03"
                      titleLabel="Pilar 3"
                      titleValue={form.pillarThreeTitle}
                      descriptionLabel="Descripción pilar 3"
                      descriptionValue={form.pillarThreeDescription}
                      onTitleChange={(value) =>
                        updateField("pillarThreeTitle", value)
                      }
                      onDescriptionChange={(value) =>
                        updateField("pillarThreeDescription", value)
                      }
                    />

                    <PillarEditor
                      number="04"
                      titleLabel="Pilar 4"
                      titleValue={form.pillarFourTitle}
                      descriptionLabel="Descripción pilar 4"
                      descriptionValue={form.pillarFourDescription}
                      onTitleChange={(value) =>
                        updateField("pillarFourTitle", value)
                      }
                      onDescriptionChange={(value) =>
                        updateField("pillarFourDescription", value)
                      }
                    />
                  </div>
                </EditorSection>

                <EditorSection
                  title="Bloque Equipo"
                  description="Encabezado de la sección donde se muestran los integrantes activos."
                >
                  <TextInput
                    label="Etiqueta"
                    value={form.teamLabel}
                    onChange={(value) => updateField("teamLabel", value)}
                    placeholder="Ej: Equipo"
                  />

                  <TextArea
                    label="Título de equipo"
                    value={form.teamTitle}
                    onChange={(value) => updateField("teamTitle", value)}
                    rows={3}
                    placeholder="Título de la sección equipo"
                  />

                  <TextArea
                    label="Descripción de equipo"
                    value={form.teamDescription}
                    onChange={(value) =>
                      updateField("teamDescription", value)
                    }
                    rows={4}
                    placeholder="Descripción introductoria del equipo"
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
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
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

function PillarEditor({
  number,
  titleLabel,
  titleValue,
  descriptionLabel,
  descriptionValue,
  onTitleChange,
  onDescriptionChange,
}: {
  number: string;
  titleLabel: string;
  titleValue: string;
  descriptionLabel: string;
  descriptionValue: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1628]/60 p-4">
      <div className="mb-4 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
        Pilar {number}
      </div>

      <div className="grid gap-4">
        <TextInput
          label={titleLabel}
          value={titleValue}
          onChange={onTitleChange}
          placeholder="Título del pilar"
        />

        <TextArea
          label={descriptionLabel}
          value={descriptionValue}
          onChange={onDescriptionChange}
          rows={4}
          placeholder="Descripción del pilar"
        />
      </div>
    </div>
  );
}

function PreviewPanel({ form }: { form: NosotrosContenido }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="relative overflow-hidden bg-linear-to-br from-[#08111f] to-[#0f2744] p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#009B8D]/10 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#009B8D]">
            {form.heroLabel || "Nosotros"}
          </p>

          <h2 className="wrap-anywhere text-4xl font-black leading-tight">
            {form.heroTitle || "Título principal"}
          </h2>

          <p className="mt-5 wrap-anywhere leading-8 text-slate-300">
            {form.heroDescription || "Descripción principal"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 2xl:grid-cols-1">
            <PreviewStat label="Enfoque" value="Evidencia" />
            <PreviewStat label="Trabajo" value="Territorio" />
            <PreviewStat label="Decisiones" value="Datos" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-[#08111f]/80 p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
            {form.focusLabel || "Enfoque"}
          </p>

          <h3 className="wrap-anywhere text-2xl font-black">
            {form.focusTitle || "Título del enfoque"}
          </h3>

          <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
            {form.focusParagraphOne || "Primer párrafo del enfoque."}
          </p>

          <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
            {form.focusParagraphTwo || "Segundo párrafo del enfoque."}
          </p>
        </div>

        <div className="grid gap-4">
          {previewPillars.map(({ Icon, titleKey, descriptionKey }) => (
            <div
              key={titleKey}
              className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/80 p-5"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D]/15">
                <Icon size={20} className="text-[#20d6c7]" />
              </div>

              <h4 className="wrap-anywhere font-black">
                {form[titleKey] || "Título del pilar"}
              </h4>

              <p className="mt-2 wrap-anywhere text-sm leading-6 text-slate-400">
                {form[descriptionKey] || "Descripción del pilar."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#08111f]/80 p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
            {form.teamLabel || "Equipo"}
          </p>

          <h3 className="wrap-anywhere text-2xl font-black">
            {form.teamTitle || "Título equipo"}
          </h3>

          <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
            {form.teamDescription || "Descripción equipo"}
          </p>
        </div>
      </div>
    </section>
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
        <SummaryItem label="Página" value="/nosotros" />
        <SummaryItem label="Estado" value="Editable" />
      </div>
    </section>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744]/80 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
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