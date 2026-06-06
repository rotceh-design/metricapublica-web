import Link from "next/link";

import SectorIcon from "@/components/icons/SectorIcons";
import { defaultInicioContenido } from "@/lib/contenido";
import { InicioContenido } from "@/types/contenido";
import { Sector, SectorIconKey } from "@/types/sector";

type SectorsProps = {
  contenido?: InicioContenido;
  sectores?: Sector[];
  loading?: boolean;
};

type SectorCardData = {
  id: string;
  number: string;
  title: string;
  description: string;
  iconKey: SectorIconKey;
  featured: boolean;
  href: string;
};

export default function Sectors({
  contenido = defaultInicioContenido,
  sectores = [],
  loading = false,
}: SectorsProps) {
  const sectorsToShow: SectorCardData[] = sectores.slice(0, 6).map((sector, index) => ({
    id: sector.id,
    number: String(index + 1).padStart(2, "0"),
    title: sector.title,
    description: sector.description,
    iconKey: sector.iconKey || "gobierno",
    featured: Boolean(sector.featured),
    href: sector.slug ? `/sectores/${sector.slug}` : "/sectores",
  }));

  return (
    <section
      id="sectores"
      className="relative w-full overflow-hidden bg-[#0a1628] px-4 py-20 text-white sm:px-6 lg:px-10 2xl:px-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.1),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(26,54,93,0.42),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-48 top-20 h-[28rem] w-[28rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-56 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#1a365d]/35 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div className="mb-10 grid gap-8 xl:grid-cols-[0.75fr_1.25fr] xl:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              {contenido.sectorsLabel}
            </span>

            <h2 className="wrap-anywhere max-w-4xl text-3xl font-black leading-tight md:text-5xl">
              {contenido.sectorsTitle}
            </h2>
          </div>

          <div className="xl:justify-self-end">
            <p className="max-w-3xl wrap-anywhere text-base leading-8 text-slate-400 md:text-lg xl:text-right">
              {contenido.sectorsDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 xl:justify-end">
              <InfoPill label={`${sectores.length} sectores activos`} />
              <InfoPill label="Territorio" />
              <InfoPill label="Audiencias" />
              <InfoPill label="Decisión pública" />
            </div>
          </div>
        </div>

        {loading ? (
          <SectorsLoading />
        ) : sectorsToShow.length === 0 ? (
          <EmptySectors />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {sectorsToShow.map((sector, index) => {
                const featuredLayout = index === 0;

                return featuredLayout ? (
                  <FeaturedSectorCard key={sector.id} sector={sector} />
                ) : (
                  <SectorCard key={sector.id} sector={sector} />
                );
              })}
            </div>

            {sectores.length > 6 && (
              <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                    Catálogo de sectores
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Hay más sectores publicados
                  </h3>
                </div>

                <Link
                  href="/sectores"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#00877a]"
                >
                  Ver todos los sectores
                  <span className="ml-2">→</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedSectorCard({ sector }: { sector: SectorCardData }) {
  return (
    <Link
      href={sector.href}
      className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[2.2rem] border border-[#009B8D]/15 bg-[#08111f] p-7 shadow-[0_26px_90px_rgba(0,0,0,0.32)] transition hover:-translate-y-1 hover:border-[#009B8D]/45 md:col-span-2 xl:col-span-2"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.22),transparent_35%),linear-gradient(135deg,#0f2744_0%,#08111f_62%,#071221_100%)]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#009B8D]/15 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-5">
        <div className="flex h-18 w-18 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          <SectorIcon iconKey={sector.iconKey} />
        </div>

        <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
          {sector.number}
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-12">
        <div className="mb-4 flex flex-wrap gap-2">
          {sector.featured && <InfoPill label="Destacado" />}
          <InfoPill label="Sector principal" />
        </div>

        <h3 className="wrap-anywhere text-3xl font-black leading-tight md:text-4xl">
          {sector.title}
        </h3>

        <p className="mt-5 line-clamp-4 wrap-anywhere leading-7 text-slate-300">
          {sector.description}
        </p>

        <p className="mt-7 text-sm font-black text-[#20d6c7]">
          Ver sector →
        </p>
      </div>
    </Link>
  );
}

function SectorCard({ sector }: { sector: SectorCardData }) {
  return (
    <Link
      href={sector.href}
      className="group flex min-h-[260px] flex-col overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#009B8D]/40"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          <SectorIcon iconKey={sector.iconKey} />
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-slate-500">
          {sector.number}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {sector.featured && <InfoPill label="Destacado" />}
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-400">
          Sector
        </span>
      </div>

      <h3 className="wrap-anywhere text-xl font-black leading-tight text-white">
        {sector.title}
      </h3>

      <p className="mt-4 line-clamp-4 wrap-anywhere text-sm leading-6 text-slate-400">
        {sector.description}
      </p>

      <div className="mt-auto pt-5">
        <span className="text-sm font-black text-[#20d6c7]">
          Ver sector →
        </span>
      </div>
    </Link>
  );
}

function EmptySectors() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7]">
        <SectorIcon iconKey="gobierno" />
      </div>

      <h3 className="mb-3 text-2xl font-black">
        Aún no hay sectores publicados
      </h3>

      <p className="mx-auto max-w-xl leading-7 text-slate-400">
        Los sectores que crees y actives desde el panel administrativo
        aparecerán automáticamente en esta sección.
      </p>
    </div>
  );
}

function SectorsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className={`rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/70 p-6 ${
            item === 1 ? "min-h-[340px] md:col-span-2 xl:col-span-2" : "min-h-[260px]"
          }`}
        >
          <div className="mb-5 h-14 w-14 animate-pulse rounded-2xl bg-white/10" />
          <div className="mb-4 h-5 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="mb-3 h-6 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="mb-3 h-3 w-full animate-pulse rounded-full bg-white/10" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="wrap-anywhere rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}