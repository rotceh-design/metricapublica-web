"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Activity,
  BarChart2,
  ChevronRight,
  FileText,
  Inbox,
  LayoutGrid,
  Mail,
  Map,
  MessageSquare,
  Newspaper,
  Settings,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

import { getNoticias } from "@/lib/noticias";
import { getEstudios } from "@/lib/estudios";
import { getMensajesContacto } from "@/lib/contacto";
import { getServicios } from "@/lib/servicios";
import { getSectores } from "@/lib/sectores";
import { getEquipo } from "@/lib/equipo";

import { Noticia } from "@/types/noticia";
import { Estudio } from "@/types/estudio";
import { MensajeContacto } from "@/types/mensaje";
import { Servicio } from "@/types/servicio";
import { Sector } from "@/types/sector";
import { EquipoIntegrante } from "@/types/equipo";

type DashboardStat = {
  label: string;
  value: number;
  detail: string;
  href: string;
  Icon: ElementType;
  trend: number | null;
};

type RecentPublicationItem = {
  key: string;
  title: string;
  href: string;
  meta: string;
  badges: string[];
  date: unknown;
};

export default function AdminDashboardPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [equipo, setEquipo] = useState<EquipoIntegrante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [
          noticiasData,
          estudiosData,
          mensajesData,
          serviciosData,
          sectoresData,
          equipoData,
        ] = await Promise.all([
          getNoticias(),
          getEstudios(),
          getMensajesContacto(),
          getServicios(),
          getSectores(),
          getEquipo(),
        ]);

        if (!isMounted) return;

        setNoticias(noticiasData);
        setEstudios(estudiosData);
        setMensajes(mensajesData);
        setServicios(serviciosData);
        setSectores(sectoresData);
        setEquipo(equipoData);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadMessages = useMemo(() => {
    return mensajes.filter((mensaje) => !mensaje.read).length;
  }, [mensajes]);

  const stats = useMemo<DashboardStat[]>(() => {
    const noticiasPublicadas = noticias.filter(
      (noticia) => noticia.status === "published"
    ).length;

    const noticiasBorrador = noticias.filter(
      (noticia) => noticia.status === "draft"
    ).length;

    const estudiosPublicados = estudios.filter(
      (estudio) => estudio.status === "published"
    ).length;

    const estudiosBorrador = estudios.filter(
      (estudio) => estudio.status === "draft"
    ).length;

    const mensajesSinLeer = mensajes.filter((mensaje) => !mensaje.read).length;
    const serviciosActivos = servicios.filter((servicio) => servicio.active).length;
    const sectoresActivos = sectores.filter((sector) => sector.active).length;
    const equipoActivo = equipo.filter((integrante) => integrante.active).length;

    return [
      {
        label: "Mensajes",
        value: mensajes.length,
        detail: `${mensajesSinLeer} sin leer · ${
          mensajes.length - mensajesSinLeer
        } leídos`,
        href: "/admin/mensajes",
        Icon: Inbox,
        trend: mensajesSinLeer,
      },
      {
        label: "Noticias",
        value: noticias.length,
        detail: `${noticiasPublicadas} publicadas · ${noticiasBorrador} borrador`,
        href: "/admin/noticias",
        Icon: Newspaper,
        trend: noticiasPublicadas,
      },
      {
        label: "Estudios",
        value: estudios.length,
        detail: `${estudiosPublicados} publicados · ${estudiosBorrador} borrador`,
        href: "/admin/estudios",
        Icon: BarChart2,
        trend: estudiosPublicados,
      },
      {
        label: "Servicios",
        value: servicios.length,
        detail: `${serviciosActivos} activos · ${
          servicios.length - serviciosActivos
        } inactivos`,
        href: "/admin/servicios",
        Icon: Wrench,
        trend: serviciosActivos,
      },
      {
        label: "Sectores",
        value: sectores.length,
        detail: `${sectoresActivos} activos · ${
          sectores.length - sectoresActivos
        } inactivos`,
        href: "/admin/sectores",
        Icon: Map,
        trend: sectoresActivos,
      },
      {
        label: "Equipo",
        value: equipo.length,
        detail: `${equipoActivo} activos · ${
          equipo.length - equipoActivo
        } inactivos`,
        href: "/admin/equipo",
        Icon: Users,
        trend: equipoActivo,
      },
      {
        label: "Contenido",
        value: 4,
        detail: "Inicio · Nosotros · Contacto · Footer",
        href: "/admin/contenido",
        Icon: FileText,
        trend: null,
      },
      {
        label: "Ajustes globales",
        value: 2,
        detail: "Redes sociales · Estado del sitio",
        href: "/admin/contenido/global",
        Icon: Settings,
        trend: null,
      },
    ];
  }, [noticias, estudios, mensajes, servicios, sectores, equipo]);

  const recentMensajes = useMemo(() => {
    return [...mensajes].sort(sortByDateDesc).slice(0, 3);
  }, [mensajes]);

  const recentNoticias = useMemo(() => {
    return [...noticias].sort(sortByDateDesc).slice(0, 3);
  }, [noticias]);

  const recentEstudios = useMemo(() => {
    return [...estudios].sort(sortByDateDesc).slice(0, 3);
  }, [estudios]);

  const recentPublicaciones = useMemo<RecentPublicationItem[]>(() => {
    const noticiasPublicadas = noticias
      .filter((noticia) => noticia.status === "published")
      .map((noticia) => ({
        key: `noticia-${noticia.id}`,
        title: noticia.title,
        href: `/admin/noticias/editar/${noticia.id}`,
        meta: `/noticias/${noticia.slug}`,
        badges: ["Noticia", noticia.category || "Sin categoría"],
        date: getRecordDate(noticia),
      }));

    const estudiosPublicados = estudios
      .filter((estudio) => estudio.status === "published")
      .map((estudio) => ({
        key: `estudio-${estudio.id}`,
        title: estudio.title,
        href: `/admin/estudios/editar/${estudio.id}`,
        meta: `/estudios/${estudio.slug}`,
        badges: ["Estudio", estudio.category || "Sin categoría"],
        date: getRecordDate(estudio),
      }));

    return [...noticiasPublicadas, ...estudiosPublicados]
      .sort((a, b) => getDateTime(b.date) - getDateTime(a.date))
      .slice(0, 3);
  }, [noticias, estudios]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
          <Activity size={28} className="animate-pulse text-[#009B8D]" />
        </div>

        <p className="font-semibold text-slate-400">
          Cargando resumen general...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] via-[#10243d] to-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              Resumen general
            </span>

            <h1 className="wrap-anywhere text-4xl font-black leading-tight md:text-5xl">
              Panel de control
            </h1>

            <p className="mt-4 max-w-3xl leading-8 text-slate-300">
              Vista ejecutiva del sitio: mensajes, noticias, estudios,
              servicios, sectores, equipo, contenido y configuración global.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur sm:grid-cols-2 lg:w-[360px]">
            <MiniMetric label="Secciones" value={String(stats.length)} />
            <MiniMetric
              label="Registros"
              value={String(
                noticias.length +
                  estudios.length +
                  mensajes.length +
                  servicios.length +
                  sectores.length +
                  equipo.length
              )}
            />
          </div>
        </div>
      </section>

      <div className="mt-5 -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-3 sm:grid sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <section className="mt-6">
        <PendingMessagesCard unreadMessages={unreadMessages} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-4">
        <RecentSection
          label="Mensajes"
          title="Últimos mensajes"
          href="/admin/mensajes"
          Icon={Mail}
          empty="Todavía no hay mensajes recibidos."
        >
          {recentMensajes.length === 0
            ? null
            : recentMensajes.map((mensaje) => (
                <RecentItem
                  key={mensaje.id}
                  title={mensaje.subject || "Sin asunto"}
                  href="/admin/mensajes"
                  meta={mensaje.email || "Sin correo"}
                  badges={[
                    mensaje.read ? "Leído" : "Nuevo",
                    mensaje.name || "Sin nombre",
                  ]}
                />
              ))}
        </RecentSection>

        <RecentSection
          label="Noticias"
          title="Últimas noticias"
          href="/admin/noticias"
          Icon={Newspaper}
          empty="Todavía no hay noticias creadas."
        >
          {recentNoticias.length === 0
            ? null
            : recentNoticias.map((noticia) => (
                <RecentItem
                  key={noticia.id}
                  title={noticia.title}
                  href={`/admin/noticias/editar/${noticia.id}`}
                  meta={`/noticias/${noticia.slug}`}
                  badges={[
                    noticia.category || "Sin categoría",
                    noticia.status === "published" ? "Publicado" : "Borrador",
                  ]}
                />
              ))}
        </RecentSection>

        <RecentSection
          label="Publicaciones"
          title="Últimas publicaciones"
          href="/admin/estudios"
          Icon={LayoutGrid}
          empty="Todavía no hay publicaciones visibles."
        >
          {recentPublicaciones.length === 0
            ? null
            : recentPublicaciones.map((item) => (
                <RecentItem
                  key={item.key}
                  title={item.title}
                  href={item.href}
                  meta={item.meta}
                  badges={item.badges}
                />
              ))}
        </RecentSection>

        <RecentSection
          label="Estudios"
          title="Últimos estudios"
          href="/admin/estudios"
          Icon={BarChart2}
          empty="Todavía no hay estudios creados."
        >
          {recentEstudios.length === 0
            ? null
            : recentEstudios.map((estudio) => (
                <RecentItem
                  key={estudio.id}
                  title={estudio.title}
                  href={`/admin/estudios/editar/${estudio.id}`}
                  meta={`/estudios/${estudio.slug}`}
                  badges={[
                    estudio.category || "Sin categoría",
                    estudio.status === "published" ? "Publicado" : "Borrador",
                    estudio.year || "Sin año",
                  ]}
                />
              ))}
        </RecentSection>
      </section>
    </>
  );
}

function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <Link
      href={stat.href}
      prefetch
      className="group w-[168px] flex-none rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:bg-[#10243d] sm:w-auto sm:rounded-[1.7rem] sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white sm:h-12 sm:w-12">
          <stat.Icon size={21} strokeWidth={2} />
        </div>

        {stat.trend !== null ? (
          <span className="flex items-center gap-1 rounded-full bg-[#009B8D]/15 px-2.5 py-1 text-xs font-black text-[#20d6c7]">
            <TrendingUp size={12} />
            {stat.trend}
          </span>
        ) : (
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-black text-slate-400">
            Ver
          </span>
        )}
      </div>

      <p className="text-xs font-bold text-slate-400 sm:text-sm">
        {stat.label}
      </p>

      <h2 className="mt-1 text-3xl font-black text-white sm:mt-2 sm:text-4xl">
        {stat.value}
      </h2>

      <p className="mt-2 line-clamp-2 wrap-anywhere text-xs leading-5 text-slate-400 sm:mt-3 sm:text-sm sm:leading-6">
        {stat.detail}
      </p>
    </Link>
  );
}

function PendingMessagesCard({
  unreadMessages,
}: {
  unreadMessages: number;
}) {
  const hasPending = unreadMessages > 0;

  return (
    <Link
      href="/admin/mensajes"
      className={`group relative block overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 ${
        hasPending
          ? "border-[#009B8D]/50 bg-linear-to-br from-[#0f2744] via-[#0d3b38] to-[#08111f]"
          : "border-[#009B8D]/15 bg-[#0f2744]"
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />

      <div
        className={`absolute right-5 top-5 flex h-18 w-18 items-center justify-center rounded-[1.4rem] border text-4xl font-black shadow-2xl sm:h-22 sm:w-22 sm:text-5xl ${
          hasPending
            ? "border-[#20d6c7]/40 bg-[#009B8D] text-white"
            : "border-white/10 bg-[#08111f] text-[#20d6c7]"
        }`}
      >
        {unreadMessages}
      </div>

      <div className="relative z-10 max-w-3xl pr-24">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          <MessageSquare size={27} strokeWidth={2} />
        </div>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#009B8D]">
          Bandeja de entrada
        </p>

        <h2 className="wrap-anywhere text-3xl font-black leading-tight text-white md:text-4xl">
          Mensajes pendientes
        </h2>

        <p className="mt-4 max-w-2xl leading-8 text-slate-300">
          {hasPending
            ? `Tienes ${unreadMessages} mensaje${
                unreadMessages === 1 ? "" : "s"
              } pendiente${
                unreadMessages === 1 ? "" : "s"
              } de revisión. Entra para responder o marcar como leído.`
            : "Todo al día. No hay mensajes pendientes de revisión en este momento."}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-5 py-3 text-sm font-black text-[#20d6c7] transition group-hover:bg-[#009B8D]/15 group-hover:text-white">
          Revisar mensajes
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function RecentSection({
  label,
  title,
  href,
  Icon,
  empty,
  children,
}: {
  label: string;
  title: string;
  href: string;
  Icon: ElementType;
  empty: string;
  children: ReactNode;
}) {
  const isEmpty =
    !children || (Array.isArray(children) && children.every((child) => !child));

  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
            <Icon size={19} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              {label}
            </p>

            <h2 className="truncate text-lg font-black text-white sm:text-xl">
              {title}
            </h2>
          </div>
        </div>

        <Link
          href={href}
          prefetch
          className="shrink-0 rounded-2xl border border-[#009B8D]/15 px-4 py-2 text-sm font-black text-slate-300 transition hover:border-[#009B8D]/40 hover:bg-[#009B8D]/10 hover:text-[#20d6c7]"
        >
          Ver
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-white/10 bg-[#08111f] p-5">
          <p className="text-sm font-semibold text-slate-400">{empty}</p>
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}

function RecentItem({
  title,
  href,
  meta,
  badges,
}: {
  title: string;
  href: string;
  meta: string;
  badges: string[];
}) {
  return (
    <Link
      href={href}
      prefetch
      className="block rounded-2xl border border-[#009B8D]/10 bg-[#08111f] p-4 transition hover:border-[#009B8D]/35 hover:bg-[#10243d]"
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge key={badge}>{badge}</Badge>
        ))}
      </div>

      <h3 className="wrap-anywhere text-base font-black text-white">
        {title}
      </h3>

      <p className="mt-2 wrap-anywhere text-sm font-semibold text-slate-400">
        {meta}
      </p>
    </Link>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {children}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-[#08111f]/80 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function getRecordDate(item: unknown) {
  const record = item as { createdAt?: unknown; updatedAt?: unknown };

  return record.updatedAt || record.createdAt;
}

function getDateTime(value: unknown) {
  if (!value) return 0;

  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().getTime();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds: number }).seconds === "number"
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }

  return 0;
}

function sortByDateDesc(
  a: { createdAt?: unknown; updatedAt?: unknown },
  b: { createdAt?: unknown; updatedAt?: unknown }
) {
  const dateA = getDateTime(a.updatedAt || a.createdAt);
  const dateB = getDateTime(b.updatedAt || b.createdAt);

  return dateB - dateA;
}