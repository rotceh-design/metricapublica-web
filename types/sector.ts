export type SectorIconKey =
  | "gobierno"
  | "campanas"
  | "privado"
  | "organizaciones"
  | "academia"
  | "territorio"
  | "datos"
  | "comunicacion";

export type Sector = {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconKey: SectorIconKey;
  order: number;
  active: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type SectorFormData = {
  title: string;
  slug: string;
  description: string;
  iconKey: SectorIconKey;
  order: number;
  active: boolean;
  featured: boolean;
};