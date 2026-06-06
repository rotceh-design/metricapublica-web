export type EquipoImageAspect = "square" | "portrait" | "wide";
export type EquipoImageFit = "cover" | "contain";
export type EquipoImagePosition = "center" | "top" | "bottom" | "left" | "right";

export type EquipoIntegrante = {
  id: string;
  name: string;
  slug: string;
  role: string;
  roleDescription?: string;
  bio: string;
  email?: string;
  linkedin?: string;
  imageUrl?: string;
  imageFit?: EquipoImageFit;
  imagePosition?: EquipoImagePosition;
  imageAspect?: EquipoImageAspect;
  order: number;
  active: boolean;
  featured: boolean;
};

export type EquipoFormData = {
  name: string;
  slug: string;
  role: string;
  roleDescription?: string;
  bio: string;
  email?: string;
  linkedin?: string;
  imageUrl?: string;
  imageFit: EquipoImageFit;
  imagePosition: EquipoImagePosition;
  imageAspect: EquipoImageAspect;
  order: number;
  active: boolean;
  featured: boolean;
};