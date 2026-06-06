export type ContenidoGlobal = {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;

  siteActive: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  updatedAt?: unknown;
};

export const defaultContenidoGlobal: ContenidoGlobal = {
  linkedin: "",
  instagram: "",
  facebook: "",
  twitter: "",

  siteActive: true,
  maintenanceMode: false,
  maintenanceMessage:
    "Estamos realizando mejoras en el sitio. Vuelve a intentarlo más tarde.",
};