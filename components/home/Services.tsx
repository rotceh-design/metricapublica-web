import Link from "next/link";
import type { ReactNode } from "react";

import { InicioContenido } from "@/types/contenido";
import { Servicio } from "@/types/servicio";

type ServicesProps = {
  contenido: InicioContenido;
  servicios: Servicio[];
  loading: boolean;
};

type ServiceCardData = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  href: string;
  featured: boolean;
};

export default function Services({
  contenido,
  servicios,
  loading,
}: ServicesProps) {
  const servicesToShow: ServiceCardData[] = servicios.slice(0, 7).map(
    (servicio, index) => ({
      id: servicio.id,
      number: String(index + 1).padStart(2, "0"),
      title: servicio.title,
      description: servicio.shortDescription || servicio.description || "",
      tags: servicio.benefits?.slice(0, 4) || [],
      icon: servicio.icon || "◈",
      href: servicio.slug ? `/servicios/${servicio.slug}` : "/servicios",
      featured: Boolean(servicio.featured),
    })
  );

  const featuredService =
    servicesToShow.find((service) => service.featured) || servicesToShow[0];

  const otherServices = servicesToShow.filter(
    (service) => service.id !== featuredService?.id
  );

  const sideServices = otherServices.slice(0, 3);
  const bottomServices = otherServices.slice(3, 6);

  return (
    <section className="relative w-full overflow-hidden bg-[#071221] px-4 py-20 text-white sm:px-6 lg:px-10 2xl:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,155,141,0.13),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(26,54,93,0.5),transparent_38%),linear-gradient(180deg,#071221_0%,#0a1628_55%,#071221_100%)]" />
      <div className="pointer-events-none absolute -left-48 top-28 h-[30rem] w-[30rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-56 bottom-10 h-[34rem] w-[34rem] rounded-full bg-[#1a365d]/40 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div className="mb-10 grid gap-8 xl:grid-cols-[0.75fr_1.25fr] xl:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              {contenido.servicesLabel}
            </span>

            <h2 className="wrap-anywhere max-w-4xl text-3xl font-black leading-tight md:text-5xl">
              {contenido.servicesTitle}
            </h2>
          </div>

          <div className="xl:justify-self-end">
            <p className="max-w-3xl wrap-anywhere text-base leading-8 text-slate-400 md:text-lg xl:text-right">
              {contenido.servicesDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 xl:justify-end">
              <InfoPill label={`${servicios.length} servicios activos`} />
              <InfoPill label="Investigación" />
              <InfoPill label="Estrategia" />
              <InfoPill label="Datos" />
            </div>
          </div>
        </div>

        {loading ? (
          <ServicesLoading />
        ) : servicesToShow.length === 0 ? (
          <EmptyServices />
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
              {featuredService && (
                <FeaturedServiceCard service={featuredService} />
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                {sideServices.length > 0 ? (
                  sideServices.map((service, index) => (
                    <ServiceEditorialCard
                      key={service.id}
                      service={service}
                      compact={index !== 0}
                    />
                  ))
                ) : (
                  <ServiceSupportCard />
                )}
              </div>
            </div>

            {bottomServices.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {bottomServices.map((service) => (
                  <SmallServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                  Catálogo completo
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Revisa todos los servicios disponibles
                </h3>

                <p className="mt-2 max-w-3xl leading-7 text-slate-400">
                  Cada servicio puede adaptarse según el problema, escala y tipo
                  de decisión que necesite resolver tu organización.
                </p>
              </div>

              <Link
                href="/servicios"
                className="inline-flex items-center justify-center rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#00877a]"
              >
                Ver todos los servicios
                <span className="ml-2">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={service.href}
      className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[2.4rem] border border-[#009B8D]/15 bg-[#08111f] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.36)] transition hover:-translate-y-1 hover:border-[#009B8D]/45 md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.22),transparent_36%),linear-gradient(135deg,#0f2744_0%,#08111f_64%,#071221_100%)]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#009B8D]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#1a365d]/70 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-5">
        <div className="flex h-18 w-18 items-center justify-center rounded-[1.6rem] border border-[#009B8D]/20 bg-[#009B8D]/15 text-4xl text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          {service.icon}
        </div>

        <span className="text-6xl font-black leading-none text-white/10">
          {service.number}
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-14">
        <div className="mb-5 flex flex-wrap gap-2">
          {service.featured && <InfoPill label="Destacado" />}
          <InfoPill label="Servicio principal" />
        </div>

        <h3 className="wrap-anywhere max-w-4xl text-3xl font-black leading-tight md:text-5xl">
          {service.title}
        </h3>

        <p className="mt-6 max-w-3xl wrap-anywhere text-base leading-8 text-slate-300 md:text-lg">
          {service.description}
        </p>

        {service.tags.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <div className="mt-8 inline-flex rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition group-hover:bg-[#00877a]">
          Ver servicio
          <span className="ml-2 transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}

function ServiceEditorialCard({
  service,
  compact,
}: {
  service: ServiceCardData;
  compact: boolean;
}) {
  return (
    <Link
      href={service.href}
      className={`group relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:bg-[#10243d] ${
        compact ? "min-h-[190px]" : "min-h-[244px]"
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[#009B8D]/10 blur-3xl" />

      <div className="relative z-10 flex h-full gap-5">
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white ${
            compact ? "h-14 w-14 text-2xl" : "h-16 w-16 text-3xl"
          }`}
        >
          {service.icon}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-slate-400">
              {service.number}
            </span>

            {service.featured && <InfoPill label="Destacado" />}
          </div>

          <h3
            className={`wrap-anywhere font-black leading-tight ${
              compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            {service.title}
          </h3>

          <p
            className={`mt-4 wrap-anywhere leading-7 text-slate-400 ${
              compact ? "line-clamp-2 text-sm" : "line-clamp-3"
            }`}
          >
            {service.description}
          </p>

          <p className="mt-auto pt-5 text-sm font-black text-[#20d6c7]">
            Ver servicio →
          </p>
        </div>
      </div>
    </Link>
  );
}

function SmallServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={service.href}
      className="group flex min-h-[240px] flex-col overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#009B8D]/40"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-2xl text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          {service.icon}
        </div>

        <span className="text-4xl font-black text-[#009B8D]/10">
          {service.number}
        </span>
      </div>

      <h3 className="wrap-anywhere text-xl font-black leading-tight">
        {service.title}
      </h3>

      <p className="mt-4 line-clamp-3 wrap-anywhere text-sm leading-6 text-slate-400">
        {service.description}
      </p>

      <div className="mt-auto pt-5">
        <span className="text-sm font-black text-[#20d6c7]">
          Ver servicio →
        </span>
      </div>
    </Link>
  );
}

function ServiceSupportCard() {
  return (
    <div className="flex min-h-[244px] items-center justify-center rounded-[2rem] border border-dashed border-[#009B8D]/25 bg-[#0f2744]/60 p-8 text-center">
      <div>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-2xl text-[#20d6c7]">
          ◈
        </div>

        <h3 className="text-2xl font-black">Servicio publicado</h3>

        <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-400">
          Agrega más servicios activos desde el panel para llenar este mosaico.
        </p>
      </div>
    </div>
  );
}

function EmptyServices() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-3xl text-[#20d6c7]">
        ◈
      </div>

      <h3 className="mb-3 text-2xl font-black">
        Aún no hay servicios publicados
      </h3>

      <p className="mx-auto max-w-xl leading-7 text-slate-400">
        Los servicios que crees y actives desde el panel administrativo
        aparecerán automáticamente en esta sección.
      </p>
    </div>
  );
}

function ServicesLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="min-h-[500px] rounded-[2.4rem] border border-[#009B8D]/15 bg-[#0f2744]/70 p-8">
        <div className="mb-10 h-16 w-16 animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-48 h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
        <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/70 p-6"
          >
            <div className="flex gap-5">
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />

              <div className="flex-1">
                <div className="mb-4 h-6 w-2/3 animate-pulse rounded-full bg-white/10" />
                <div className="mb-3 h-3 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
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

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="wrap-anywhere rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm font-bold text-[#20d6c7]">
      {children}
    </span>
  );
}