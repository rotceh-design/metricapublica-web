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
  ImageIcon,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import { createNoticia, createSlug } from "@/lib/noticias";
import {
  createEmptyImageDraft,
  getLegacyImageFields,
  uploadContentImages,
} from "@/lib/content-images";
import { NoticiaFormData, NoticiaStatus } from "@/types/noticia";
import {
  AdminImageDraft,
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
    placement: "Arriba de la noticia",
    description:
      "Imagen principal de la publicación. También se usará en listados y tarjetas.",
  },
  {
    label: "Foto secundaria",
    shortLabel: "Apoyo",
    placement: "Dentro del desarrollo",
    description:
      "Imagen de apoyo para reforzar visualmente el contenido de la noticia.",
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

export default function NuevaNoticiaPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState<NoticiaFormData>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    status: "draft",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
    imageAspect: "wide",
    images: [],
  });

  const [imageDrafts, setImageDrafts] = useState<AdminImageDraft[]>([
    makeImageDraft(0),
    makeImageDraft(1),
  ]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [uploadProgress, setUploadProgress] = useState({
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
      imagesCount > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [form, imagesCount]);

  const updateField = <T extends keyof NoticiaFormData>(
    field: T,
    value: NoticiaFormData[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug
        ? { slug: createSlug(String(value)) }
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

    const maxSizeInMB = 6;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`Cada imagen no puede superar los ${maxSizeInMB}MB.`);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const uploadedImages = await uploadContentImages({
        drafts: normalizedImages,
        folder: "noticias",
        setProgress: setUploadProgress,
      });

      const legacyImageFields = getLegacyImageFields(uploadedImages);

      await createNoticia({
        ...form,
        ...legacyImageFields,
        slug: form.slug || createSlug(form.title),
        status: form.status as NoticiaStatus,
        images: uploadedImages,
      });

      router.push("/admin/noticias");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar la noticia. Revisa Firebase Storage, Firestore y tu sesión."
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
      title="Crear noticia"
      description="Construye una publicación editable con portada, imagen secundaria y contenido."
      userEmail={user?.email}
      backHref="/admin/noticias"
      backLabel="Volver a noticias"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="new-noticia-form"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="new-noticia-form" onSubmit={handleSubmit}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/noticias"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={16} />
              Volver a noticias
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
            <EditablePublication
              form={form}
              images={normalizedImages}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
              onImageChange={handleImageChange}
              onUpdateField={updateField}
            />

            {loading && uploadProgress.total > 0 && (
              <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                  <span>
                    Subiendo imagen {uploadProgress.index + 1} de{" "}
                    {uploadProgress.total}
                  </span>
                  <span>{uploadProgress.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#009B8D] transition-all"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>
              </div>
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

            <PublishPanel
              slug={form.slug}
              status={form.status}
              category={form.category}
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
            {loading ? "Guardando..." : "Guardar"}
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

function EditablePublication({
  form,
  images,
  selectedImageIndex,
  onSelectImage,
  onImageChange,
  onUpdateField,
}: {
  form: NoticiaFormData;
  images: AdminImageDraft[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  onUpdateField: <T extends keyof NoticiaFormData>(
    field: T,
    value: NoticiaFormData[T]
  ) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#20d6c7]">
            Publicación editable
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
            Noticias
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <FieldGroup label="Categoría">
            <input
              value={form.category}
              onChange={(event) =>
                onUpdateField("category", event.target.value)
              }
              placeholder="Institucional, Análisis, Territorio..."
              className="field-input"
            />
          </FieldGroup>

          <FieldGroup label="Estado">
            <select
              value={form.status}
              onChange={(event) =>
                onUpdateField("status", event.target.value as NoticiaStatus)
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
                onUpdateField("slug", createSlug(event.target.value))
              }
              placeholder="nueva-medicion-opinion-publica"
              className="field-input"
              required
            />

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              URL final: /noticias/{form.slug || "mi-noticia"}
            </p>
          </FieldGroup>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <FieldGroup label="Título principal">
          <input
            value={form.title}
            onChange={(event) => onUpdateField("title", event.target.value)}
            placeholder="Ej: Nueva medición de opinión pública"
            className="field-input text-xl font-black sm:text-2xl"
            required
          />
        </FieldGroup>

        <FieldGroup label="Resumen / bajada">
          <textarea
            value={form.summary}
            onChange={(event) => onUpdateField("summary", event.target.value)}
            placeholder="Escribe una bajada breve y atractiva..."
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

        <FieldGroup label="Cuerpo de la noticia">
          <textarea
            value={form.content}
            onChange={(event) => onUpdateField("content", event.target.value)}
            placeholder="Desarrolla la noticia completa..."
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

function PublishPanel({
  slug,
  status,
  category,
  completionScore,
  imagesCount,
  readingTime,
}: {
  slug: string;
  status: string;
  category: string;
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
        <SummaryItem label="Lectura" value={readingTime} />
        <SummaryItem label="Imágenes" value={`${imagesCount} de 2`} />
        <SummaryItem
          label="URL"
          value={`/noticias/${slug || "mi-noticia"}`}
          wrap
        />
      </div>
    </section>
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