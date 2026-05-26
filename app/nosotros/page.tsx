import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-6xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Quiénes somos
          </span>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            Investigación, datos y estrategia para comprender la realidad pública
          </h1>

          <p className="mb-12 max-w-3xl text-lg leading-8 text-slate-300">
            Métrica Pública desarrolla estudios de opinión, análisis territorial
            e investigación aplicada para apoyar decisiones estratégicas en el
            mundo público, privado y social.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-4 text-2xl font-bold text-[#009B8D]">
                Misión
              </h2>
              <p className="leading-7 text-slate-400">
                Transformar información en evidencia clara, útil y accionable
                para instituciones y organizaciones.
              </p>
            </article>

            <article className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-4 text-2xl font-bold text-[#009B8D]">
                Visión
              </h2>
              <p className="leading-7 text-slate-400">
                Ser una referencia en investigación pública, análisis social y
                lectura estratégica de escenarios.
              </p>
            </article>

            <article className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-4 text-2xl font-bold text-[#009B8D]">
                Enfoque
              </h2>
              <p className="leading-7 text-slate-400">
                Combinamos metodologías cuantitativas, cualitativas y
                territoriales para generar diagnósticos confiables.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}