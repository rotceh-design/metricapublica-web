"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createEstudio, createStudySlug } from "@/lib/estudios";
import { uploadFeaturedImage, uploadPdfFile } from "@/lib/storage";
import { formatBytes } from "@/lib/image-compression";
import { EstudioFormData, EstudioStatus } from "@/types/estudio";

const aspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function NuevoEstudioPage() {
  const router = useRouter();

  const [form, setForm] = useState<EstudioFormData>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    year: new Date().getFullYear().toString(),
    status: "draft",
    imageUrl: "",
    pdfUrl: "",
    pdfName: "",
    imageFit: "cover",
    imagePosition: "center",
    imageAspect: "wide",
    methodology: "",
    sample: "",
    fieldworkDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [imageProgress, setImageProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const readingTime = useMemo(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));

    return `${minutes} min de lectura`;
  }, [form.content]);

  const updateField = <T extends keyof EstudioFormData>(
    field: T,
    value: EstudioFormData[T]
  ) => {
    setForm((prev: EstudioFormData) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createStudySlug(String(value)) }
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

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Debes seleccionar un archivo PDF.");
      return;
    }

    const maxSizeInMB = 15;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`El PDF no puede superar los ${maxSizeInMB}MB.`);
      return;
    }

    setPdfFile(file);
    setPdfProgress(0);

    setForm((prev: EstudioFormData) => ({
      ...prev,
      pdfName: file.name,
    }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageProgress(0);

    setForm((prev: EstudioFormData) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfProgress(0);

    setForm((prev: EstudioFormData) => ({
      ...prev,
      pdfUrl: "",
      pdfName: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let finalImageUrl = form.imageUrl;
      let finalPdfUrl = form.pdfUrl;
      let finalPdfName = form.pdfName;

      if (imageFile) {
        finalImageUrl = await uploadFeaturedImage(
          imageFile,
          "estudios",
          setImageProgress
        );
      }

      if (pdfFile) {
        const uploadedPdf = await uploadPdfFile(
          pdfFile,
          "estudios-pdf",
          setPdfProgress
        );

        finalPdfUrl = uploadedPdf.url;
        finalPdfName = uploadedPdf.name;
      }

      await createEstudio({
        ...form,
        slug: form.slug || createStudySlug(form.title),
        status: form.status as EstudioStatus,
        imageUrl: finalImageUrl,
        pdfUrl: finalPdfUrl,
        pdfName: finalPdfName,
      });

      router.push("/admin/estudios");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar el estudio. Revisa Firebase Storage, Firestore y tu sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imagePreview || form.imageUrl;

  return (
    <main className="min-h-screen bg-[#0a1628] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Estudios / Publicaciones
            </p>

            <h1 className="text-4xl font-bold">Crear nuevo estudio</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Publica estudios, informes y documentos descargables con imagen,
              PDF, ficha técnica y contenido descriptivo.
            </p>
          </div>

          <a
            href="/admin/estudios"
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
                Sube una imagen desde tu computador o celular. Se optimiza
                automáticamente para reducir peso antes de guardarla en Storage.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/35 bg-[#009B8D]/5 px-6 py-10 text-center transition hover:bg-[#009B8D]/10">
                <span className="mb-3 text-4xl">🖼️</span>

                <span className="font-bold text-white">
                  Seleccionar imagen
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
                  <div className={aspectClasses[form.imageAspect as keyof typeof aspectClasses]}>
                    <img
                      src={displayImage}
                      alt="Vista previa del estudio"
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
                      updateField(
                        "imageAspect",
                        event.target.value as EstudioFormData["imageAspect"]
                      )
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
                      updateField(
                        "imageFit",
                        event.target.value as EstudioFormData["imageFit"]
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
                          .value as EstudioFormData["imagePosition"]
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
                    <span>Subiendo imagen optimizada...</span>
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

            <div className="mb-8 rounded-2xl border border-[#009B8D]/15 bg-[#08111f]/70 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Archivo PDF
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Adjunta el informe, estudio o documento descargable en formato
                PDF. Máximo 30MB.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/35 bg-[#009B8D]/5 px-6 py-10 text-center transition hover:bg-[#009B8D]/10">
                <span className="mb-3 text-4xl">📄</span>

                <span className="font-bold text-white">Seleccionar PDF</span>

                <span className="mt-1 text-sm text-slate-400">
                  PDF. Máximo 15MB. Recomendado menos de 5MB para carga rápida.
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </label>

              {(pdfFile || form.pdfName) && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0a1628] p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="wrap-anywhere font-semibold text-white">
                        {pdfFile?.name || form.pdfName}
                      </p>

                      {pdfFile && (
                        <p className="mt-1 text-sm text-slate-400">
                          Peso: {formatBytes(pdfFile.size)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={removePdf}
                      className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}

              {loading && pdfFile && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Subiendo PDF...</span>
                    <span>{pdfProgress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#009B8D] transition-all"
                      style={{ width: `${pdfProgress}%` }}
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
                  placeholder="Ej: Estudio nacional de opinión pública"
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
                    updateField("slug", createStudySlug(event.target.value))
                  }
                  placeholder="estudio-nacional-opinion-publica"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />

                <p className="mt-2 wrap-anywhere text-xs text-slate-500">
                  URL final: /estudios/{form.slug || "mi-estudio"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Categoría
                  </label>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="Opinión pública, Territorio..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Año
                  </label>

                  <input
                    value={form.year}
                    onChange={(event) => updateField("year", event.target.value)}
                    placeholder="2026"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Estado
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as EstudioStatus
                      )
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
                  placeholder="Escribe una bajada clara del estudio o publicación..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Metodología
                  </label>

                  <input
                    value={form.methodology}
                    onChange={(event) =>
                      updateField("methodology", event.target.value)
                    }
                    placeholder="Encuesta online, entrevistas..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Muestra
                  </label>

                  <input
                    value={form.sample}
                    onChange={(event) =>
                      updateField("sample", event.target.value)
                    }
                    placeholder="Ej: 1.200 casos"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Fecha de terreno
                  </label>

                  <input
                    value={form.fieldworkDate}
                    onChange={(event) =>
                      updateField("fieldworkDate", event.target.value)
                    }
                    placeholder="Mayo 2026"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Contenido descriptivo
                </label>

                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  placeholder="Describe el estudio, principales hallazgos, contexto o explicación general..."
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
                disabled={loading}
                className="rounded-xl bg-[#009B8D] px-6 py-4 font-bold transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Guardando estudio..." : "Guardar estudio"}
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] shadow-2xl">
              <div
                className={`relative overflow-hidden bg-[#08111f] ${aspectClasses[form.imageAspect as keyof typeof aspectClasses]}`}
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
                    {form.title || "Título del estudio"}
                  </h2>
                </div>
              </div>

              <div className="p-7">
                <div className="mb-5 flex flex-wrap gap-3 wrap-anywhere text-sm text-slate-400">
                  <span>
                    {form.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                  <span>•</span>
                  <span>{form.year || "Año"}</span>
                  <span>•</span>
                  <span>{readingTime}</span>
                </div>

                <p className="mb-6 wrap-anywhere text-lg leading-8 text-slate-300">
                  {form.summary ||
                    "Aquí aparecerá la bajada del estudio. Debe explicar claramente el valor de la publicación."}
                </p>

                <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5 text-sm">
                  <div>
                    <p className="text-slate-500">Metodología</p>
                    <p className="wrap-anywhere font-semibold text-white">
                      {form.methodology || "No definida"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Muestra</p>
                    <p className="wrap-anywhere font-semibold text-white">
                      {form.sample || "No definida"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Fecha de terreno</p>
                    <p className="wrap-anywhere font-semibold text-white">
                      {form.fieldworkDate || "No definida"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">PDF</p>
                    <p className="wrap-anywhere font-semibold text-white">
                      {form.pdfName || "Sin PDF adjunto"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    Vista previa del contenido
                  </p>

                  <div className="max-h-72 overflow-hidden whitespace-pre-wrap wrap-anywhere text-sm leading-7 text-slate-400">
                    {form.content ||
                      "El contenido del estudio aparecerá aquí mientras escribes."}
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