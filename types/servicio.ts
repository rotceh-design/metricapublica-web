export type Servicio = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
  featured: boolean;
  benefits: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ServicioFormData = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
  featured: boolean;
  benefits: string[];
};