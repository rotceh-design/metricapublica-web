"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveServicioBySlug } from "@/lib/servicios";
import { Servicio } from "@/types/servicio";

export default function ServicioDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicio = async () => {
      const data = await getActiveServicioBySlug(slug);
      setServicio(data);
      setLoading(false);
    };

    if (slug) {
      loadServicio();
    }
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <p className="text-slate-400">Cargando servicio...</p>
          ) : !servicio ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Servicio
              </span>

              <h1 className="mb-4 text-4xl font-bold">
                Servicio no encontrado
              </h1>

              <p className="mb-6 text-slate-400">
                El servicio no existe o no está activo actualmente.
              </p>

              <a
                href="/servicios"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Volver a servicios
              </a>
            </div>
          ) : (
            <article>
              <a
                href="/servicios"
                className="mb-8 inline-flex text-sm font-semibold text-[#009B8D] transition hover:text-white"
              >
                ← Volver a servicios
              </a>

              <header className="relative mb-10 overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-7 md:p-10">
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#009B8D]/25 bg-[#009B8D]/15 text-5xl">
                    {servicio.icon || "◈"}
                  </div>

                  <div className="mb-6 flex flex-wrap gap-3">
                    {servicio.featured && (
                      <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                        Servicio destacado
                      </span>
                    )}

                    <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                      Métrica Pública
                    </span>
                  </div>

                  <h1 className="mb-6 max-w-4xl wrap-anywhere text-5xl font-bold leading-tight md:text-6xl">
                    {servicio.title}
                  </h1>

                  <p className="max-w-3xl wrap-anywhere text-xl leading-9 text-slate-300">
                    {servicio.shortDescription}
                  </p>
                </div>
              </header>

              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-7 md:p-10">
                  <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                    Descripción del servicio
                  </p>

                  <div className="whitespace-pre-wrap wrap-anywhere text-lg leading-9 text-slate-300">
                    {servicio.description}
                  </div>
                </div>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-6">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Información
                    </p>

                    <div className="space-y-4 text-sm text-slate-400">
                      <div>
                        <p className="text-slate-500">Estado</p>
                        <p className="font-semibold text-white">
                          Servicio activo
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Tipo</p>
                        <p className="font-semibold text-white">
                          {servicio.featured ? "Destacado" : "Normal"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">URL</p>
                        <p className="wrap-anywhere font-semibold text-white">
                          /servicios/{servicio.slug}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#009B8D]/15 bg-[#08111f] p-6">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Beneficios
                    </p>

                    {servicio.benefits?.length > 0 ? (
                      <ul className="space-y-3">
                        {servicio.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex gap-3 rounded-xl border-l-4 border-[#009B8D] bg-[#009B8D]/10 px-4 py-3 text-sm text-slate-200"
                          >
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#009B8D]" />
                            <span className="wrap-anywhere">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Este servicio todavía no tiene beneficios registrados.
                      </p>
                    )}
                  </div>

                  <a
                    href="/contacto"
                    className="block rounded-2xl bg-[#009B8D] px-6 py-4 text-center font-bold text-white transition hover:bg-[#00877a]"
                  >
                    Solicitar información
                  </a>
                </aside>
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}