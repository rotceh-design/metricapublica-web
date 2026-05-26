import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const news = [
  {
    title: "Métrica Pública prepara nueva plataforma de publicaciones",
    date: "2025",
    category: "Institucional",
    description:
      "La nueva web permitirá publicar noticias, estudios, informes y documentos desde un sistema administrativo privado.",
  },
  {
    title: "El valor de los datos en la toma de decisiones públicas",
    date: "2025",
    category: "Análisis",
    description:
      "La evidencia permite mejorar diagnósticos, anticipar escenarios y construir estrategias más sólidas.",
  },
  {
    title: "Investigación territorial para comprender realidades locales",
    date: "2025",
    category: "Territorio",
    description:
      "El análisis geográfico y social ayuda a identificar diferencias, brechas y prioridades en distintos contextos.",
  },
];

export default function NoticiasPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Noticias
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Actualidad, análisis y novedades de Métrica Pública
          </h1>

          <p className="mb-14 max-w-3xl text-lg leading-8 text-slate-300">
            Esta sección será administrable desde Firebase: el equipo podrá
            crear, editar, publicar o eliminar noticias.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/70 p-7 transition hover:-translate-y-1 hover:border-[#009B8D]/40"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                    {item.category}
                  </span>
                  <span className="text-sm text-slate-500">{item.date}</span>
                </div>

                <h2 className="mb-4 text-2xl font-bold leading-tight">
                  {item.title}
                </h2>

                <p className="mb-6 leading-7 text-slate-400">
                  {item.description}
                </p>

                <a
                  href="/noticias"
                  className="font-semibold text-[#009B8D] transition hover:text-white"
                >
                  Leer más →
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