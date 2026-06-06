"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  Activity,
  ArrowLeft,
  FileText,
  ImageIcon,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import { createEstudio, createStudySlug } from "@/lib/estudios";
import { uploadPdfFile } from "@/lib/storage";
import { formatBytes } from "@/lib/image-compression";
import {
  createEmptyImageDraft,
  getLegacyImageFields,
  uploadContentImages,
} from "@/lib/content-images";
import { EstudioFormData, EstudioStatus } from "@/types/estudio";
import {
  AdminImageDraft,
  ContentImage,
  ContentImageAspect,
  ContentImageFit,
  ContentImagePosition,
  ContentImageRole,
} from "@/types/content-image";

const aspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
} as const;

type EstudioEditorForm = EstudioFormData & {
  images?: ContentImage[];
};

type ImageSlot = {
  label: string;
  shortLabel: string;
  placement: string;
  description: string;
};

const imageSlots: ImageSlot[] = [
  {
    label: "Foto principal",
    shortLabel: "Portada",
    placement: "Arriba del estudio",
    description:
      "Imagen principal del estudio. También se usará en listados, tarjetas y portada pública.",
  },
  {
    label: "Foto secundaria",
    shortLabel: "Apoyo",
    placement: "Dentro del desarrollo",
    description:
      "Imagen de apoyo para reforzar visualmente el contenido, hallazgos o contexto del estudio.",
  },
];

function makeImageDraft(order: number): AdminImageDraft {
  const draft = createEmptyImageDraft(order);
  const role: ContentImageRole = order === 0 ? "cover" : "gallery";

  return {
    ...draft,
    aspect: "wide",
    fit: "contain",
    position: "center",
    order,
    role,
  };
}

export default function NuevoEstudioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState<EstudioEditorForm>({
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
    imageFit: "contain",
    imagePosition: "center",
    imageAspect: "wide",
    methodology: "",
    sample: "",
    fieldworkDate: "",
    images: [],
  });

  const [imageDrafts, setImageDrafts] = useState<AdminImageDraft[]>([
    makeImageDraft(0),
    makeImageDraft(1),
  ]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfProgress, setPdfProgress] = useState(0);

  const [imageUploadProgress, setImageUploadProgress] = useState({
    index: 0,
    progress: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedImages = useMemo(() => {
    return normalizeDrafts(imageDrafts);
  }, [imageDrafts]);

  const selectedImage =
    normalizedImages[selectedImageIndex] || normalizedImages[0];

  const selectedSlot = imageSlots[selectedImageIndex] || imageSlots[0];

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

  const readingTime = useMemo(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));

    return `${minutes} min de lectura`;
  }, [form.content]);

  const wordCount = useMemo(() => {
    return form.content.trim().split(/\s+/).filter(Boolean).length;
  }, [form.content]);

  const imagesCount = useMemo(() => {
    return normalizedImages.filter(
      (image) => image.url || image.previewUrl || image.file
    ).length;
  }, [normalizedImages]);

  const completionScore = useMemo(() => {
    const checks = [
      form.title.trim().length > 0,
      form.slug.trim().length > 0,
      form.summary.trim().length > 0,
      form.content.trim().length > 0,
      form.category.trim().length > 0,
      form.year.trim().length > 0,
      Boolean(form.pdfName || pdfFile),
      imagesCount > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [form, pdfFile, imagesCount]);

  const updateField = <T extends keyof EstudioEditorForm>(
    field: T,
    value: EstudioEditorForm[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createStudySlug(String(value)) }
        : {}),
    }));
  };

  const updateImage = (index: number, patch: Partial<AdminImageDraft>) => {
    const nextImages: AdminImageDraft[] = normalizedImages.map(
      (image, imageIndex) => {
        const role: ContentImageRole = imageIndex === 0 ? "cover" : "gallery";

        if (imageIndex !== index) {
          return {
            ...image,
            order: imageIndex,
            role,
          };
        }

        return {
          ...image,
          ...patch,
          order: imageIndex,
          role,
        };
      }
    );

    setImageDrafts(normalizeDrafts(nextImages));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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
        `Cada imagen no puede superar los ${maxSizeInMB}MB. Se optimiza automáticamente antes de subir.`
      );
      return;
    }

    const previousPreview = normalizedImages[index]?.previewUrl;

    if (previousPreview) {
      URL.revokeObjectURL(previousPreview);
    }

    updateImage(index, {
      file,
      previewUrl: URL.createObjectURL(file),
      fit: normalizedImages[index]?.fit || "contain",
      position: normalizedImages[index]?.position || "center",
    });

    setSelectedImageIndex(index);
  };

  const clearImage = (index: number) => {
    const currentPreview = normalizedImages[index]?.previewUrl;

    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    updateImage(index, {
      url: "",
      file: undefined,
      previewUrl: "",
      alt: "",
      fit: "contain",
      position: "center",
    });
  };

  const resetImageSettings = (index: number) => {
    updateImage(index, {
      aspect: "wide",
      fit: "contain",
      position: "center",
    });
  };

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    setForm((prev) => ({
      ...prev,
      pdfName: file.name,
    }));
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfProgress(0);

    setForm((prev) => ({
      ...prev,
      pdfUrl: "",
      pdfName: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const uploadedImages = await uploadContentImages({
        drafts: normalizedImages,
        folder: "estudios",
        setProgress: setImageUploadProgress,
      });

      const legacyImageFields = getLegacyImageFields(uploadedImages);

      let finalPdfUrl = form.pdfUrl;
      let finalPdfName = form.pdfName;

      if (pdfFile) {
        const uploadedPdf = await uploadPdfFile(
          pdfFile,
          "estudios-pdf",
          setPdfProgress
        );

        finalPdfUrl = uploadedPdf.url;
        finalPdfName = uploadedPdf.name;
      }

      const payload = {
        ...form,
        ...legacyImageFields,
        slug: form.slug || createStudySlug(form.title),
        status: form.status as EstudioStatus,
        images: uploadedImages,
        pdfUrl: finalPdfUrl,
        pdfName: finalPdfName,
      };

      await createEstudio(payload);

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

          <p className="font-semibold text-slate-400">
            Verificando acceso...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AdminEditorShell
      title="Crear estudio"
      description="Construye una publicación descargable con portada, imagen de apoyo, PDF, ficha técnica y contenido descriptivo."
      userEmail={user?.email}
      backHref="/admin/estudios"
      backLabel="Volver a estudios"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="new-estudio-form"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="new-estudio-form" onSubmit={handleSubmit}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/estudios"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={16} />
              Volver a estudios
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${wordCount} palabras`} />
            <InfoPill label={readingTime} />
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill
              label={form.status === "published" ? "Publicado" : "Borrador"}
            />
            <InfoPill label={`${imagesCount} imágenes`} />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.45fr)_minmax(420px,0.65fr)]">
          <section className="space-y-5">
            <EditableStudyPublication
              form={form}
              images={normalizedImages}
              selectedImageIndex={selectedImageIndex}
              pdfFile={pdfFile}
              onSelectImage={setSelectedImageIndex}
              onImageChange={handleImageChange}
              onPdfChange={handlePdfChange}
              onRemovePdf={removePdf}
              onUpdateField={updateField}
            />

            {loading && imageUploadProgress.total > 0 && (
              <ProgressPanel
                label={`Subiendo imagen ${imageUploadProgress.index + 1} de ${
                  imageUploadProgress.total
                }`}
                progress={imageUploadProgress.progress}
              />
            )}

            {loading && pdfFile && (
              <ProgressPanel label="Subiendo PDF" progress={pdfProgress} />
            )}

            {error && (
              <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:h-fit">
            <ImageSettingsPanel
              image={selectedImage}
              slot={selectedSlot}
              index={selectedImageIndex}
              onUpdateImage={updateImage}
              onClearImage={clearImage}
              onResetImage={resetImageSettings}
            />

            <StudySummaryPanel
              slug={form.slug}
              status={form.status}
              category={form.category}
              year={form.year}
              pdfName={form.pdfName}
              methodology={form.methodology}
              sample={form.sample}
              fieldworkDate={form.fieldworkDate}
              completionScore={completionScore}
              imagesCount={imagesCount}
              readingTime={readingTime}
            />
          </aside>
        </div>

        <div className="sticky bottom-4 z-20 mt-5 rounded-[1.7rem] border border-[#009B8D]/15 bg-[#08111f]/95 p-3 shadow-2xl backdrop-blur 2xl:hidden">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {loading ? "Guardando..." : "Guardar estudio"}
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

function EditableStudyPublication({
  form,
  images,
  selectedImageIndex,
  pdfFile,
  onSelectImage,
  onImageChange,
  onPdfChange,
  onRemovePdf,
  onUpdateField,
}: {
  form: EstudioEditorForm;
  images: AdminImageDraft[];
  selectedImageIndex: number;
  pdfFile: File | null;
  onSelectImage: (index: number) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  onPdfChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePdf: () => void;
  onUpdateField: <T extends keyof EstudioEditorForm>(
    field: T,
    value: EstudioEditorForm[T]
  ) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#20d6c7]">
            Estudio editable
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
            Publicaciones
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_130px_180px]">
          <FieldGroup label="Categoría">
            <input
              value={form.category}
              onChange={(event) =>
                onUpdateField("category", event.target.value)
              }
              placeholder="Opinión pública, Territorio..."
              className="field-input"
            />
          </FieldGroup>

          <FieldGroup label="Año">
            <input
              value={form.year}
              onChange={(event) => onUpdateField("year", event.target.value)}
              placeholder="2026"
              className="field-input"
              required
            />
          </FieldGroup>

          <FieldGroup label="Estado">
            <select
              value={form.status}
              onChange={(event) =>
                onUpdateField("status", event.target.value as EstudioStatus)
              }
              className="field-input"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </FieldGroup>
        </div>

        <div className="mt-4">
          <FieldGroup label="Slug / URL">
            <input
              value={form.slug}
              onChange={(event) =>
                onUpdateField("slug", createStudySlug(event.target.value))
              }
              placeholder="estudio-nacional-opinion-publica"
              className="field-input"
              required
            />

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              URL final: /estudios/{form.slug || "mi-estudio"}
            </p>
          </FieldGroup>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <FieldGroup label="Título principal">
          <input
            value={form.title}
            onChange={(event) => onUpdateField("title", event.target.value)}
            placeholder="Ej: Estudio nacional de opinión pública"
            className="field-input text-xl font-black sm:text-2xl"
            required
          />
        </FieldGroup>

        <FieldGroup label="Resumen / bajada">
          <textarea
            value={form.summary}
            onChange={(event) => onUpdateField("summary", event.target.value)}
            placeholder="Escribe una bajada clara del estudio o publicación..."
            rows={4}
            className="field-textarea"
            required
          />
        </FieldGroup>

        <EditableImageSlot
          image={images[0]}
          slot={imageSlots[0]}
          selected={selectedImageIndex === 0}
          main
          onSelect={() => onSelectImage(0)}
          onImageChange={(event) => onImageChange(event, 0)}
        />

        <FichaTecnicaBlock form={form} onUpdateField={onUpdateField} />

        <FieldGroup label="Contenido descriptivo">
          <textarea
            value={form.content}
            onChange={(event) => onUpdateField("content", event.target.value)}
            placeholder="Describe el estudio, principales hallazgos, contexto o explicación general..."
            rows={14}
            className="field-textarea leading-7"
            required
          />
        </FieldGroup>

        <EditableImageSlot
          image={images[1]}
          slot={imageSlots[1]}
          selected={selectedImageIndex === 1}
          onSelect={() => onSelectImage(1)}
          onImageChange={(event) => onImageChange(event, 1)}
        />

        <PdfUploadBlock
          pdfFile={pdfFile}
          pdfName={form.pdfName}
          onPdfChange={onPdfChange}
          onRemovePdf={onRemovePdf}
        />
      </div>
    </section>
  );
}

function FichaTecnicaBlock({
  form,
  onUpdateField,
}: {
  form: EstudioEditorForm;
  onUpdateField: <T extends keyof EstudioEditorForm>(
    field: T,
    value: EstudioEditorForm[T]
  ) => void;
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/10 bg-[#08111f] p-5">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Ficha técnica
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <FieldGroup label="Metodología">
          <input
            value={form.methodology}
            onChange={(event) =>
              onUpdateField("methodology", event.target.value)
            }
            placeholder="Encuesta online, entrevistas..."
            className="field-input"
          />
        </FieldGroup>

        <FieldGroup label="Muestra">
          <input
            value={form.sample}
            onChange={(event) => onUpdateField("sample", event.target.value)}
            placeholder="Ej: 1.200 casos"
            className="field-input"
          />
        </FieldGroup>

        <FieldGroup label="Fecha de terreno">
          <input
            value={form.fieldworkDate}
            onChange={(event) =>
              onUpdateField("fieldworkDate", event.target.value)
            }
            placeholder="Mayo 2026"
            className="field-input"
          />
        </FieldGroup>
      </div>
    </section>
  );
}

function EditableImageSlot({
  image,
  slot,
  selected,
  main = false,
  onSelect,
  onImageChange,
}: {
  image: AdminImageDraft;
  slot: ImageSlot;
  selected: boolean;
  main?: boolean;
  onSelect: () => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const displayImage = image.previewUrl || image.url;
  const aspectClass = getAspectClass(image.aspect, main);

  return (
    <article
      className={`overflow-hidden rounded-[1.7rem] border bg-[#08111f] transition ${
        selected
          ? "border-[#009B8D]/70 shadow-[0_24px_70px_rgba(0,155,141,0.12)]"
          : "border-white/10 hover:border-[#009B8D]/40"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`relative block w-full overflow-hidden bg-[#0a1628] text-left ${aspectClass}`}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={image.alt || slot.label}
            className="h-full w-full"
            style={{
              objectFit: image.fit,
              objectPosition: image.position,
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#009B8D]">
            <ImageIcon size={main ? 46 : 34} />
            <p className="text-sm font-black">Subir {slot.label}</p>
            <p className="max-w-xs text-center text-xs leading-5 text-slate-500">
              {slot.placement}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/80 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <span className="mb-3 inline-flex rounded-full bg-[#009B8D]/90 px-3 py-1 text-xs font-black text-white">
            {slot.placement}
          </span>

          <h3
            className={`${
              main ? "text-2xl" : "text-lg"
            } font-black text-white`}
          >
            {slot.label}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-300">
            {slot.description}
          </p>
        </div>
      </button>

      <div className="border-t border-white/10 bg-[#08111f] p-3">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15">
          <UploadCloud size={17} />
          {displayImage ? "Cambiar imagen" : "Subir imagen"}

          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      </div>
    </article>
  );
}

function PdfUploadBlock({
  pdfFile,
  pdfName,
  onPdfChange,
  onRemovePdf,
}: {
  pdfFile: File | null;
  pdfName: string;
  onPdfChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePdf: () => void;
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/10 bg-[#08111f] p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
          <FileText size={22} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
            Archivo PDF
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Adjunta el informe, estudio o documento descargable. Máximo 15MB.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/30 bg-[#009B8D]/5 px-4 py-8 text-center transition hover:bg-[#009B8D]/10">
        <UploadCloud size={30} className="mb-3 text-[#20d6c7]" />

        <span className="text-sm font-black text-white">
          {pdfName ? "Cambiar PDF" : "Subir PDF"}
        </span>

        <span className="mt-1 text-xs text-slate-500">
          PDF · máximo 15MB · recomendado menos de 5MB
        </span>

        <input
          type="file"
          accept="application/pdf"
          onChange={onPdfChange}
          className="hidden"
        />
      </label>

      {(pdfFile || pdfName) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0a1628] p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="wrap-anywhere font-black text-white">
                {pdfFile?.name || pdfName}
              </p>

              {pdfFile && (
                <p className="mt-1 text-sm text-slate-400">
                  Peso: {formatBytes(pdfFile.size)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onRemovePdf}
              className="rounded-2xl border border-red-500/30 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
            >
              Quitar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ImageSettingsPanel({
  image,
  slot,
  index,
  onUpdateImage,
  onClearImage,
  onResetImage,
}: {
  image: AdminImageDraft;
  slot: ImageSlot;
  index: number;
  onUpdateImage: (index: number, patch: Partial<AdminImageDraft>) => void;
  onClearImage: (index: number) => void;
  onResetImage: (index: number) => void;
}) {
  const hasImage = Boolean(image.url || image.previewUrl || image.file);

  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
          Ajustes de imagen
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">{slot.label}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {slot.description}
        </p>
      </div>

      <div className="grid gap-4">
        <input
          value={image.alt || ""}
          onChange={(event) => onUpdateImage(index, { alt: event.target.value })}
          placeholder="Texto alternativo / descripción breve"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
        />

        <ControlSelect
          label="Formato"
          value={image.aspect}
          onChange={(value) =>
            onUpdateImage(index, {
              aspect: value as ContentImageAspect,
            })
          }
          options={[
            { value: "wide", label: "Panorámica" },
            { value: "square", label: "Cuadrada" },
            { value: "portrait", label: "Vertical" },
          ]}
        />

        <ControlSelect
          label="Ajuste"
          value={image.fit}
          onChange={(value) =>
            onUpdateImage(index, {
              fit: value as ContentImageFit,
            })
          }
          options={[
            { value: "contain", label: "Mostrar completa" },
            { value: "cover", label: "Cubrir / recortar" },
          ]}
        />

        <ControlSelect
          label="Posición"
          value={image.position}
          onChange={(value) =>
            onUpdateImage(index, {
              position: value as ContentImagePosition,
            })
          }
          options={[
            { value: "center", label: "Centro" },
            { value: "top", label: "Arriba" },
            { value: "bottom", label: "Abajo" },
            { value: "left", label: "Izquierda" },
            { value: "right", label: "Derecha" },
          ]}
        />

        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-1">
          <button
            type="button"
            onClick={() => onResetImage(index)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#08111f] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:text-[#20d6c7]"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>

          {hasImage && (
            <button
              type="button"
              onClick={() => onClearImage(index)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Quitar imagen
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function StudySummaryPanel({
  slug,
  status,
  category,
  year,
  pdfName,
  methodology,
  sample,
  fieldworkDate,
  completionScore,
  imagesCount,
  readingTime,
}: {
  slug: string;
  status: string;
  category: string;
  year: string;
  pdfName: string;
  methodology: string;
  sample: string;
  fieldworkDate: string;
  completionScore: number;
  imagesCount: number;
  readingTime: string;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Resumen
      </p>

      <div className="mt-4 space-y-4 text-sm">
        <SummaryItem label="Completitud" value={`${completionScore}%`} />
        <SummaryItem
          label="Estado"
          value={status === "published" ? "Publicado" : "Borrador"}
        />
        <SummaryItem label="Categoría" value={category || "Sin categoría"} />
        <SummaryItem label="Año" value={year || "Sin año"} />
        <SummaryItem label="Lectura" value={readingTime} />
        <SummaryItem label="Imágenes" value={`${imagesCount} de 2`} />
        <SummaryItem label="PDF" value={pdfName || "Sin PDF adjunto"} wrap />
        <SummaryItem
          label="Metodología"
          value={methodology || "No definida"}
          wrap
        />
        <SummaryItem label="Muestra" value={sample || "No definida"} wrap />
        <SummaryItem
          label="Fecha terreno"
          value={fieldworkDate || "No definida"}
          wrap
        />
        <SummaryItem
          label="URL"
          value={`/estudios/${slug || "mi-estudio"}`}
          wrap
        />
      </div>
    </section>
  );
}

function ProgressPanel({
  label,
  progress,
}: {
  label: string;
  progress: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#009B8D] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
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

function ControlSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#10243d] px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-[#009B8D]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}

function normalizeDrafts(images: AdminImageDraft[]): AdminImageDraft[] {
  return Array.from({ length: 2 }, (_, index) => {
    const existing = images[index];
    const fallback = makeImageDraft(index);
    const role: ContentImageRole = index === 0 ? "cover" : "gallery";

    return {
      ...fallback,
      ...existing,
      aspect: existing?.aspect || "wide",
      fit: existing?.fit || "contain",
      position: existing?.position || "center",
      order: index,
      role,
    };
  });
}

function getAspectClass(
  aspect: ContentImageAspect | undefined,
  main: boolean
): string {
  if (!aspect) {
    return main ? "aspect-[16/9]" : "aspect-[16/10]";
  }

  return aspectClasses[aspect] || (main ? "aspect-[16/9]" : "aspect-[16/10]");
}