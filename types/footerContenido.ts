export type FooterContenido = {
  brandName: string;
  description: string;

  navigationTitle: string;
  servicesTitle: string;
  contactTitle: string;

  homeLabel: string;
  nosotrosLabel: string;
  serviciosLabel: string;
  estudiosLabel: string;
  contactoLabel: string;

  contactEmailLabel: string;
  contactEmail: string;

  websiteLabel: string;
  websiteValue: string;
  websiteUrl: string;

  coverageLabel: string;
  coverageValue: string;

  copyright: string;

  updatedAt?: unknown;
};

export const defaultFooterContenido: FooterContenido = {
  brandName: "Métrica Pública",
  description:
    "Investigación, análisis de datos y evidencia pública para apoyar decisiones estratégicas.",

  navigationTitle: "Navegación",
  servicesTitle: "Contenido",
  contactTitle: "Contacto",

  homeLabel: "Inicio",
  nosotrosLabel: "Nosotros",
  serviciosLabel: "Servicios",
  estudiosLabel: "Estudios",
  contactoLabel: "Contacto",

  contactEmailLabel: "Correo",
  contactEmail: "contacto@metricapublica.cl",

  websiteLabel: "Sitio web",
  websiteValue: "metricapublica.cl",
  websiteUrl: "https://metricapublica.cl",

  coverageLabel: "Cobertura",
  coverageValue: "Chile y territorios",

  copyright: "© Métrica Pública. Todos los derechos reservados.",
};