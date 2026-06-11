"use client";

import { useEffect, useState } from "react";

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

        setServicios(serviciosData || []);
        setEstudios(estudiosData || []);
        setNoticias(noticiasData || []);
        setSectores(sectoresData || []);
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
      <div className="pointer-events-none fixed -left-48 top-32 z-0 h-[28rem] w-[28rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-20 z-0 h-[34rem] w-[34rem] rounded-full bg-[#1a365d]/40 blur-3xl" />

      <Navbar />

      <section id="inicio" className="relative z-10 scroll-mt-28">
        <Hero contenido={contenido} estudios={estudios} noticias={noticias} />
      </section>

      <section id="servicios" className="relative z-10 scroll-mt-28">
        <Services
          contenido={contenido}
          servicios={servicios}
          loading={loadingServicios}
        />
      </section>

      <section id="estudios" className="relative z-10 scroll-mt-28">
        <Studies
          contenido={contenido}
          estudios={estudios}
          loading={loadingEstudios}
        />
      </section>

      <section id="sectores" className="relative z-10 scroll-mt-28">
        <Sectors
          contenido={contenido}
          sectores={sectores}
          loading={loadingSectores}
        />
      </section>

      <section id="contacto" className="relative z-10 scroll-mt-28">
        <Contact contactoContenido={contactoContenido} />
      </section>

      <div className="relative z-10">
        <Footer
          footerContenido={footerContenido}
          contenidoGlobal={contenidoGlobal}
        />
      </div>
    </main>
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
