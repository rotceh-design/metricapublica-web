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
import { InicioContenido } from "@/types/contenido";
import { Servicio } from "@/types/servicio";

export default function HomePage() {
  const [contenido, setContenido] = useState<InicioContenido>(
    defaultInicioContenido
  );

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [contenidoData, serviciosData] = await Promise.all([
          getInicioContenido(),
          getActiveServicios(),
        ]);

        setContenido(contenidoData);
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error cargando contenido del home:", error);
      } finally {
        setLoadingServicios(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <Hero contenido={contenido} />

      <Services
        contenido={contenido}
        servicios={servicios}
        loading={loadingServicios}
      />

      <Studies contenido={contenido} />
      <Sectors contenido={contenido} />
      <Contact contenido={contenido} />

      <Footer />
    </main>
  );
}