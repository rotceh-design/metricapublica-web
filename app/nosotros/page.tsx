"use client";

import { useEffect, useState } from "react";
import {
  BarChart2,
  Compass,
  Handshake,
  Map,
  ArrowUpRight,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveEquipo } from "@/lib/equipo";
import {
  defaultNosotrosContenido,
  getNosotrosContenido,
} from "@/lib/contenido";
import { EquipoIntegrante } from "@/types/equipo";
import { NosotrosContenido } from "@/types/contenido";

export default function NosotrosPage() {
  const [equipo, setEquipo] = useState<EquipoIntegrante[]>([]);
  const [contenido, setContenido] = useState<NosotrosContenido>(
    defaultNosotrosContenido
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [equipoData, contenidoData] = await Promise.all([
          getActiveEquipo(),
          getNosotrosContenido(),
        ]);

        setEquipo(equipoData);
        setContenido(contenidoData);
      } catch (error) {
        console.error("Error cargando página Nosotros:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  const pillars = [
    {
      Icon: BarChart2,
      title: contenido.pillarOneTitle,
      description: contenido.pillarOneDescription,
    },
    {
      Icon: Compass,
      title: contenido.pillarTwoTitle,
      description: contenido.pillarTwoDescription,
    },
    {
      Icon: Map,
      title: contenido.pillarThreeTitle,
      description: contenido.pillarThreeDescription,
    },
    {
      Icon: Handshake,
      title: contenido.pillarFourTitle,
      description: contenido.pillarFourDescription,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#1a365d]/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            {contenido.heroLabel}
          </span>

          <h1 className="mb-6 max-w-5xl wrap-anywhere text-5xl font-bold leading-tight md:text-6xl">
            {contenido.heroTitle}
          </h1>

          <p className="max-w-3xl wrap-anywhere text-lg leading-8 text-slate-300">
            {contenido.heroDescription}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              {contenido.focusLabel}
            </p>

            <h2 className="mb-5 wrap-anywhere text-3xl font-bold leading-tight">
              {contenido.focusTitle}
            </h2>

            <div className="space-y-5 text-slate-300">
              <p className="wrap-anywhere leading-8">
                {contenido.focusParagraphOne}
              </p>

              <p className="wrap-anywhere leading-8">
                {contenido.focusParagraphTwo}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map(({ Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-7 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]/25">
                  <Icon
                    size={26}
                    strokeWidth={1.8}
                    className="text-[#009B8D]"
                  />
                </div>

                <h3 className="mb-3 wrap-anywhere text-2xl font-bold">
                  {title}
                </h3>

                <p className="wrap-anywhere leading-7 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f2744] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                {contenido.teamLabel}
              </span>

              <h2 className="max-w-4xl wrap-anywhere text-4xl font-bold leading-tight md:text-5xl">
                {contenido.teamTitle}
              </h2>
            </div>

            <p className="max-w-xl wrap-anywhere text-slate-400">
              {contenido.teamDescription}
            </p>
          </div>

          {loading ? (
            <TeamLoading />
          ) : equipo.length === 0 ? (
            <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0a1628] p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15">
                <Users size={30} strokeWidth={1.8} className="text-[#009B8D]" />
              </div>

              <h3 className="mb-3 text-2xl font-bold">
                Aún no hay integrantes publicados
              </h3>

              <p className="text-slate-400">
                Los integrantes inactivos no se mostrarán en esta página.
                Activa integrantes desde el panel administrativo.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {equipo.map((integrante) => (
                <TeamCard key={integrante.id} integrante={integrante} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TeamCard({ integrante }: { integrante: EquipoIntegrante }) {
  const imageFit = integrante.imageFit || "cover";
  const imagePosition = integrante.imagePosition || "center";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0a1628] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl">
      <div className="p-5">
        <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-[#08111f]">
          {integrante.imageUrl ? (
            <img
              src={integrante.imageUrl}
              alt={integrante.name}
              className="h-full w-full transition duration-700 group-hover:scale-105"
              style={{
                objectFit: imageFit,
                objectPosition: imagePosition,
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#009B8D]">
              MP
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-7">
        <div className="mb-4 flex flex-wrap gap-2">
          {integrante.featured && (
            <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
              Destacado
            </span>
          )}

          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            Equipo
          </span>
        </div>

        <h3 className="wrap-anywhere text-2xl font-bold">
          {integrante.name}
        </h3>

        <p className="mt-2 wrap-anywhere font-semibold text-[#009B8D]">
          {integrante.role}
        </p>

        <p className="mt-4 max-h-28 overflow-hidden wrap-anywhere leading-7 text-slate-400">
          {integrante.bio}
        </p>

        <div className="mt-auto pt-6">
          <a
            href={`/equipo/${integrante.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#009B8D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
          >
            Ver perfil
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}

function TeamLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-[#009B8D]/15 bg-[#0a1628] p-5"
        >
          <div className="aspect-square animate-pulse rounded-3xl bg-white/5" />

          <div className="px-2 pb-4 pt-6">
            <div className="mb-3 h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="mb-5 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />

            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-4/6 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}