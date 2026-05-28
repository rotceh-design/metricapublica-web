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
import { InicioContenido } from "@/types/contenido";

export default function HomePage() {
  const [contenido, setContenido] = useState<InicioContenido>(
    defaultInicioContenido
  );

  useEffect(() => {
    const loadContenido = async () => {
      try {
        const data = await getInicioContenido();
        setContenido(data);
      } catch (error) {
        console.error("Error cargando contenido de inicio:", error);
      }
    };

    loadContenido();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />
      <Hero contenido={contenido} />
      <Services contenido={contenido} />
      <Studies contenido={contenido} />
      <Sectors contenido={contenido} />
      <Contact contenido={contenido} />
      <Footer />
    </main>
  );
}