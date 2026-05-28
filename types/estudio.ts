export type EstudioStatus = "draft" | "published";

export type EstudioImageFit = "cover" | "contain";
export type EstudioImagePosition = "center" | "top" | "bottom" | "left" | "right";
export type EstudioImageAspect = "wide" | "square" | "portrait";

export type Estudio = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  year: string;
  status: EstudioStatus;
  imageUrl: string;
  imageFit?: EstudioImageFit;
  imagePosition?: EstudioImagePosition;
  imageAspect?: EstudioImageAspect;
  pdfUrl?: string;
  pdfName?: string;
  methodology?: string;
  sample?: string;
  fieldworkDate?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type EstudioFormData = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  year: string;
  status: EstudioStatus;
  imageUrl: string;
  imageFit: EstudioImageFit;
  imagePosition: EstudioImagePosition;
  imageAspect: EstudioImageAspect;
  pdfUrl: string;
  pdfName: string;
  methodology: string;
  sample: string;
  fieldworkDate: string;
};