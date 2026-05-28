"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  Newspaper,
  BarChart2,
  LayoutGrid,
  Users,
  CheckCircle2,
  FileEdit,
  ExternalLink,
  LogOut,
  Plus,
  ChevronRight,
  TrendingUp,
  Activity,
  Mail,
  Inbox,
  FileText,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getNoticias } from "@/lib/noticias";
import { getEstudios } from "@/lib/estudios";
import { getMensajesContacto } from "@/lib/contacto";
import { Noticia } from "@/types/noticia";
import { Estudio } from "@/types/estudio";
import { MensajeContacto } from "@/types/mensaje";

const moduleCards = [
  {
    title: "Noticias",
    description: "Crear, editar, publicar o eliminar noticias.",
    href: "/admin/noticias",
    actionHref: "/admin/noticias/nueva",
    actionLabel: "Nueva noticia",
    Icon: Newspaper,
    status: "Activo" as const,
  },
  {
    title: "Estudios",
    description: "Administrar estudios, publicaciones, imágenes y PDF.",
    href: "/admin/estudios",
    actionHref: "/admin/estudios/nuevo",
    actionLabel: "Nuevo estudio",
    Icon: BarChart2,
    status: "Activo" as const,
  },
  {
    title: "Servicios",
    description: "Crear, editar y ordenar los servicios visibles en la web.",
    href: "/admin/servicios",
    actionHref: "/admin/servicios/nuevo",
    actionLabel: "Nuevo servicio",
    Icon: LayoutGrid,
    status: "Activo" as const,
  },
  {
    title: "Contenido",
    description: "Editar textos principales de las páginas públicas del sitio.",
    href: "/admin/contenido",
    actionHref: "/admin/contenido",
    actionLabel: "Editar contenido",
    Icon: FileText,
    status: "Activo" as const,
  },
  {
    title: "Mensajes",
    description: "Revisar solicitudes recibidas desde el formulario de contacto.",
    href: "/admin/mensajes",
    actionHref: "/admin/mensajes",
    actionLabel: "Ver mensajes",
    Icon: Mail,
    status: "Activo" as const,
  },
  {
    title: "Equipo",
    description: "Administrar integrantes, cargos, fotografías y biografías.",
    href: "/admin/equipo",
    actionHref: "/admin/equipo/nuevo",
    actionLabel: "Nuevo integrante",
    Icon: Users,
    status: "Activo" as const,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);

      try {
        const [noticiasData, estudiosData, mensajesData] = await Promise.all([
          getNoticias(),
          getEstudios(),
          getMensajesContacto(),
        ]);

        setNoticias(noticiasData);
        setEstudios(estudiosData);
        setMensajes(mensajesData);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const stats = useMemo(() => {
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

    return [
      {
        label: "Noticias totales",
        value: noticias.length,
        detail: `${noticiasPublicadas} publicadas · ${noticiasBorrador} borrador`,
        Icon: Newspaper,
        trend: noticiasPublicadas,
      },
      {
        label: "Estudios totales",
        value: estudios.length,
        detail: `${estudiosPublicados} publicados · ${estudiosBorrador} borrador`,
        Icon: BarChart2,
        trend: estudiosPublicados,
      },
      {
        label: "Mensajes",
        value: mensajes.length,
        detail: `${mensajesSinLeer} sin leer · ${
          mensajes.length - mensajesSinLeer
        } leídos`,
        Icon: Inbox,
        trend: mensajesSinLeer,
      },
      {
        label: "Publicados",
        value: noticiasPublicadas + estudiosPublicados,
        detail: "Contenido visible en la web pública",
        Icon: CheckCircle2,
        trend: null,
      },
      {
        label: "Borradores",
        value: noticiasBorrador + estudiosBorrador,
        detail: "Contenido guardado sin publicar",
        Icon: FileEdit,
        trend: null,
      },
    ];
  }, [noticias, estudios, mensajes]);

  const recentNoticias = noticias.slice(0, 3);
  const recentEstudios = estudios.slice(0, 3);
  const recentMensajes = mensajes.slice(0, 3);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/20">
            <Activity size={28} className="animate-pulse text-[#009B8D]" />
          </div>

          <p className="text-slate-400">Cargando panel administrativo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="relative overflow-hidden border-b border-[#009B8D]/10 bg-[#08111f] px-6 py-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#1a365d]/40 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>

            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Métrica Pública
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Administra noticias, estudios, publicaciones, servicios, mensajes,
              equipo y contenido editable de la plataforma.
            </p>

            <p className="mt-3 wrap-anywhere text-sm text-slate-500">
              Sesión iniciada como{" "}
              <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              <ExternalLink size={16} strokeWidth={2} />
              Ver sitio
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
            >
              <LogOut size={16} strokeWidth={2} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="group rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-xl transition hover:border-[#009B8D]/30 hover:shadow-[0_0_30px_rgba(0,155,141,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]/25">
                    <stat.Icon
                      size={22}
                      strokeWidth={1.8}
                      className="text-[#009B8D]"
                    />
                  </div>

                  {stat.trend !== null ? (
                    <span className="flex items-center gap-1 rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-xs font-bold text-[#009B8D]">
                      <TrendingUp size={11} strokeWidth={2.5} />
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-500">
                      Métrica
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400">{stat.label}</p>

                <h2 className="mt-2 text-4xl font-bold">{stat.value}</h2>

                <p className="mt-3 wrap-anywhere text-sm text-slate-500">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mb-10">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                  Módulos
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Administración de contenido
                </h2>
              </div>

              <p className="max-w-xl text-sm text-slate-400">
                Desde aquí puedes entrar a cada módulo del sistema y gestionar
                el contenido visible en el sitio público.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {moduleCards.map((module) => (
                <article
                  key={module.href}
                  className="group rounded-3xl border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 transition hover:-translate-y-1 hover:border-[#009B8D]/40 hover:shadow-2xl"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 transition group-hover:bg-[#009B8D]/25 group-hover:shadow-[0_0_16px_rgba(0,155,141,0.3)]">
                      <module.Icon
                        size={26}
                        strokeWidth={1.6}
                        className="text-[#009B8D] transition group-hover:scale-110"
                      />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        module.status === "Activo"
                          ? "bg-[#009B8D]/15 text-[#009B8D]"
                          : "border border-white/10 text-slate-500"
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>

                  <h3 className="mb-3 wrap-anywhere text-2xl font-bold">
                    {module.title}
                  </h3>

                  <p className="mb-6 min-h-16 wrap-anywhere text-sm leading-6 text-slate-400">
                    {module.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={module.href}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      <ChevronRight size={15} strokeWidth={2.2} />
                      Ver módulo
                    </a>

                    <a
                      href={module.actionHref}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#009B8D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                      {module.actionLabel}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-3">
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
                    <article
                      key={noticia.id}
                      className="rounded-2xl border border-white/10 bg-[#08111f] p-5 transition hover:border-white/20"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge color="teal">
                          {noticia.category || "Sin categoría"}
                        </Badge>

                        <Badge>
                          {noticia.status === "published"
                            ? "Publicado"
                            : "Borrador"}
                        </Badge>
                      </div>

                      <h3 className="wrap-anywhere text-lg font-bold">
                        {noticia.title}
                      </h3>

                      <p className="mt-2 wrap-anywhere text-sm text-slate-500">
                        /noticias/{noticia.slug}
                      </p>
                    </article>
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
                    <article
                      key={estudio.id}
                      className="rounded-2xl border border-white/10 bg-[#08111f] p-5 transition hover:border-white/20"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge color="teal">
                          {estudio.category || "Sin categoría"}
                        </Badge>

                        <Badge>
                          {estudio.status === "published"
                            ? "Publicado"
                            : "Borrador"}
                        </Badge>

                        <Badge>{estudio.year || "Sin año"}</Badge>
                      </div>

                      <h3 className="wrap-anywhere text-lg font-bold">
                        {estudio.title}
                      </h3>

                      <p className="mt-2 wrap-anywhere text-sm text-slate-500">
                        /estudios/{estudio.slug}
                      </p>
                    </article>
                  ))}
            </RecentSection>

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
                    <article
                      key={mensaje.id}
                      className="rounded-2xl border border-white/10 bg-[#08111f] p-5 transition hover:border-white/20"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge color={mensaje.read ? undefined : "teal"}>
                          {mensaje.read ? "Leído" : "Nuevo"}
                        </Badge>

                        <Badge>{mensaje.name || "Sin nombre"}</Badge>
                      </div>

                      <h3 className="wrap-anywhere text-lg font-bold">
                        {mensaje.subject || "Sin asunto"}
                      </h3>

                      <p className="mt-2 wrap-anywhere text-sm text-slate-500">
                        {mensaje.email}
                      </p>
                    </article>
                  ))}
            </RecentSection>
          </div>
        </div>
      </section>
    </main>
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
    <section className="rounded-3xl border border-[#009B8D]/15 bg-[#0f2744] p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#009B8D]/20 bg-[#009B8D]/15">
            <Icon size={18} strokeWidth={1.8} className="text-[#009B8D]" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              {label}
            </p>

            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        </div>

        <a
          href={href}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
        >
          Ver todas
          <ChevronRight size={14} strokeWidth={2.2} />
        </a>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-white/10 bg-[#08111f] p-5">
          <p className="text-slate-400">{empty}</p>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </section>
  );
}

function Badge({
  children,
  color,
}: {
  children: ReactNode;
  color?: "teal";
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        color === "teal"
          ? "bg-[#009B8D]/15 text-[#009B8D]"
          : "border border-white/10 text-slate-400"
      }`}
    >
      {children}
    </span>
  );
}