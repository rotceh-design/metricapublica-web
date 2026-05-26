"use client";

import { useState } from "react";

const studies = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
];

export default function Studies() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="estudios" className="bg-[#0f2744] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Estudios y publicaciones
          </span>

          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Evidencia pública presentada de forma clara y accionable
          </h2>

          <p className="text-lg leading-8 text-slate-400">
            Esta sección será administrable: el equipo podrá agregar estudios,
            noticias, documentos PDF e imágenes desde el panel privado.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {studies.map((study) => {
            const isOpen = openId === study.id;

            return (
              <article
                key={study.id}
                className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/60 to-[#0a1628]/60 transition hover:border-[#009B8D]/40"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : study.id)}
                  className="flex w-full flex-col gap-5 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-2xl text-[#009B8D]">
                      ▣
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-bold uppercase tracking-wide text-[#009B8D]">
                        {study.date}
                      </p>

                      <h3 className="text-xl font-bold text-white md:text-2xl">
                        {study.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
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
                    <p className="mb-6 leading-8 text-slate-300">
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
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a
                        href="/estudios"
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
      </div>
    </section>
  );
}