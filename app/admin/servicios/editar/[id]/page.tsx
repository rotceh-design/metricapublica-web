"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
  createServiceSlug,
  getServicio,
  updateServicio,
} from "@/lib/servicios";
import { ServicioFormData } from "@/types/servicio";

const iconOptions = [
  "📊",
  "🧭",
  "🏛️",
  "🗺️",
  "📈",
  "🧠",
  "💬",
  "🔎",
  "📋",
  "🤝",
  "⚙️",
  "◈",
];

export default function EditarServicioPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [benefitsText, setBenefitsText] = useState("");

  const [form, setForm] = useState<ServicioFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    icon: "📊",
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
        icon: servicio.icon || "📊",
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
      .map((item) => item.trim())
      .filter(Boolean);
  }, [benefitsText]);

  const updateField = <T extends keyof ServicioFormData>(
    field: T,
    value: ServicioFormData[T]
  ) => {
    setForm((prev: ServicioFormData) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createServiceSlug(String(value)) }
        : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      setError(
        "No se pudo guardar el servicio. Revisa Firestore y tu sesión."
      );
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando servicio...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Servicios
            </p>

            <h1 className="text-4xl font-bold">Editar servicio</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Modifica el contenido, orden, estado, ícono y beneficios de este
              servicio.
            </p>
          </div>

          <a
            href="/admin/servicios"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold transition hover:bg-white/5"
          >
            Volver
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-2xl md:p-8"
          >
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Título del servicio
                </label>

                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Ej: Estudios de opinión pública"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Slug / URL
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", createServiceSlug(event.target.value))
                  }
                  placeholder="estudios-de-opinion-publica"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />

                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL final: /servicios/{form.slug || "mi-servicio"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_160px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Ícono
                  </label>

                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => updateField("icon", icon)}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${
                          form.icon === icon
                            ? "border-[#009B8D] bg-[#009B8D]/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Orden
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(event) =>
                      updateField("order", Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#009B8D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Descripción corta
                </label>

                <textarea
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField("shortDescription", event.target.value)
                  }
                  placeholder="Resumen breve que aparecerá en tarjetas y listados..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Descripción completa
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Explica el servicio, su enfoque, utilidad y alcance..."
                  rows={9}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Beneficios
                </label>

                <textarea
                  value={benefitsText}
                  onChange={(event) => setBenefitsText(event.target.value)}
                  placeholder={`Escribe un beneficio por línea:\nDiagnóstico claro\nRecomendaciones accionables\nLectura territorial`}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Cada línea se guardará como un beneficio independiente.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#08111f]/70 p-5">
                  <div>
                    <p className="font-semibold text-white">
                      Servicio activo
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Si está activo, se mostrará en la web pública.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      updateField("active", event.target.checked)
                    }
                    className="h-5 w-5 accent-[#009B8D]"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#08111f]/70 p-5">
                  <div>
                    <p className="font-semibold text-white">
                      Servicio destacado
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Se marcará como relevante dentro del sitio.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField("featured", event.target.checked)
                    }
                    className="h-5 w-5 accent-[#009B8D]"
                  />
                </label>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#009B8D] px-6 py-4 font-bold transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] shadow-2xl">
              <div className="relative overflow-hidden bg-linear-to-br from-[#08111f] to-[#0f2744] p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#009B8D]/25 bg-[#009B8D]/15 text-5xl">
                    {form.icon || "◈"}
                  </div>

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