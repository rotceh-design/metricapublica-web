import { InicioContenido } from "@/types/contenido";

const GobiernoIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <rect x="6" y="36" width="36" height="4" rx="1" fill="currentColor" opacity="0.4"/>
    <rect x="4" y="40" width="40" height="3" rx="1" fill="currentColor" opacity="0.6"/>
    <rect x="10" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="18" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="26" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="34" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7"/>
    <path d="M6 20h36v2H6z" fill="currentColor" opacity="0.5"/>
    <path d="M24 6L4 18h40L24 6z" fill="currentColor"/>
    <circle cx="24" cy="13" r="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

const CampañasIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <rect x="4" y="34" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="14" y="26" width="8" height="18" rx="1.5" fill="currentColor" opacity="0.65"/>
    <rect x="24" y="18" width="8" height="26" rx="1.5" fill="currentColor" opacity="0.8"/>
    <rect x="34" y="10" width="8" height="34" rx="1.5" fill="currentColor"/>
    <path d="M8 28 L18 20 L28 13 L38 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <circle cx="8" cy="28" r="2.5" fill="currentColor" opacity="0.6"/>
    <circle cx="18" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
    <circle cx="28" cy="13" r="2.5" fill="currentColor" opacity="0.85"/>
    <circle cx="38" cy="6" r="2.5" fill="currentColor"/>
  </svg>
);

const SectorPrivadoIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <rect x="4" y="18" width="20" height="26" rx="2" fill="currentColor" opacity="0.5"/>
    <rect x="8" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9"/>
    <rect x="16" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9"/>
    <rect x="8" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9"/>
    <rect x="16" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9"/>
    <rect x="10" y="38" width="8" height="6" rx="0.5" fill="currentColor" opacity="0.7"/>
    <rect x="22" y="8" width="22" height="36" rx="2" fill="currentColor" opacity="0.75"/>
    <rect x="26" y="12" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="34" y="12" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="26" y="20" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="34" y="20" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="26" y="28" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="34" y="28" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="29" y="36" width="6" height="8" rx="0.5" fill="currentColor" opacity="0.4"/>
    <path d="M28 4h6l2 4H26l2-4z" fill="currentColor" opacity="0.9"/>
  </svg>
);

const OrganizacionesIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <circle cx="24" cy="12" r="5" fill="currentColor"/>
    <circle cx="10" cy="28" r="4.5" fill="currentColor" opacity="0.7"/>
    <circle cx="38" cy="28" r="4.5" fill="currentColor" opacity="0.7"/>
    <path d="M24 17 C24 17 14 20 10 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M24 17 C24 17 34 20 38 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M10 32 C10 32 16 36 24 36 C32 36 38 32 38 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M16 38 C16 38 19 44 24 44 C29 44 32 38 32 38" fill="currentColor" opacity="0.4"/>
    <circle cx="24" cy="36" r="3" fill="currentColor" opacity="0.8"/>
  </svg>
);

const AcademiaIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <path d="M24 8L4 18l20 10 20-10L24 8z" fill="currentColor"/>
    <path d="M12 23v10c0 3 5.4 7 12 7s12-4 12-7V23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <line x1="44" y1="18" x2="44" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="44" cy="32" r="2" fill="currentColor" opacity="0.5"/>
    <path d="M18 26l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
  </svg>
);

const SECTOR_ICONS = {
  Gobierno: GobiernoIcon,
  Campañas: CampañasIcon,
  "Sector privado": SectorPrivadoIcon,
  "Organizaciones sociales": OrganizacionesIcon,
  Academia: AcademiaIcon,
};

const sectors = [
  {
    title: "Gobierno",
    description:
      "Apoyo a instituciones públicas en diagnósticos, estudios de percepción y toma de decisiones basadas en evidencia.",
  },
  {
    title: "Campañas",
    description:
      "Investigación estratégica para comprender audiencias, territorios, posicionamiento y escenarios políticos.",
  },
  {
    title: "Sector privado",
    description:
      "Estudios para empresas, marcas y organizaciones que necesitan comprender mejor a sus públicos.",
  },
  {
    title: "Organizaciones sociales",
    description:
      "Análisis de comunidades, necesidades territoriales y percepción ciudadana para proyectos sociales.",
  },
  {
    title: "Academia",
    description:
      "Diseño, levantamiento y análisis de información para investigaciones aplicadas y publicaciones.",
  },
];

type SectorsProps = {
  contenido: InicioContenido;
};

export default function Sectors({ contenido }: SectorsProps) {
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((sector) => {
            const Icon = SECTOR_ICONS[sector.title as keyof typeof SECTOR_ICONS];
            return (
              <article
                key={sector.title}
                className="group rounded-2xl border border-[#009B8D]/10 bg-linear-to-b from-[#1a365d]/35 to-[#0f2744]/30 p-6 text-center transition hover:-translate-y-1 hover:border-[#009B8D]/40"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#009B8D] transition group-hover:bg-[#009B8D]/25">
                  {Icon && <Icon />}
                </div>
                <h3 className="mb-3 wrap-anywhere text-lg font-bold text-white">
                  {sector.title}
                </h3>
                <p className="wrap-anywhere text-sm leading-6 text-slate-400">
                  {sector.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}