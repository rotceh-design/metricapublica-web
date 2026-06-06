import { uploadFeaturedImage } from "@/lib/storage";

export type ContentImageAspect = "wide" | "square" | "portrait";

export type ContentImageFit = "cover" | "contain";

export type ContentImagePosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type ContentImageRole = "cover" | "gallery";

export type ContentImage = {
  url: string;
  alt?: string;
  aspect: ContentImageAspect;
  fit: ContentImageFit;
  position: ContentImagePosition;
  order: number;
  role: ContentImageRole;
};

export type AdminImageDraft = {
  url?: string;
  file?: File;
  previewUrl?: string;
  alt?: string;
  aspect: ContentImageAspect;
  fit: ContentImageFit;
  position: ContentImagePosition;
  order: number;
  role: ContentImageRole;
};

type LegacyImageFields = {
  imageUrl?: string;
  imageAspect?: string;
  imageFit?: string;
  imagePosition?: string;
};

type UploadProgressPayload = {
  index: number;
  progress: number;
  total: number;
};

const DEFAULT_ASPECT: ContentImageAspect = "wide";
const DEFAULT_FIT: ContentImageFit = "cover";
const DEFAULT_POSITION: ContentImagePosition = "center";

function normalizeAspect(value?: string): ContentImageAspect {
  if (value === "wide" || value === "square" || value === "portrait") {
    return value;
  }

  return DEFAULT_ASPECT;
}

function normalizeFit(value?: string): ContentImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return DEFAULT_FIT;
}

function normalizePosition(value?: string): ContentImagePosition {
  if (
    value === "center" ||
    value === "top" ||
    value === "bottom" ||
    value === "left" ||
    value === "right"
  ) {
    return value;
  }

  return DEFAULT_POSITION;
}

function getImageRole(order: number): ContentImageRole {
  return order === 0 ? "cover" : "gallery";
}

export function createEmptyImageDraft(order: number): AdminImageDraft {
  return {
    url: "",
    file: undefined,
    previewUrl: "",
    alt: "",
    aspect: DEFAULT_ASPECT,
    fit: DEFAULT_FIT,
    position: DEFAULT_POSITION,
    order,
    role: getImageRole(order),
  };
}

export function buildImageDraftsFromContent(
  images?: ContentImage[],
  legacy?: LegacyImageFields
): AdminImageDraft[] {
  if (images && images.length > 0) {
    return images
      .slice(0, 3)
      .sort((a, b) => a.order - b.order)
      .map((image, index) => ({
        url: image.url || "",
        file: undefined,
        previewUrl: "",
        alt: image.alt || "",
        aspect: normalizeAspect(image.aspect),
        fit: normalizeFit(image.fit),
        position: normalizePosition(image.position),
        order: index,
        role: getImageRole(index),
      }));
  }

  if (legacy?.imageUrl) {
    return [
      {
        url: legacy.imageUrl,
        file: undefined,
        previewUrl: "",
        alt: "",
        aspect: normalizeAspect(legacy.imageAspect),
        fit: normalizeFit(legacy.imageFit),
        position: normalizePosition(legacy.imagePosition),
        order: 0,
        role: "cover",
      },
    ];
  }

  return [createEmptyImageDraft(0)];
}

export async function uploadContentImages({
  drafts,
  folder,
  setProgress,
}: {
  drafts: AdminImageDraft[];
  folder: "noticias" | "estudios" | string;
  setProgress?: (payload: UploadProgressPayload) => void;
}): Promise<ContentImage[]> {
  const validDrafts = drafts.slice(0, 3);
  const uploadedImages: ContentImage[] = [];

  for (let index = 0; index < validDrafts.length; index += 1) {
    const draft = validDrafts[index];

    let finalUrl = draft.url || "";

    if (draft.file) {
      finalUrl = await uploadFeaturedImage(draft.file, folder, (progress) => {
        setProgress?.({
          index,
          progress,
          total: validDrafts.length,
        });
      });
    }

    if (!finalUrl) continue;

    const order = uploadedImages.length;

    uploadedImages.push({
      url: finalUrl,
      alt: draft.alt || "",
      aspect: normalizeAspect(draft.aspect),
      fit: normalizeFit(draft.fit),
      position: normalizePosition(draft.position),
      order,
      role: getImageRole(order),
    });
  }

  return uploadedImages;
}

export function getLegacyImageFields(images: ContentImage[]) {
  const cover = images[0];

  return {
    imageUrl: cover?.url || "",
    imageAspect: cover?.aspect || DEFAULT_ASPECT,
    imageFit: cover?.fit || DEFAULT_FIT,
    imagePosition: cover?.position || DEFAULT_POSITION,
  };
}