import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const studies = [
  {
    title: "Radiografía de percepción ciudadana",
    category: "Opinión pública",
    year: "2025",
    description:
      "Estudio sobre confianza institucional, prioridades ciudadanas y percepción de escenarios públicos.",
  },
  {
    title: "Análisis territorial y comportamiento social",
    category: "Territorio",
    year: "2025",
    description:
      "Cruce de información territorial y social para identificar brechas, oportunidades y zonas prioritarias.",
  },
  {
    title: "Escenarios públicos y toma de decisiones",
    category: "Estrategia",
    year: "2025",
    description:
      "Informe estratégico con lectura de escenarios, riesgos y oportunidades para equipos de decisión.",
  },
];

export default function EstudiosPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-6xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Estudios y publicaciones
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Evidencia pública para comprender escenarios y tomar decisiones
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            En esta sección se publicarán estudios, informes, documentos PDF,
            análisis y publicaciones administrables desde el panel privado.
          </p>

          <div className="space-y-6">
            {studies.map((study) => (
              <article
                key={study.title}
                className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 transition hover:border-[#009B8D]/40"
              >
                <div className="mb-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                    {study.category}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                    {study.year}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold">{study.title}</h2>

                <p className="mb-6 leading-7 text-slate-400">
                  {study.description}
                </p>

                <a
                  href="/estudios"
                  className="inline-flex rounded-lg bg-[#009B8D] px-5 py-3 font-semibold text-white transition hover:bg-[#00877a]"
                >
                  Ver publicación
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}