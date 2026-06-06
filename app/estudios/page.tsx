"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedEstudios } from "@/lib/estudios";
import { Estudio } from "@/types/estudio";
import { ContentImage } from "@/types/content-image";

const cardAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
} as const;

type EstudioCard = Estudio & {
  images?: ContentImage[];
};

type CardImageAspect = keyof typeof cardAspectClasses;
type CardImageFit = "cover" | "contain";
type CardImagePosition = "center" | "top" | "bottom" | "left" | "right";

type CardImageData = {
  url: string;
  alt: string;
  aspect: CardImageAspect;
  fit: CardImageFit;
  position: CardImagePosition;
};

export default function EstudiosPage() {
  const [estudios, setEstudios] = useState<EstudioCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEstudios = async () => {
      try {
        const data = await getPublishedEstudios();
        setEstudios(data as EstudioCard[]);
      } catch (error) {
        console.error("Error cargando estudios:", error);
        setEstudios([]);
      } finally {
        setLoading(false);
      }
    };

    loadEstudios();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[4%] top-80 h-60 w-60 rounded-full bg-[#1a365d]/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
            Estudios y publicaciones
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Evidencia pública para comprender escenarios y tomar decisiones
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Revisa estudios, informes, publicaciones y documentos descargables
            desarrollados por Métrica Pública.
          </p>

          {loading ? (
            <LoadingState />
          ) : estudios.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {estudios.map((estudio) => {
                const coverImage = getCoverImage(estudio);
                const imageCount = getImageCount(estudio);
                const hasSupportImage = imageCount > 1;
                const hasPdf = Boolean(estudio.pdfUrl);

                return (
                  <article
                    key={estudio.id}
                    className="group overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/80 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
                  >
                    <Link href={`/estudios/${estudio.slug}`} className="block">
                      <div
                        className={`relative overflow-hidden bg-[#08111f] ${
                          cardAspectClasses[coverImage.aspect]
                        }`}
                      >
                        {coverImage.url ? (
                          <img
                            src={coverImage.url}
                            alt={coverImage.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
                            style={{
                              objectFit:
                                coverImage.fit as CSSProperties["objectFit"],
                              objectPosition:
                                coverImage.position as CSSProperties["objectPosition"],
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-[#009B8D]">
                            MP
                          </div>
                        )}

                        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/75 via-transparent to-transparent opacity-90" />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {hasPdf && (
                            <span className="rounded-full border border-[#009B8D]/25 bg-[#08111f]/85 px-3 py-1 text-xs font-black text-[#20d6c7] backdrop-blur">
                              PDF
                            </span>
                          )}

                          {hasSupportImage && (
                            <span className="rounded-full border border-white/10 bg-[#08111f]/85 px-3 py-1 text-xs font-black text-slate-200 backdrop-blur">
                              Imagen de apoyo
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="rounded-full bg-[#009B8D]/90 px-3 py-1 text-xs font-black text-white">
                            {estudio.year || "Sin año"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-7">
                      <div className="mb-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-black text-[#20d6c7]">
                          {estudio.category || "Publicación"}
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-sm font-semibold text-slate-400">
                          {estudio.year || "Sin año"}
                        </span>

                        {hasPdf && (
                          <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm font-black text-[#20d6c7]">
                            Descargable
                          </span>
                        )}
                      </div>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-black leading-tight text-white">
                        <Link
                          href={`/estudios/${estudio.slug}`}
                          className="transition hover:text-[#20d6c7]"
                        >
                          {estudio.title}
                        </Link>
                      </h2>

                      <p className="mb-6 line-clamp-4 wrap-anywhere leading-7 text-slate-400">
                        {estudio.summary}
                      </p>

                      <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-[#08111f]/70 p-4 text-sm">
                        <SmallInfo
                          label="Metodología"
                          value={estudio.methodology || "No definida"}
                        />

                        <SmallInfo
                          label="Muestra"
                          value={estudio.sample || "No definida"}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <Link
                          href={`/estudios/${estudio.slug}`}
                          className="font-black text-[#009B8D] transition hover:text-white"
                        >
                          Ver estudio →
                        </Link>

                        {hasPdf && (
                          <span className="text-xs font-semibold text-slate-500">
                            PDF disponible
                          </span>
                        )}
                      </div>
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

function getCoverImage(estudio: EstudioCard): CardImageData {
  const galleryCover = estudio.images
    ?.filter((image) => image.url)
    .sort((a, b) => a.order - b.order)[0];

  if (galleryCover) {
    return {
      url: galleryCover.url,
      alt: galleryCover.alt || estudio.title,
      aspect: normalizeAspect(galleryCover.aspect),
      fit: normalizeFit(galleryCover.fit),
      position: normalizePosition(galleryCover.position),
    };
  }

  return {
    url: estudio.imageUrl || "",
    alt: estudio.title,
    aspect: normalizeAspect(estudio.imageAspect),
    fit: normalizeFit(estudio.imageFit),
    position: normalizePosition(estudio.imagePosition),
  };
}

function getImageCount(estudio: EstudioCard): number {
  const galleryCount =
    estudio.images?.filter((image) => Boolean(image.url)).slice(0, 2).length ||
    0;

  if (galleryCount > 0) {
    return galleryCount;
  }

  return estudio.imageUrl ? 1 : 0;
}

function normalizeAspect(value?: string): CardImageAspect {
  if (value === "wide" || value === "square" || value === "portrait") {
    return value;
  }

  return "wide";
}

function normalizeFit(value?: string): CardImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "contain";
}

function normalizePosition(value?: string): CardImagePosition {
  if (
    value === "center" ||
    value === "top" ||
    value === "bottom" ||
    value === "left" ||
    value === "right"
  ) {
    return value;
  }

  return "center";
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="line-clamp-2 wrap-anywhere font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando estudios...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <h2 className="mb-3 text-2xl font-black">
        Aún no hay estudios publicados
      </h2>

      <p className="text-slate-400">
        Los estudios creados como borrador no se mostrarán en esta página.
        Publica un estudio desde el panel administrativo.
      </p>
    </div>
  );
}