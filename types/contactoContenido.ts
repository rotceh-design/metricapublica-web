export type ContactoContenido = {
  label: string;
  title: string;
  description: string;

  infoTitle: string;
  infoDescription: string;

  emailLabel: string;
  emailValue: string;

  websiteLabel: string;
  websiteValue: string;
  websiteUrl: string;

  coverageLabel: string;
  coverageValue: string;

  formLabel: string;
  formTitle: string;
  formDescription: string;

  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;

  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
};

export const defaultContactoContenido: ContactoContenido = {
  label: "Contacto",
  title: "Conversemos sobre tu próximo proyecto",
  description:
    "Completa el formulario y cuéntanos qué necesitas investigar, analizar o levantar. El equipo de Métrica Pública revisará tu solicitud.",

  infoTitle: "Hablemos de tu proyecto",
  infoDescription:
    "Escríbenos para coordinar estudios, levantamientos de información, asesoría estratégica o análisis territorial.",

  emailLabel: "Correo",
  emailValue: "contacto@metricapublica.cl",

  websiteLabel: "Sitio web",
  websiteValue: "metricapublica.cl",
  websiteUrl: "https://metricapublica.cl",

  coverageLabel: "Cobertura",
  coverageValue: "Estudios a nivel nacional y territorial",

  formLabel: "Formulario",
  formTitle: "Envíanos un mensaje",
  formDescription:
    "Completa los datos y cuéntanos qué necesitas investigar, analizar o levantar.",

  namePlaceholder: "Tu nombre",
  emailPlaceholder: "tu@email.cl",
  phonePlaceholder: "+56 9 1234 5678",
  subjectPlaceholder: "Ej: Cotización de estudio",
  messagePlaceholder: "Cuéntanos qué necesitas investigar o analizar...",

  submitLabel: "Enviar mensaje",
  sendingLabel: "Enviando mensaje...",
  successMessage:
    "Mensaje enviado correctamente. El equipo de Métrica Pública podrá revisarlo desde el panel administrativo.",
};