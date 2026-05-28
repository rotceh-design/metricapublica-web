import { InicioContenido } from "@/types/contenido";
import { Estudio } from "@/types/estudio";
import { Noticia } from "@/types/noticia";

type HeroProps = {
  contenido: InicioContenido;
  estudios?: Estudio[];
  noticias?: Noticia[];
};

type RibbonItem = {
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

const fallbackRibbonItems: RibbonItem[] = [
  {
    id: "fallback-estudio-1",
    type: "Estudio",
    title: "Radiografía de percepción ciudadana",
    category: "Opinión pública",
    href: "/estudios",
  },
  {
    id: "fallback-noticia-1",
    type: "Noticia",
    title: "Análisis de escenarios públicos y toma de decisiones",
    category: "Actualidad",
    href: "/noticias",
  },
  {
    id: "fallback-estudio-2",
    type: "Estudio",
    title: "Análisis territorial y comportamiento social",
    category: "Territorio",
    href: "/estudios",
  },
  {
    id: "fallback-noticia-2",
    type: "Noticia",
    title: "Datos para comprender mejor el entorno público",
    category: "Investigación",
    href: "/noticias",
  },
];

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
  const dynamicRibbonItems: RibbonItem[] = [
    ...estudios.slice(0, 6).map((estudio) => ({
      id: `estudio-${estudio.id}`,
      type: "Estudio" as const,
      title: estudio.title,
      category: estudio.category || estudio.year || "Publicación",
      href: `/estudios/${estudio.slug}`,
      imageUrl: getImageUrl(estudio),
      imageFit: getImageFit(estudio),
      imagePosition: getImagePosition(estudio),
    })),
    ...noticias.slice(0, 6).map((noticia) => ({
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

  const ribbonItems =
    dynamicRibbonItems.length > 0 ? dynamicRibbonItems : fallbackRibbonItems;

  const duplicatedItems = [...ribbonItems, ...ribbonItems, ...ribbonItems];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#06101f] via-[#0f2744] to-[#234e82] px-6 pb-12 pt-32 text-center text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-[8%] top-[18%] h-24 w-24 rounded-full border border-[#009B8D]/25 opacity-60 blur-[1px]" />
      <div className="absolute bottom-[18%] right-[10%] h-52 w-52 rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="absolute right-[18%] top-[26%] h-3 w-3 rounded-full bg-[#009B8D] shadow-[0_0_25px_#009B8D]" />
      <div className="absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#009B8D]/8 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
        <div className="mx-auto max-w-5xl">
          <span className="mb-7 inline-flex rounded-full border border-[#009B8D]/30 bg-[#009B8D]/15 px-5 py-2 text-sm font-medium text-[#009B8D]">
            {contenido.heroLabel}
          </span>

          <h1 className="mb-6 wrap-anywhere text-5xl font-bold leading-tight text-white md:text-7xl">
            {contenido.heroTitle}
          </h1>

          <p className="mx-auto mb-9 max-w-2xl wrap-anywhere text-lg leading-8 text-slate-300">
            {contenido.heroDescription}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={contenido.primaryButtonHref || "/servicios"}
              className="rounded-xl bg-[#009B8D] px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#00877a] hover:shadow-[0_15px_40px_rgba(0,155,141,0.25)]"
            >
              {contenido.primaryButtonLabel}
            </a>

            <a
              href={contenido.secondaryButtonHref || "/estudios"}
              className="rounded-xl border border-[#009B8D]/40 px-8 py-4 font-semibold text-white transition hover:bg-[#009B8D]/10"
            >
              {contenido.secondaryButtonLabel}
            </a>
          </div>
        </div>

        <div className="mt-14 w-full overflow-hidden">
          <div className="mb-5 flex items-center justify-between gap-4 text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#009B8D]">
                Últimas publicaciones
              </p>

              <h2 className="mt-2 text-xl font-bold text-white md:text-2xl">
                Estudios y noticias destacadas
              </h2>
            </div>

            <a
              href="/estudios"
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 md:inline-flex"
            >
              Ver publicaciones
            </a>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-[#0f2744] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-[#0f2744] to-transparent" />

            <div className="group overflow-hidden">
              <div className="flex w-max animate-[heroRibbon_42s_linear_infinite] gap-4 group-hover:[animation-play-state:paused]">
                {duplicatedItems.map((item, index) => (
                  <a
                    key={`${item.id}-${index}`}
                    href={item.href}
                    className="w-[290px] shrink-0 overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#08111f]/75 text-left shadow-2xl backdrop-blur transition hover:-translate-y-1 hover:border-[#009B8D]/45 hover:bg-[#0f2744]"
                  >
                    <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#1a365d]/80 to-[#009B8D]/20">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full transition duration-700 hover:scale-105"
                          style={{
                            objectFit: item.imageFit || "cover",
                            objectPosition: item.imagePosition || "center",
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-end p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D]/20 text-2xl text-[#009B8D]">
                            {item.type === "Estudio" ? "▣" : "◉"}
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-[#08111f] via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${
                            item.type === "Estudio"
                              ? "bg-[#009B8D]/80 text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="max-w-[150px] truncate rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                          {item.category}
                        </span>

                        <span className="text-xs font-semibold text-[#009B8D]">
                          Ver →
                        </span>
                      </div>

                      <h3 className="line-clamp-3 wrap-anywhere text-lg font-bold leading-snug text-white">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm font-semibold text-[#009B8D]">
                        Ver detalle →
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes heroRibbon {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-33.333%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}