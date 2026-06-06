"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  Activity,
  BarChart2,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Map,
  Menu,
  Newspaper,
  Users,
  X,
} from "lucide-react";

import { auth } from "@/lib/firebase";

type AdminNavItem = {
  label: string;
  href: string;
  Icon: ElementType;
};

const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    Icon: LayoutDashboard,
  },
  {
    label: "Noticias",
    href: "/admin/noticias",
    Icon: Newspaper,
  },
  {
    label: "Estudios",
    href: "/admin/estudios",
    Icon: BarChart2,
  },
  {
    label: "Servicios",
    href: "/admin/servicios",
    Icon: LayoutGrid,
  },
  {
    label: "Sectores",
    href: "/admin/sectores",
    Icon: Map,
  },
  {
    label: "Contenido",
    href: "/admin/contenido",
    Icon: FileText,
  },
  {
    label: "Mensajes",
    href: "/admin/mensajes",
    Icon: Mail,
  },
  {
    label: "Equipo",
    href: "/admin/equipo",
    Icon: Users,
  },
];

const pageCopy: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": {
    title: "Dashboard",
    description:
      "Resumen general del sitio, publicaciones, mensajes y módulos activos.",
  },
  "/admin/noticias": {
    title: "Noticias",
    description:
      "Administra publicaciones, imágenes, estados, categorías y contenido visible en la sección de noticias.",
  },
  "/admin/estudios": {
    title: "Estudios",
    description: "Administra estudios, publicaciones, imágenes y documentos PDF.",
  },
  "/admin/servicios": {
    title: "Servicios",
    description: "Crea, edita y ordena los servicios visibles en la web pública.",
  },
  "/admin/sectores": {
    title: "Sectores",
    description:
      "Administra los sectores visibles en el home y en la página pública.",
  },
  "/admin/contenido": {
    title: "Contenido",
    description: "Edita textos principales y bloques de contenido del sitio público.",
  },
  "/admin/mensajes": {
    title: "Mensajes",
    description: "Revisa solicitudes recibidas desde el formulario de contacto.",
  },
  "/admin/equipo": {
    title: "Equipo",
    description: "Administra integrantes, cargos, fotografías y biografías.",
  },
  "/admin/configuracion": {
    title: "Configuración",
    description: "Ajustes generales del panel administrativo.",
  },
};

export default function AdminPanelShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const currentPage = useMemo(() => {
    const exact = pageCopy[pathname];

    if (exact) return exact;

    const matchedPath = Object.keys(pageCopy).find(
      (path) => path !== "/admin/dashboard" && pathname.startsWith(path)
    );

    return matchedPath
      ? pageCopy[matchedPath]
      : {
          title: "Panel administrativo",
          description: "Administra el contenido y los módulos del sitio.",
        };
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
            <Activity size={28} className="animate-pulse text-[#009B8D]" />
          </div>

          <p className="font-semibold text-slate-400">
            Cargando panel administrativo...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
<aside className="fixed bottom-6 left-6 top-6 z-50 hidden w-[270px] overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex lg:flex-col">
  <AdminSidebar onLogout={handleLogout} />
</aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <aside className="relative z-10 h-full w-[86%] max-w-[340px] border-r border-[#009B8D]/10 bg-[#08111f] px-5 py-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <Brand />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] text-slate-200 transition hover:bg-[#1a365d]"
              >
                <X size={20} />
              </button>
            </div>

            <AdminSidebar
              onLogout={handleLogout}
              onNavigate={() => setMobileMenuOpen(false)}
              compactBrand
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-[#009B8D]/10 bg-[#08111f]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] text-white transition hover:bg-[#1a365d] lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                  Panel administrativo
                </p>

                <h1 className="truncate text-xl font-black text-white sm:text-2xl">
                  {currentPage.title}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
              >
                <ExternalLink size={16} />
                Ver sitio
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl bg-[#009B8D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#00877a]"
              >
                <LogOut size={16} />
                Salir
              </button>
            </div>
          </div>
        </header>

        <section className="px-4 py-5 sm:px-6 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#08111f] via-[#0f2744] to-[#1a365d] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-[#009B8D]/30 bg-[#009B8D]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#20d6c7]">
                    Métrica Pública
                  </div>

                  <h2 className="max-w-3xl wrap-anywhere text-3xl font-black leading-tight sm:text-4xl">
                    {currentPage.title}
                  </h2>

                  <p className="mt-3 max-w-2xl wrap-anywhere text-sm leading-7 text-slate-300 sm:text-base">
                    {currentPage.description}
                  </p>
                </div>

                <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:block">
                  <p className="text-xs text-slate-300">Sesión activa</p>

                  <p className="mt-1 max-w-[260px] truncate text-sm font-bold text-white">
                    {user?.email || "Administrador"}
                  </p>
                </div>
              </div>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminSidebar({
  onLogout,
  onNavigate,
  compactBrand = false,
}: {
  onLogout: () => void | Promise<void>;
  onNavigate?: () => void;
  compactBrand?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {!compactBrand && (
        <div className="mb-7">
          <Brand />
        </div>
      )}

      <div className="mb-5 rounded-[1.7rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <p className="text-sm text-slate-400">Bienvenido</p>

        <h2 className="mt-1 text-2xl font-black leading-tight">
          Panel de control
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Navega entre módulos para revisar, crear o editar contenido.
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              prefetch
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-[#009B8D] text-white shadow-lg shadow-[#009B8D]/20"
                  : "text-slate-300 hover:bg-[#009B8D]/10 hover:text-[#20d6c7]"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[#0f2744] text-slate-400 group-hover:bg-[#009B8D]/15 group-hover:text-[#20d6c7]"
                }`}
              >
                <item.Icon size={18} strokeWidth={2} />
              </span>

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[1.7rem] border border-[#009B8D]/20 bg-[#009B8D]/10 p-5 text-white">
        <p className="text-sm font-bold text-[#20d6c7]">Acceso rápido</p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Revisa el sitio público o cierra sesión de forma segura.
        </p>

        <div className="mt-4 grid gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#08111f] transition hover:bg-slate-100"
          >
            <Home size={16} />
            Ver sitio
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-4 py-3 text-sm font-black text-white transition hover:bg-[#00877a]"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D] text-lg font-black text-white shadow-lg shadow-[#009B8D]/20">
        MP
      </div>

      <div>
        <p className="text-lg font-black leading-none text-white">
          Métrica Pública
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Investigación y datos
        </p>
      </div>
    </Link>
  );
}