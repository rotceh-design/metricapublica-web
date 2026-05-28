"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createIntegranteEquipo, createTeamSlug } from "@/lib/equipo";
import { uploadFeaturedImage } from "@/lib/storage";
import { EquipoFormData } from "@/types/equipo";

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

export default function NuevoIntegranteEquipoPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageProgress, setImageProgress] = useState(0);

  const [form, setForm] = useState<EquipoFormData>({
    name: "",
    slug: "",
    role: "",
    bio: "",
    email: "",
    linkedin: "",
    imageUrl: "",
    imageFit: "cover",
    imagePosition: "center",
    imageAspect: "square",
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

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  const updateField = <T extends keyof EquipoFormData>(
    field: T,
    value: EquipoFormData[T]
  ) => {
    setForm((prev: EquipoFormData) => ({
      ...prev,
      [field]: value,
      ...(field === "name" && !prev.slug
        ? { slug: createTeamSlug(String(value)) }
        : {}),
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Debes seleccionar una imagen válida.");
      return;
    }

    const maxSizeInMB = 20;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(
        `La imagen no puede superar los ${maxSizeInMB}MB. Se optimiza automáticamente antes de subir.`
      );
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageProgress(0);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageProgress(0);

    setForm((prev: EquipoFormData) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let finalImageUrl = form.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadFeaturedImage(
          imageFile,
          "equipo",
          setImageProgress
        );
      }

      await createIntegranteEquipo({
        ...form,
        slug: form.slug || createTeamSlug(form.name),
        imageUrl: finalImageUrl,
      });

      router.push("/admin/equipo");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar el integrante. Revisa Firestore, Storage y tu sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imagePreview || form.imageUrl;

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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Equipo
            </p>

            <h1 className="text-4xl font-bold">Agregar integrante</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Crea perfiles del equipo con foto, cargo, biografía y enlaces.
            </p>
          </div>

          <a
            href="/admin/equipo"
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
            <div className="mb-8 rounded-2xl border border-[#009B8D]/15 bg-[#08111f]/70 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Fotografía
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Sube una foto del integrante. Se optimiza automáticamente para
                reducir peso antes de guardarse.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/35 bg-[#009B8D]/5 px-6 py-10 text-center transition hover:bg-[#009B8D]/10">
                <span className="mb-3 text-4xl">📷</span>

                <span className="font-bold text-white">
                  Seleccionar fotografía
                </span>

                <span className="mt-1 text-sm text-slate-400">
                  JPG, PNG o WebP · máximo 20MB · se optimiza automáticamente
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {displayImage && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]">
                  <div className={aspectClasses[form.imageAspect]}>
                    <img
                      src={displayImage}
                      alt="Vista previa del integrante"
                      className="h-full w-full bg-[#08111f]"
                      style={{
                        objectFit: form.imageFit,
                        objectPosition: form.imagePosition,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4">
                    <p className="text-sm text-slate-400">
                      Vista previa de fotografía
                    </p>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Forma
                  </label>

                  <select
                    value={form.imageAspect}
                    onChange={(event) =>
                      updateField(
                        "imageAspect",
                        event.target.value as EquipoFormData["imageAspect"]
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#10243d] px-4 py-3 text-sm outline-none focus:border-[#009B8D]"
                  >
                    <option value="square">Cuadrada</option>
                    <option value="portrait">Vertical</option>
                    <option value="wide">Panorámica</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Ajuste
                  </label>

                  <select
                    value={form.imageFit}
                    onChange={(event) =>
                      updateField(
                        "imageFit",
                        event.target.value as EquipoFormData["imageFit"]
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#10243d] px-4 py-3 text-sm outline-none focus:border-[#009B8D]"
                  >
                    <option value="cover">Cubrir / recortar</option>
                    <option value="contain">Mostrar completa</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Posición
                  </label>

                  <select
                    value={form.imagePosition}
                    onChange={(event) =>
                      updateField(
                        "imagePosition",
                        event.target
                          .value as EquipoFormData["imagePosition"]
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#10243d] px-4 py-3 text-sm outline-none focus:border-[#009B8D]"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </div>

              {loading && imageFile && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Subiendo fotografía optimizada...</span>
                    <span>{imageProgress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#009B8D] transition-all"
                      style={{ width: `${imageProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre
                </label>

                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ej: Camila González"
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
                    updateField("slug", createTeamSlug(event.target.value))
                  }
                  placeholder="camila-gonzalez"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />

                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL final: /equipo/{form.slug || "integrante"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_160px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Cargo
                  </label>

                  <input
                    value={form.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    placeholder="Ej: Directora de estudios"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                    required
                  />
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

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Correo
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="correo@metricapublica.cl"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    LinkedIn
                  </label>

                  <input
                    value={form.linkedin}
                    onChange={(event) =>
                      updateField("linkedin", event.target.value)
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Biografía
                </label>

                <textarea
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  placeholder="Describe la experiencia, rol y especialidad del integrante..."
                  rows={8}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#08111f]/70 p-5">
                  <div>
                    <p className="font-semibold text-white">
                      Integrante activo
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
                      Integrante destacado
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
                disabled={loading}
                className="rounded-xl bg-[#009B8D] px-6 py-4 font-bold transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Guardando integrante..." : "Guardar integrante"}
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] shadow-2xl">
              <div className="relative bg-linear-to-br from-[#08111f] to-[#0f2744] p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mx-auto mb-6 max-w-[260px] overflow-hidden rounded-3xl border border-[#009B8D]/20 bg-[#08111f]">
                    <div className={aspectClasses[form.imageAspect]}>
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt="Preview"
                          className="h-full w-full"
                          style={{
                            objectFit: form.imageFit,
                            objectPosition: form.imagePosition,
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#009B8D]">
                          MP
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-5 flex justify-center gap-2">
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

                  <h2 className="wrap-anywhere text-center text-3xl font-bold leading-tight">
                    {form.name || "Nombre del integrante"}
                  </h2>

                  <p className="mt-3 wrap-anywhere text-center font-semibold text-[#009B8D]">
                    {form.role || "Cargo del integrante"}
                  </p>

                  <p className="mt-5 whitespace-pre-wrap wrap-anywhere text-center text-sm leading-7 text-slate-400">
                    {form.bio ||
                      "Aquí aparecerá la biografía del integrante mientras completas el formulario."}
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