import Link from "next/link";

import { InicioContenido } from "@/types/contenido";
import { Estudio } from "@/types/estudio";
import { Noticia } from "@/types/noticia";

type HeroProps = {
  contenido: InicioContenido;
  estudios?: Estudio[];
  noticias?: Noticia[];
};

type PublicationItem = {
  id: string;
  type: "Estudio" | "Noticia";
  title: string;
  category: string;
  href: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

type MaybeImageData = {
  imageUrl?: string;
  featuredImageUrl?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  image?: string;
  featuredImage?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

function getImageUrl(item: unknown) {
  const data = item as MaybeImageData;

  return (
    data.imageUrl ||
    data.featuredImageUrl ||
    data.coverImageUrl ||
    data.thumbnailUrl ||
    data.image ||
    data.featuredImage ||
    ""
  );
}

function getImageFit(item: unknown) {
  const data = item as MaybeImageData;
  return data.imageFit || "cover";
}

function getImagePosition(item: unknown) {
  const data = item as MaybeImageData;
  return data.imagePosition || "center";
}

export default function Hero({
  contenido,
  estudios = [],
  noticias = [],
}: HeroProps) {
  const publicationItems: PublicationItem[] = [
    ...estudios.slice(0, 4).map((estudio) => ({
      id: `estudio-${estudio.id}`,
      type: "Estudio" as const,
      title: estudio.title,
      category: estudio.category || estudio.year || "Publicación",
      href: `/estudios/${estudio.slug}`,
      imageUrl: getImageUrl(estudio),
      imageFit: getImageFit(estudio),
      imagePosition: getImagePosition(estudio),
    })),
    ...noticias.slice(0, 4).map((noticia) => ({
      id: `noticia-${noticia.id}`,
      type: "Noticia" as const,
      title: noticia.title,
      category: noticia.category || "Actualidad",
      href: `/noticias/${noticia.slug}`,
      imageUrl: getImageUrl(noticia),
      imageFit: getImageFit(noticia),
      imagePosition: getImagePosition(noticia),
    })),
  ];

  const featuredPublication = publicationItems[0];
  const secondaryPublications = publicationItems.slice(1, 5);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#071221] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,155,141,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(35,78,130,0.58),transparent_36%),linear-gradient(135deg,#071221_0%,#0f2744_50%,#071221_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.04)_1px,transparent_1px)] bg-size-[56px_56px]" />
      <div className="pointer-events-none absolute left-[4%] top-[29%] h-28 w-28 rounded-full border border-[#009B8D]/20 opacity-60 blur-[1px]" />
      <div className="pointer-events-none absolute right-[8%] top-[24%] h-3 w-3 rounded-full bg-[#20d6c7] shadow-[0_0_35px_rgba(32,214,199,0.9)]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[4%] h-96 w-96 rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[34rem] w-[34rem] rounded-full bg-[#1a365d]/35 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1800px] flex-col justify-center px-4 pb-10 pt-28 sm:px-6 lg:px-10 xl:pt-32 2xl:px-14">
        <div className="w-full">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-[#009B8D]/30 bg-[#009B8D]/15 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              {contenido.heroLabel}
            </span>

            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold text-slate-300 backdrop-blur">
              Evidencia · datos · estrategia
            </span>
          </div>

          <h1 className="max-w-[1600px] text-[clamp(3.2rem,4.85vw,5.8rem)] font-black leading-[0.98] tracking-tight text-white md:leading-[0.94]">
            {contenido.heroTitle}
          </h1>
        </div>

        <div className="mt-8 grid w-full gap-10 xl:grid-cols-[minmax(0,0.82fr)_minmax(560px,1fr)] xl:items-start">
          <div className="max-w-4xl pt-1 xl:pt-4">
            <p className="max-w-3xl wrap-anywhere text-lg leading-8 text-slate-300 md:text-xl">
              {contenido.heroDescription}
            </p>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              <Link
                href={contenido.primaryButtonHref || "/servicios"}
                className="group inline-flex w-full items-center justify-center rounded-2xl bg-[#009B8D] px-8 py-4 text-sm font-black text-white shadow-[0_18px_55px_rgba(0,155,141,0.22)] transition hover:-translate-y-1 hover:bg-[#00877a] hover:shadow-[0_24px_70px_rgba(0,155,141,0.32)]"
              >
                {contenido.primaryButtonLabel}
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href={contenido.secondaryButtonHref || "/estudios"}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#009B8D]/35 bg-white/5 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-[#009B8D]/10"
              >
                {contenido.secondaryButtonLabel}
              </Link>
            </div>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <MiniTrust label="Estrategia" value="Datos" />
              <MiniTrust label="Análisis" value="Territorio" />
              <MiniTrust label="Decisión" value="Evidencia" />
            </div>
          </div>

          <div className="relative w-full">
            <div className="absolute -inset-8 rounded-[3rem] bg-[#009B8D]/10 blur-3xl" />

            {featuredPublication ? (
              <FeaturedPublication item={featuredPublication} />
            ) : (
              <EmptyHeroPublication />
            )}
          </div>
        </div>

        <div className="mt-12 w-full">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#20d6c7]">
                Últimas publicaciones
              </p>

              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Estudios y noticias destacadas
              </h2>
            </div>

            <Link
              href="/estudios"
              className="w-fit rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-5 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D] hover:text-white"
            >
              Ver publicaciones
            </Link>
          </div>

          {secondaryPublications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {secondaryPublications.map((item) => (
                <SmallPublicationCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#009B8D]/25 bg-[#0f2744]/60 p-6 text-center">
              <p className="text-sm font-semibold text-slate-400">
                Cuando publiques más estudios o noticias desde el panel,
                aparecerán automáticamente en este bloque.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedPublication({ item }: { item: PublicationItem }) {
  return (
    <Link
      href={item.href}
      className="group relative block min-h-[390px] overflow-hidden rounded-[2.4rem] border border-[#009B8D]/15 bg-[#08111f]/80 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#009B8D]/45 md:min-h-[430px]"
    >
      <div className="absolute inset-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
            style={{
              objectFit: item.imageFit || "cover",
              objectPosition: item.imagePosition || "center",
            }}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#1a365d] via-[#0f2744] to-[#071221]" />
        )}

        <div className="absolute inset-0 bg-linear-to-r from-[#071221]/95 via-[#071221]/82 to-[#071221]/50" />
        <div className="absolute inset-0 bg-linear-to-t from-[#071221] via-[#071221]/70 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full min-h-[390px] flex-col justify-between p-7 md:min-h-[430px] md:p-9">
        <div className="flex flex-wrap items-start gap-3">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur ${
              item.type === "Estudio"
                ? "bg-[#009B8D] text-white"
                : "bg-white/20 text-white"
            }`}
          >
            {item.type}
          </span>

          <span className="inline-flex max-w-xs truncate rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur">
            {item.category}
          </span>

          <span className="inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-xs font-black text-[#20d6c7] backdrop-blur">
            Destacado
          </span>
        </div>

        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[#20d6c7]">
            Publicación principal
          </p>

          <h2 className="wrap-anywhere text-3xl font-black leading-tight md:text-5xl">
            {item.title}
          </h2>

          <div className="mt-8 inline-flex rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition group-hover:bg-[#00877a]">
            Ver detalle
            <span className="ml-2 transition group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyHeroPublication() {
  return (
    <div className="flex min-h-[390px] items-center justify-center rounded-[2.4rem] border border-dashed border-[#009B8D]/25 bg-[#08111f]/80 p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl md:min-h-[430px]">
      <div>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-3xl text-[#20d6c7]">
          ▣
        </div>

        <h3 className="text-2xl font-black">
          Aún no hay publicaciones visibles
        </h3>

        <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-400">
          Cuando publiques estudios o noticias desde el panel, aparecerán como
          contenido destacado en la portada.
        </p>
      </div>
    </div>
  );
}

function SmallPublicationCard({ item }: { item: PublicationItem }) {
  return (
    <Link
      href={item.href}
      className="group overflow-hidden rounded-[1.8rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-[#009B8D]/45 hover:bg-[#10243d]"
    >
      <div className="relative h-44 overflow-hidden bg-linear-to-br from-[#1a365d]/80 to-[#009B8D]/20">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full transition duration-700 group-hover:scale-105"
            style={{
              objectFit: item.imageFit || "cover",
              objectPosition: item.imagePosition || "center",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-end p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009B8D]/20 text-3xl text-[#20d6c7]">
              {item.type === "Estudio" ? "▣" : "◉"}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#08111f] via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black backdrop-blur ${
              item.type === "Estudio"
                ? "bg-[#009B8D]/85 text-white"
                : "bg-white/20 text-white"
            }`}
          >
            {item.type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="max-w-[9.5rem] truncate rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            {item.category}
          </span>

          <span className="text-xs font-black text-[#20d6c7]">Ver →</span>
        </div>

        <h3 className="line-clamp-3 wrap-anywhere text-lg font-black leading-snug text-white">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

function MiniTrust({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[#009B8D]/15 bg-white/5 p-4 text-center backdrop-blur transition hover:-translate-y-1 hover:border-[#009B8D]/35 hover:bg-[#009B8D]/10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-black text-[#20d6c7]">{value}</p>
    </div>
  );
}