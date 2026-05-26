const services = [
  {
    number: "01",
    title: "Estudios de opinión pública",
    description:
      "Diseñamos y ejecutamos estudios cuantitativos para comprender percepciones, tendencias, comportamiento ciudadano y evaluación de escenarios públicos.",
    tags: ["Encuestas", "Percepción", "Opinión pública"],
  },
  {
    number: "02",
    title: "Investigación cualitativa",
    description:
      "Aplicamos entrevistas, grupos focales y análisis interpretativo para profundizar en motivaciones, discursos y necesidades de distintos públicos.",
    tags: ["Entrevistas", "Focus group", "Análisis social"],
  },
  {
    number: "03",
    title: "Análisis territorial",
    description:
      "Integramos información georreferenciada, datos comunales y variables sociales para entregar diagnósticos útiles para la toma de decisiones.",
    tags: ["Territorio", "Geodatos", "Diagnóstico"],
  },
  {
    number: "04",
    title: "Asesoría estratégica",
    description:
      "Transformamos evidencia en recomendaciones claras para instituciones, campañas, organizaciones y equipos de comunicación pública.",
    tags: ["Estrategia", "Datos", "Decisión"],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-[#0a1628] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Servicios
          </span>

          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Soluciones basadas en datos para comprender escenarios complejos
          </h2>

          <p className="text-lg leading-8 text-slate-400">
            Acompañamos a organizaciones públicas, privadas y sociales con
            metodologías de investigación, análisis territorial y evidencia
            estratégica.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-2xl border border-[#009B8D]/10 bg-linear-to-br from-[#1a365d]/40 to-[#0f2744]/40 p-8 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
            >
              <div className="absolute right-8 top-6 text-6xl font-bold text-[#009B8D]/10">
                {service.number}
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#009B8D]/15 text-2xl">
                ◈
              </div>

              <h3 className="mb-4 pr-16 text-2xl font-bold text-white">
                {service.title}
              </h3>

              <p className="mb-6 leading-7 text-slate-400">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm text-[#009B8D]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}