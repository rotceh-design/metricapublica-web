import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/home/Contact";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}