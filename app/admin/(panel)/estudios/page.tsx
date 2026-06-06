"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { deleteEstudio, getEstudios } from "@/lib/estudios";
import { Estudio } from "@/types/estudio";
import { ContentImage } from "@/types/content-image";

const thumbAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
} as const;

type EstudioAdminCard = Estudio & {
  images?: ContentImage[];
};

type ThumbImageAspect = keyof typeof thumbAspectClasses;
type ThumbImageFit = "cover" | "contain";
type ThumbImagePosition = "center" | "top" | "bottom" | "left" | "right";

type ThumbImageData = {
  url: string;
  alt: string;
  aspect: ThumbImageAspect;
  fit: ThumbImageFit;
  position: ThumbImagePosition;
};

export default function AdminEstudiosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [estudios, setEstudios] = useState<EstudioAdminCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEstudios = async () => {
    const data = await getEstudios();
    setEstudios(data as EstudioAdminCard[]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadEstudios();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este estudio?");

    if (!confirmDelete) return;

    await deleteEstudio(id);
    await loadEstudios();
  };

  const totalPublished = estudios.filter(
    (estudio) => estudio.status === "published"
  ).length;

  const totalDrafts = estudios.filter(
    (estudio) => estudio.status !== "published"
  ).length;

  const totalWithPdf = estudios.filter((estudio) => Boolean(estudio.pdfUrl))
    .length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">
            Cargando estudios...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-[#009B8D]/10 bg-[#08111f] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>

            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Estudios / Publicaciones
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Administra estudios, documentos descargables, fichas técnicas,
              portada, imagen de apoyo y estado de publicación.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/dashboard"
              className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/5"
            >
              Volver al dashboard
            </Link>

            <Link
              href="/admin/estudios/nuevo"
              className="rounded-2xl bg-[#009B8D] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#00877a]"
            >
              Crear estudio
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1760px]">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Total estudios" value={String(estudios.length)} />
            <StatCard label="Publicados" value={String(totalPublished)} />
            <StatCard label="Borradores" value={String(totalDrafts)} />
            <StatCard label="Con PDF" value={String(totalWithPdf)} />
          </div>

          {estudios.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5">
              {estudios.map((estudio) => {
                const coverImage = getCoverImage(estudio);
                const imageCount = getImageCount(estudio);
                const hasSupportImage = imageCount > 1;
                const hasPdf = Boolean(estudio.pdfUrl);
                const isPublished = estudio.status === "published";

                return (
                  <article
                    key={estudio.id}
                    className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.16)] transition hover:border-[#009B8D]/35"
                  >
                    <div className="grid gap-0 xl:grid-cols-[300px_1fr]">
                      <div className="bg-[#08111f] p-4">
                        <Link
                          href={`/admin/estudios/editar/${estudio.id}`}
                          className="group block"
                        >
                          <div
                            className={`relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08111f] ${
                              thumbAspectClasses[coverImage.aspect]
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
                              <div className="flex h-full w-full items-center justify-center text-4xl font-black text-[#009B8D]">
                                MP
                              </div>
                            )}

                            <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/75 via-transparent to-transparent" />

                            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  isPublished
                                    ? "bg-[#009B8D]/90 text-white"
                                    : "bg-white/10 text-slate-200 backdrop-blur"
                                }`}
                              >
                                {isPublished ? "Publicado" : "Borrador"}
                              </span>

                              {hasPdf && (
                                <span className="rounded-full border border-[#009B8D]/25 bg-[#08111f]/85 px-3 py-1 text-xs font-black text-[#20d6c7] backdrop-blur">
                                  PDF
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-3 left-3 right-3">
                              <span className="rounded-full border border-white/10 bg-[#08111f]/85 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur">
                                {coverImage.fit} · {coverImage.position}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="p-5 sm:p-6">
                        <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
                          <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black text-[#20d6c7]">
                                {estudio.category || "Sin categoría"}
                              </span>

                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                                {estudio.year || "Sin año"}
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-black ${
                                  isPublished
                                    ? "border-[#009B8D]/25 bg-[#009B8D]/10 text-[#20d6c7]"
                                    : "border-white/10 bg-white/5 text-slate-400"
                                }`}
                              >
                                {isPublished ? "Publicado" : "Borrador"}
                              </span>

                              {hasPdf && (
                                <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
                                  PDF disponible
                                </span>
                              )}

                              {hasSupportImage && (
                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                                  Imagen de apoyo
                                </span>
                              )}
                            </div>

                            <h2 className="mb-2 wrap-anywhere text-2xl font-black leading-tight text-white">
                              {estudio.title}
                            </h2>

                            <p className="mb-4 wrap-anywhere text-sm font-semibold text-slate-500">
                              /estudios/{estudio.slug}
                            </p>

                            <p className="mb-5 max-w-4xl wrap-anywhere leading-7 text-slate-400">
                              {estudio.summary}
                            </p>

                            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-4 text-sm md:grid-cols-3">
                              <SmallInfo
                                label="Metodología"
                                value={estudio.methodology || "No definida"}
                              />

                              <SmallInfo
                                label="Muestra"
                                value={estudio.sample || "No definida"}
                              />

                              <SmallInfo
                                label="Fecha terreno"
                                value={estudio.fieldworkDate || "No definida"}
                              />
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
                            <Link
                              href={`/admin/estudios/editar/${estudio.id}`}
                              className="rounded-2xl border border-[#009B8D]/30 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#009B8D]/10"
                            >
                              Editar
                            </Link>

                            {isPublished && (
                              <Link
                                href={`/estudios/${estudio.slug}`}
                                target="_blank"
                                className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-slate-200 transition hover:bg-white/5 hover:text-white"
                              >
                                Ver público
                              </Link>
                            )}

                            {hasPdf && (
                              <a
                                href={estudio.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-5 py-3 text-center text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15"
                              >
                                PDF
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(estudio.id)}
                              className="rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function getCoverImage(estudio: EstudioAdminCard): ThumbImageData {
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

function getImageCount(estudio: EstudioAdminCard): number {
  const galleryCount =
    estudio.images?.filter((image) => Boolean(image.url)).slice(0, 2).length ||
    0;

  if (galleryCount > 0) {
    return galleryCount;
  }

  return estudio.imageUrl ? 1 : 0;
}

function normalizeAspect(value?: string): ThumbImageAspect {
  if (value === "wide" || value === "square" || value === "portrait") {
    return value;
  }

  return "wide";
}

function normalizeFit(value?: string): ThumbImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "contain";
}

function normalizePosition(value?: string): ThumbImagePosition {
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="line-clamp-2 wrap-anywhere font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <h2 className="mb-2 text-2xl font-black">No hay estudios todavía</h2>

      <p className="mb-6 text-slate-400">
        Crea el primer estudio o publicación para mostrarlo en la web.
      </p>

      <Link
        href="/admin/estudios/nuevo"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Crear estudio
      </Link>
    </div>
  );
}