"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedNoticias } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";

const cardAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
} as const;

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

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticias = async () => {
      try {
        const data = await getPublishedNoticias();
        setNoticias(data);
      } catch (error) {
        console.error("Error cargando noticias:", error);
        setNoticias([]);
      } finally {
        setLoading(false);
      }
    };

    loadNoticias();
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
            Noticias
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Actualidad, análisis y novedades de Métrica Pública
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Revisa publicaciones, análisis, novedades institucionales y
            contenidos actualizados por el equipo de Métrica Pública.
          </p>

          {loading ? (
            <LoadingState />
          ) : noticias.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {noticias.map((noticia) => {
                const coverImage = getCoverImage(noticia);
                const imageCount = getImageCount(noticia);

                return (
                  <article
                    key={noticia.id}
                    className="group overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/80 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
                  >
                    <Link href={`/noticias/${noticia.slug}`} className="block">
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

                        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/65 via-transparent to-transparent opacity-80" />

                        {imageCount > 1 && (
                          <div className="absolute bottom-4 right-4 rounded-full border border-[#009B8D]/25 bg-[#08111f]/85 px-3 py-1 text-xs font-black text-[#20d6c7] backdrop-blur">
                            Portada + apoyo
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-7">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-black text-[#20d6c7]">
                          {noticia.category || "Institucional"}
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                          Publicado
                        </span>
                      </div>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-black leading-tight text-white">
                        <Link
                          href={`/noticias/${noticia.slug}`}
                          className="transition hover:text-[#20d6c7]"
                        >
                          {noticia.title}
                        </Link>
                      </h2>

                      <p className="mb-6 line-clamp-4 wrap-anywhere leading-7 text-slate-400">
                        {noticia.summary}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <Link
                          href={`/noticias/${noticia.slug}`}
                          className="font-black text-[#009B8D] transition hover:text-white"
                        >
                          Leer más →
                        </Link>

                        {imageCount > 1 && (
                          <span className="text-xs font-semibold text-slate-500">
                            Imagen de apoyo
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

function getCoverImage(noticia: Noticia): CardImageData {
  const galleryCover = noticia.images
    ?.filter((image) => image.url)
    .sort((a, b) => a.order - b.order)[0];

  if (galleryCover) {
    return {
      url: galleryCover.url,
      alt: galleryCover.alt || noticia.title,
      aspect: normalizeAspect(galleryCover.aspect),
      fit: normalizeFit(galleryCover.fit),
      position: normalizePosition(galleryCover.position),
    };
  }

  return {
    url: noticia.imageUrl || "",
    alt: noticia.title,
    aspect: normalizeAspect(noticia.imageAspect),
    fit: normalizeFit(noticia.imageFit),
    position: normalizePosition(noticia.imagePosition),
  };
}

function getImageCount(noticia: Noticia): number {
  const galleryCount =
    noticia.images?.filter((image) => Boolean(image.url)).slice(0, 2).length ||
    0;

  if (galleryCount > 0) {
    return galleryCount;
  }

  return noticia.imageUrl ? 1 : 0;
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

  return "cover";
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

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando noticias...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <h2 className="mb-3 text-2xl font-black">
        Aún no hay noticias publicadas
      </h2>

      <p className="text-slate-400">
        Las noticias creadas como borrador no se mostrarán en esta página.
        Publica una noticia desde el panel administrativo.
      </p>
    </div>
  );
}