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
import { InicioContenido } from "@/types/contenido";
import { Servicio } from "@/types/servicio";
import { Estudio } from "@/types/estudio";
import { Noticia } from "@/types/noticia";

export default function HomePage() {
  const [contenido, setContenido] = useState<InicioContenido>(
    defaultInicioContenido
  );

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingEstudios, setLoadingEstudios] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [contenidoData, serviciosData, estudiosData, noticiasData] =
          await Promise.all([
            getInicioContenido(),
            getActiveServicios(),
            getPublishedEstudios(),
            getNoticias(),
          ]);

        setContenido(contenidoData);
        setServicios(serviciosData);
        setEstudios(estudiosData);

        setNoticias(
          noticiasData.filter((noticia) => noticia.status === "published")
        );
      } catch (error) {
        console.error("Error cargando contenido del home:", error);
      } finally {
        setLoadingServicios(false);
        setLoadingEstudios(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <Hero
        contenido={contenido}
        estudios={estudios}
        noticias={noticias}
      />

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

      <Sectors contenido={contenido} />
      <Contact contenido={contenido} />

      <Footer />
    </main>
  );
}