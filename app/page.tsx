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
import { getActiveServicios } from "@/lib/servicios";
import { getPublishedEstudios } from "@/lib/estudios";
import { getNoticias } from "@/lib/noticias";
import { getActiveSectores } from "@/lib/sectores";
import { InicioContenido } from "@/types/contenido";
import { Servicio } from "@/types/servicio";
import { Estudio } from "@/types/estudio";
import { Noticia } from "@/types/noticia";
import { Sector } from "@/types/sector";

export default function HomePage() {
  const [contenido, setContenido] = useState<InicioContenido>(
    defaultInicioContenido
  );

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);

  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingEstudios, setLoadingEstudios] = useState(true);
  const [loadingSectores, setLoadingSectores] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [
          contenidoData,
          serviciosData,
          estudiosData,
          noticiasData,
          sectoresData,
        ] = await Promise.all([
          getInicioContenido(),
          getActiveServicios(),
          getPublishedEstudios(),
          getNoticias(),
          getActiveSectores(),
        ]);

        setContenido(contenidoData);
        setServicios(serviciosData);
        setEstudios(estudiosData);
        setSectores(sectoresData);

        setNoticias(
          noticiasData.filter((noticia) => noticia.status === "published")
        );
      } catch (error) {
        console.error("Error cargando contenido del home:", error);
      } finally {
        setLoadingServicios(false);
        setLoadingEstudios(false);
        setLoadingSectores(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <Hero contenido={contenido} estudios={estudios} noticias={noticias} />

      <Services
        contenido={contenido}
        servicios={servicios}
        loading={loadingServicios}
      />

      <Studies
        contenido={contenido}
        estudios={estudios}
        loading={loadingEstudios}
      />

      <Sectors
        contenido={contenido}
        sectores={sectores}
        loading={loadingSectores}
      />

      <Contact contenido={contenido} />

      <Footer />
    </main>
  );
}