"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedEstudioBySlug } from "@/lib/estudios";
import { Estudio, EstudioImageAspect } from "@/types/estudio";

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

export default function EstudioDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [estudio, setEstudio] = useState<Estudio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEstudio = async () => {
      const data = await getPublishedEstudioBySlug(slug);
      setEstudio(data);
      setLoading(false);
    };

    if (slug) {
      loadEstudio();
    }
  }, [slug]);

  const imageAspect: EstudioImageAspect = estudio?.imageAspect || "wide";
  const imageFit = estudio?.imageFit || "cover";
  const imagePosition = estudio?.imagePosition || "center";

  const isWideImage = imageAspect === "wide";

  const imageElement = estudio?.imageUrl ? (
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
            <p className="text-slate-400">Cargando estudio...</p>
          ) : !estudio ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Estudio
              </span>

              <h1 className="mb-4 text-4xl font-bold">
                Estudio no encontrado
              </h1>

              <p className="mb-6 text-slate-400">
                El estudio no existe o todavía no está publicado.
              </p>

              <a
                href="/estudios"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Volver a estudios
              </a>
            </div>
          ) : (
            <article>
              <a
                href="/estudios"
                className="mb-8 inline-flex text-sm font-semibold text-[#009B8D] transition hover:text-white"
              >
                ← Volver a estudios
              </a>

              <header className="mb-10 rounded-3xl border border-[#009B8D]/15 bg-gradient-to-br from-[#0f2744] to-[#08111f] p-7 md:p-10">
                <div className="mb-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                    {estudio.category || "Publicación"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                    {estudio.year || "Sin año"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                    Publicado
                  </span>
                </div>

                <h1 className="mb-6 wrap-anywhere text-5xl font-bold leading-tight md:text-6xl">
                  {estudio.title}
                </h1>

                <p className="max-w-3xl wrap-anywhere text-xl leading-9 text-slate-300">
                  {estudio.summary}
                </p>

                {estudio.pdfUrl && (
                  <a
                    href={estudio.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex rounded-xl bg-[#009B8D] px-6 py-4 font-bold text-white transition hover:bg-[#00877a]"
                  >
                    Descargar PDF
                  </a>
                )}
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
                    {estudio.content}
                  </div>
                </div>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  {!isWideImage && (
                    <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-4 shadow-2xl">
                      <div
                        className={`mx-auto overflow-hidden rounded-2xl bg-[#08111f] ${
                          imageAspect === "portrait"
                            ? "w-full max-w-[260px] sm:max-w-[300px] lg:max-w-full"
                            : "w-full"
                        } ${sideImageClasses[imageAspect]}`}
                      >
                        {imageElement}
                      </div>

                      <p className="mt-4 text-center text-xs text-slate-500">
                        Imagen destacada del estudio
                      </p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-6">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Ficha técnica
                    </p>

                    <div className="space-y-4 text-sm text-slate-400">
                      <div>
                        <p className="text-slate-500">Categoría</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          {estudio.category || "Publicación"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Año</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          {estudio.year || "Sin año"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Metodología</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          {estudio.methodology || "No definida"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Muestra</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          {estudio.sample || "No definida"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Fecha de terreno</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          {estudio.fieldworkDate || "No definida"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">PDF</p>

                        {estudio.pdfUrl ? (
                          <a
                            href={estudio.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wrap-anywhere font-semibold text-[#009B8D] transition hover:text-white"
                          >
                            {estudio.pdfName || "Descargar documento"}
                          </a>
                        ) : (
                          <p className="font-semibold text-white">
                            Sin PDF adjunto
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-slate-500">URL</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          /estudios/{estudio.slug}
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