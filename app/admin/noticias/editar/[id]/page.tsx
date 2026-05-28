"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createSlug, getNoticia, updateNoticia } from "@/lib/noticias";
import { uploadFeaturedImage } from "@/lib/storage";
import { NoticiaFormData, NoticiaStatus } from "@/types/noticia";

const aspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function EditarNoticiaPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [form, setForm] = useState<NoticiaFormData>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    status: "draft",
    imageUrl: "",
    imageFit: "cover",
    imagePosition: "center",
    imageAspect: "wide",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const readingTime = useMemo(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));

    return `${minutes} min de lectura`;
  }, [form.content]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      const noticia = await getNoticia(id);

      if (!noticia) {
        router.push("/admin/noticias");
        return;
      }

      setForm({
        title: noticia.title || "",
        slug: noticia.slug || "",
        summary: noticia.summary || "",
        content: noticia.content || "",
        category: noticia.category || "",
        status: noticia.status || "draft",
        imageUrl: noticia.imageUrl || "",
        imageFit: noticia.imageFit || "cover",
        imagePosition: noticia.imagePosition || "center",
        imageAspect: noticia.imageAspect || "wide",
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  const updateField = (field: keyof NoticiaFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug ? { slug: createSlug(value) } : {}),
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

    const maxSizeInMB = 6;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`La imagen no puede superar los ${maxSizeInMB}MB.`);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadProgress(0);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);

    setForm((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      let finalImageUrl = form.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadFeaturedImage(
          imageFile,
          "noticias",
          setUploadProgress
        );
      }

      await updateNoticia(id, {
        ...form,
        slug: form.slug || createSlug(form.title),
        status: form.status as NoticiaStatus,
        imageUrl: finalImageUrl,
      });

      router.push("/admin/noticias");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar la noticia. Revisa Firebase Storage, Firestore y tu sesión."
      );
    } finally {
      setSaving(false);
    }
  };

  const displayImage = imagePreview || form.imageUrl;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando noticia...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Noticias
            </p>

            <h1 className="text-4xl font-bold">Editar noticia</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Modifica el contenido, estado, imagen destacada y configuración
              visual de esta publicación.
            </p>
          </div>

          <a
            href="/admin/noticias"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold transition hover:bg-white/5"
          >
            Volver
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-2xl md:p-8"
          >
            <div className="mb-8 rounded-2xl border border-[#009B8D]/15 bg-[#08111f]/70 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Imagen destacada
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Cambia la imagen desde tu computador o celular. También puedes
                ajustar forma, recorte y posición.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/35 bg-[#009B8D]/5 px-6 py-10 text-center transition hover:bg-[#009B8D]/10">
                <span className="mb-3 text-4xl">📸</span>

                <span className="font-bold text-white">
                  Seleccionar nueva imagen
                </span>

                <span className="mt-1 text-sm text-slate-400">
                  JPG, PNG o WebP · máximo 6MB
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
                      alt="Vista previa de la noticia"
                      className="h-full w-full bg-[#08111f]"
                      style={{
                        objectFit: form.imageFit,
                        objectPosition: form.imagePosition,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4">
                    <p className="text-sm text-slate-400">
                      Vista previa de imagen destacada
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
                      updateField("imageAspect", event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#10243d] px-4 py-3 text-sm outline-none focus:border-[#009B8D]"
                  >
                    <option value="wide">Panorámica</option>
                    <option value="square">Cuadrada</option>
                    <option value="portrait">Vertical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Ajuste
                  </label>

                  <select
                    value={form.imageFit}
                    onChange={(event) =>
                      updateField("imageFit", event.target.value)
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
                      updateField("imagePosition", event.target.value)
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

              {saving && imageFile && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Subiendo imagen...</span>
                    <span>{uploadProgress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#009B8D] transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Título
                </label>

                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Ej: Nueva medición de opinión pública"
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
                    updateField("slug", createSlug(event.target.value))
                  }
                  placeholder="nueva-medicion-opinion-publica"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />

                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL final: /noticias/{form.slug || "mi-noticia"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Categoría
                  </label>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="Institucional, Análisis, Territorio..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Estado
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#10243d] px-4 py-3 outline-none focus:border-[#009B8D]"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Resumen / bajada
                </label>

                <textarea
                  value={form.summary}
                  onChange={(event) =>
                    updateField("summary", event.target.value)
                  }
                  placeholder="Escribe una bajada breve y atractiva para la noticia..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Contenido principal
                </label>

                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  placeholder="Desarrolla la noticia completa. Puedes separar párrafos con saltos de línea..."
                  rows={13}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
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
              <div
                className={`relative overflow-hidden bg-[#08111f] ${aspectClasses[form.imageAspect]}`}
              >
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
                  <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#009B8D]">
                    MP
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-[#0f2744] via-[#0f2744]/30 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <span className="rounded-full bg-[#009B8D] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {form.category || "Categoría"}
                  </span>

                  <h2 className="mt-4 wrap-anywhere text-3xl font-bold leading-tight">
                    {form.title || "Título de la noticia"}
                  </h2>
                </div>
              </div>

              <div className="p-7">
                <div className="mb-5 flex flex-wrap gap-3 wrap-anywhere text-sm text-slate-400">
                  <span>
                    {form.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                  <span>•</span>
                  <span>{readingTime}</span>
                  <span>•</span>
                  <span>/noticias/{form.slug || "slug"}</span>
                </div>

                <p className="mb-6 wrap-anywhere text-lg leading-8 text-slate-300">
                  {form.summary ||
                    "Aquí aparecerá la bajada de la noticia. Debe ser clara, atractiva y resumir el valor del contenido."}
                </p>

                <div className="rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    Vista previa del contenido
                  </p>

                  <div className="max-h-72 overflow-hidden whitespace-pre-wrap wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.content ||
                      "El contenido de la noticia aparecerá aquí mientras escribes. Esto ayuda a visualizar cómo se verá antes de publicar."}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}