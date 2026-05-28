"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedNoticias } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";

const cardAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticias = async () => {
      const data = await getPublishedNoticias();
      setNoticias(data);
      setLoading(false);
    };

    loadNoticias();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Noticias
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Actualidad, análisis y novedades de Métrica Pública
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Revisa publicaciones, análisis, novedades institucionales y
            contenidos actualizados por el equipo de Métrica Pública.
          </p>

          {loading ? (
            <p className="text-slate-400">Cargando noticias...</p>
          ) : noticias.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-3 text-2xl font-bold">
                Aún no hay noticias publicadas
              </h2>
              <p className="text-slate-400">
                Las noticias creadas como borrador no se mostrarán en esta
                página. Publica una noticia desde el panel administrativo.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {noticias.map((noticia) => {
                const imageAspect = noticia.imageAspect || "wide";
                const imageFit = noticia.imageFit || "cover";
                const imagePosition = noticia.imagePosition || "center";

                return (
                  <article
                    key={noticia.id}
                    className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/70 transition hover:-translate-y-1 hover:border-[#009B8D]/40"
                  >
                    <div
                      className={`overflow-hidden bg-[#08111f] ${cardAspectClasses[imageAspect]}`}
                    >
                      {noticia.imageUrl ? (
                        <img
                          src={noticia.imageUrl}
                          alt={noticia.title}
                          className="h-full w-full"
                          style={{
                            objectFit: imageFit,
                            objectPosition: imagePosition,
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl text-[#009B8D]">
                          MP
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                          {noticia.category || "Institucional"}
                        </span>

                        <span className="text-xs text-slate-500">
                          Publicado
                        </span>
                      </div>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-bold leading-tight">
                        {noticia.title}
                      </h2>

                      <p className="mb-6 wrap-anywhere leading-7 text-slate-400">
                        {noticia.summary}
                      </p>

                      <a
                        href={`/noticias/${noticia.slug}`}
                        className="font-semibold text-[#009B8D] transition hover:text-white"
                      >
                        Leer más →
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
