export type NoticiaStatus = "draft" | "published";

export type NoticiaImageFit = "cover" | "contain";
export type NoticiaImagePosition = "center" | "top" | "bottom" | "left" | "right";
export type NoticiaImageAspect = "wide" | "square" | "portrait";

export type Noticia = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  status: NoticiaStatus;
  imageUrl: string;
  imageFit?: NoticiaImageFit;
  imagePosition?: NoticiaImagePosition;
  imageAspect?: NoticiaImageAspect;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type NoticiaFormData = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  status: NoticiaStatus;
  imageUrl: string;
  imageFit: NoticiaImageFit;
  imagePosition: NoticiaImagePosition;
  imageAspect: NoticiaImageAspect;
};