"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedNoticiaBySlug } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";
import {
  ContentImage,
  ContentImageAspect,
  ContentImageFit,
  ContentImagePosition,
} from "@/types/content-image";

const aspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
} as const;

export default function NoticiaDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticia = async () => {
      try {
        const data = await getPublishedNoticiaBySlug(slug);
        setNoticia(data);
      } catch (error) {
        console.error("Error cargando noticia:", error);
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadNoticia();
    }
  }, [slug]);

  const noticiaImages = useMemo(() => {
    if (!noticia) return [];

    return buildNoticiaImages(noticia);
  }, [noticia]);

  const coverImage = noticiaImages[0];
  const secondaryImage = noticiaImages[1];

  const readingTime = useMemo(() => {
    if (!noticia?.content) return "1 min de lectura";

    const words = noticia.content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));

    return `${minutes} min de lectura`;
  }, [noticia?.content]);

  const contentParts = useMemo(() => {
    return splitContentForSecondaryImage(noticia?.content || "");
  }, [noticia?.content]);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[6%] top-72 h-56 w-56 rounded-full bg-[#1a365d]/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {loading ? (
            <LoadingState />
          ) : !noticia ? (
            <NotFoundState />
          ) : (
            <article>
              <Link
                href="/noticias"
                className="mb-8 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-sm font-black text-[#20d6c7] transition hover:border-[#009B8D]/50 hover:bg-[#009B8D]/15 hover:text-white"
              >
                ← Volver a noticias
              </Link>

              <header className="mb-8 overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] via-[#10243d] to-[#08111f] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.25)] md:p-10">
                <div className="mb-7 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-black text-[#20d6c7]">
                    {noticia.category || "Institucional"}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                    Publicado
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                    {readingTime}
                  </span>

                  {noticiaImages.length > 1 && (
                    <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm font-black text-[#20d6c7]">
                      Portada + imagen de apoyo
                    </span>
                  )}
                </div>

                <h1 className="mb-6 max-w-5xl wrap-anywhere text-4xl font-black leading-tight text-white md:text-6xl">
                  {noticia.title}
                </h1>

                <p className="max-w-3xl wrap-anywhere text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
                  {noticia.summary}
                </p>
              </header>

              <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <section className="space-y-8">
                  <ArticleImage
                    image={coverImage}
                    title={noticia.title}
                    fallbackLabel="Imagen principal"
                    main
                  />

                  <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div className="border-b border-white/10 bg-[#08111f]/70 px-7 py-5 md:px-10">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#009B8D]">
                        Desarrollo
                      </p>
                    </div>

                    <div className="space-y-8 p-7 md:p-10">
                      <ArticleText paragraphs={contentParts.before} />

                      {secondaryImage && (
                        <ArticleImage
                          image={secondaryImage}
                          title={noticia.title}
                          fallbackLabel="Imagen secundaria"
                          caption={secondaryImage.alt}
                        />
                      )}

                      <ArticleText paragraphs={contentParts.after} />
                    </div>
                  </div>
                </section>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Publicación
                    </p>

                    <div className="space-y-5 text-sm text-slate-400">
                      <InfoItem
                        label="Categoría"
                        value={noticia.category || "Institucional"}
                      />

                      <InfoItem label="Estado" value="Publicado" />

                      <InfoItem label="Lectura estimada" value={readingTime} />

                      <InfoItem
                        label="Imágenes"
                        value={`${noticiaImages.length || 0} de 2`}
                      />

                      <InfoItem
                        label="URL"
                        value={`/noticias/${noticia.slug}`}
                        wrap
                      />
                    </div>
                  </div>

                  {coverImage && (
                    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                      <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                        Imagen principal
                      </p>

                      <MiniImage image={coverImage} title={noticia.title} />

                      {secondaryImage && (
                        <>
                          <p className="mb-4 mt-5 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                            Imagen de apoyo
                          </p>

                          <MiniImage
                            image={secondaryImage}
                            title={`${noticia.title} apoyo`}
                          />
                        </>
                      )}

                      <p className="mt-4 text-xs leading-5 text-slate-500">
                        La portada se usa en listados. La imagen de apoyo se
                        integra dentro del desarrollo de la noticia.
                      </p>
                    </div>
                  )}
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

function ArticleImage({
  image,
  title,
  fallbackLabel,
  caption,
  main = false,
}: {
  image?: ContentImage;
  title: string;
  fallbackLabel: string;
  caption?: string;
  main?: boolean;
}) {
  const aspectClass = image
    ? aspectClasses[normalizeAspect(image.aspect)]
    : main
      ? "aspect-[16/9]"
      : "aspect-[16/10]";

  return (
    <figure className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className={`relative overflow-hidden bg-[#0a1628] ${aspectClass}`}>
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || title}
            loading={main ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full"
            style={{
              objectFit: image.fit || "contain",
              objectPosition: image.position || "center",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-[#009B8D]">
            MP
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/55 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <span className="rounded-full bg-[#009B8D]/90 px-3 py-1 text-xs font-black text-white">
            {fallbackLabel}
          </span>
        </div>
      </div>

      {caption && (
        <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MiniImage({
  image,
  title,
}: {
  image: ContentImage;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]">
      <div className="aspect-[16/9]">
        <img
          src={image.url}
          alt={image.alt || title}
          loading="lazy"
          decoding="async"
          className="h-full w-full"
          style={{
            objectFit: image.fit || "contain",
            objectPosition: image.position || "center",
          }}
        />
      </div>
    </div>
  );
}

function ArticleText({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 24)}-${index}`}
          className="wrap-anywhere text-lg leading-9 text-slate-300"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function splitContentForSecondaryImage(content: string): {
  before: string[];
  after: string[];
} {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return {
      before: [],
      after: [],
    };
  }

  if (paragraphs.length === 1) {
    return {
      before: paragraphs,
      after: [],
    };
  }

  const middleIndex = Math.ceil(paragraphs.length / 2);

  return {
    before: paragraphs.slice(0, middleIndex),
    after: paragraphs.slice(middleIndex),
  };
}

function buildNoticiaImages(noticia: Noticia): ContentImage[] {
  const imagesFromGallery = noticia.images
    ?.filter((image) => image.url)
    .sort((a, b) => a.order - b.order)
    .slice(0, 2);

  if (imagesFromGallery && imagesFromGallery.length > 0) {
    return imagesFromGallery.map((image, index) => ({
      url: image.url,
      alt: image.alt || noticia.title,
      aspect: normalizeAspect(image.aspect),
      fit: normalizeFit(image.fit),
      position: normalizePosition(image.position),
      order: index,
      role: index === 0 ? "cover" : "gallery",
    }));
  }

  if (!noticia.imageUrl) return [];

  return [
    {
      url: noticia.imageUrl,
      alt: noticia.title,
      aspect: normalizeAspect(noticia.imageAspect),
      fit: normalizeFit(noticia.imageFit),
      position: normalizePosition(noticia.imagePosition),
      order: 0,
      role: "cover",
    },
  ];
}

function normalizeAspect(value?: string): ContentImageAspect {
  if (value === "wide" || value === "square" || value === "portrait") {
    return value;
  }

  return "wide";
}

function normalizeFit(value?: string): ContentImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "contain";
}

function normalizePosition(value?: string): ContentImagePosition {
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

function InfoItem({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className={`font-bold text-white ${wrap ? "wrap-anywhere" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando noticia...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Noticia
      </span>

      <h1 className="mb-4 text-4xl font-black">Noticia no encontrada</h1>

      <p className="mb-6 text-slate-400">
        La noticia no existe o todavía no está publicada.
      </p>

      <Link
        href="/noticias"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Volver a noticias
      </Link>
    </div>
  );
}