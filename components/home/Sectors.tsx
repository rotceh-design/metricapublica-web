const sectors = [
  {
    title: "Gobierno",
    description:
      "Apoyo a instituciones públicas en diagnósticos, estudios de percepción y toma de decisiones basadas en evidencia.",
    icon: "🏛️",
  },
  {
    title: "Campañas",
    description:
      "Investigación estratégica para comprender audiencias, territorios, posicionamiento y escenarios políticos.",
    icon: "📊",
  },
  {
    title: "Sector privado",
    description:
      "Estudios para empresas, marcas y organizaciones que necesitan comprender mejor a sus públicos.",
    icon: "🏢",
  },
  {
    title: "Organizaciones sociales",
    description:
      "Análisis de comunidades, necesidades territoriales y percepción ciudadana para proyectos sociales.",
    icon: "🤝",
  },
  {
    title: "Academia",
    description:
      "Diseño, levantamiento y análisis de información para investigaciones aplicadas y publicaciones.",
    icon: "🎓",
  },
];

export default function Sectors() {
  return (
    <section id="sectores" className="bg-[#0a1628] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Sectores
          </span>

          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Trabajamos con distintos actores del mundo público y privado
          </h2>

          <p className="text-lg leading-8 text-slate-400">
            Métrica Pública entrega evidencia útil para instituciones,
            organizaciones, campañas y equipos que necesitan comprender mejor
            sus entornos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((sector) => (
            <article
              key={sector.title}
              className="group rounded-2xl border border-[#009B8D]/10 bg-linear-to-b from-[#1a365d]/35 to-[#0f2744]/30 p-6 text-center transition hover:-translate-y-1 hover:border-[#009B8D]/40"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-3xl transition group-hover:bg-[#009B8D]/25">
                {sector.icon}
              </div>

              <h3 className="mb-3 text-lg font-bold text-white">
                {sector.title}
              </h3>

              <p className="text-sm leading-6 text-slate-400">
                {sector.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}