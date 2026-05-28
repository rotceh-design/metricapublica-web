"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveServicios } from "@/lib/servicios";
import { Servicio } from "@/types/servicio";

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicios = async () => {
      const data = await getActiveServicios();
      setServicios(data);
      setLoading(false);
    };

    loadServicios();
  }, []);

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

          {loading ? (
            <p className="text-slate-400">Cargando servicios...</p>
          ) : servicios.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <h2 className="mb-3 text-2xl font-bold">
                Aún no hay servicios activos
              </h2>

              <p className="text-slate-400">
                Los servicios inactivos no se mostrarán en esta página. Activa
                un servicio desde el panel administrativo.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servicios.map((servicio) => (
                <article
                  key={servicio.id}
                  className="group overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#1a365d]/50 to-[#0f2744]/70 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden p-7">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#009B8D]/10 blur-3xl" />

                    <div className="relative z-10">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-4xl transition group-hover:bg-[#009B8D]/25">
                        {servicio.icon || "◈"}
                      </div>

                      <div className="mb-5 flex flex-wrap gap-2">
                        {servicio.featured && (
                          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                            Destacado
                          </span>
                        )}

                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                          Servicio
                        </span>
                      </div>

                      <h2 className="mb-4 wrap-anywhere text-2xl font-bold leading-tight">
                        {servicio.title}
                      </h2>

                      <p className="mb-6 wrap-anywhere leading-7 text-slate-400">
                        {servicio.shortDescription}
                      </p>

                      {servicio.benefits?.length > 0 && (
                        <div className="mb-7 flex flex-wrap gap-2">
                          {servicio.benefits.slice(0, 3).map((benefit) => (
                            <span
                              key={benefit}
                              className="wrap-anywhere rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs text-[#009B8D]"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      )}

                      <a
                        href={`/servicios/${servicio.slug}`}
                        className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
                      >
                        Ver servicio
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}