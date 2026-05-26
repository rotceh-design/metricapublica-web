import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Studies from "@/components/home/Studies";
import Sectors from "@/components/home/Sectors";
import Contact from "@/components/home/Contact";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />
      <Hero />
      <Services />
      <Studies />
      <Sectors />
      <Contact />
      <Footer />
    </main>
  );
}