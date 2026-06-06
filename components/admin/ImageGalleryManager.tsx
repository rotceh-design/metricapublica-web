"use client";

import { useState, type ChangeEvent } from "react";
import {
  Camera,
  ImageIcon,
  RotateCcw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  AdminImageDraft,
  ContentImageAspect,
  ContentImageFit,
  ContentImagePosition,
  ContentImageRole,
} from "@/types/content-image";
import { createEmptyImageDraft } from "@/lib/content-images";

const aspectClasses: Record<ContentImageAspect, string> = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

type ImageSlot = {
  label: string;
  shortLabel: string;
  description: string;
  placement: string;
  helper: string;
};

const imageSlots: ImageSlot[] = [
  {
    label: "Foto principal",
    shortLabel: "Portada",
    description:
      "Es la imagen principal de la noticia. Aparece arriba del artículo y también se usa en las tarjetas del sitio.",
    placement: "Arriba de la publicación",
    helper: "Portada principal",
  },
  {
    label: "Foto secundaria",
    shortLabel: "Apoyo",
    description:
      "Es una imagen de apoyo editorial. Aparece más abajo, acompañando el desarrollo del contenido.",
    placement: "Dentro del desarrollo",
    helper: "Imagen secundaria",
  },
];

type ImageGalleryManagerProps = {
  images: AdminImageDraft[];
  onChange: (images: AdminImageDraft[]) => void;
  maxImages?: number;
  error?: string;
  setError?: (message: string) => void;
};

export default function ImageGalleryManager({
  images,
  onChange,
  maxImages = 2,
  error,
  setError,
}: ImageGalleryManagerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const normalizedImages = normalizeToSlots(images, maxImages);
  const safeSelectedIndex =
    selectedIndex >= normalizedImages.length ? 0 : selectedIndex;

  const selectedImage = normalizedImages[safeSelectedIndex];
  const selectedSlot = imageSlots[safeSelectedIndex];

  const filledCount = normalizedImages.filter(
    (image) => image.url || image.previewUrl || image.file
  ).length;

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

    onChange(normalizeOrder(nextImages));
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

  const resetSettings = (index: number) => {
    updateImage(index, {
      aspect: "wide",
      fit: "contain",
      position: "center",
    });
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];

    setError?.("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError?.("Debes seleccionar una imagen válida.");
      return;
    }

    const maxSizeInMB = 6;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError?.(`Cada imagen no puede superar los ${maxSizeInMB}MB.`);
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

    setSelectedIndex(index);
  };

  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Ubicación en noticia
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Láminas visuales de la publicación
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Selecciona una lámina, sube la imagen y mira al instante cómo se
            verá dentro de la noticia. Por defecto las imágenes se muestran
            completas para evitar cortes accidentales.
          </p>
        </div>

        <div className="rounded-2xl border border-[#009B8D]/15 bg-[#08111f] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Carga visual
          </p>

          <p className="mt-1 text-sm font-black text-white">
            {filledCount} de {maxImages} imágenes
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="overflow-hidden rounded-[1.8rem] border border-[#009B8D]/10 bg-[#08111f]">
          <div className="border-b border-white/10 bg-[#0a1628] p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#20d6c7]">
                Esqueleto real
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                Noticia pública
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f] p-5">
              <p className="mb-3 inline-flex rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black text-[#20d6c7]">
                Categoría
              </p>

              <div className="mb-3 h-8 w-3/4 rounded-full bg-white/15" />
              <div className="h-4 w-full rounded-full bg-white/10" />
              <div className="mt-2 h-4 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="grid gap-4 p-4">
            <ArticleImageSlot
              image={normalizedImages[0]}
              slot={imageSlots[0]}
              selected={safeSelectedIndex === 0}
              main
              onSelect={() => setSelectedIndex(0)}
              onFileChange={(event) => handleFileChange(event, 0)}
            />

            <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1628] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#009B8D]">
                Desarrollo
              </p>

              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white/10" />
                <div className="h-3 w-11/12 rounded-full bg-white/10" />
                <div className="h-3 w-10/12 rounded-full bg-white/10" />
              </div>
            </div>

            <ArticleImageSlot
              image={normalizedImages[1]}
              slot={imageSlots[1]}
              selected={safeSelectedIndex === 1}
              onSelect={() => setSelectedIndex(1)}
              onFileChange={(event) => handleFileChange(event, 1)}
            />

            <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1628] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#009B8D]">
                Continuación
              </p>

              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white/10" />
                <div className="h-3 w-9/12 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.8rem] border border-[#009B8D]/10 bg-[#08111f] p-4">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
            Láminas
          </p>

          <div className="grid gap-3">
            {normalizedImages.map((image, index) => {
              const thumb = image.previewUrl || image.url;
              const slot = imageSlots[index];
              const active = safeSelectedIndex === index;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-[#009B8D]/60 bg-[#009B8D]/10"
                      : "border-white/10 bg-[#0a1628] hover:border-[#009B8D]/35"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-white">
                      {index + 1}. {slot.shortLabel}
                    </p>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        thumb
                          ? "bg-[#009B8D]/15 text-[#20d6c7]"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {thumb ? "Cargada" : "Vacía"}
                    </span>
                  </div>

                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#08111f]">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={image.alt || slot.label}
                        className="h-full w-full"
                        style={{
                          objectFit: image.fit,
                          objectPosition: image.position,
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#009B8D]">
                        <ImageIcon size={22} />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {slot.placement}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {image.aspect} · {image.fit} · {image.position}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="mt-5 rounded-[1.8rem] border border-[#009B8D]/10 bg-[#08111f] p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black text-[#20d6c7]">
              <Camera size={14} />
              Editando: {selectedSlot.label}
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              {selectedSlot.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => resetSettings(safeSelectedIndex)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:text-[#20d6c7]"
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>

            {(selectedImage.url ||
              selectedImage.previewUrl ||
              selectedImage.file) && (
              <button
                type="button"
                onClick={() => clearImage(safeSelectedIndex)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Quitar
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#009B8D]/30 bg-[#009B8D]/5 px-4 py-8 text-center transition hover:bg-[#009B8D]/10">
            <UploadCloud size={30} className="mb-3 text-[#20d6c7]" />

            <span className="text-sm font-black text-white">
              Subir {selectedSlot.label.toLowerCase()}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG o WebP · máximo 6MB
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFileChange(event, safeSelectedIndex)}
              className="hidden"
            />
          </label>

          <div className="grid gap-3">
            <input
              value={selectedImage.alt || ""}
              onChange={(event) =>
                updateImage(safeSelectedIndex, { alt: event.target.value })
              }
              placeholder="Texto alternativo / descripción breve"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
            />

            <div className="grid gap-3 md:grid-cols-3">
              <ControlSelect
                label="Formato"
                value={selectedImage.aspect}
                onChange={(value) =>
                  updateImage(safeSelectedIndex, {
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
                value={selectedImage.fit}
                onChange={(value) =>
                  updateImage(safeSelectedIndex, {
                    fit: value as ContentImageFit,
                  })
                }
                options={[
                  { value: "contain", label: "Completa" },
                  { value: "cover", label: "Cubrir" },
                ]}
              />

              <ControlSelect
                label="Posición"
                value={selectedImage.position}
                onChange={(value) =>
                  updateImage(safeSelectedIndex, {
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
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}
    </section>
  );
}

function ArticleImageSlot({
  image,
  slot,
  selected,
  main = false,
  onSelect,
  onFileChange,
}: {
  image: AdminImageDraft;
  slot: ImageSlot;
  selected: boolean;
  main?: boolean;
  onSelect: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const displayImage = image.previewUrl || image.url;
  const aspectClass = getAspectClass(image.aspect, main);

  return (
    <article
      className={`group overflow-hidden rounded-[1.6rem] border bg-[#08111f] transition ${
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
            <ImageIcon size={main ? 44 : 34} />
            <p className="text-sm font-black">Subir {slot.shortLabel}</p>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/80 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#009B8D]/90 px-3 py-1 text-xs font-black text-white">
            {slot.shortLabel}
          </span>

          <span className="rounded-full border border-white/10 bg-[#08111f]/80 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur">
            {slot.placement}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className={`${main ? "text-2xl" : "text-lg"} font-black text-white`}>
            {slot.label}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-300">
            {slot.helper}
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
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>
    </article>
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

function normalizeToSlots(
  images: AdminImageDraft[],
  maxImages: number
): AdminImageDraft[] {
  return Array.from({ length: maxImages }, (_, index) => {
    const existing = images[index];
    const fallback = createEmptyImageDraft(index);
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

function normalizeOrder(images: AdminImageDraft[]): AdminImageDraft[] {
  return images.slice(0, 2).map((image, index) => {
    const role: ContentImageRole = index === 0 ? "cover" : "gallery";

    return {
      ...image,
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