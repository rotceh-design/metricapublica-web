import SectorIcon from "@/components/icons/SectorIcons";
import { defaultInicioContenido } from "@/lib/contenido";
import { InicioContenido } from "@/types/contenido";
import { Sector, SectorIconKey } from "@/types/sector";

type SectorsProps = {
  contenido?: InicioContenido;
  sectores?: Sector[];
  loading?: boolean;
};

type FallbackSector = {
  id: string;
  title: string;
  description: string;
  iconKey: SectorIconKey;
  featured: boolean;
};

const fallbackSectors: FallbackSector[] = [
  {
    id: "fallback-gobierno",
    title: "Gobierno",
    description:
      "Apoyo a instituciones públicas en diagnósticos, estudios de percepción y toma de decisiones basadas en evidencia.",
    iconKey: "gobierno",
    featured: true,
  },
  {
    id: "fallback-campanas",
    title: "Campañas",
    description:
      "Investigación estratégica para comprender audiencias, territorios, posicionamiento y escenarios políticos.",
    iconKey: "campanas",
    featured: true,
  },
  {
    id: "fallback-privado",
    title: "Sector privado",
    description:
      "Estudios para empresas, marcas y organizaciones que necesitan comprender mejor a sus públicos.",
    iconKey: "privado",
    featured: false,
  },
  {
    id: "fallback-organizaciones",
    title: "Organizaciones sociales",
    description:
      "Análisis de comunidades, necesidades territoriales y percepción ciudadana para proyectos sociales.",
    iconKey: "organizaciones",
    featured: false,
  },
  {
    id: "fallback-academia",
    title: "Academia",
    description:
      "Diseño, levantamiento y análisis de información para investigaciones aplicadas y publicaciones.",
    iconKey: "academia",
    featured: false,
  },
];

export default function Sectors({
  contenido = defaultInicioContenido,
  sectores = [],
  loading = false,
}: SectorsProps) {
  const sectorsToShow =
    sectores.length > 0
      ? sectores.slice(0, 5).map((sector) => ({
          id: sector.id,
          title: sector.title,
          description: sector.description,
          iconKey: sector.iconKey || "gobierno",
          featured: sector.featured,
        }))
      : fallbackSectors;

  return (
    <section id="sectores" className="bg-[#0a1628] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            {contenido.sectorsLabel}
          </span>

          <h2 className="mb-5 wrap-anywhere text-4xl font-bold leading-tight md:text-5xl">
            {contenido.sectorsTitle}
          </h2>

          <p className="wrap-anywhere text-lg leading-8 text-slate-400">
            {contenido.sectorsDescription}
          </p>
        </div>

        {loading ? (
          <SectorsLoading />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {sectorsToShow.map((sector) => (
                <article
                  key={sector.id}
                  className="group flex h-full flex-col rounded-3xl border border-[#009B8D]/10 bg-linear-to-b from-[#1a365d]/35 to-[#0f2744]/30 p-6 text-center transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
                >
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#009B8D]/20 bg-[#009B8D]/10 text-[#009B8D] transition group-hover:bg-[#009B8D]/20 group-hover:shadow-[0_0_24px_rgba(0,155,141,0.18)]">
                    <SectorIcon iconKey={sector.iconKey} />
                  </div>

                  <div className="mb-4 flex justify-center gap-2">
                    {sector.featured && (
                      <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                        Destacado
                      </span>
                    )}

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      Sector
                    </span>
                  </div>

                  <h3 className="mb-3 wrap-anywhere text-lg font-bold text-white">
                    {sector.title}
                  </h3>

                  <p className="wrap-anywhere text-sm leading-6 text-slate-400">
                    {sector.description}
                  </p>
                </article>
              ))}
            </div>

            {sectores.length > 5 && (
              <div className="mt-10 text-center">
                <a
                  href="/sectores"
                  className="inline-flex rounded-xl border border-[#009B8D]/40 px-6 py-3 font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
                >
                  Ver todos los sectores
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function SectorsLoading() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="rounded-3xl border border-[#009B8D]/10 bg-[#0f2744]/50 p-6 text-center"
        >
          <div className="mx-auto mb-5 h-20 w-20 animate-pulse rounded-3xl bg-white/10" />
          <div className="mx-auto mb-4 h-5 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto mb-3 h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto mb-3 h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto h-4 w-4/6 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}