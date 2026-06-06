import { uploadFeaturedImage } from "@/lib/storage";
import {
  AdminImageDraft,
  ContentImage,
  ContentImageAspect,
  ContentImageFit,
  ContentImagePosition,
} from "@/types/content-image";

type LegacyImageFields = {
  imageUrl?: string;
  imageAspect?: string;
  imageFit?: string;
  imagePosition?: string;
};

const DEFAULT_ASPECT: ContentImageAspect = "wide";
const DEFAULT_FIT: ContentImageFit = "cover";
const DEFAULT_POSITION: ContentImagePosition = "center";

const normalizeAspect = (value?: string): ContentImageAspect => {
  if (value === "wide" || value === "square" || value === "portrait") {
    return value;
  }

  return DEFAULT_ASPECT;
};

const normalizeFit = (value?: string): ContentImageFit => {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return DEFAULT_FIT;
};

const normalizePosition = (value?: string): ContentImagePosition => {
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
};

export function createEmptyImageDraft(order: number): AdminImageDraft {
  return {
    url: "",
    previewUrl: "",
    alt: "",
    aspect: DEFAULT_ASPECT,
    fit: DEFAULT_FIT,
    position: DEFAULT_POSITION,
    order,
    role: order === 0 ? "cover" : "gallery",
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
        previewUrl: "",
        alt: image.alt || "",
        aspect: normalizeAspect(image.aspect),
        fit: normalizeFit(image.fit),
        position: normalizePosition(image.position),
        order: index,
        role: index === 0 ? "cover" : "gallery",
      }));
  }

  if (legacy?.imageUrl) {
    return [
      {
        url: legacy.imageUrl,
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
  setProgress?: (payload: {
    index: number;
    progress: number;
    total: number;
  }) => void;
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

    uploadedImages.push({
      url: finalUrl,
      alt: draft.alt || "",
      aspect: normalizeAspect(draft.aspect),
      fit: normalizeFit(draft.fit),
      position: normalizePosition(draft.position),
      order: uploadedImages.length,
      role: uploadedImages.length === 0 ? "cover" : "gallery",
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