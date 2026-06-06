"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Studies from "@/components/home/Studies";
import Sectors from "@/components/home/Sectors";
import Contact from "@/components/home/Contact";

import {
  defaultInicioContenido,
  getInicioContenido,
} from "@/lib/contenido";

import { getContactoContenido } from "@/lib/contactoContenido";
import { getFooterContenido } from "@/lib/footerContenido";
import { getContenidoGlobal } from "@/lib/contenidoGlobal";

import { getActiveServicios } from "@/lib/servicios";
import { getPublishedEstudios } from "@/lib/estudios";
import { getPublishedNoticias } from "@/lib/noticias";
import { getActiveSectores } from "@/lib/sectores";

import { InicioContenido } from "@/types/contenido";
import {
  ContactoContenido,
  defaultContactoContenido,
} from "@/types/contactoContenido";
import {
  FooterContenido,
  defaultFooterContenido,
} from "@/types/footerContenido";
import {
  ContenidoGlobal,
  defaultContenidoGlobal,
} from "@/types/contenidoGlobal";

import { Servicio } from "@/types/servicio";
import { Estudio } from "@/types/estudio";
import { Noticia } from "@/types/noticia";
import { Sector } from "@/types/sector";

type HomeSectionItem = {
  id: string;
  label: string;
  description: string;
  metric?: string;
  href: string;
};

export default function HomePage() {
  const [contenido, setContenido] = useState<InicioContenido>(
    defaultInicioContenido
  );

  const [contactoContenido, setContactoContenido] =
    useState<ContactoContenido>(defaultContactoContenido);

  const [footerContenido, setFooterContenido] =
    useState<FooterContenido>(defaultFooterContenido);

  const [contenidoGlobal, setContenidoGlobal] =
    useState<ContenidoGlobal>(defaultContenidoGlobal);

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);

  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingEstudios, setLoadingEstudios] = useState(true);
  const [loadingSectores, setLoadingSectores] = useState(true);

  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const [
          contenidoData,
          contactoData,
          footerData,
          globalData,
          serviciosData,
          estudiosData,
          noticiasData,
          sectoresData,
        ] = await Promise.all([
          getInicioContenido(),
          getContactoContenido(),
          getFooterContenido(),
          getContenidoGlobal(),
          getActiveServicios(),
          getPublishedEstudios(),
          getPublishedNoticias(),
          getActiveSectores(),
        ]);

        if (!isMounted) return;

        setContenido(contenidoData || defaultInicioContenido);
        setContactoContenido(contactoData || defaultContactoContenido);
        setFooterContenido(footerData || defaultFooterContenido);
        setContenidoGlobal(globalData || defaultContenidoGlobal);

        setServicios(serviciosData);
        setEstudios(estudiosData);
        setNoticias(noticiasData);
        setSectores(sectoresData);
      } catch (error) {
        console.error("Error cargando contenido del home:", error);
      } finally {
        if (!isMounted) return;

        setLoadingServicios(false);
        setLoadingEstudios(false);
        setLoadingSectores(false);
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-home-section]")
  );

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);

      if (!visibleEntry) return;

      const target = visibleEntry.target as HTMLElement;
      const sectionId = target.dataset.homeSection;

      if (sectionId) {
        setActiveSection(sectionId);
      }
    },
    {
      root: null,
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.05,
    }
  );

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
}, []);
  const homeSections = useMemo<HomeSectionItem[]>(() => {
    return [
      {
        id: "inicio",
        label: "Inicio",
        description: "Entrada principal",
        metric: noticias.length > 0 ? `${noticias.length} noticias` : "Portada",
        href: "#inicio",
      },
      {
        id: "servicios",
        label: "Servicios",
        description: "Qué hacemos",
        metric:
          servicios.length > 0
            ? `${servicios.length} activos`
            : "Cargando",
        href: "#servicios",
      },
      {
        id: "estudios",
        label: "Estudios",
        description: "Evidencia pública",
        metric:
          estudios.length > 0
            ? `${estudios.length} publicados`
            : "Informes",
        href: "#estudios",
      },
      {
        id: "sectores",
        label: "Sectores",
        description: "Áreas de trabajo",
        metric:
          sectores.length > 0
            ? `${sectores.length} áreas`
            : "Territorios",
        href: "#sectores",
      },
      {
        id: "contacto",
        label: "Contacto",
        description: "Conversemos",
        metric: "Formulario",
        href: "#contacto",
      },
    ];
  }, [noticias.length, servicios.length, estudios.length, sectores.length]);

  if (!contenidoGlobal.siteActive || contenidoGlobal.maintenanceMode) {
    return (
      <MaintenanceScreen
        message={contenidoGlobal.maintenanceMessage}
        footerContenido={footerContenido}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#071221] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(0,155,141,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(26,54,93,0.55),transparent_30%),linear-gradient(180deg,#071221_0%,#0a1628_38%,#071221_100%)]" />
      <div className="pointer-events-none fixed left-[-12rem] top-32 z-0 h-[28rem] w-[28rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-[-10rem] z-0 h-[34rem] w-[34rem] rounded-full bg-[#1a365d]/40 blur-3xl" />

      <Navbar />

      <HomeNavigator items={homeSections} activeSection={activeSection} />

      <section
        id="inicio"
        data-home-section="inicio"
        className="relative z-10 scroll-mt-28"
      >
        <Hero contenido={contenido} estudios={estudios} noticias={noticias} />
      </section>

      <section
        id="servicios"
        data-home-section="servicios"
        className="relative z-10 scroll-mt-28"
      >
        <Services
          contenido={contenido}
          servicios={servicios}
          loading={loadingServicios}
        />
      </section>

      <section
        id="estudios"
        data-home-section="estudios"
        className="relative z-10 scroll-mt-28"
      >
        <Studies
          contenido={contenido}
          estudios={estudios}
          loading={loadingEstudios}
        />
      </section>

      <section
        id="sectores"
        data-home-section="sectores"
        className="relative z-10 scroll-mt-28"
      >
        <Sectors
          contenido={contenido}
          sectores={sectores}
          loading={loadingSectores}
        />
      </section>

      <div
        data-home-section="contacto"
        className="relative z-10 scroll-mt-28"
      >
        <Contact contactoContenido={contactoContenido} />
      </div>

      <div className="relative z-10">
        <Footer
          footerContenido={footerContenido}
          contenidoGlobal={contenidoGlobal}
        />
      </div>
    </main>
  );
}

function HomeNavigator({
  items,
  activeSection,
}: {
  items: HomeSectionItem[];
  activeSection: string;
}) {
  return (
    <>
      <aside className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <nav className="group/nav overflow-hidden rounded-full border border-[#009B8D]/15 bg-[#08111f]/70 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 hover:rounded-[2rem] hover:bg-[#08111f]/92">
          <div className="grid gap-2">
            {items.map((item, index) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-label={`Ir a ${item.label}`}
                  className={`group/item grid h-12 grid-cols-[2.5rem_0fr] items-center rounded-full border transition-all duration-500 group-hover/nav:w-60 group-hover/nav:grid-cols-[2.5rem_1fr] ${
                    isActive
                      ? "border-[#009B8D]/45 bg-[#009B8D]/15 text-white"
                      : "border-transparent text-slate-500 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition ${
                        isActive
                          ? "bg-[#009B8D] text-white shadow-[0_0_24px_rgba(0,155,141,0.35)]"
                          : "bg-white/5 text-slate-500 group-hover/item:bg-[#009B8D]/15 group-hover/item:text-[#20d6c7]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <span className="min-w-0 overflow-hidden pr-4 opacity-0 transition duration-500 group-hover/nav:opacity-100">
                    <span className="block truncate text-sm font-black">
                      {item.label}
                    </span>

                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="block max-w-24 truncate text-[11px] font-semibold text-slate-500">
                        {item.description}
                      </span>

                      {item.metric && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                            isActive
                              ? "bg-[#009B8D] text-white"
                              : "bg-white/5 text-slate-500"
                          }`}
                        >
                          {item.metric}
                        </span>
                      )}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </nav>
      </aside>

      <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 gap-2 overflow-x-auto rounded-[1.5rem] border border-[#009B8D]/15 bg-[#08111f]/90 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl xl:hidden">
        {items.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex min-w-fit flex-1 items-center justify-center rounded-[1.1rem] px-3 py-3 text-xs font-black transition ${
                isActive
                  ? "bg-[#009B8D] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

function MaintenanceScreen({
  message,
  footerContenido,
}: {
  message: string;
  footerContenido: FooterContenido;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071221] px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,155,141,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(26,54,93,0.65),transparent_45%)]" />

      <section className="relative z-10 mx-auto max-w-2xl rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744]/90 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D] text-xl font-black text-white shadow-2xl shadow-[#009B8D]/20">
          MP
        </div>

        <span className="mb-5 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
          {footerContenido.brandName}
        </span>

        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          Sitio en mantenimiento
        </h1>

        <p className="mt-5 whitespace-pre-wrap leading-8 text-slate-300">
          {message ||
            "Estamos realizando mejoras en el sitio. Vuelve a intentarlo más tarde."}
        </p>
      </section>
    </main>
  );
}