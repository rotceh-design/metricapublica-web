export type EquipoImageFit = "cover" | "contain";
export type EquipoImagePosition = "center" | "top" | "bottom" | "left" | "right";
export type EquipoImageAspect = "square" | "portrait" | "wide";

export type EquipoIntegrante = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  imageUrl: string;
  imageFit?: EquipoImageFit;
  imagePosition?: EquipoImagePosition;
  imageAspect?: EquipoImageAspect;
  order: number;
  active: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type EquipoFormData = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  imageUrl: string;
  imageFit: EquipoImageFit;
  imagePosition: EquipoImagePosition;
  imageAspect: EquipoImageAspect;
  order: number;
  active: boolean;
  featured: boolean;
};