export type ConfiguracionGlobal = {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;

  siteActive: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  updatedAt?: unknown;
};

export const defaultConfiguracionGlobal: ConfiguracionGlobal = {
  linkedin: "",
  instagram: "",
  facebook: "",
  twitter: "",

  siteActive: true,
  maintenanceMode: false,
  maintenanceMessage:
    "Estamos realizando mejoras en el sitio. Vuelve a intentarlo más tarde.",
};