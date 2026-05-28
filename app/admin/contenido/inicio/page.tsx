"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  FileText,
  Home,
  Save,
  LayoutGrid,
  BarChart2,
  Map,
  Mail,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import {
  defaultInicioContenido,
  getInicioContenido,
  updateInicioContenido,
} from "@/lib/contenido";
import { InicioContenido } from "@/types/contenido";

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

  const updateField = (field: keyof InicioContenido, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
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
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando contenido editable...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Contenido editable
            </p>

            <h1 className="text-4xl font-bold">Página Inicio</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Edita los textos principales del home: hero, servicios, estudios,
              sectores y contacto.
            </p>

            <p className="mt-2 wrap-anywhere text-sm text-slate-500">
              Sesión iniciada como{" "}
              <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/contenido"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold transition hover:bg-white/5"
            >
              Volver
            </a>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
            >
              Ver inicio
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-2xl md:p-8"
          >
            <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#009B8D]/15 bg-[#08111f]/70 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D]/15">
                  <FileText size={24} className="text-[#009B8D]" />
                </div>

                <div>
                  <p className="font-bold">Editor de contenido</p>

                  <p className="text-sm text-slate-500">
                    Los cambios se verán en la página de inicio después de
                    conectar el home a este contenido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetToDefault}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Restaurar base
              </button>
            </div>

            <div className="grid gap-8">
              <EditorSection title="Hero principal">
                <TextInput
                  label="Etiqueta"
                  value={form.heroLabel}
                  onChange={(value) => updateField("heroLabel", value)}
                />

                <TextArea
                  label="Título principal"
                  value={form.heroTitle}
                  onChange={(value) => updateField("heroTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción principal"
                  value={form.heroDescription}
                  onChange={(value) => updateField("heroDescription", value)}
                  rows={4}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput
                    label="Botón principal"
                    value={form.primaryButtonLabel}
                    onChange={(value) =>
                      updateField("primaryButtonLabel", value)
                    }
                  />

                  <TextInput
                    label="URL botón principal"
                    value={form.primaryButtonHref}
                    onChange={(value) =>
                      updateField("primaryButtonHref", value)
                    }
                  />

                  <TextInput
                    label="Botón secundario"
                    value={form.secondaryButtonLabel}
                    onChange={(value) =>
                      updateField("secondaryButtonLabel", value)
                    }
                  />

                  <TextInput
                    label="URL botón secundario"
                    value={form.secondaryButtonHref}
                    onChange={(value) =>
                      updateField("secondaryButtonHref", value)
                    }
                  />
                </div>
              </EditorSection>

              <EditorSection title="Bloque Servicios">
                <TextInput
                  label="Etiqueta"
                  value={form.servicesLabel}
                  onChange={(value) => updateField("servicesLabel", value)}
                />

                <TextArea
                  label="Título"
                  value={form.servicesTitle}
                  onChange={(value) => updateField("servicesTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción"
                  value={form.servicesDescription}
                  onChange={(value) =>
                    updateField("servicesDescription", value)
                  }
                  rows={4}
                />
              </EditorSection>

              <EditorSection title="Bloque Estudios">
                <TextInput
                  label="Etiqueta"
                  value={form.studiesLabel}
                  onChange={(value) => updateField("studiesLabel", value)}
                />

                <TextArea
                  label="Título"
                  value={form.studiesTitle}
                  onChange={(value) => updateField("studiesTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción"
                  value={form.studiesDescription}
                  onChange={(value) =>
                    updateField("studiesDescription", value)
                  }
                  rows={4}
                />
              </EditorSection>

              <EditorSection title="Bloque Sectores">
                <TextInput
                  label="Etiqueta"
                  value={form.sectorsLabel}
                  onChange={(value) => updateField("sectorsLabel", value)}
                />

                <TextArea
                  label="Título"
                  value={form.sectorsTitle}
                  onChange={(value) => updateField("sectorsTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción"
                  value={form.sectorsDescription}
                  onChange={(value) =>
                    updateField("sectorsDescription", value)
                  }
                  rows={4}
                />
              </EditorSection>

              <EditorSection title="Bloque Contacto">
                <TextInput
                  label="Etiqueta"
                  value={form.contactLabel}
                  onChange={(value) => updateField("contactLabel", value)}
                />

                <TextArea
                  label="Título"
                  value={form.contactTitle}
                  onChange={(value) => updateField("contactTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción"
                  value={form.contactDescription}
                  onChange={(value) =>
                    updateField("contactDescription", value)
                  }
                  rows={4}
                />
              </EditorSection>

              {statusMessage && (
                <div className="rounded-xl border border-[#009B8D]/30 bg-[#009B8D]/10 px-4 py-3 text-sm text-slate-200">
                  {statusMessage}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#009B8D] px-6 py-4 font-bold transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Guardando contenido..." : "Guardar contenido"}
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] shadow-2xl">
              <div className="relative overflow-hidden bg-linear-to-br from-[#08111f] to-[#0f2744] p-8">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009B8D]/15">
                    <Home size={28} className="text-[#009B8D]" />
                  </div>

                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    {form.heroLabel || "Inicio"}
                  </p>

                  <h2 className="wrap-anywhere text-4xl font-bold leading-tight">
                    {form.heroTitle || "Título principal"}
                  </h2>

                  <p className="mt-5 wrap-anywhere leading-8 text-slate-300">
                    {form.heroDescription || "Descripción principal"}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <span className="rounded-xl bg-[#009B8D] px-5 py-3 text-center text-sm font-bold text-white">
                      {form.primaryButtonLabel || "Botón principal"}
                    </span>

                    <span className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white">
                      {form.secondaryButtonLabel || "Botón secundario"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-7">
                <PreviewBlock
                  Icon={LayoutGrid}
                  label={form.servicesLabel}
                  title={form.servicesTitle}
                  description={form.servicesDescription}
                />

                <PreviewBlock
                  Icon={BarChart2}
                  label={form.studiesLabel}
                  title={form.studiesTitle}
                  description={form.studiesDescription}
                />

                <PreviewBlock
                  Icon={Map}
                  label={form.sectorsLabel}
                  title={form.sectorsTitle}
                  description={form.sectorsDescription}
                />

                <PreviewBlock
                  Icon={Mail}
                  label={form.contactLabel}
                  title={form.contactTitle}
                  description={form.contactDescription}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function EditorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#08111f]/50 p-5">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>

      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
      />
    </div>
  );
}

function PreviewBlock({
  Icon,
  label,
  title,
  description,
}: {
  Icon: React.ElementType;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D]/15">
        <Icon size={20} className="text-[#009B8D]" />
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
        {label}
      </p>

      <h4 className="wrap-anywhere font-bold">{title}</h4>

      <p className="mt-2 wrap-anywhere text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}