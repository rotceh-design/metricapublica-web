import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { InicioContenido, NosotrosContenido } from "@/types/contenido";

const nosotrosRef = doc(db, "contenidoPaginas", "nosotros");
const inicioRef = doc(db, "contenidoPaginas", "inicio");

export const defaultNosotrosContenido: NosotrosContenido = {
  heroLabel: "Nosotros",
  heroTitle:
    "Investigación, análisis y estrategia pública con mirada territorial",
  heroDescription:
    "En Métrica Pública desarrollamos estudios, análisis y diagnósticos para transformar información en decisiones claras, útiles y conectadas con la realidad social.",

  focusLabel: "Enfoque",
  focusTitle: "Datos para comprender mejor el entorno público",
  focusParagraphOne:
    "Trabajamos con evidencia cuantitativa y cualitativa para apoyar procesos de decisión, planificación, comunicación y evaluación.",
  focusParagraphTwo:
    "Nuestro foco está en entregar información clara, bien estructurada y útil para instituciones, organizaciones, campañas, comunidades y equipos que necesitan entender mejor sus contextos.",

  pillarOneTitle: "Evidencia",
  pillarOneDescription:
    "Levantamos y analizamos datos para generar diagnósticos claros, útiles y accionables.",

  pillarTwoTitle: "Estrategia",
  pillarTwoDescription:
    "Convertimos información en criterios para orientar decisiones, acciones y planificación.",

  pillarThreeTitle: "Territorio",
  pillarThreeDescription:
    "Incorporamos lectura local y territorial para comprender mejor cada realidad.",

  pillarFourTitle: "Confianza",
  pillarFourDescription:
    "Diseñamos procesos ordenados, transparentes y orientados a resultados.",

  teamLabel: "Equipo",
  teamTitle: "Personas detrás de Métrica Pública",
  teamDescription:
    "Conoce a quienes forman parte del equipo y sus principales áreas de experiencia.",
};

export const defaultInicioContenido: InicioContenido = {
  heroLabel: "Investigación y opinión pública",
  heroTitle:
    "Datos, análisis y estrategia para comprender mejor el entorno público",
  heroDescription:
    "En Métrica Pública transformamos información en evidencia útil para la toma de decisiones, el diseño estratégico y la comprensión de escenarios sociales, políticos y territoriales.",
  primaryButtonLabel: "Conocer servicios",
  primaryButtonHref: "/servicios",
  secondaryButtonLabel: "Ver estudios",
  secondaryButtonHref: "/estudios",

  servicesLabel: "Servicios",
  servicesTitle: "Soluciones para investigar, analizar y decidir mejor",
  servicesDescription:
    "Desarrollamos estudios, diagnósticos y asesorías para instituciones, organizaciones y equipos que necesitan información clara, confiable y accionable.",

  studiesLabel: "Estudios",
  studiesTitle: "Publicaciones y análisis recientes",
  studiesDescription:
    "Revisa estudios, informes y publicaciones desarrolladas por Métrica Pública.",

  sectorsLabel: "Sectores",
  sectorsTitle: "Ámbitos donde aportamos evidencia y análisis",
  sectorsDescription:
    "Trabajamos con instituciones públicas, organizaciones, territorios, campañas y equipos que requieren comprender mejor su entorno.",

  contactLabel: "Contacto",
  contactTitle: "Conversemos sobre tu próximo estudio",
  contactDescription:
    "Cuéntanos qué necesitas investigar, medir o analizar. Podemos ayudarte a transformar información en decisiones claras.",
};

export async function getNosotrosContenido() {
  const snapshot = await getDoc(nosotrosRef);

  if (!snapshot.exists()) {
    return defaultNosotrosContenido;
  }

  return {
    ...defaultNosotrosContenido,
    ...snapshot.data(),
  } as NosotrosContenido;
}

export async function updateNosotrosContenido(data: NosotrosContenido) {
  return setDoc(
    nosotrosRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function getInicioContenido() {
  const snapshot = await getDoc(inicioRef);

  if (!snapshot.exists()) {
    return defaultInicioContenido;
  }

  return {
    ...defaultInicioContenido,
    ...snapshot.data(),
  } as InicioContenido;
}

export async function updateInicioContenido(data: InicioContenido) {
  return setDoc(
    inicioRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}