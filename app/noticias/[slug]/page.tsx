import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NoticiaDetallePage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Noticia
          </span>

          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Detalle de noticia
          </h1>

          <p className="text-lg leading-8 text-slate-300">
            Esta página será dinámica más adelante. Aquí se mostrará la noticia
            completa creada desde el panel administrativo.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}