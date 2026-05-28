"use client";

import { useEffect, useMemo, useState } from "react";

import { InicioContenido } from "@/types/contenido";
import { Estudio } from "@/types/estudio";

const fallbackStudies = [
  {
    id: "fallback-1",
    date: "Estudio 2025",
    title: "Radiografía de percepción ciudadana",
    subtitle: "Análisis de opinión pública y confianza institucional",
    content:
      "Este estudio presenta una lectura estratégica sobre percepciones ciudadanas, confianza institucional, prioridades sociales y principales preocupaciones del entorno público.",
    highlights: [
      "Identificación de tendencias de opinión.",
      "Análisis de confianza y evaluación institucional.",
      "Lectura estratégica para la toma de decisiones.",
    ],
    href: "/estudios",
  },
  {
    id: "fallback-2",
    date: "Publicación",
    title: "Análisis territorial y comportamiento social",
    subtitle: "Cruce de datos comunales, sociales y geográficos",
    content:
      "El análisis territorial permite observar diferencias entre zonas, segmentos y realidades locales, entregando evidencia útil para instituciones y organizaciones.",
    highlights: [
      "Cruce de variables sociales y territoriales.",
      "Visualización de brechas y oportunidades.",
      "Apoyo a diagnósticos comunales o regionales.",
    ],
    href: "/estudios",
  },
  {
    id: "fallback-3",
    date: "Informe estratégico",
    title: "Escenarios públicos y toma de decisiones",
    subtitle: "Datos convertidos en recomendaciones accionables",
    content:
      "A partir de evidencia cuantitativa y cualitativa, se construyen escenarios de análisis que ayudan a anticipar riesgos, oportunidades y decisiones estratégicas.",
    highlights: [
      "Síntesis ejecutiva para equipos directivos.",
      "Recomendaciones basadas en evidencia.",
      "Apoyo a comunicación pública y planificación.",
    ],
    href: "/estudios",
  },
];

type StudiesProps = {
  contenido: InicioContenido;
  estudios: Estudio[];
  loading: boolean;
};

export default function Studies({
  contenido,
  estudios,
  loading,
}: StudiesProps) {
  const studyCards = useMemo(() => {
    if (estudios.length === 0) {
      return fallbackStudies;
    }

    return estudios.slice(0, 3).map((estudio) => {
      const highlights = [
        estudio.category ? `Categoría: ${estudio.category}` : "",
        estudio.year ? `Año de publicación: ${estudio.year}` : "",
        estudio.pdfUrl ? "Documento PDF disponible para descarga." : "",
      ].filter(Boolean);

      return {
        id: estudio.id,
        date: estudio.year || "Publicación",
        title: estudio.title,
        subtitle: estudio.category || "Estudio / Publicación",
        content:
          estudio.summary ||
          estudio.content ||
          "Publicación disponible en el sitio de Métrica Pública.",
        highlights:
          highlights.length > 0
            ? highlights
            : [
                "Información publicada por Métrica Pública.",
                "Contenido disponible para revisión pública.",
                "Material asociado a estudios y publicaciones.",
              ],
        href: `/estudios/${estudio.slug}`,
      };
    });
  }, [estudios]);

  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId && studyCards.length > 0) {
      setOpenId(studyCards[0].id);
    }
  }, [openId, studyCards]);

  return (
    <section id="estudios" className="bg-[#0f2744] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            {contenido.studiesLabel}
          </span>

          <h2 className="mb-5 wrap-anywhere text-4xl font-bold leading-tight md:text-5xl">
            {contenido.studiesTitle}
          </h2>

          <p className="wrap-anywhere text-lg leading-8 text-slate-400">
            {contenido.studiesDescription}
          </p>
        </div>

        {loading ? (
          <StudiesLoading />
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {studyCards.map((study) => {
                const isOpen = openId === study.id;

                return (
                  <article
                    key={study.id}
                    className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/60 to-[#0a1628]/60 transition hover:border-[#009B8D]/40 hover:shadow-2xl"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : study.id)}
                      className="flex w-full flex-col gap-5 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8"
                    >
                      <div className="flex items-start gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-2xl text-[#009B8D]">
                          ▣
                        </div>

                        <div>
                          <p className="mb-1 wrap-anywhere text-sm font-bold uppercase tracking-wide text-[#009B8D]">
                            {study.date}
                          </p>

                          <h3 className="wrap-anywhere text-xl font-bold text-white md:text-2xl">
                            {study.title}
                          </h3>

                          <p className="mt-1 wrap-anywhere text-sm text-slate-400">
                            {study.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#009B8D]/15 text-[#009B8D]">
                        {isOpen ? "−" : "+"}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#009B8D]/10 px-6 pb-8 pt-6 md:px-8">
                        <p className="mb-6 wrap-anywhere leading-8 text-slate-300">
                          {study.content}
                        </p>

                        <ul className="mb-8 space-y-3">
                          {study.highlights.map((item, index) => (
                            <li
                              key={item}
                              className="flex gap-3 rounded-xl border-l-4 border-[#009B8D] bg-[#009B8D]/10 px-4 py-3 text-slate-200"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#009B8D] text-xs font-bold text-white">
                                {index + 1}
                              </span>

                              <span className="wrap-anywhere">{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <a
                            href={study.href}
                            className="rounded-lg bg-[#009B8D] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#00877a]"
                          >
                            Ver estudio
                          </a>

                          <a
                            href="/contacto"
                            className="rounded-lg border border-[#009B8D]/40 px-5 py-3 text-center font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
                          >
                            Solicitar información
                          </a>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/estudios"
                className="inline-flex rounded-xl border border-[#009B8D]/40 px-6 py-3 font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
              >
                Ver todos los estudios
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StudiesLoading() {
  return (
    <div className="flex flex-col gap-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-3xl border border-[#009B8D]/15 bg-[#0a1628]/60 p-8"
        >
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-white/10" />

            <div className="w-full">
              <div className="mb-3 h-4 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="mb-3 h-7 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}