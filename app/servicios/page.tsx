import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const services = [
  {
    title: "Estudios de opinión pública",
    description:
      "Diseño, levantamiento y análisis de encuestas para medir percepciones, confianza, prioridades y evaluación ciudadana.",
  },
  {
    title: "Investigación cualitativa",
    description:
      "Entrevistas, grupos focales y análisis de discurso para comprender motivaciones, narrativas y necesidades profundas.",
  },
  {
    title: "Análisis territorial",
    description:
      "Cruce de datos sociales, geográficos y comunales para diagnósticos locales, regionales o nacionales.",
  },
  {
    title: "Asesoría estratégica",
    description:
      "Interpretación de datos y construcción de recomendaciones para equipos directivos, comunicacionales o institucionales.",
  },
  {
    title: "Georreferenciación",
    description:
      "Visualización y análisis espacial de información para comprender brechas, zonas críticas y oportunidades territoriales.",
  },
  {
    title: "Comunicación basada en evidencia",
    description:
      "Apoyo a mensajes, vocerías, campañas y comunicación pública desde datos e investigación aplicada.",
  },
];

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Servicios
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Soluciones de investigación para tomar mejores decisiones
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Desarrollamos estudios, análisis y asesoría estratégica para
            instituciones, campañas, empresas y organizaciones que necesitan
            evidencia clara y confiable.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="rounded-2xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/60 to-[#0f2744]/60 p-8 transition hover:-translate-y-1 hover:border-[#009B8D]/40"
              >
                <p className="mb-5 text-5xl font-bold text-[#009B8D]/20">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h2 className="mb-4 text-2xl font-bold">{service.title}</h2>

                <p className="leading-7 text-slate-400">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}