"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedEstudios } from "@/lib/estudios";
import { Estudio } from "@/types/estudio";

const cardAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function EstudiosPage() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEstudios = async () => {
      const data = await getPublishedEstudios();
      setEstudios(data);
      setLoading(false);
    };

    loadEstudios();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Estudios y publicaciones
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Evidencia pública para comprender escenarios y tomar decisiones
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Revisa estudios, informes, publicaciones y documentos descargables
            desarrollados por Métrica Pública.
          </p>

          {loading ? (
            <p className="text-slate-400">Cargando estudios...</p>
          ) : estudios.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-3 text-2xl font-bold">
                Aún no hay estudios publicados
              </h2>

              <p className="text-slate-400">
                Los estudios creados como borrador no se mostrarán en esta
                página. Publica un estudio desde el panel administrativo.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {estudios.map((estudio) => {
                const imageAspect = estudio.imageAspect || "wide";
                const imageFit = estudio.imageFit || "cover";
                const imagePosition = estudio.imagePosition || "center";

                return (
                  <article
                    key={estudio.id}
                    className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-gradient-to-br from-[#1a365d]/50 to-[#0f2744]/70 transition hover:-translate-y-1 hover:border-[#009B8D]/40"
                  >
                    <div
                      className={`overflow-hidden bg-[#08111f] ${cardAspectClasses[imageAspect]}`}
                    >
                      {estudio.imageUrl ? (
                        <img
                          src={estudio.imageUrl}
                          alt={estudio.title}
                          className="h-full w-full"
                          style={{
                            objectFit: imageFit,
                            objectPosition: imagePosition,
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#009B8D]">
                          MP
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <div className="mb-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                          {estudio.category || "Publicación"}
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                          {estudio.year || "Sin año"}
                        </span>

                        {estudio.pdfUrl && (
                          <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                            PDF
                          </span>
                        )}
                      </div>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-bold leading-tight">
                        {estudio.title}
                      </h2>

                      <p className="mb-6 wrap-anywhere leading-7 text-slate-400">
                        {estudio.summary}
                      </p>

                      <a
                        href={`/estudios/${estudio.slug}`}
                        className="font-semibold text-[#009B8D] transition hover:text-white"
                      >
                        Ver estudio →
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}