import { ContentImage } from "@/types/content-image";

export type NoticiaStatus = "draft" | "published";

export type NoticiaFormData = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  status: NoticiaStatus;

  imageUrl: string;
  imageFit: string;
  imagePosition: string;
  imageAspect: string;

  images?: ContentImage[];
};

export type Noticia = NoticiaFormData & {
  id: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};