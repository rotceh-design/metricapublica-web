"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveIntegranteBySlug } from "@/lib/equipo";
import { EquipoImageAspect, EquipoIntegrante } from "@/types/equipo";

const imageAspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

export default function EquipoDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [integrante, setIntegrante] = useState<EquipoIntegrante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIntegrante = async () => {
      const data = await getActiveIntegranteBySlug(slug);
      setIntegrante(data);
      setLoading(false);
    };

    if (slug) {
      loadIntegrante();
    }
  }, [slug]);

  const imageAspect: EquipoImageAspect = integrante?.imageAspect || "square";
  const imageFit = integrante?.imageFit || "cover";
  const imagePosition = integrante?.imagePosition || "center";

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <p className="text-slate-400">Cargando perfil...</p>
          ) : !integrante ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8">
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Equipo
              </span>

              <h1 className="mb-4 text-4xl font-bold">
                Integrante no encontrado
              </h1>

              <p className="mb-6 text-slate-400">
                El perfil no existe o no está activo actualmente.
              </p>

              <a
                href="/nosotros"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Volver a nosotros
              </a>
            </div>
          ) : (
            <article>
              <a
                href="/nosotros"
                className="mb-8 inline-flex text-sm font-semibold text-[#009B8D] transition hover:text-white"
              >
                ← Volver a nosotros
              </a>

              <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                <aside className="h-fit rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-2xl lg:sticky lg:top-28">
                  <div
                    className={`overflow-hidden rounded-3xl border border-white/10 bg-[#08111f] ${imageAspectClasses[imageAspect]}`}
                  >
                    {integrante.imageUrl ? (
                      <img
                        src={integrante.imageUrl}
                        alt={integrante.name}
                        className="h-full w-full"
                        style={{
                          objectFit: imageFit,
                          objectPosition: imagePosition,
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#009B8D]">
                        MP
                      </div>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Contacto
                    </p>

                    <div className="space-y-3">
                      {integrante.email ? (
                        <a
                          href={`mailto:${integrante.email}`}
                          className="block wrap-anywhere rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                        >
                          {integrante.email}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Sin correo publicado
                        </p>
                      )}

                      {integrante.linkedin && (
                        <a
                          href={integrante.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-[#009B8D]/30 px-4 py-3 text-sm font-semibold text-[#009B8D] transition hover:bg-[#009B8D]/10"
                        >
                          Ver LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </aside>

                <section>
                  <header className="relative mb-8 overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-8 md:p-10">
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />

                    <div className="relative z-10">
                      <div className="mb-5 flex flex-wrap gap-3">
                        {integrante.featured && (
                          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-sm font-semibold text-[#009B8D]">
                            Integrante destacado
                          </span>
                        )}

                        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                          Equipo Métrica Pública
                        </span>
                      </div>

                      <h1 className="wrap-anywhere text-5xl font-bold leading-tight md:text-6xl">
                        {integrante.name}
                      </h1>

                      <p className="mt-5 wrap-anywhere text-2xl font-semibold text-[#009B8D]">
                        {integrante.role}
                      </p>
                    </div>
                  </header>

                  <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-7 md:p-10">
                    <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                      Biografía
                    </p>

                    <div className="whitespace-pre-wrap wrap-anywhere text-lg leading-9 text-slate-300">
                      {integrante.bio}
                    </div>
                  </div>
                </section>
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}