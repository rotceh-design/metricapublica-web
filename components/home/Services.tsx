import { InicioContenido } from "@/types/contenido";
import { Servicio } from "@/types/servicio";

type ServicesProps = {
  contenido: InicioContenido;
  servicios: Servicio[];
  loading: boolean;
};

const fallbackServices = [
  {
    id: "fallback-1",
    number: "01",
    title: "Estudios de opinión pública",
    description:
      "Diseñamos y ejecutamos estudios cuantitativos para comprender percepciones, tendencias, comportamiento ciudadano y evaluación de escenarios públicos.",
    tags: ["Encuestas", "Percepción", "Opinión pública"],
    icon: "◈",
    href: "/servicios",
  },
  {
    id: "fallback-2",
    number: "02",
    title: "Investigación cualitativa",
    description:
      "Aplicamos entrevistas, grupos focales y análisis interpretativo para profundizar en motivaciones, discursos y necesidades de distintos públicos.",
    tags: ["Entrevistas", "Focus group", "Análisis social"],
    icon: "◈",
    href: "/servicios",
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Análisis territorial",
    description:
      "Integramos información georreferenciada, datos comunales y variables sociales para entregar diagnósticos útiles para la toma de decisiones.",
    tags: ["Territorio", "Geodatos", "Diagnóstico"],
    icon: "◈",
    href: "/servicios",
  },
  {
    id: "fallback-4",
    number: "04",
    title: "Asesoría estratégica",
    description:
      "Transformamos evidencia en recomendaciones claras para instituciones, campañas, organizaciones y equipos de comunicación pública.",
    tags: ["Estrategia", "Datos", "Decisión"],
    icon: "◈",
    href: "/servicios",
  },
];

export default function Services({
  contenido,
  servicios,
  loading,
}: ServicesProps) {
  const servicesToShow =
    servicios.length > 0
      ? servicios.slice(0, 4).map((servicio, index) => ({
          id: servicio.id,
          number: String(index + 1).padStart(2, "0"),
          title: servicio.title,
          description: servicio.shortDescription,
          tags: servicio.benefits?.slice(0, 3) || [],
          icon: servicio.icon || "◈",
          href: `/servicios/${servicio.slug}`,
        }))
      : fallbackServices;

  return (
    <section id="servicios" className="bg-[#0a1628] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            {contenido.servicesLabel}
          </span>

          <h2 className="mb-5 wrap-anywhere text-4xl font-bold leading-tight md:text-5xl">
            {contenido.servicesTitle}
          </h2>

          <p className="wrap-anywhere text-lg leading-8 text-slate-400">
            {contenido.servicesDescription}
          </p>
        </div>

        {loading ? (
          <ServicesLoading />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {servicesToShow.map((service) => (
                <article
                  key={service.id}
                  className="group relative flex min-h-80 flex-col overflow-hidden rounded-3xl border border-[#009B8D]/10 bg-linear-to-br from-[#1a365d]/40 to-[#0f2744]/40 p-8 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
                >
                  <div className="absolute right-8 top-6 text-6xl font-bold text-[#009B8D]/10">
                    {service.number}
                  </div>

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-3xl text-[#009B8D] transition group-hover:bg-[#009B8D]/25">
                    {service.icon}
                  </div>

                  <h3 className="mb-4 pr-16 wrap-anywhere text-2xl font-bold text-white">
                    {service.title}
                  </h3>

                  <p className="mb-6 wrap-anywhere leading-7 text-slate-400">
                    {service.description}
                  </p>

                  {service.tags.length > 0 && (
                    <div className="mb-7 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="wrap-anywhere rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm text-[#009B8D]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    <a
                      href={service.href}
                      className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
                    >
                      Ver servicio
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/servicios"
                className="inline-flex rounded-xl border border-[#009B8D]/40 px-6 py-3 font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
              >
                Ver todos los servicios
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ServicesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="min-h-80 rounded-3xl border border-[#009B8D]/10 bg-[#0f2744]/60 p-8"
        >
          <div className="mb-6 h-16 w-16 animate-pulse rounded-2xl bg-white/10" />
          <div className="mb-4 h-7 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="mb-3 h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div className="mb-3 h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
          <div className="mb-8 h-4 w-4/6 animate-pulse rounded-full bg-white/10" />

          <div className="flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}