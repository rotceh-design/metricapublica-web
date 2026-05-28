"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedNoticiaBySlug } from "@/lib/noticias";
import { Noticia, NoticiaImageAspect } from "@/types/noticia";

const wideImageClasses = {
  wide: "mx-auto mb-10 w-full max-w-4xl aspect-[16/9]",
  square: "mx-auto mb-10 w-full max-w-xl aspect-square",
  portrait:
    "mx-auto mb-10 w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-[4/5]",
};

const sideImageClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function NoticiaDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticia = async () => {
      const data = await getPublishedNoticiaBySlug(slug);
      setNoticia(data);
      setLoading(false);
    };

    if (slug) {
      loadNoticia();
    }
  }, [slug]);

  const imageAspect: NoticiaImageAspect = noticia?.imageAspect || "wide";
  const imageFit = noticia?.imageFit || "cover";
  const imagePosition = noticia?.imagePosition || "center";

  const isWideImage = imageAspect === "wide";

  const imageElement = noticia?.imageUrl ? (
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
    <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#009B8D]">
      MP
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <p className="text-slate-400">Cargando noticia...</p>
          ) : !noticia ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Noticia
              </span>

              <h1 className="mb-4 text-4xl font-bold">
                Noticia no encontrada
              </h1>

              <p className="mb-6 text-slate-400">
                La noticia no existe o todavía no está publicada.
              </p>

              <a
                href="/noticias"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Volver a noticias
              </a>
            </div>
          ) : (
            <article>
              <a
                href="/noticias"
                className="mb-8 inline-flex text-sm font-semibold text-[#009B8D] transition hover:text-white"
              >
                ← Volver a noticias
              </a>

              <header className="mb-10 rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-7 md:p-10">
                <div className="mb-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                    {noticia.category || "Institucional"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                    Publicado
                  </span>
                </div>

                <h1 className="mb-6 wrap-anywhere text-5xl font-bold leading-tight md:text-6xl">
                  {noticia.title}
                </h1>

                <p className="max-w-3xl wrap-anywhere text-xl leading-9 text-slate-300">
                  {noticia.summary}
                </p>
              </header>

              {isWideImage && (
                <div
                  className={`overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#08111f] shadow-2xl ${wideImageClasses[imageAspect]}`}
                >
                  {imageElement}
                </div>
              )}

              <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-7 md:p-10">
                  <div className="whitespace-pre-wrap wrap-anywhere text-lg leading-9 text-slate-300">
                    {noticia.content}
                  </div>
                </div>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  {!isWideImage && (
                    <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-4 shadow-2xl">
                      <div
                        className={`mx-auto overflow-hidden rounded-2xl bg-[#08111f] ${
                          imageAspect === "portrait"
                            ? "w-full max-w-65 sm:max-w-75 lg:max-w-full"
                            : "w-full"
                        } ${sideImageClasses[imageAspect]}`}
                      >
                        {imageElement}
                      </div>

                      <p className="mt-4 text-center text-xs text-slate-500">
                        Imagen destacada de la publicación
                      </p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-6">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Publicación
                    </p>

                    <div className="space-y-4 text-sm text-slate-400">
                      <div>
                        <p className="text-slate-500">Categoría</p>
                        <p className="font-semibold text-white">
                          {noticia.category || "Institucional"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Estado</p>
                        <p className="font-semibold text-white">Publicado</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Formato imagen</p>
                        <p className="font-semibold text-white">
                          {imageAspect} · {imageFit} · {imagePosition}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">URL</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          /noticias/{noticia.slug}
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}