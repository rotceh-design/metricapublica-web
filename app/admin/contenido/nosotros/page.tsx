"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  BarChart2,
  Compass,
  Handshake,
  Map,
  Save,
  FileText,
} from "lucide-react";

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

  const updateField = (field: keyof NosotrosContenido, value: string) => {
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

            <h1 className="text-4xl font-bold">Página Nosotros</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Edita los textos principales que aparecen en la página pública
              Nosotros. Solo usuarios administradores pueden modificar esta
              información.
            </p>

            <p className="mt-2 wrap-anywhere text-sm text-slate-500">
              Sesión iniciada como{" "}
              <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold transition hover:bg-white/5"
            >
              Volver
            </a>

            <a
              href="/nosotros"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
            >
              Ver página
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
                    Los cambios se verán en /nosotros después de guardar.
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
              </EditorSection>

              <EditorSection title="Bloque Enfoque">
                <TextInput
                  label="Etiqueta de sección"
                  value={form.focusLabel}
                  onChange={(value) => updateField("focusLabel", value)}
                />

                <TextArea
                  label="Título del enfoque"
                  value={form.focusTitle}
                  onChange={(value) => updateField("focusTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Párrafo 1"
                  value={form.focusParagraphOne}
                  onChange={(value) =>
                    updateField("focusParagraphOne", value)
                  }
                  rows={4}
                />

                <TextArea
                  label="Párrafo 2"
                  value={form.focusParagraphTwo}
                  onChange={(value) =>
                    updateField("focusParagraphTwo", value)
                  }
                  rows={4}
                />
              </EditorSection>

              <EditorSection title="Pilares">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <TextInput
                      label="Pilar 1"
                      value={form.pillarOneTitle}
                      onChange={(value) =>
                        updateField("pillarOneTitle", value)
                      }
                    />

                    <TextArea
                      label="Descripción pilar 1"
                      value={form.pillarOneDescription}
                      onChange={(value) =>
                        updateField("pillarOneDescription", value)
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <TextInput
                      label="Pilar 2"
                      value={form.pillarTwoTitle}
                      onChange={(value) =>
                        updateField("pillarTwoTitle", value)
                      }
                    />

                    <TextArea
                      label="Descripción pilar 2"
                      value={form.pillarTwoDescription}
                      onChange={(value) =>
                        updateField("pillarTwoDescription", value)
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <TextInput
                      label="Pilar 3"
                      value={form.pillarThreeTitle}
                      onChange={(value) =>
                        updateField("pillarThreeTitle", value)
                      }
                    />

                    <TextArea
                      label="Descripción pilar 3"
                      value={form.pillarThreeDescription}
                      onChange={(value) =>
                        updateField("pillarThreeDescription", value)
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <TextInput
                      label="Pilar 4"
                      value={form.pillarFourTitle}
                      onChange={(value) =>
                        updateField("pillarFourTitle", value)
                      }
                    />

                    <TextArea
                      label="Descripción pilar 4"
                      value={form.pillarFourDescription}
                      onChange={(value) =>
                        updateField("pillarFourDescription", value)
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </EditorSection>

              <EditorSection title="Bloque Equipo">
                <TextInput
                  label="Etiqueta"
                  value={form.teamLabel}
                  onChange={(value) => updateField("teamLabel", value)}
                />

                <TextArea
                  label="Título de equipo"
                  value={form.teamTitle}
                  onChange={(value) => updateField("teamTitle", value)}
                  rows={3}
                />

                <TextArea
                  label="Descripción de equipo"
                  value={form.teamDescription}
                  onChange={(value) => updateField("teamDescription", value)}
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
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    {form.heroLabel || "Nosotros"}
                  </p>

                  <h2 className="wrap-anywhere text-4xl font-bold leading-tight">
                    {form.heroTitle || "Título principal"}
                  </h2>

                  <p className="mt-5 wrap-anywhere leading-8 text-slate-300">
                    {form.heroDescription || "Descripción principal"}
                  </p>
                </div>
              </div>

              <div className="p-7">
                <div className="mb-6 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    {form.focusLabel || "Enfoque"}
                  </p>

                  <h3 className="wrap-anywhere text-2xl font-bold">
                    {form.focusTitle || "Título del enfoque"}
                  </h3>

                  <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.focusParagraphOne}
                  </p>

                  <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.focusParagraphTwo}
                  </p>
                </div>

                <div className="grid gap-4">
                  {previewPillars.map(({ Icon, titleKey, descriptionKey }) => (
                    <div
                      key={titleKey}
                      className="rounded-2xl border border-white/10 bg-[#08111f]/80 p-5"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D]/15">
                        <Icon size={20} className="text-[#009B8D]" />
                      </div>

                      <h4 className="wrap-anywhere font-bold">
                        {form[titleKey]}
                      </h4>

                      <p className="mt-2 wrap-anywhere text-sm leading-6 text-slate-400">
                        {form[descriptionKey]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    {form.teamLabel || "Equipo"}
                  </p>

                  <h3 className="wrap-anywhere text-2xl font-bold">
                    {form.teamTitle || "Título equipo"}
                  </h3>

                  <p className="mt-4 wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.teamDescription || "Descripción equipo"}
                  </p>
                </div>
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