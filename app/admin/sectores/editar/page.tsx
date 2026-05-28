"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import SectorIcon, { sectorIconOptions } from "@/components/icons/SectorIcons";
import { auth } from "@/lib/firebase";
import {
  createSectorSlug,
  getSector,
  updateSector,
} from "@/lib/sectores";
import { SectorFormData } from "@/types/sector";

export default function EditarSectorPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<SectorFormData>({
    title: "",
    slug: "",
    description: "",
    iconKey: "gobierno",
    order: 1,
    active: true,
    featured: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      const sector = await getSector(id);

      if (!sector) {
        router.push("/admin/sectores");
        return;
      }

      setForm({
        title: sector.title || "",
        slug: sector.slug || "",
        description: sector.description || "",
        iconKey: sector.iconKey || "gobierno",
        order: sector.order || 1,
        active: sector.active ?? true,
        featured: sector.featured ?? true,
      });

      setChecking(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  const updateField = <T extends keyof SectorFormData>(
    field: T,
    value: SectorFormData[T]
  ) => {
    setForm((prev: SectorFormData) => ({
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
      await updateSector(id, {
        ...form,
        slug: form.slug || createSectorSlug(form.title),
      });

      router.push("/admin/sectores");
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar el sector. Revisa Firestore y tu sesión.");
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando sector...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Sectores
            </p>

            <h1 className="text-4xl font-bold">Editar sector</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Modifica el nombre, descripción, ícono, orden y estado del sector.
            </p>
          </div>

          <a
            href="/admin/sectores"
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
                  Nombre del sector
                </label>

                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
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
                    updateField("slug", createSectorSlug(event.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />

                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL futura: /sectores/{form.slug || "mi-sector"}
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-300">
                  Ícono
                </label>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sectorIconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("iconKey", option.value)}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        form.iconKey === option.value
                          ? "border-[#009B8D] bg-[#009B8D]/15"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-[#009B8D]">
                        <SectorIcon iconKey={option.value} className="h-7 w-7" />
                      </div>

                      <span className="text-sm font-semibold text-white">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Descripción
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={6}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
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

                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#08111f]/70 p-5">
                  <div>
                    <p className="font-semibold text-white">Activo</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Visible en la web.
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
                    <p className="font-semibold text-white">Destacado</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Marca visual.
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
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#009B8D]">
                    <SectorIcon iconKey={form.iconKey} />
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
                    {form.title || "Nombre del sector"}
                  </h2>

                  <p className="mt-4 whitespace-pre-wrap wrap-anywhere leading-8 text-slate-300">
                    {form.description ||
                      "Aquí aparecerá la descripción del sector mientras escribes."}
                  </p>

                  <p className="mt-5 wrap-anywhere text-sm text-slate-500">
                    /sectores/{form.slug || "mi-sector"}
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